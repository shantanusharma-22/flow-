using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace FlowDesktop
{
    static class Program
    {
        private const string MutexName = "FlowMusicPlayerWindowsAppInstanceMutex";
        private static Process backendProcess = null;
        private static Process frontendProcess = null;
        private static Process appWindowProcess = null;

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            bool isNewInstance;
            using (var mutex = new Mutex(true, MutexName, out isNewInstance))
            {
                if (!isNewInstance)
                {
                    // Flow is already running; launch/focus app window
                    LaunchDedicatedAppWindow("http://localhost:4173");
                    return;
                }

                string appDir = AppDomain.CurrentDomain.BaseDirectory;

                // 1. Boot local backend and frontend services if not active
                EnsureServices(appDir);

                // 2. Resolve best target URL (local preview -> local server -> production Vercel)
                string targetUrl = ResolveTargetUrl();

                // 3. Launch dedicated standalone desktop window
                LaunchDedicatedAppWindow(targetUrl);

                // 4. Configure System Tray lifecycle icon
                Icon appIcon = null;
                string iconPath = Path.Combine(appDir, "Flow.ico");
                if (File.Exists(iconPath))
                {
                    try { appIcon = new Icon(iconPath); } catch { }
                }
                if (appIcon == null)
                {
                    appIcon = SystemIcons.Application;
                }

                var notifyIcon = new NotifyIcon
                {
                    Icon = appIcon,
                    Visible = true,
                    Text = "Flow — Hi-Res Lossless Music Player"
                };

                var contextMenu = new ContextMenuStrip();
                var itemOpen = new ToolStripMenuItem("Open Flow", null, (s, e) =>
                {
                    LaunchDedicatedAppWindow(ResolveTargetUrl());
                });
                itemOpen.Font = new Font(itemOpen.Font, FontStyle.Bold);
                contextMenu.Items.Add(itemOpen);

                contextMenu.Items.Add(new ToolStripSeparator());

                contextMenu.Items.Add("Web Version (Vercel)", null, (s, e) =>
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = "https://bitchord-replica.vercel.app",
                        UseShellExecute = true
                    });
                });

                contextMenu.Items.Add("GitHub Repository", null, (s, e) =>
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = "https://github.com/shantanusharma-22/flow-.git",
                        UseShellExecute = true
                    });
                });

                contextMenu.Items.Add(new ToolStripSeparator());

                contextMenu.Items.Add("Exit Flow", null, (s, e) =>
                {
                    notifyIcon.Visible = false;
                    CleanupProcesses();
                    Application.Exit();
                });

                notifyIcon.ContextMenuStrip = contextMenu;
                notifyIcon.DoubleClick += (s, e) =>
                {
                    LaunchDedicatedAppWindow(ResolveTargetUrl());
                };

                Application.ApplicationExit += (s, e) =>
                {
                    notifyIcon.Visible = false;
                    CleanupProcesses();
                };

                Application.Run();
            }
        }

        private static string ResolveTargetUrl()
        {
            using (var client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(800) })
            {
                // Check localhost:4173 (Vite preview)
                try
                {
                    var res = client.GetAsync("http://localhost:4173/").Result;
                    if (res.IsSuccessStatusCode) return "http://localhost:4173";
                }
                catch { }

                // Check 127.0.0.1:8901 (Express server serving dist)
                try
                {
                    var res = client.GetAsync("http://127.0.0.1:8901/api/health").Result;
                    if (res.IsSuccessStatusCode) return "http://127.0.0.1:8901";
                }
                catch { }
            }

            // Fallback to verified production deployment
            return "https://bitchord-replica.vercel.app";
        }

        private static void LaunchDedicatedAppWindow(string url)
        {
            string profileDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "FlowDesktop",
                "Profile"
            );

            try
            {
                if (!Directory.Exists(profileDir))
                {
                    Directory.CreateDirectory(profileDir);
                }
            }
            catch { }

            // Candidates for Chromium standalone application window
            string[] browserCandidates = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
            };

            string selectedBrowser = null;
            foreach (var candidate in browserCandidates)
            {
                if (!string.IsNullOrEmpty(candidate) && File.Exists(candidate))
                {
                    selectedBrowser = candidate;
                    break;
                }
            }

            if (selectedBrowser != null)
            {
                string args = string.Format(
                    "--app=\"{0}\" --window-size=1280,840 --user-data-dir=\"{1}\" --enable-features=OverlayScrollbar,AudioServiceOutOfProcess",
                    url,
                    profileDir
                );

                var psi = new ProcessStartInfo
                {
                    FileName = selectedBrowser,
                    Arguments = args,
                    UseShellExecute = false
                };

                try
                {
                    appWindowProcess = Process.Start(psi);
                    return;
                }
                catch { }
            }

            // Fallback to default shell handler
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch { }
        }

        private static void EnsureServices(string appDir)
        {
            using (var client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(600) })
            {
                // 1. Check Backend
                bool backendHealthy = false;
                try
                {
                    var res = client.GetAsync("http://127.0.0.1:8901/api/health").Result;
                    backendHealthy = res.IsSuccessStatusCode;
                }
                catch { }

                if (!backendHealthy)
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c npm run server",
                        WorkingDirectory = appDir,
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };
                    try { backendProcess = Process.Start(psi); } catch { }
                }

                // 2. Check Frontend Preview
                bool frontendHealthy = false;
                try
                {
                    var res = client.GetAsync("http://localhost:4173/").Result;
                    frontendHealthy = res.IsSuccessStatusCode;
                }
                catch { }

                if (!frontendHealthy)
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c npm run preview -- --port 4173",
                        WorkingDirectory = appDir,
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };
                    try { frontendProcess = Process.Start(psi); } catch { }
                }

                // Brief warm-up for child processes
                Thread.Sleep(1200);
            }
        }

        private static void CleanupProcesses()
        {
            try
            {
                if (backendProcess != null && !backendProcess.HasExited)
                {
                    backendProcess.Kill();
                }
            }
            catch { }

            try
            {
                if (frontendProcess != null && !frontendProcess.HasExited)
                {
                    frontendProcess.Kill();
                }
            }
            catch { }
        }
    }
}

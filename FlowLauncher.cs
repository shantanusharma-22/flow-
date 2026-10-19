using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace FlowDesktop
{
    static class Program
    {
        private static Process backendProcess = null;
        private static Process frontendProcess = null;

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            bool isNewInstance;
            using (var mutex = new Mutex(true, "FlowMusicPlayerSingleInstanceMutex", out isNewInstance))
            {
                if (!isNewInstance)
                {
                    // Already running, bring forward
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = "http://localhost:4173",
                        UseShellExecute = true
                    });
                    return;
                }

                string appDir = AppDomain.CurrentDomain.BaseDirectory;

                // Ensure backend is running
                Task.Run(() => EnsureServices(appDir)).Wait();

                // Open Flow desktop app
                Process.Start(new ProcessStartInfo
                {
                    FileName = "http://localhost:4173",
                    UseShellExecute = true
                });

                // Tray icon for background lifecycle
                var notifyIcon = new NotifyIcon
                {
                    Icon = System.Drawing.SystemIcons.Application,
                    Visible = true,
                    Text = "Flow - Hi-Res Music Player"
                };

                var contextMenu = new ContextMenuStrip();
                contextMenu.Items.Add("Open Flow", null, (s, e) =>
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = "http://localhost:4173",
                        UseShellExecute = true
                    });
                });
                contextMenu.Items.Add("Exit Flow", null, (s, e) =>
                {
                    notifyIcon.Visible = false;
                    CleanupProcesses();
                    Application.Exit();
                });

                notifyIcon.ContextMenuStrip = contextMenu;

                Application.ApplicationExit += (s, e) =>
                {
                    notifyIcon.Visible = false;
                    CleanupProcesses();
                };

                Application.Run();
            }
        }

        private static void EnsureServices(string appDir)
        {
            using (var client = new HttpClient { Timeout = TimeSpan.FromSeconds(1) })
            {
                // Check Backend
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

                // Check Frontend Preview
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

                Thread.Sleep(1500);
            }
        }

        private static void CleanupProcesses()
        {
            try { if (backendProcess != null && !backendProcess.HasExited) backendProcess.Kill(); } catch { }
            try { if (frontendProcess != null && !frontendProcess.HasExited) frontendProcess.Kill(); } catch { }
        }
    }
}

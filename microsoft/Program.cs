using System;
using System.Threading;
using System.Windows.Forms;

namespace Flow.Windows
{
    static class Program
    {
        private const string AppMutexName = "FlowMusicPlayerWindowsNativeEditionMutex";

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            bool isNewInstance;
            using (var mutex = new Mutex(true, AppMutexName, out isNewInstance))
            {
                if (!isNewInstance)
                {
                    MessageBox.Show(
                        "Flow Windows Edition is already running in the background.",
                        "Flow Music Player",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information
                    );
                    return;
                }

                Application.Run(new MainWindow());
            }
        }
    }
}

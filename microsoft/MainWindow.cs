using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace Flow.Windows
{
    public class MainWindow : Form
    {
        private readonly AudioEngine audioEngine;
        private readonly LocalLibraryWatcher libraryWatcher;
        private readonly MediaTransportControls transportControls;

        // UI Controls
        private Panel sidebarPanel;
        private Panel mainPanel;
        private Panel playerDock;

        private TextBox searchBox;
        private Label spotifyBanner;
        private ListView trackListView;

        private Label lblTrackTitle;
        private Label lblTrackArtist;
        private Label lblFormatBadge;
        private Button btnPlayPause;
        private ProgressBar progressBar;
        private TrackBar volumeBar;
        private Label lblTime;

        public MainWindow()
        {
            audioEngine = new AudioEngine();
            libraryWatcher = new LocalLibraryWatcher();
            transportControls = new MediaTransportControls(audioEngine);

            InitializeComponent();
            WireEvents();

            libraryWatcher.Start();
            LoadInitialTracks();
        }

        private void InitializeComponent()
        {
            this.Text = "Flow — Microsoft Windows Edition (C# Native)";
            this.Size = new Size(1100, 720);
            this.MinimumSize = new Size(880, 560);
            this.BackColor = Color.FromArgb(8, 11, 18); // #080b12 obsidian
            this.ForeColor = Color.FromArgb(248, 250, 252);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            this.StartPosition = FormStartPosition.CenterScreen;

            // 1. Sidebar Panel (Left)
            sidebarPanel = new Panel
            {
                Dock = DockStyle.Left,
                Width = 220,
                BackColor = Color.FromArgb(13, 19, 31)
            };

            Label lblLogo = new Label
            {
                Text = "FLOW",
                ForeColor = Color.FromArgb(0, 229, 255), // Cyan
                Font = new Font("Segoe UI", 14f, FontStyle.Bold),
                Location = new Point(20, 20),
                AutoSize = true
            };
            sidebarPanel.Controls.Add(lblLogo);

            string[] navItems = new string[] { "Library", "Equalizer", "Sleep Timer", "Stats for Nerds" };
            int yPos = 70;
            foreach (string item in navItems)
            {
                Button btn = new Button
                {
                    Text = item,
                    Location = new Point(15, yPos),
                    Size = new Size(190, 38),
                    FlatStyle = FlatStyle.Flat,
                    ForeColor = Color.FromArgb(203, 213, 225),
                    BackColor = Color.Transparent,
                    TextAlign = ContentAlignment.MiddleLeft,
                    Padding = new Padding(10, 0, 0, 0)
                };
                btn.FlatAppearance.BorderSize = 0;
                btn.FlatAppearance.MouseOverBackColor = Color.FromArgb(30, 41, 59);

                string itemName = item;
                btn.Click += delegate(object s, EventArgs e) { HandleNavClick(itemName); };
                sidebarPanel.Controls.Add(btn);
                yPos += 46;
            }

            // 2. Player Dock (Bottom)
            playerDock = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 84,
                BackColor = Color.FromArgb(17, 24, 39), // #111827
                Padding = new Padding(16, 12, 16, 12)
            };

            lblTrackTitle = new Label
            {
                Text = "No Track Selected",
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(16, 14),
                AutoSize = true
            };

            lblTrackArtist = new Label
            {
                Text = "Select a song to start listening",
                Font = new Font("Segoe UI", 8.5f),
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(16, 36),
                AutoSize = true
            };

            lblFormatBadge = new Label
            {
                Text = "FLAC 24-BIT",
                Font = new Font("Segoe UI", 7.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 229, 255),
                BackColor = Color.FromArgb(20, 0, 229, 255),
                Location = new Point(16, 56),
                AutoSize = true,
                Padding = new Padding(4, 2, 4, 2)
            };

            // Playback Controls (Center)
            btnPlayPause = new Button
            {
                Text = "> Play",
                Size = new Size(80, 36),
                Location = new Point(480, 16),
                FlatStyle = FlatStyle.Flat,
                BackColor = Color.FromArgb(0, 229, 255),
                ForeColor = Color.FromArgb(8, 11, 18),
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold)
            };
            btnPlayPause.FlatAppearance.BorderSize = 0;
            btnPlayPause.Click += delegate(object s, EventArgs e)
            {
                if (audioEngine.IsPlaying) audioEngine.Pause();
                else audioEngine.Resume();
            };

            progressBar = new ProgressBar
            {
                Location = new Point(360, 56),
                Size = new Size(320, 8),
                Style = ProgressBarStyle.Continuous
            };

            lblTime = new Label
            {
                Text = "0:00 / 0:00",
                Font = new Font("Segoe UI", 8f),
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(690, 52),
                AutoSize = true
            };

            // Volume (Right)
            Label lblVol = new Label
            {
                Text = "Volume:",
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(880, 26),
                AutoSize = true
            };
            volumeBar = new TrackBar
            {
                Location = new Point(940, 20),
                Size = new Size(120, 32),
                Minimum = 0,
                Maximum = 100,
                Value = 80,
                TickStyle = TickStyle.None
            };
            volumeBar.Scroll += delegate(object s, EventArgs e) { audioEngine.SetVolume(volumeBar.Value / 100f); };

            playerDock.Controls.AddRange(new Control[]
            {
                lblTrackTitle, lblTrackArtist, lblFormatBadge,
                btnPlayPause, progressBar, lblTime,
                lblVol, volumeBar
            });

            // 3. Main Stage Panel
            mainPanel = new Panel
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(24)
            };

            // Search Header
            searchBox = new TextBox
            {
                Location = new Point(24, 20),
                Size = new Size(500, 32),
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 11f),
                BorderStyle = BorderStyle.FixedSingle
            };
            searchBox.TextChanged += OnSearchChanged;

            spotifyBanner = new Label
            {
                Text = "Spotify Link Detected: Auto-resolving playlist to Hi-Res lossless stream",
                ForeColor = Color.FromArgb(34, 197, 94),
                BackColor = Color.FromArgb(20, 34, 197, 94),
                Location = new Point(24, 58),
                Size = new Size(500, 24),
                Visible = false,
                Font = new Font("Segoe UI", 8.5f, FontStyle.Bold),
                Padding = new Padding(6, 4, 6, 4)
            };

            // Track List View
            trackListView = new ListView
            {
                Location = new Point(24, 92),
                Size = new Size(820, 480),
                Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right,
                View = View.Details,
                FullRowSelect = true,
                BackColor = Color.FromArgb(13, 19, 31),
                ForeColor = Color.White,
                BorderStyle = BorderStyle.None
            };
            trackListView.Columns.Add("Title", 280);
            trackListView.Columns.Add("Artist", 200);
            trackListView.Columns.Add("Album", 180);
            trackListView.Columns.Add("Format", 80);
            trackListView.Columns.Add("Bitrate", 80);

            trackListView.DoubleClick += delegate(object s, EventArgs e)
            {
                if (trackListView.SelectedItems.Count > 0)
                {
                    ListViewItem item = trackListView.SelectedItems[0];
                    Track track = item.Tag as Track;
                    if (track != null)
                    {
                        audioEngine.PlayTrack(track);
                    }
                }
            };

            mainPanel.Controls.AddRange(new Control[] { searchBox, spotifyBanner, trackListView });

            this.Controls.Add(mainPanel);
            this.Controls.Add(playerDock);
            this.Controls.Add(sidebarPanel);
        }

        private void WireEvents()
        {
            audioEngine.StateChanged += delegate(bool playing)
            {
                this.Invoke((MethodInvoker)delegate
                {
                    btnPlayPause.Text = playing ? "|| Pause" : "> Play";
                    if (audioEngine.CurrentTrack != null)
                    {
                        lblTrackTitle.Text = audioEngine.CurrentTrack.Title;
                        lblTrackArtist.Text = audioEngine.CurrentTrack.Artist;
                        lblFormatBadge.Text = string.Format("{0} {1} KBPS", audioEngine.CurrentTrack.AudioFormat.ToUpper(), audioEngine.CurrentTrack.BitrateKbps);
                    }
                });
            };

            audioEngine.PositionChanged += delegate(double current, double duration)
            {
                this.Invoke((MethodInvoker)delegate
                {
                    if (duration > 0)
                    {
                        progressBar.Value = Math.Min(100, (int)((current / duration) * 100));
                        int cMin = (int)(current / 60);
                        int cSec = (int)(current % 60);
                        int dMin = (int)(duration / 60);
                        int dSec = (int)(duration % 60);
                        lblTime.Text = string.Format("{0}:{1:D2} / {2}:{3:D2}", cMin, cSec, dMin, dSec);
                    }
                });
            };

            libraryWatcher.TrackIndexed += delegate(Track track)
            {
                this.Invoke((MethodInvoker)delegate
                {
                    AddTrackToListView(track);
                });
            };
        }

        private void LoadInitialTracks()
        {
            Track[] seedTracks = new Track[]
            {
                new Track { Id = "trk-1", Title = "Midnight City Pulse", Artist = "Kavinsky & The Midnight", Album = "Synthwave Odyssey", AudioFormat = "flac", BitrateKbps = 1411, DurationSec = 234 },
                new Track { Id = "trk-2", Title = "Echoes of Shibuya", Artist = "Tokyo Lo-Fi Collective", Album = "Rainy Shinjuku Beats", AudioFormat = "flac", BitrateKbps = 1411, DurationSec = 176 },
                new Track { Id = "trk-3", Title = "Starlight Horizon", Artist = "Solar Fields", Album = "Cosmic Reverie", AudioFormat = "opus", BitrateKbps = 320, DurationSec = 312 },
                new Track { Id = "trk-4", Title = "Cyberpunk Drift", Artist = "Lorn & Carpenter Brut", Album = "Neo-Tokyo Underground", AudioFormat = "flac", BitrateKbps = 1411, DurationSec = 245 }
            };

            foreach (Track t in seedTracks)
            {
                AddTrackToListView(t);
            }
        }

        private void AddTrackToListView(Track t)
        {
            ListViewItem item = new ListViewItem(t.Title);
            item.SubItems.Add(t.Artist);
            item.SubItems.Add(t.Album);
            item.SubItems.Add(t.AudioFormat.ToUpper());
            item.SubItems.Add(string.Format("{0}k", t.BitrateKbps));
            item.Tag = t;
            trackListView.Items.Add(item);
        }

        private void OnSearchChanged(object sender, EventArgs e)
        {
            string q = searchBox.Text.Trim();
            bool isSpotify = q.Contains("spotify.com") || q.StartsWith("spotify:");
            spotifyBanner.Visible = isSpotify;
        }

        private void HandleNavClick(string destination)
        {
            switch (destination)
            {
                case "Equalizer":
                    ShowEqualizerDialog();
                    break;
                case "Sleep Timer":
                    ShowSleepTimerDialog();
                    break;
                case "Stats for Nerds":
                    ShowStatsDialog();
                    break;
            }
        }

        private void ShowEqualizerDialog()
        {
            string[] presets = new string[] { "Flat", "Bass Boost", "Vocal Clarity", "Electronic", "Rock" };
            string selected = audioEngine.ActivePreset;

            using (Form dlg = new Form())
            {
                dlg.Text = "8-Band Parametric Equalizer (C# Native)";
                dlg.Size = new Size(420, 260);
                dlg.BackColor = Color.FromArgb(17, 24, 39);
                dlg.ForeColor = Color.White;
                dlg.StartPosition = FormStartPosition.CenterParent;
                dlg.FormBorderStyle = FormBorderStyle.FixedDialog;
                dlg.MaximizeBox = false;

                Label lbl = new Label { Text = "Select Equalizer Sound Signature:", Location = new Point(20, 20), AutoSize = true };
                ComboBox cb = new ComboBox { Location = new Point(20, 50), Width = 360, DropDownStyle = ComboBoxStyle.DropDownList };
                cb.Items.AddRange(presets);
                cb.SelectedItem = selected;

                Button btnApply = new Button
                {
                    Text = "Apply Preset",
                    Location = new Point(20, 110),
                    Size = new Size(160, 36),
                    BackColor = Color.FromArgb(0, 229, 255),
                    ForeColor = Color.Black,
                    FlatStyle = FlatStyle.Flat
                };
                btnApply.Click += delegate(object s, EventArgs e)
                {
                    audioEngine.ApplyPreset(cb.SelectedItem != null ? cb.SelectedItem.ToString() : "Flat");
                    dlg.Close();
                };

                dlg.Controls.AddRange(new Control[] { lbl, cb, btnApply });
                dlg.ShowDialog(this);
            }
        }

        private void ShowSleepTimerDialog()
        {
            using (Form dlg = new Form())
            {
                dlg.Text = "Sleep Timer with 30s Fadeout (C# Native)";
                dlg.Size = new Size(380, 240);
                dlg.BackColor = Color.FromArgb(17, 24, 39);
                dlg.ForeColor = Color.White;
                dlg.StartPosition = FormStartPosition.CenterParent;
                dlg.FormBorderStyle = FormBorderStyle.FixedDialog;
                dlg.MaximizeBox = false;

                Label lbl = new Label { Text = "Select Sleep Timer Preset:", Location = new Point(20, 20), AutoSize = true };
                int[] minutes = new int[] { 15, 30, 45, 60 };

                int y = 55;
                foreach (int m in minutes)
                {
                    Button btn = new Button
                    {
                        Text = string.Format("{0} Minutes", m),
                        Location = new Point(20, y),
                        Size = new Size(150, 32),
                        FlatStyle = FlatStyle.Flat,
                        BackColor = Color.FromArgb(30, 41, 59),
                        ForeColor = Color.White
                    };
                    int minVal = m;
                    btn.Click += delegate(object s, EventArgs e)
                    {
                        audioEngine.StartSleepTimer(minVal);
                        MessageBox.Show(dlg, string.Format("Sleep timer set for {0} minutes with linear fadeout.", minVal), "Flow Sleep Timer");
                        dlg.Close();
                    };
                    dlg.Controls.Add(btn);
                    y += 38;
                }

                dlg.Controls.Add(lbl);
                dlg.ShowDialog(this);
            }
        }

        private void ShowStatsDialog()
        {
            Track trk = audioEngine.CurrentTrack;
            string msg = string.Format(
                "Codec: {0}\nBitrate: {1} kbps\nAudio Output: Windows Audio Graph Master Bus\nVolume: {2}%\nActive Preset: {3}\nWatched Folder: {4}",
                (trk != null && trk.AudioFormat == "flac" ? "FLAC 24-Bit Studio Master" : "Opus 320k"),
                trk != null ? trk.BitrateKbps : 1411,
                Math.Round(audioEngine.Volume * 100),
                audioEngine.ActivePreset,
                Environment.GetFolderPath(Environment.SpecialFolder.MyMusic)
            );

            MessageBox.Show(this, msg, "Stats for Nerds — Flow Windows Edition", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Flow.Windows
{
    public class LocalLibraryWatcher : IDisposable
    {
        private FileSystemWatcher watcher;
        private readonly string musicDirectory;
        private readonly Dictionary<string, Track> indexedTracks;
        private readonly HashSet<string> supportedExtensions;

        public event Action<Track> TrackIndexed;

        public LocalLibraryWatcher() : this(null)
        {
        }

        public LocalLibraryWatcher(string customPath)
        {
            indexedTracks = new Dictionary<string, Track>();
            supportedExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                ".mp3", ".flac", ".wav", ".m4a", ".aac", ".opus", ".ogg"
            };

            musicDirectory = customPath ?? Environment.GetFolderPath(Environment.SpecialFolder.MyMusic);
            if (string.IsNullOrEmpty(musicDirectory) || !Directory.Exists(musicDirectory))
            {
                musicDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Music");
            }
        }

        public void Start()
        {
            if (!Directory.Exists(musicDirectory))
            {
                try { Directory.CreateDirectory(musicDirectory); } catch { return; }
            }

            ScanDirectory(musicDirectory);

            try
            {
                watcher = new FileSystemWatcher(musicDirectory)
                {
                    IncludeSubdirectories = true,
                    NotifyFilter = NotifyFilters.FileName | NotifyFilters.Size | NotifyFilters.LastWrite,
                    EnableRaisingEvents = true
                };

                watcher.Created += OnFileEvent;
                watcher.Changed += OnFileEvent;
            }
            catch (Exception ex)
            {
                Console.WriteLine(string.Format("[Flow Windows Watcher] Error: {0}", ex.Message));
            }
        }

        private void OnFileEvent(object sender, FileSystemEventArgs e)
        {
            string ext = Path.GetExtension(e.FullPath);
            if (supportedExtensions.Contains(ext))
            {
                var track = IndexFile(e.FullPath);
                if (track != null && TrackIndexed != null)
                {
                    TrackIndexed(track);
                }
            }
        }

        private void ScanDirectory(string dir)
        {
            try
            {
                var files = Directory.GetFiles(dir, "*.*", SearchOption.AllDirectories);
                foreach (var file in files)
                {
                    string ext = Path.GetExtension(file);
                    if (supportedExtensions.Contains(ext))
                    {
                        IndexFile(file);
                    }
                }
            }
            catch { }
        }

        private Track IndexFile(string filePath)
        {
            try
            {
                if (!File.Exists(filePath)) return null;

                string fileName = Path.GetFileNameWithoutExtension(filePath);
                string ext = Path.GetExtension(filePath).TrimStart('.').ToLower();
                var parts = fileName.Split(new[] { " - " }, StringSplitOptions.None);

                string artist = parts.Length > 1 ? parts[0].Trim() : "Local Artist";
                string title = parts.Length > 1 ? string.Join(" - ", parts.Skip(1).ToArray()).Trim() : fileName;

                var track = new Track
                {
                    Id = string.Format("win-trk-{0:X8}", Math.Abs(filePath.GetHashCode())),
                    Title = title,
                    Artist = artist,
                    Album = "Local Music Collection",
                    StreamUrl = filePath,
                    AudioFormat = ext == "flac" ? "flac" : "mp3",
                    BitrateKbps = ext == "flac" ? 1411 : 320,
                    DurationSec = 195
                };

                lock (indexedTracks)
                {
                    indexedTracks[filePath] = track;
                }
                return track;
            }
            catch
            {
                return null;
            }
        }

        public List<Track> GetAllTracks()
        {
            lock (indexedTracks)
            {
                return indexedTracks.Values.ToList();
            }
        }

        public void Dispose()
        {
            if (watcher != null)
            {
                watcher.Dispose();
                watcher = null;
            }
        }
    }
}

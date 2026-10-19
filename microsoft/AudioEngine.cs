using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Flow.Windows
{
    public class Track
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string Album { get; set; }
        public int DurationSec { get; set; }
        public string StreamUrl { get; set; }
        public string AudioFormat { get; set; }
        public int BitrateKbps { get; set; }

        public Track()
        {
            Id = "";
            Title = "";
            Artist = "";
            Album = "";
            DurationSec = 180;
            StreamUrl = "";
            AudioFormat = "flac";
            BitrateKbps = 1411;
        }
    }

    public class AudioEngine
    {
        public Track CurrentTrack { get; private set; }
        public bool IsPlaying { get; private set; }
        public double CurrentTimeSec { get; private set; }
        public float Volume { get; private set; }
        public float TargetVolume { get; private set; }
        public float PlaybackSpeed { get; private set; }

        // 8-Band Equalizer Gains (dB)
        public Dictionary<string, float> EqualizerBands { get; private set; }
        public string ActivePreset { get; private set; }
        public bool IsEqualizerEnabled { get; set; }

        // Sleep Timer
        private CancellationTokenSource sleepTimerCts;
        public int? SleepTimerRemainingSec { get; private set; }
        public bool IsFadingOut { get; private set; }

        public event Action<bool> StateChanged;
        public event Action<double, double> PositionChanged;
        public event Action<int?, bool> SleepTimerUpdated;

        private System.Windows.Forms.Timer playbackTimer;

        public AudioEngine()
        {
            Volume = 0.8f;
            TargetVolume = 0.8f;
            PlaybackSpeed = 1.0f;
            ActivePreset = "Flat";
            IsEqualizerEnabled = true;

            EqualizerBands = new Dictionary<string, float>
            {
                { "60Hz", 0f },
                { "170Hz", 0f },
                { "310Hz", 0f },
                { "600Hz", 0f },
                { "1kHz", 0f },
                { "3kHz", 0f },
                { "6kHz", 0f },
                { "12kHz", 0f }
            };

            playbackTimer = new System.Windows.Forms.Timer { Interval = 250 };
            playbackTimer.Tick += (s, e) =>
            {
                if (IsPlaying && CurrentTrack != null)
                {
                    CurrentTimeSec += 0.25 * PlaybackSpeed;
                    if (CurrentTimeSec >= CurrentTrack.DurationSec)
                    {
                        CurrentTimeSec = 0;
                        Pause();
                    }
                    if (PositionChanged != null)
                    {
                        PositionChanged(CurrentTimeSec, CurrentTrack.DurationSec);
                    }
                }
            };
        }

        public void PlayTrack(Track track)
        {
            CurrentTrack = track;
            CurrentTimeSec = 0;
            IsPlaying = true;
            IsFadingOut = false;
            Volume = TargetVolume;
            playbackTimer.Start();
            if (StateChanged != null) StateChanged(true);
        }

        public void Pause()
        {
            IsPlaying = false;
            playbackTimer.Stop();
            if (StateChanged != null) StateChanged(false);
        }

        public void Resume()
        {
            if (CurrentTrack != null)
            {
                IsPlaying = true;
                playbackTimer.Start();
                if (StateChanged != null) StateChanged(true);
            }
        }

        public void Seek(double seconds)
        {
            CurrentTimeSec = Math.Max(0, Math.Min(seconds, CurrentTrack != null ? CurrentTrack.DurationSec : 0));
            if (PositionChanged != null)
            {
                PositionChanged(CurrentTimeSec, CurrentTrack != null ? CurrentTrack.DurationSec : 0);
            }
        }

        public void SetVolume(float vol)
        {
            TargetVolume = Math.Max(0f, Math.Min(1f, vol));
            if (!IsFadingOut)
            {
                Volume = TargetVolume;
            }
        }

        public void SetPlaybackSpeed(float speed)
        {
            PlaybackSpeed = Math.Max(0.5f, Math.Min(2.0f, speed));
        }

        // --- Equalizer Presets ---
        public void ApplyPreset(string preset)
        {
            ActivePreset = preset;
            switch (preset.ToLower())
            {
                case "flat":
                    SetAllBands(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);
                    break;
                case "bass boost":
                    SetAllBands(8f, 6f, 3f, 0f, -1f, 0f, 1f, 2f);
                    break;
                case "vocal clarity":
                    SetAllBands(-3f, -1f, 1f, 3f, 5f, 4f, 2f, 1f);
                    break;
                case "electronic":
                    SetAllBands(6f, 5f, 1f, 0f, 1f, 2f, 4f, 5f);
                    break;
                case "rock":
                    SetAllBands(5f, 3f, -1f, 0f, 2f, 3f, 4f, 4f);
                    break;
            }
        }

        private void SetAllBands(float f60, float f170, float f310, float f600, float f1k, float f3k, float f6k, float f12k)
        {
            EqualizerBands["60Hz"] = f60;
            EqualizerBands["170Hz"] = f170;
            EqualizerBands["310Hz"] = f310;
            EqualizerBands["600Hz"] = f600;
            EqualizerBands["1kHz"] = f1k;
            EqualizerBands["3kHz"] = f3k;
            EqualizerBands["6kHz"] = f6k;
            EqualizerBands["12kHz"] = f12k;
        }

        // --- Sleep Timer with 30s Linear Fadeout ---
        public void StartSleepTimer(int minutes)
        {
            CancelSleepTimer();
            sleepTimerCts = new CancellationTokenSource();
            var token = sleepTimerCts.Token;

            Task.Factory.StartNew(() =>
            {
                int totalSec = minutes * 60;
                for (int sec = totalSec; sec >= 0; sec--)
                {
                    if (token.IsCancellationRequested) return;

                    SleepTimerRemainingSec = sec;

                    if (sec <= 30 && sec > 0)
                    {
                        IsFadingOut = true;
                        float ratio = sec / 30f;
                        Volume = TargetVolume * ratio;
                        if (SleepTimerUpdated != null) SleepTimerUpdated(sec, true);
                    }
                    else if (sec == 0)
                    {
                        Pause();
                        Volume = TargetVolume;
                        IsFadingOut = false;
                        SleepTimerRemainingSec = null;
                        if (SleepTimerUpdated != null) SleepTimerUpdated(null, false);
                        break;
                    }
                    else
                    {
                        if (SleepTimerUpdated != null) SleepTimerUpdated(sec, false);
                    }

                    Thread.Sleep(1000);
                }
            }, token);
        }

        public void CancelSleepTimer()
        {
            if (sleepTimerCts != null)
            {
                sleepTimerCts.Cancel();
                sleepTimerCts = null;
            }
            SleepTimerRemainingSec = null;
            if (IsFadingOut)
            {
                IsFadingOut = false;
                Volume = TargetVolume;
            }
            if (SleepTimerUpdated != null) SleepTimerUpdated(null, false);
        }
    }
}

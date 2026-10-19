using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Flow.Windows
{
    public class MediaTransportControls : IMessageFilter
    {
        private const int WM_APPCOMMAND = 0x0319;
        private const int APPCOMMAND_MEDIA_PLAY_PAUSE = 14;
        private const int APPCOMMAND_MEDIA_STOP = 13;
        private const int APPCOMMAND_MEDIA_NEXTTRACK = 11;
        private const int APPCOMMAND_MEDIA_PREVIOUSTRACK = 12;

        private readonly AudioEngine audioEngine;

        public event Action NextTrackRequested;
        public event Action PreviousTrackRequested;

        public MediaTransportControls(AudioEngine engine)
        {
            this.audioEngine = engine;
            Application.AddMessageFilter(this);
        }

        public bool PreFilterMessage(ref Message m)
        {
            if (m.Msg == WM_APPCOMMAND)
            {
                int cmd = unchecked((short)(long)m.LParam);
                int appCommand = (cmd & 0xFFF0) >> 4;

                switch (appCommand)
                {
                    case APPCOMMAND_MEDIA_PLAY_PAUSE:
                        if (audioEngine.IsPlaying) audioEngine.Pause();
                        else audioEngine.Resume();
                        return true;

                    case APPCOMMAND_MEDIA_STOP:
                        audioEngine.Pause();
                        return true;

                    case APPCOMMAND_MEDIA_NEXTTRACK:
                        if (NextTrackRequested != null) NextTrackRequested();
                        return true;

                    case APPCOMMAND_MEDIA_PREVIOUSTRACK:
                        if (PreviousTrackRequested != null) PreviousTrackRequested();
                        return true;
                }
            }
            return false;
        }
    }
}

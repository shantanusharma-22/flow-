import React, { useState, useEffect } from 'react';
import {
  X,
  Headphones,
  Users,
  Copy,
  Check,
  Radio,
  Play,
  Pause,
  Crown,
  Share2,
  Lock,
  Unlock,
  PlusCircle,
  LogIn,
  LogOut
} from 'lucide-react';
import { Track } from '../types';
import { api } from '../services/api';

interface ListenTogetherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack?: (track: Track) => void;
  onTogglePlayPause?: () => void;
}

export const ListenTogetherModal: React.FC<ListenTogetherModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlayPause
}) => {
  const [tab, setTab] = useState<'active' | 'join' | 'host'>('active');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [userName, setUserName] = useState('Harrmane');
  const [roomNameInput, setRoomNameInput] = useState("Harrmane's Flow Jam");
  const [hostOnly, setHostOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active Session state
  const [currentSession, setCurrentSession] = useState<any | null>(null);
  const [currentMember, setCurrentMember] = useState<any | null>(null);
  const [publicRooms, setPublicRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Poll for rooms or active session state
  useEffect(() => {
    if (!isOpen) return;

    loadPublicRooms();
    const interval = setInterval(() => {
      if (currentSession?.code) {
        refreshSession(currentSession.code);
      } else {
        loadPublicRooms();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, currentSession?.code]);

  const loadPublicRooms = async () => {
    try {
      const rooms = await api.listJamRooms();
      setPublicRooms(rooms);
    } catch {
      // ignore
    }
  };

  const refreshSession = async (code: string) => {
    try {
      const room = await api.getJamRoomState(code);
      if (room && !room.error) {
        setCurrentSession(room);
      }
    } catch {
      // ignore
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.createJamRoom({
        roomName: roomNameInput.trim() || `${userName}'s Jam`,
        userName: userName.trim() || 'Host',
        hostOnlyControl: hostOnly,
        currentTrack
      });

      if (res && res.room) {
        setCurrentSession(res.room);
        setCurrentMember(res.member);
        setTab('active');
      } else {
        setErrorMsg('Failed to create Jam room.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error creating party room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (codeToJoin?: string) => {
    const targetCode = (codeToJoin || roomCodeInput).trim();
    if (!targetCode) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.joinJamRoom(targetCode, userName.trim() || 'Listener');
      if (res && res.room) {
        setCurrentSession(res.room);
        setCurrentMember(res.member);
        setTab('active');
        if (res.room.currentTrack && onPlayTrack) {
          onPlayTrack(res.room.currentTrack);
        }
      } else {
        setErrorMsg(`Room '${targetCode.toUpperCase()}' not found.`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error joining party room');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentSession || !currentMember) return;
    try {
      await api.leaveJamRoom(currentSession.code, currentMember.id);
    } catch {
      // ignore
    }
    setCurrentSession(null);
    setCurrentMember(null);
    loadPublicRooms();
  };

  const handleCopyCode = () => {
    if (!currentSession) return;
    navigator.clipboard.writeText(currentSession.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#161922',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          color: '#ffffff',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Headphones size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Listen Together</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Real-time synchronized listening inspired by BitChord Jam Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '16px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* In-Session Active View */}
        {currentSession ? (
          <div>
            <div
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#22c55e',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      padding: '3px 8px',
                      borderRadius: '100px',
                      textTransform: 'uppercase'
                    }}
                  >
                    <Radio size={12} className="animate-pulse" /> Live Party
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '6px 0 2px 0' }}>{currentSession.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Hosted by {currentSession.hostName} {currentMember?.isHost && '(You)'}
                  </p>
                </div>

                {/* 6-Character Room Code */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>Party Code</div>
                  <button
                    onClick={handleCopyCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      color: '#06b6d4',
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    {currentSession.code}
                    {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Now Playing in Room */}
              {currentSession.currentTrack ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: '8px'
                  }}
                >
                  <img
                    src={currentSession.currentTrack.coverArt || '/default_cover.jpg'}
                    alt="Track"
                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentSession.currentTrack.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {currentSession.currentTrack.artist}
                    </div>
                  </div>
                  <button
                    onClick={onTogglePlayPause}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No track queued. Play a song to broadcast to the room.
                </div>
              )}
            </div>

            {/* Listeners List */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#cbd5e1' }}>
                  Listeners ({currentSession.members?.length || 1})
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {currentSession.hostOnlyControl ? <Lock size={12} /> : <Unlock size={12} />}
                  {currentSession.hostOnlyControl ? 'Host Only Controls' : 'Open Controls'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                {currentSession.members?.map((m: any) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '100px',
                      fontSize: '12px'
                    }}
                  >
                    {m.isHost && <Crown size={12} color="#f59e0b" />}
                    <span>{m.name}</span>
                    {m.id === currentMember?.id && <span style={{ color: '#06b6d4', fontSize: '10px' }}>(You)</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Room Button */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCopyCode}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <Share2 size={15} /> Copy Invite
              </button>
              <button
                onClick={handleLeaveRoom}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '10px',
                  color: '#f87171',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <LogOut size={15} /> Leave
              </button>
            </div>
          </div>
        ) : (
          /* Not in room: Tabs to Join, Host, or Browse */
          <div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '12px',
                marginBottom: '18px'
              }}
            >
              <button
                onClick={() => setTab('active')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: tab === 'active' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: tab === 'active' ? '#ffffff' : '#94a3b8'
                }}
              >
                Active Parties
              </button>
              <button
                onClick={() => setTab('join')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: tab === 'join' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: tab === 'join' ? '#ffffff' : '#94a3b8'
                }}
              >
                Join by Code
              </button>
              <button
                onClick={() => setTab('host')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: tab === 'host' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: tab === 'host' ? '#ffffff' : '#94a3b8'
                }}
              >
                Host Party
              </button>
            </div>

            {/* TAB: ACTIVE ROOMS */}
            {tab === 'active' && (
              <div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' }}>
                  Available live rooms on the local network & community relay:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                  {publicRooms.length > 0 ? (
                    publicRooms.map((r) => (
                      <div
                        key={r.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{r.name}</span>
                            <span style={{ fontSize: '11px', color: '#06b6d4', letterSpacing: '1px', fontWeight: 700 }}>
                              [{r.code}]
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            Host: {r.hostName} • Playing: {r.currentTrackTitle}
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinRoom(r.code)}
                          disabled={loading}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#06b6d4',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#000000',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Join
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b', fontSize: '13px' }}>
                      No live parties active right now. Start one!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: JOIN BY CODE */}
            {tab === 'join' && (
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Your Nickname
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    6-Character Party Code (e.g. FLOW26)
                  </label>
                  <input
                    type="text"
                    placeholder="FLOW26"
                    maxLength={8}
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#06b6d4',
                      fontSize: '18px',
                      fontWeight: 700,
                      letterSpacing: '3px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={() => handleJoinRoom()}
                  disabled={loading || roomCodeInput.length < 4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: roomCodeInput.length < 4 ? 'not-allowed' : 'pointer',
                    opacity: roomCodeInput.length < 4 ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogIn size={16} /> {loading ? 'Joining...' : 'Join Party'}
                </button>
              </div>
            )}

            {/* TAB: HOST PARTY */}
            {tab === 'host' && (
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Party Room Name
                  </label>
                  <input
                    type="text"
                    value={roomNameInput}
                    onChange={(e) => setRoomNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Host Display Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '8px',
                    marginBottom: '18px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>Host-Only Control</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Only the host can pause, skip, or change track</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hostOnly}
                    onChange={(e) => setHostOnly(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#06b6d4', cursor: 'pointer' }}
                  />
                </div>
                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <PlusCircle size={16} /> {loading ? 'Creating...' : 'Start Jam Room'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

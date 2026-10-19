import React, { useEffect, useRef } from 'react';
import { Plus, Users, Settings, Check } from 'lucide-react';

interface AccountPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const AccountPopover: React.FC<AccountPopoverProps> = ({
  isOpen,
  onClose,
  onOpenSettings
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: '52px',
        right: '18px',
        width: '270px',
        backgroundColor: '#1a1d26',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.75)',
        zIndex: 100,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Switch account</div>
        <div style={{ fontSize: '12px', color: '#8c92a4', marginTop: '1px' }}>@Harrmane</div>
      </div>

      {/* Active Account Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 10px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          cursor: 'pointer'
        }}
      >
        <img
          src="/avatar_harrmane.svg"
          alt="Harrmane"
          style={{ width: '38px', height: '38px', borderRadius: '50%' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Harrmane</div>
          <div style={{ fontSize: '12px', color: '#8c92a4' }}>@Harrmane</div>
        </div>
        <Check size={18} style={{ color: '#ffffff', strokeWidth: 2.5 }} />
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '2px 0' }} />

      {/* Menu Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => {
            alert('Add account: Multiple Google / YouTube Music accounts supported.');
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 10px',
            borderRadius: '8px',
            background: 'none',
            border: 'none',
            color: '#e2e8f0',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Plus size={16} />
          <span>Add account</span>
        </button>

        <button
          onClick={() => {
            alert('Manage accounts: Manage active sessions and tokens.');
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 10px',
            borderRadius: '8px',
            background: 'none',
            border: 'none',
            color: '#e2e8f0',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Users size={16} />
          <span>Manage accounts</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 10px',
            borderRadius: '8px',
            background: 'none',
            border: 'none',
            color: '#e2e8f0',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

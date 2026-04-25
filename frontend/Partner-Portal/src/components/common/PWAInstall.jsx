import React, { useState, useEffect } from 'react';
import { MdInstallMobile, MdClose } from 'react-icons/md';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!sessionStorage.getItem('pwa-banner-dismissed')) {
        setShowBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-install-banner" style={{
      position: 'fixed', bottom: '16px', left: '16px', right: '16px',
      background: 'white', borderRadius: '20px', padding: '12px 16px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.25)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', zIndex: 10000,
      border: '1px solid rgba(0,0,0,0.05)', animation: 'pwaSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '48px', height: '48px', background: '#f8f9fa', 
          borderRadius: '12px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', border: '1px solid #f0f0f0' 
        }}>
          <MdInstallMobile size={24} color="var(--primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#1a1a1a', lineHeight: 1.2 }}>HostelPass Partner</div>
          <div style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>Manage your PG easily</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={handleInstall} style={{
          background: 'var(--primary)', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '12px', fontWeight: 800,
          fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          Install
        </button>
        <button onClick={handleDismiss} style={{
          background: '#f1f3f5', color: '#495057', border: 'none',
          width: '32px', height: '32px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <MdClose size={18} />
        </button>
      </div>

      <style>{`
        @keyframes pwaSlideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 769px) { .pwa-install-banner { display: none !important; } }
      `}</style>
    </div>
  );
};

export default PWAInstall;

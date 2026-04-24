import React, { useState, useEffect } from 'react';
import { MdDownload, MdClose } from 'react-icons/md';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user already dismissed it in this session
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
      console.log('User accepted the install prompt');
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
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: 'white',
      borderRadius: '16px',
      padding: '16px 20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10000,
      border: '1px solid #eee',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/pwa-192x192.png" alt="App Icon" style={{ width: '44px', height: '44px', borderRadius: '10px' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '15px', color: '#1a1a1a' }}>Install HostelPass</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Add to home screen for quick access</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleInstall} style={{
          background: 'var(--primary-gradient)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer'
        }}>
          <MdDownload /> Install
        </button>
        <button onClick={handleDismiss} style={{
          background: '#f5f5f5',
          color: '#666',
          border: 'none',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <MdClose size={20} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 769px) {
          .pwa-install-banner { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PWAInstall;

import React, { useState, useEffect } from 'react';
import { MdInstallMobile, MdClose } from 'react-icons/md';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-banner animate-slideUp">
      <div className="pwa-content">
        <MdInstallMobile className="pwa-icon" />
        <div className="pwa-text">
          <div className="pwa-title">Install Admin App</div>
          <div className="pwa-desc">Access the portal faster from your home screen</div>
        </div>
      </div>
      <div className="pwa-actions">
        <button onClick={handleInstall} className="btn-install">Install</button>
        <button onClick={() => setIsVisible(false)} className="btn-close-pwa">
          <MdClose />
        </button>
      </div>
    </div>
  );
};

export default PWAInstall;

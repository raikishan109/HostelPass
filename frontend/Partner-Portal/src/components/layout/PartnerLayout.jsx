import React, { useState } from 'react';
import PartnerSidebar from './PartnerSidebar';
import Topbar from './Topbar';

const PartnerLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <PartnerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 999 }}
        />
      )}

      <div className="main-content">
        <Topbar 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        <div className="page-content animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PartnerLayout;

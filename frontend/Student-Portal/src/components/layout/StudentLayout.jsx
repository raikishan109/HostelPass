import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import Topbar from './Topbar';
import MobileBottomNav from './MobileBottomNav';

const StudentLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="modal-overlay pc-only-hidden" 
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
      <MobileBottomNav />
    </div>
  );
};

export default StudentLayout;

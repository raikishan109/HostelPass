import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';

const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
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
    </div>
  );
};

export default AdminLayout;

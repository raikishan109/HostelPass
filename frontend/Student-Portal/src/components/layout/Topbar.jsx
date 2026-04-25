import React from 'react';
import { MdMenu } from 'react-icons/md';
import Logo from '../common/Logo';
import UserActions from './UserActions';

const Topbar = ({ title, onMenuClick, subtitle }) => {
  return (
    <nav className="topbar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="nav-left" style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
        <button 
          className="btn btn-ghost btn-icon mobile-only" 
          onClick={onMenuClick}
          style={{ 
            padding: 0, 
            minWidth: '40px', 
            height: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <MdMenu size={24} />
        </button>
        <Logo />
      </div>

      <UserActions />
    </nav>
  );
};

export default Topbar;

import React from 'react';
import { MdMenu } from 'react-icons/md';
import Logo from '../common/Logo';
import UserActions from './UserActions';

const Topbar = ({ title, onMenuClick, subtitle }) => {
  return (
    <nav className="topbar">
      <div className="nav-left">
        <button 
          className="btn btn-ghost btn-icon pc-only-hidden" 
          onClick={onMenuClick}
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

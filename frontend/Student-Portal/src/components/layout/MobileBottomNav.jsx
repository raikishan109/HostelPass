import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdHome, MdSearch, MdPayment, MdMessage, MdPerson, MdBookmark, MdHeadsetMic } from 'react-icons/md';

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/student', icon: <MdHome />, label: 'Home' },
    { path: '/student/search-results', icon: <MdSearch />, label: 'Explore' },
    { path: '/student/favorites', icon: <MdBookmark />, label: 'Saved' },
    { path: '/student/support', icon: <MdHeadsetMic />, label: 'Support' },
    { path: '/student/profile', icon: <MdPerson />, label: 'Profile' },
  ];

  return (
    <nav className="mobile-nav-container pc-only-hidden">
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path} 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          end={item.path === '/student'}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;

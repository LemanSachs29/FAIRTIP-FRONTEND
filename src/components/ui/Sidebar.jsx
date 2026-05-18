// Fairtip — Sidebar component
// Manager-only nav.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/fairtip-logo.svg';

const FtSidebar = ({ active, onSignOut }) => {
  const navigate = useNavigate();
  const I = ({ name }) => <Icon name={name} className="ic" />;
  const items = [
    { key: 'dashboard', label: 'Dashboard',     icon: 'layout-dashboard', path: '/dashboard' },
    { key: 'employees', label: 'Employees',     icon: 'users', path: '/employees' },
    { key: 'distributions', label: 'Distributions', icon: 'pie-chart', path: '/distributions' },
    { key: 'absences', label: 'Absences',       icon: 'calendar-x', path: '/absences' },
    { key: 'settings', label: 'Settings',       icon: 'settings', path: '/dashboard/settings' },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <img src={logo} width="120" height="24" alt="Fairtip" />
      </div>
      <div className="sb-section">Workspace</div>
      {items.map(i => (
        <div key={i.key}
             className={"sb-item " + (active === i.key ? "active" : "")}
             onClick={() => navigate(i.path)}>
          <I name={i.icon} />
          {i.label}
        </div>
      ))}
      <div className="sb-spacer"></div>
      {onSignOut && (
        <button className="btn btn-secondary" onClick={onSignOut} style={{margin:'12px', gap: 8, width: 'calc(100% - 24px)'}}>
          <Icon name="log-out" className="ic" />
          <span>Sign out</span>
        </button>
      )}
    </aside>
  );
};
window.FtSidebar = FtSidebar;

export {FtSidebar};

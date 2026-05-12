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
  ];
  const settings = [
    { key: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
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
      <div className="sb-section">Account</div>
      {settings.map(i => (
        <div key={i.key} className={"sb-item " + (active === i.key ? "active" : "")} onClick={() => navigate(i.path)}>
          <I name={i.icon} />
          {i.label}
        </div>
      ))}
      <div className="sb-spacer"></div>
      <div className="sb-user">
        <div className="avatar">LB</div>
        <div className="meta">
          <span className="name">Leman B.</span>
          <span className="email">manager@trattoria.es</span>
        </div>
        {onSignOut && (
          <button className="btn btn-icon btn-ghost sb-signout" aria-label="Sign out" onClick={onSignOut}>
            <Icon name="log-out" className="ic" />
          </button>
        )}
      </div>
    </aside>
  );
};
window.FtSidebar = FtSidebar;

export {FtSidebar};

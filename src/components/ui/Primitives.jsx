// Fairtip — Generic primitives: Button, Badge, Card, Stat, Modal, EmptyState

// Stable React-owned wrapper around Lucide SVGs.
// Renders an inline SVG via dangerouslySetInnerHTML so React keeps full ownership
// of the DOM node (no createIcons() mutation racing with reconciliation).

import React from 'react';


const Icon = ({ name, className = '', style }) => {
  const svg = React.useMemo(() => {
    const icons = (window.lucide && window.lucide.icons) || {};
    const pascal = name.split('-').map(p => p ? p[0].toUpperCase() + p.slice(1) : '').join('');
    const camel = pascal ? pascal[0].toLowerCase() + pascal.slice(1) : '';
    const def = icons[pascal] || icons[camel] || icons[name];
    if (!def) return '';
    // Lucide UMD: icons[name] = { toSvg, ... }  OR  raw array node.
    if (typeof def.toSvg === 'function') return def.toSvg({ 'stroke-width': 1.75 });
    if (Array.isArray(def)) {
      // Older shape: [tag, attrs, children]
      const children = (def[2] || []).map(([tag, attrs]) => {
        const a = Object.entries(attrs || {}).map(([k,v]) => `${k}="${v}"`).join(' ');
        return `<${tag} ${a} />`;
      }).join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
    }
    return '';
  }, [name]);
  return <span className={"lucide-wrap " + className} style={style} dangerouslySetInnerHTML={{ __html: svg }} />;
};

const FtButton = ({ variant = 'secondary', size = '', icon, children, onClick, type, disabled }) => {
  const cls = `btn btn-${variant} ${size ? 'btn-' + size : ''}`;
  return (
    <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} className="ic" />}
      {children}
    </button>
  );
};

const FtIconButton = ({ icon, label, onClick, disabled }) => (
  <button className="btn btn-icon btn-ghost" aria-label={label} onClick={onClick} disabled={disabled}>
    <Icon name={icon} className="ic" />
  </button>
);

const FtBadge = ({ tone = 'neutral', dot, children }) => (
  <span className={`badge b-${tone}`}>
    {dot && <span className="dot" style={{background: dot}}></span>}
    {children}
  </span>
);

const FtCard = ({ title, actions, children, flush }) => (
  <section className="card">
    {(title || actions) && (
      <div className="card-h">
        {title && <h2>{title}</h2>}
        {actions && <div className="actions">{actions}</div>}
      </div>
    )}
    <div className={"card-body" + (flush ? " flush" : "")}>{children}</div>
  </section>
);

const FtStat = ({ label, value, sub }) => (
  <div className="stat">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
    {sub && <div className="sub">{sub}</div>}
  </div>
);

const FtModal = ({ title, onClose, children, footer }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-h">
        <h2>{title}</h2>
        <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
          <Icon name="x" className="ic" />
        </button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-f">{footer}</div>}
    </div>
  </div>
);

const FtEmpty = ({ icon = 'inbox', title, body, action }) => (
  <div className="center-col">
    <div style={{
      width: 40, height: 40, borderRadius: 8,
      background: 'var(--surface-sunken)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--fg-muted)',
    }}>
      <Icon name={icon} style={{width: 20, height: 20, display: 'inline-flex'}} />
    </div>
    <h3 style={{margin: '4px 0 2px', font: '600 16px/22px var(--font-sans)', color: 'var(--fg-strong)'}}>{title}</h3>
    {body && <p style={{margin: '0 0 14px', color: 'var(--fg-muted)', fontSize: 13}}>{body}</p>}
    {action}
  </div>
);

Object.assign(window, { Icon, FtButton, FtIconButton, FtBadge, FtCard, FtStat, FtModal, FtEmpty });

export {FtButton, FtBadge, FtCard, FtStat, FtModal, FtEmpty, Icon, FtIconButton};

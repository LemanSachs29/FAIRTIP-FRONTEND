import React from 'react';

// Fairtip — Topbar with breadcrumbs
const FtTopbar = ({ crumbs = [], right }) => {
  return (
    <header className="topbar">
      <nav className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? "here" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </nav>
      <div className="topbar-spacer"></div>
      {right}
    </header>
  );
};
window.FtTopbar = FtTopbar;

export {FtTopbar};
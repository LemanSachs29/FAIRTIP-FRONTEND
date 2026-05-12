import React from 'react';

import { FtTheme } from './components/ui/Theme.jsx';
import { FtSidebar } from './components/ui/Sidebar.jsx';
import { FtTopbar } from './components/ui/Topbar.jsx';
import {
  FtButton,
  FtCard,
  FtEmpty,
} from './components/ui/Primitives.jsx';

import { FtLogin, FtRegister } from './pages/Auth.jsx';
import { FtDashboard } from './pages/Dashboard.jsx';
import { FtEmployees } from './pages/Employees.jsx';
import { FtEmployeeDetail } from './pages/EmployeeDetail.jsx';
import { FtDistributions, FtNewDistribution } from './pages/Distributions.jsx';
import { FtDistributionDetail } from './pages/DistributionDetail.jsx';

// Fairtip — App shell. Wires together every screen as a click-through prototype.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "charcoal",
  "font": "plex",
  "authView": "app"
}/*EDITMODE-END*/;

const FtApp = () => {
  const [t, setTweak] = (typeof useTweaks === 'function') ? useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  const [view, setView] = React.useState({ name: 'dashboard' });
  const [showNewDist, setShowNewDist] = React.useState(false);

  const nav = (key) => setView({ name: key });
  const openEmployee = (id) => setView({ name: 'employee', id });
  const openDistribution = (id) => setView({ name: 'distribution', id });

  // Auth-view tweak: 'app' | 'login' | 'register' lets the reviewer see each.
  const authView = t.authView || 'app';
  if (authView === 'login') {
    return <>
      <FtTheme palette={t.palette} font={t.font} />
      <FtLogin onSwitch={(m)=>setTweak('authView', m)} onLogin={()=>setTweak('authView','app')} />
      <FtTweaks t={t} setTweak={setTweak} />
    </>;
  }
  if (authView === 'register') {
    return <>
      <FtTheme palette={t.palette} font={t.font} />
      <FtRegister onSwitch={(m)=>setTweak('authView', m)} onRegister={()=>setTweak('authView','app')} />
      <FtTweaks t={t} setTweak={setTweak} />
    </>;
  }

  const crumbs = (() => {
    switch (view.name) {
      case 'dashboard':     return ['Dashboard'];
      case 'employees':     return ['Employees'];
      case 'employee':      return ['Employees', 'Maria Lopez'];
      case 'distributions': return ['Distributions'];
      case 'distribution':  return ['Distributions', '#' + view.id.toString().padStart(4,'0')];
      case 'absences':      return ['Absences'];
      case 'settings':      return ['Settings'];
      default: return ['Dashboard'];
    }
  })();

  let body = null;
  switch (view.name) {
    case 'dashboard':
      body = <FtDashboard
        onNewDistribution={() => setShowNewDist(true)}
        onOpenDistribution={openDistribution}
      />; break;
    case 'employees':
      body = <FtEmployees onOpenEmployee={openEmployee} />; break;
    case 'employee':
      body = <FtEmployeeDetail employeeId={view.id} onBack={() => nav('employees')} />; break;
    case 'distributions':
      body = <FtDistributions onNew={() => setShowNewDist(true)} onOpenDistribution={openDistribution} />; break;
    case 'distribution':
      body = <FtDistributionDetail distributionId={view.id} onBack={() => nav('distributions')} />; break;
    case 'absences':
      body = (
        <div>
          <div className="page-h"><div className="titles"><h1>Absences</h1><div className="sub">All absences across employees.</div></div></div>
          <FtCard><FtEmpty icon="calendar-x" title="Calendar view coming soon."
            body="For now, register absences inside an employee's profile."
            action={<FtButton variant="primary" icon="users" onClick={() => nav('employees')}>Go to employees</FtButton>} />
          </FtCard>
        </div>
      ); break;
    case 'settings':
      body = (
        <div>
          <div className="page-h"><div className="titles"><h1>Settings</h1><div className="sub">Workspace and currency.</div></div></div>
          <div className="grid-2">
            <FtCard title="Workspace">
              <div className="field" style={{marginBottom: 16}}>
                <label className="l">Display name</label>
                <input className="inp" defaultValue="Trattoria San Marco" />
              </div>
              <div className="field">
                <label className="l">Default currency</label>
                <select className="inp"><option>EUR — €</option><option>USD — $</option><option>GBP — £</option></select>
              </div>
            </FtCard>
            <FtCard title="Rounding">
              <div className="field" style={{marginBottom: 16}}>
                <label className="l">Display precision</label>
                <select className="inp"><option>2 decimals</option><option>4 decimals</option></select>
              </div>
              <div className="field">
                <label className="l">Apply remainder to</label>
                <select className="inp"><option>Largest share</option><option>Random employee</option><option>Carry over</option></select>
              </div>
            </FtCard>
          </div>
        </div>
      ); break;
    default: body = <div>Not found.</div>;
  }

  return (
    <>
      <FtTheme palette={t.palette} font={t.font} />
      <div className="app">
        <FtSidebar
          active={view.name === 'employee' ? 'employees' : view.name === 'distribution' ? 'distributions' : view.name}
          onNav={nav}
          onSignOut={() => setTweak('authView', 'login')}
        />
        <main className="main">
          <FtTopbar crumbs={crumbs} />
          <div className="page">{body}</div>
        </main>
        {showNewDist && (
          <FtNewDistribution
            onCancel={() => setShowNewDist(false)}
            onCreate={({start, end, total}) => { setShowNewDist(false); openDistribution(13); }}
          />
        )}
      </div>
      <FtTweaks t={t} setTweak={setTweak} />
    </>
  );
};

const FtTweaks = ({ t, setTweak }) => {
  if (typeof TweaksPanel !== 'function') return null;
  const paletteOpts = Object.entries(FT_PALETTES).map(([k, v]) => ({ value: k, swatch: v.swatch, label: v.label }));
  const fontOpts = Object.entries(FT_FONTS).map(([k, v]) => ({ value: k, label: v.label, sub: v.sub }));
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette">
        <div className="tw-swatches">
          {paletteOpts.map(p => (
            <button key={p.value} className={"tw-swatch " + (t.palette === p.value ? "on" : "")}
              onClick={() => setTweak('palette', p.value)} title={p.label}>
              <span className="tw-sw-dots">
                <span style={{background:p.swatch[0]}} />
                <span style={{background:p.swatch[1]}} />
                <span style={{background:p.swatch[2]}} />
              </span>
              <span className="tw-sw-lbl">{p.label}</span>
            </button>
          ))}
        </div>
      </TweakSection>
      <TweakSection label="Typeface">
        {fontOpts.map(f => (
          <button key={f.value} className={"tw-font " + (t.font === f.value ? "on" : "")}
            onClick={() => setTweak('font', f.value)}
            style={{ fontFamily: (FT_FONTS[f.value] && FT_FONTS[f.value].sans) || 'inherit' }}>
            <span className="tw-font-lbl">{f.label}</span>
            <span className="tw-font-sub">{f.sub}</span>
          </button>
        ))}
      </TweakSection>
      <TweakSection label="View">
        <TweakRadio
          label="Screen"
          value={t.authView}
          options={[
            { value: 'app', label: 'App' },
            { value: 'login', label: 'Log in' },
            { value: 'register', label: 'Sign up' },
          ]}
          onChange={(v) => setTweak('authView', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
};

export default FtApp;
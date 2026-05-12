import React from 'react';
import fairtipMark from '../../assets/fairtip-mark.svg'; 
import logo from '../../assets/fairtip-logo.svg';

// Fairtip — Auth shell. Hosts Login + Register on a split layout.

const FtAuthShell = ({ children, mode = 'login', onSwitch }) => (
  <div className="auth">
    <aside className="auth-side">
      <div className="auth-brand">
        <img src={fairtipMark} alt="" width="28" height="28" />
        <span>Fairtip</span>
      </div>
      <div className="auth-pitch">
        <h2 className="auth-headline">Distribute tips fairly,<br/>in under a minute.</h2>
        <p className="auth-blurb">A clean ledger for restaurant managers. Track hours, split pools, and keep a paper trail your team trusts.</p>
        <ul className="auth-points">
          <li><Icon name="clock" className="ic" /> Hours-based, fixed, or custom rules</li>
          <li><Icon name="receipt" className="ic" /> Per-employee distribution history</li>
          <li><Icon name="download" className="ic" /> Export to CSV or PDF anytime</li>
        </ul>
      </div>
      <div className="auth-foot muted">© Fairtip 2025 · Made for hospitality</div>
    </aside>
    <main className="auth-main">
      <div className="auth-card">
        {children}
        <div className="auth-swap">
          {mode === 'login'
            ? <>New here? <a href="#" onClick={(e)=>{e.preventDefault(); onSwitch('register');}}>Create an account</a></>
            : <>Already have an account? <a href="#" onClick={(e)=>{e.preventDefault(); onSwitch('login');}}>Log in</a></>}
        </div>
      </div>
    </main>
  </div>
);

const FtLogin = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = React.useState('manager@trattoria.example');
  const [pass, setPass]   = React.useState('••••••••••');
  return (
    <FtAuthShell mode="login" onSwitch={onSwitch}>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-sub">Log in to your Fairtip workspace.</p>
      <form className="auth-form" onSubmit={(e)=>{e.preventDefault(); onLogin();}}>
        <div className="field">
          <label className="l">Work email</label>
          <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="field">
          <div className="row" style={{justifyContent:'space-between'}}>
            <label className="l">Password</label>
            <a href="#" className="auth-link-sm" onClick={e=>e.preventDefault()}>Forgot?</a>
          </div>
          <input className="inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} autoComplete="current-password" />
        </div>
        <label className="auth-check">
          <input type="checkbox" defaultChecked /> Keep me signed in on this device
        </label>
        <FtButton variant="primary" type="submit">Log in</FtButton>
      </form>
      <div className="auth-divider"><span>or</span></div>
      <button className="btn btn-secondary auth-sso" type="button">
        <Icon name="key-round" className="ic" /> Continue with SSO
      </button>
    </FtAuthShell>
  );
};

const FtRegister = ({ onSwitch, onRegister }) => {
  const [step, setStep] = React.useState(1);
  const [name, setName]   = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass]   = React.useState('');
  const [biz, setBiz]     = React.useState('');
  const [size, setSize]   = React.useState('5-15');

  return (
    <FtAuthShell mode="register" onSwitch={onSwitch}>
      <div className="auth-step">
        <span className={step >= 1 ? 'on' : ''}>1 · You</span>
        <span className="sep">·</span>
        <span className={step >= 2 ? 'on' : ''}>2 · Restaurant</span>
      </div>
      <h1 className="auth-title">Create your workspace</h1>
      <p className="auth-sub">Free for 14 days. No card required.</p>

      {step === 1 ? (
        <form className="auth-form" onSubmit={(e)=>{e.preventDefault(); setStep(2);}}>
          <div className="field">
            <label className="l">Your name</label>
            <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Maria Lopez" autoFocus />
          </div>
          <div className="field">
            <label className="l">Work email</label>
            <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@restaurant.com" />
          </div>
          <div className="field">
            <label className="l">Password</label>
            <input className="inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="At least 10 characters" />
            <div className="auth-hint">Use 10+ characters. We'll send a verification link.</div>
          </div>
          <FtButton variant="primary" type="submit">Continue</FtButton>
        </form>
      ) : (
        <form className="auth-form" onSubmit={(e)=>{e.preventDefault(); onRegister();}}>
          <div className="field">
            <label className="l">Restaurant name</label>
            <input className="inp" value={biz} onChange={e=>setBiz(e.target.value)} placeholder="Trattoria San Marco" autoFocus />
          </div>
          <div className="field">
            <label className="l">Team size</label>
            <select className="inp" value={size} onChange={e=>setSize(e.target.value)}>
              <option>1-4</option><option>5-15</option><option>16-40</option><option>40+</option>
            </select>
          </div>
          <div className="field">
            <label className="l">Default currency</label>
            <select className="inp" defaultValue="EUR — €"><option>EUR — €</option><option>USD — $</option><option>GBP — £</option></select>
          </div>
          <label className="auth-check">
            <input type="checkbox" defaultChecked /> I agree to the Terms and Privacy Policy
          </label>
          <div className="row" style={{gap:8}}>
            <FtButton variant="secondary" onClick={()=>setStep(1)}>Back</FtButton>
            <FtButton variant="primary" type="submit">Create workspace</FtButton>
          </div>
        </form>
      )}
    </FtAuthShell>
  );
};

Object.assign(window, { FtLogin, FtRegister });

export { FtAuthShell, FtLogin, FtRegister };
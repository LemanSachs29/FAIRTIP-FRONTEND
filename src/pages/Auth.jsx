import React from 'react';
import fairtipMark from '../assets/fairtip-mark.svg';

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
          <li><Icon name="clock" className="ic" /> Track employee hours</li>
          <li><Icon name="receipt" className="ic" /> Fair tip distribution</li>
          <li><Icon name="users" className="ic" /> Manage your team</li>
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
  const [email, setEmail] = React.useState('');
  const [pass, setPass]   = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onLogin(email, pass);
    } catch (err) {
      setError(err?.message || 'Unable to log in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <FtAuthShell mode="login" onSwitch={onSwitch}>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-sub">Log in to your Fairtip workspace.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <div className="field">
          <label className="l">Work email</label>
          <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="field">
          <label className="l">Password</label>
          <input className="inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} autoComplete="current-password" required />
        </div>
        <FtButton variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</FtButton>
      </form>
    </FtAuthShell>
  );
};

const FtRegister = ({ onSwitch, onRegister }) => {
  const [email, setEmail] = React.useState('');
  const [pass, setPass]   = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onRegister(email, pass);
    } catch (err) {
      setError(err?.message || 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FtAuthShell mode="register" onSwitch={onSwitch}>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">Sign up for Fairtip to get started.</p>
      {error && <div className="auth-error" role="alert">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="l">Work email</label>
          <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@restaurant.com" autoFocus required />
        </div>
        <div className="field">
          <label className="l">Password</label>
          <input className="inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="At least 8 characters" required />
        </div>
        <FtButton variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create account'}</FtButton>
      </form>
    </FtAuthShell>
  );
};

Object.assign(window, { FtLogin, FtRegister });

export { FtAuthShell, FtLogin, FtRegister };

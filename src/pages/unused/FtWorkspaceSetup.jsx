import React from 'react';

import { FtButton } from '../../components/ui/Primitives.jsx';

// Archived MVP onboarding step. This is intentionally not wired into /register yet.
// Keep it as a starting point when restaurant/workspace setup returns.
const FtWorkspaceSetup = ({ onBack, onCreate }) => {
  const [biz, setBiz] = React.useState('');
  const [size, setSize] = React.useState('5-15');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate?.({ businessName: biz, teamSize: size });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
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
        <select className="inp" defaultValue="EUR"><option>EUR</option><option>USD</option><option>GBP</option></select>
      </div>
      <label className="auth-check">
        <input type="checkbox" defaultChecked /> I agree to the Terms and Privacy Policy
      </label>
      <div className="row" style={{gap:8}}>
        <FtButton variant="secondary" onClick={onBack} disabled={isSubmitting}>Back</FtButton>
        <FtButton variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create workspace'}</FtButton>
      </div>
    </form>
  );
};

export { FtWorkspaceSetup };

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FtButton, FtCard } from '../components/ui/Primitives.jsx';
import { api } from '../services/api.js';
import { logout } from '../services/auth.js';

const FtSettings = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [serverError, setServerError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = () => {
    const next = {};

    if (!currentPassword.trim()) {
      next.currentPassword = 'Current password is required.';
    }
    if (!newPassword) {
      next.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      next.newPassword = 'New password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      next.confirmPassword = 'Confirm new password is required.';
    } else if (confirmPassword !== newPassword) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccessMessage('Password updated successfully. Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFieldErrors({});

      window.setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err) {
      setServerError(err?.message || 'Unable to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-h">
        <div className="titles">
          <h1>Settings</h1>
          <div className="sub">Change your password and protect your account.</div>
        </div>
      </div>

      <FtCard title="Change password">
        {successMessage && (
          <div
            role="status"
            style={{
              border: '1px solid #2f855a',
              background: '#e6fffa',
              color: '#276749',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {successMessage}
          </div>
        )}

        {serverError && <div className="auth-error" role="alert">{serverError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="l">Current password</label>
            <input
              className="inp"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {fieldErrors.currentPassword && (
              <div style={{ color: '#d53033', fontSize: 13 }}>{fieldErrors.currentPassword}</div>
            )}
          </div>

          <div className="field">
            <label className="l">New password</label>
            <input
              className="inp"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {fieldErrors.newPassword && (
              <div style={{ color: '#d53033', fontSize: 13 }}>{fieldErrors.newPassword}</div>
            )}
          </div>

          <div className="field">
            <label className="l">Confirm new password</label>
            <input
              className="inp"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {fieldErrors.confirmPassword && (
              <div style={{ color: '#d53033', fontSize: 13 }}>{fieldErrors.confirmPassword}</div>
            )}
          </div>

          <FtButton variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update password'}
          </FtButton>
        </form>
      </FtCard>
    </div>
  );
};

export { FtSettings };
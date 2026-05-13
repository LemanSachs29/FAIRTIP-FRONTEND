import React from 'react';

import { getDistributions } from '../services/distributions.js';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const FtDistributions = ({ onOpenDistribution, onNew }) => {
  const [list, setList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');

  const loadDistributions = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const data = await getDistributions();
      setList(Array.isArray(data) ? data : data?.distributions || []);
    } catch (err) {
      setLoadError(err?.message || 'Unable to load distributions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDistributions();
  }, [loadDistributions]);

  return (
    <div>
      <div className="page-h">
        <div className="titles">
          <h1>Distributions</h1>
          <div className="sub">All saved tip distributions.</div>
        </div>
        <div className="actions">
          <FtButton variant="secondary" icon="download">Export</FtButton>
          <FtButton variant="primary" icon="plus" onClick={onNew}>New distribution</FtButton>
        </div>
      </div>

      <FtCard flush={!isLoading && !loadError && list.length > 0}>
        {isLoading ? (
          <FtEmpty icon="loader" title="Loading distributions..." body="Fetching the latest distributions." />
        ) : loadError ? (
          <FtEmpty
            icon="circle-alert"
            title="Could not load distributions."
            body={loadError}
            action={<FtButton variant="secondary" onClick={loadDistributions}>Try again</FtButton>}
          />
        ) : list.length === 0 ? (
          <FtEmpty icon="pie-chart" title="No distributions yet." body="Create your first distribution to start sharing tips." />
        ) : (
          <table className="tbl">
            <thead><tr>
              <th>Period</th>
              <th>Employees</th>
              <th className="r">Computed h</th>
              <th className="r">Total tips</th>
              <th className="r">€ / hour</th>
              <th>Status</th>
            </tr></thead>
            <tbody>
              {list.map(d => (
                <tr key={d.id} onClick={() => onOpenDistribution && onOpenDistribution(d.id)}>
                  <td>
                    <div className="name">{formatDate(d.start_date)} – {formatDate(d.end_date)}</div>
                    <div className="sub">#{d.id.toString().padStart(4,'0')}</div>
                  </td>
                  <td>{d.entry_count}</td>
                  <td className="r">{d.total_computed_hours}</td>
                  <td className="r"><strong>€{d.total_rounded_amount}</strong></td>
                  <td className="r">€{d.tip_per_hour}</td>
                  <td><FtBadge tone="success" dot="#2F7D5B">Distributed</FtBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </FtCard>
    </div>
  );
};

const FtNewDistribution = ({ onCancel, onCreate }) => {
  const [start, setStart] = React.useState('2026-06-01');
  const [end,   setEnd]   = React.useState('2026-06-30');
  const [total, setTotal] = React.useState('2500.00');
  const [error, setError] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const submit = async () => {
    if (!onCreate) return;

    setError('');
    setIsCreating(true);

    try {
      await onCreate({ start_date: start, end_date: end, total_tip_amount: total });
      // Reset form after successful creation
      setStart('2026-06-01');
      setEnd('2026-06-30');
      setTotal('2500.00');
    } catch (err) {
      setError(err?.message || 'Unable to create distribution.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <FtModal
      title="New distribution"
      onClose={onCancel}
      footer={<>
        <FtButton variant="secondary" onClick={onCancel} disabled={isCreating}>Cancel</FtButton>
        <FtButton variant="primary" icon="pie-chart" onClick={submit} disabled={isCreating || !start || !end || !total}>
          {isCreating ? 'Creating...' : 'Calculate'}
        </FtButton>
      </>}
    >
      <div className="grid-2">
        <div className="field">
          <label className="l">Start date</label>
          <input className="inp" type="date" value={start} onChange={e => setStart(e.target.value)} disabled={isCreating} />
        </div>
        <div className="field">
          <label className="l">End date</label>
          <input className="inp" type="date" value={end} onChange={e => setEnd(e.target.value)} disabled={isCreating} />
        </div>
      </div>
      <div className="field">
        <label className="l">Total tip amount</label>
        <div className="inp-h"><span className="prefix">€</span>
          <input className="inp" value={total} onChange={e => setTotal(e.target.value)} disabled={isCreating} />
        </div>
        <span className="caption" style={{color:'var(--fg-subtle)'}}>Distributed proportionally to each employee's computed hours.</span>
      </div>
      {error && (
        <div style={{background: 'var(--surface-sunken)', borderRadius: 8, padding: 12, display:'flex', gap: 10, marginBottom: 12, borderLeft: '3px solid var(--warning)'}}>
          <Icon name="circle-alert" style={{width:16, height:16, color:'var(--warning)', flex:'0 0 16px', marginTop: 2, display:'inline-flex'}} />
          <div className="body-sm" style={{color:'var(--fg-muted)'}}>{error}</div>
        </div>
      )}
      <div style={{background: 'var(--surface-sunken)', borderRadius: 8, padding: 12, display:'flex', gap: 10}}>
        <Icon name="info" style={{width:16, height:16, color:'var(--info)', flex:'0 0 16px', marginTop: 2, display:'inline-flex'}} />
        <div className="body-sm" style={{color:'var(--fg-muted)'}}>
          Snapshot taken at calculation time. Editing employee hours afterwards won't change this distribution.
        </div>
      </div>
    </FtModal>
  );
};

window.FtDistributions = FtDistributions;
window.FtNewDistribution = FtNewDistribution;

export { FtDistributions, FtNewDistribution };
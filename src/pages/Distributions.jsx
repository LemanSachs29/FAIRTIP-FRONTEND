import React from 'react';

// Fairtip — Distributions list + New distribution flow
const SEED_DIST = [
  { id: 12, period: 'May 1 – May 31, 2026', total: '€2,310.00', perHour: '€10.9764', employees: 8, hours: '210.50' },
  { id: 11, period: 'Apr 1 – Apr 30, 2026', total: '€1,985.50', perHour: '€9.4138',  employees: 8, hours: '210.92' },
  { id: 10, period: 'Mar 1 – Mar 31, 2026', total: '€2,142.20', perHour: '€10.0567', employees: 7, hours: '213.00' },
  { id:  9, period: 'Feb 1 – Feb 28, 2026', total: '€1,720.00', perHour: '€9.0526',  employees: 7, hours: '190.00' },
];

const FtDistributions = ({ onOpenDistribution, onNew }) => (
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
    <FtCard flush>
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
          {SEED_DIST.map(d => (
            <tr key={d.id} onClick={() => onOpenDistribution && onOpenDistribution(d.id)}>
              <td><div className="name">{d.period}</div><div className="sub">#{d.id.toString().padStart(4,'0')}</div></td>
              <td>{d.employees}</td>
              <td className="r">{d.hours}</td>
              <td className="r"><strong>{d.total}</strong></td>
              <td className="r">{d.perHour}</td>
              <td><FtBadge tone="success" dot="#2F7D5B">Distributed</FtBadge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </FtCard>
  </div>
);

const FtNewDistribution = ({ onCancel, onCreate }) => {
  const [start, setStart] = React.useState('2026-06-01');
  const [end,   setEnd]   = React.useState('2026-06-30');
  const [total, setTotal] = React.useState('2500.00');
  return (
    <FtModal
      title="New distribution"
      onClose={onCancel}
      footer={<>
        <FtButton variant="secondary" onClick={onCancel}>Cancel</FtButton>
        <FtButton variant="primary" icon="pie-chart" onClick={() => onCreate && onCreate({start, end, total})}>Calculate</FtButton>
      </>}
    >
      <div className="grid-2">
        <div className="field">
          <label className="l">Start date</label>
          <input className="inp" type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div className="field">
          <label className="l">End date</label>
          <input className="inp" type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="l">Total tip amount</label>
        <div className="inp-h"><span className="prefix">€</span>
          <input className="inp" value={total} onChange={e => setTotal(e.target.value)} />
        </div>
        <span className="caption" style={{color:'var(--fg-subtle)'}}>Distributed proportionally to each employee's computed hours.</span>
      </div>
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
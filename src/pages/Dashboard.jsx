import React from 'react';

// Fairtip — Dashboard screen
const FtDashboard = ({ onNewDistribution, onOpenDistribution }) => {
  const recent = [
    { id: 12, period: 'May 1 – May 31, 2026', total: '€2,310.00', perHour: '€10.9764', employees: 8, status: 'Distributed' },
    { id: 11, period: 'Apr 1 – Apr 30, 2026', total: '€1,985.50', perHour: '€9.4138',  employees: 8, status: 'Distributed' },
    { id: 10, period: 'Mar 1 – Mar 31, 2026', total: '€2,142.20', perHour: '€10.0567', employees: 7, status: 'Distributed' },
  ];
  return (
    <div>
      <div className="page-h">
        <div className="titles">
          <h1>Dashboard</h1>
          <div className="sub">Overview of tips, hours, and recent distributions.</div>
        </div>
        <div className="actions">
          <FtButton variant="secondary" icon="download">Export</FtButton>
          <FtButton variant="primary" icon="plus" onClick={onNewDistribution}>New distribution</FtButton>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom: 20}}>
        <FtStat label="Tips, this period" value="€2,500.00" sub="Jun 1 – Jun 30, 2026 (draft)" />
        <FtStat label="Tip per hour"      value="€11.7647"  sub="Across 212.50 computed hours" />
        <FtStat label="Employees"         value="8"         sub="3 with absences this period" />
      </div>

      <FtCard
        title="Recent distributions"
        actions={<FtButton variant="ghost" size="sm" icon="arrow-right">View all</FtButton>}
        flush
      >
        <table className="tbl">
          <thead><tr>
            <th>Period</th>
            <th>Employees</th>
            <th className="r">Total tips</th>
            <th className="r">€ / hour</th>
            <th>Status</th>
          </tr></thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.id} onClick={() => onOpenDistribution && onOpenDistribution(r.id)}>
                <td><div className="name">{r.period}</div><div className="sub">#{r.id.toString().padStart(4,'0')}</div></td>
                <td>{r.employees}</td>
                <td className="r"><strong>{r.total}</strong></td>
                <td className="r">{r.perHour}</td>
                <td><FtBadge tone="success" dot="#2F7D5B">{r.status}</FtBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </FtCard>
    </div>
  );
};
window.FtDashboard = FtDashboard;

export { FtDashboard };
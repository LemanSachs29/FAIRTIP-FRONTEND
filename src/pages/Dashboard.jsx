import React from 'react';

// Fairtip — Dashboard screen
const FtDashboard = ({ onNewDistribution, onOpenDistribution }) => {
  const mockDistributions = [
    {
      id: 1,
      start_date: "2026-10-01",
      end_date: "2026-10-15",
      total_tip_amount: "400.00",
      total_computed_hours: "736.00",
      tip_per_hour: "0.5435",
      created_at: "2026-10-15T12:00:00Z",
    },
  ];

  const mockEmployees = [
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
  ];

  const formatCurrency = (value) => `€${value}`;

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} – ${endStr}`;
  };

  const getLatestDistribution = (distributions) => distributions[0];

  const distributions = mockDistributions;
  const employees = mockEmployees;
  const latestDistribution = getLatestDistribution(distributions);

  const card1 = latestDistribution ? {
    label: "Latest distribution",
    value: formatCurrency(latestDistribution.total_tip_amount),
    sub: formatDateRange(latestDistribution.start_date, latestDistribution.end_date)
  } : {
    label: "Latest distribution",
    value: "No distributions yet",
    sub: "Create your first distribution to see results"
  };

  const card2 = latestDistribution ? {
    label: "Tip per hour",
    value: formatCurrency(latestDistribution.tip_per_hour),
    sub: `Across ${latestDistribution.total_computed_hours} computed hours`
  } : {
    label: "Tip per hour",
    value: "—",
    sub: "Across 0.00 computed hours"
  };

  const card3 = {
    label: "Employees",
    value: employees.length.toString(),
    sub: "Registered employees"
  };

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
        <FtStat label={card1.label} value={card1.value} sub={card1.sub} />
        <FtStat label={card2.label} value={card2.value} sub={card2.sub} />
        <FtStat label={card3.label} value={card3.value} sub={card3.sub} />
      </div>

      <FtCard
        title="Recent distributions"
        actions={<FtButton variant="ghost" size="sm" icon="arrow-right" onClick={() => window.location.href = '/distributions'}>View all</FtButton>}
        flush
      >
        {distributions.length > 0 ? (
          <table className="tbl">
            <thead><tr>
              <th>Period</th>
              <th>Employees</th>
              <th className="r">Total tips</th>
              <th className="r">€ / hour</th>
              <th>Status</th>
            </tr></thead>
            <tbody>
              {distributions.slice(0,3).map(r => (
                <tr key={r.id} onClick={() => onOpenDistribution && onOpenDistribution(r.id)}>
                  <td><div className="name">{formatDateRange(r.start_date, r.end_date)}</div><div className="sub">#{r.id.toString().padStart(4,'0')}</div></td>
                  <td>{employees.length}</td>
                  <td className="r"><strong>{formatCurrency(r.total_tip_amount)}</strong></td>
                  <td className="r">{formatCurrency(r.tip_per_hour)}</td>
                  <td><FtBadge tone="success" dot="#2F7D5B">Distributed</FtBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No distributions created yet. Create your first distribution to see history.</div>
        )}
      </FtCard>
    </div>
  );
};
window.FtDashboard = FtDashboard;

export { FtDashboard };
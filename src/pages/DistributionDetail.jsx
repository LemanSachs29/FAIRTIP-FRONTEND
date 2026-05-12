import React from 'react';


// Fairtip — Distribution detail (the breakdown view)
const FtDistributionDetail = ({ distributionId = 12, onBack }) => {
  const entries = [
    { id: 1, name: 'Maria Lopez',      avg: '8.50', off: 4, abs: 1, days: 25, hours: '212.50', exact: '1050.6250', rounded: '€1,050.62' },
    { id: 2, name: 'Andrés Vega',      avg: '7.50', off: 4, abs: 0, days: 26, hours: '195.00', exact: '964.6125',  rounded: '€964.61' },
    { id: 3, name: 'Sofía Ruiz',       avg: '8.00', off: 8, abs: 2, days: 20, hours: '160.00', exact: '791.4080',  rounded: '€791.41' },
    { id: 4, name: 'Pedro Martín',     avg: '8.00', off: 4, abs: 0, days: 26, hours: '208.00', exact: '1028.8304', rounded: '€1,028.83' },
    { id: 5, name: 'Lucía Herrera',    avg: '6.00', off: 4, abs: 1, days: 25, hours: '150.00', exact: '741.9450',  rounded: '€741.95' },
    { id: 6, name: 'Diego Fernández',  avg: '8.50', off: 4, abs: 0, days: 26, hours: '221.00', exact: '1093.0407', rounded: '€1,093.04' },
    { id: 7, name: 'Elena Castro',     avg: '7.00', off: 8, abs: 0, days: 22, hours: '154.00', exact: '761.7402',  rounded: '€761.74' },
    { id: 8, name: 'Tomás Reyes',      avg: '8.00', off: 4, abs: 0, days: 26, hours: '208.00', exact: '1028.8304', rounded: '€1,028.83' },
  ];

  return (
    <div>
      <div className="page-h">
        <div className="titles" style={{display:'flex', alignItems:'center', gap: 12}}>
          <button className="btn btn-icon btn-ghost" onClick={onBack} aria-label="Back">
            <Icon name="arrow-left" className="ic" />
          </button>
          <div>
            <h1>Distribution #{distributionId.toString().padStart(4,'0')}</h1>
            <div className="sub">Jun 1 – Jun 30, 2026 · created Jun 30, 2026</div>
          </div>
        </div>
        <div className="actions">
          <FtButton variant="secondary" icon="download">Export PDF</FtButton>
          <FtButton variant="secondary" icon="download">Export CSV</FtButton>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom: 20}}>
        <FtStat label="Total tips"      value="€2,500.00" sub="As entered" />
        <FtStat label="Tip per hour"    value="€11.7647"  sub="Across 1,508.50 computed h" />
        <FtStat label="Remainder"       value="€0.01"     sub="Rounding leftover" />
      </div>

      <FtCard
        title="Per-employee breakdown"
        actions={<span className="caption">{entries.length} employees</span>}
        flush
      >
        <table className="tbl">
          <thead><tr>
            <th>Employee</th>
            <th className="r">Worked days</th>
            <th className="r">Days off</th>
            <th className="r">Absences</th>
            <th className="r">Computed h</th>
            <th className="r">Exact</th>
            <th className="r">Rounded</th>
          </tr></thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id}>
                <td><div className="name">{e.name}</div><div className="sub">{e.avg}h/day snapshot</div></td>
                <td className="r">{e.days}</td>
                <td className="r"><span className="muted">{e.off}</span></td>
                <td className="r">{e.abs > 0 ? <FtBadge tone="warning">{e.abs}</FtBadge> : <span className="muted">0</span>}</td>
                <td className="r">{e.hours}</td>
                <td className="r"><span className="muted">€{e.exact}</span></td>
                <td className="r"><strong>{e.rounded}</strong></td>
              </tr>
            ))}
            <tr style={{background:'var(--surface-sunken)'}}>
              <td className="strong">Total</td>
              <td className="r mono strong">196</td>
              <td className="r mono muted">40</td>
              <td className="r mono">4</td>
              <td className="r mono strong">1,508.50</td>
              <td className="r mono muted">€2,500.0000</td>
              <td className="r mono strong">€2,499.99</td>
            </tr>
          </tbody>
        </table>
      </FtCard>

      <div style={{marginTop: 16, padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 8, display:'flex', alignItems:'flex-start', gap: 10}}>
        <Icon name="info" style={{width: 16, height: 16, color: 'var(--info)', flex:'0 0 16px', marginTop: 2, display:'inline-flex'}} />
        <div className="body-sm" style={{color:'var(--fg-muted)'}}>
          Exact values are stored at 4-decimal precision; rounded values are paid out. The remainder is the rounding leftover for the period.
        </div>
      </div>
    </div>
  );
};
window.FtDistributionDetail = FtDistributionDetail;

export { FtDistributionDetail };
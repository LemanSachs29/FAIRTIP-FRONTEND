import React from 'react';

import { getDistribution } from '../services/distributions.js';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateRange = (startStr, endStr) => {
  if (!startStr || !endStr) return '—';

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Invalid date range';
  }

  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const endFormatted = end.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `${startFormatted} – ${endFormatted}`;
};

const FtDistributionDetail = ({ distributionId, onBack }) => {
  const [distribution, setDistribution] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');

  const loadDistribution = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const data = await getDistribution(distributionId);
      setDistribution(data);
    } catch (err) {
      setLoadError(err?.message || 'Unable to load distribution.');
    } finally {
      setIsLoading(false);
    }
  }, [distributionId]);

  React.useEffect(() => {
    loadDistribution();
  }, [loadDistribution]);

  if (isLoading) {
    return (
      <div>
        <div className="page-h">
          <div className="titles" style={{display:'flex', alignItems:'center', gap: 12}}>
            <button className="btn btn-icon btn-ghost" onClick={onBack} aria-label="Back">
              <Icon name="arrow-left" className="ic" />
            </button>
            <div>
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
        <FtCard><FtEmpty icon="loader" title="Loading distribution..." body="Fetching the latest data." /></FtCard>
      </div>
    );
  }

  if (loadError || !distribution) {
    return (
      <div>
        <div className="page-h">
          <div className="titles" style={{display:'flex', alignItems:'center', gap: 12}}>
            <button className="btn btn-icon btn-ghost" onClick={onBack} aria-label="Back">
              <Icon name="arrow-left" className="ic" />
            </button>
            <div>
              <h1>Error</h1>
            </div>
          </div>
        </div>
        <FtCard>
          <FtEmpty
            icon="circle-alert"
            title="Could not load distribution."
            body={loadError}
            action={<FtButton variant="secondary" onClick={loadDistribution}>Try again</FtButton>}
          />
        </FtCard>
      </div>
    );
  }

  const { entries = [] } = distribution;
  const createdDate = distribution.created_at ? formatDate(distribution.created_at) : 'Unknown';

  // Calculate totals from entries
  const totalWorkedDays = entries.reduce((sum, e) => sum + (e.worked_days || 0), 0);
  const totalDaysOff = entries.reduce((sum, e) => sum + (e.day_off_count || 0), 0);
  const totalAbsences = entries.reduce((sum, e) => sum + (e.absence_count || 0), 0);

  return (
    <div>
      <div className="page-h">
        <div className="titles" style={{display:'flex', alignItems:'center', gap: 12}}>
          <button className="btn btn-icon btn-ghost" onClick={onBack} aria-label="Back">
            <Icon name="arrow-left" className="ic" />
          </button>
          <div>
            <h1>Distribution #{distribution.id.toString().padStart(4,'0')}</h1>
            <div className="sub">{formatDateRange(distribution.start_date, distribution.end_date)} · created {createdDate}</div>
          </div>
        </div>
        <div className="actions">
          <FtButton variant="secondary" icon="download">Export PDF</FtButton>
          <FtButton variant="secondary" icon="download">Export CSV</FtButton>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom: 20}}>
        <FtStat label="Total tips"      value={`€${distribution.total_rounded_amount}`} sub="As distributed" />
        <FtStat label="Tip per hour"    value={`€${distribution.tip_per_hour}`}  sub={`Across ${distribution.total_computed_hours} computed h`} />
        <FtStat label="Remainder"       value={`€${distribution.remainder_amount}`}     sub="Rounding leftover" />
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
                <td>
                  <div className="name">{e.name} {e.surname}</div>
                  <div className="sub">{e.average_daily_hours_snapshot}h/day snapshot</div>
                </td>
                <td className="r">{e.worked_days}</td>
                <td className="r"><span className="muted">{e.day_off_count}</span></td>
                <td className="r">{e.absence_count > 0 ? <FtBadge tone="warning">{e.absence_count}</FtBadge> : <span className="muted">0</span>}</td>
                <td className="r">{e.computed_hours}</td>
                <td className="r"><span className="muted">€{e.exact_amount}</span></td>
                <td className="r"><strong>€{e.rounded_amount}</strong></td>
              </tr>
            ))}
            <tr style={{background:'var(--surface-sunken)'}}>
              <td className="strong">Total</td>
              <td className="r mono strong">{totalWorkedDays}</td>
              <td className="r mono muted">{totalDaysOff}</td>
              <td className="r mono">{totalAbsences}</td>
              <td className="r mono strong">{distribution.total_computed_hours}</td>
              <td className="r mono muted">€{distribution.total_exact_amount}</td>
              <td className="r mono strong">€{distribution.total_rounded_amount}</td>
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
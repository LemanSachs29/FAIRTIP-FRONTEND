import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/employees.js';
import { getDistributions } from '../services/distributions.js';
import { getUpcomingUkHoliday } from '../services/holidays.js';

// Fairtip — Dashboard screen
const FtDashboard = ({ onNewDistribution, onOpenDistribution }) => {
  const [distributions, setDistributions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingHoliday, setUpcomingHoliday] = useState(null);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const [holidayError, setHolidayError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [distributionsData, employeesData] = await Promise.all([
          getDistributions(),
          getEmployees()
        ]);
        setDistributions(distributionsData);
        setEmployees(employeesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUpcomingHoliday = async () => {
      try {
        setHolidayLoading(true);
        setHolidayError(null);
        const holiday = await getUpcomingUkHoliday();
        setUpcomingHoliday(holiday);
      } catch (err) {
        setHolidayError(err.message || 'Failed to load public holiday');
      } finally {
        setHolidayLoading(false);
      }
    };

    fetchUpcomingHoliday();
  }, []);

  const formatCurrency = (value) => `€${value}`;

  const formatHolidayDate = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} – ${endStr}`;
  };

  const getLatestDistribution = (distributions) => distributions[0];

  const latestDistribution = getLatestDistribution(distributions);

  const card1 = loading ? {
    label: "Latest distribution",
    value: "Loading...",
    sub: ""
  } : error ? {
    label: "Latest distribution",
    value: "Error loading data",
    sub: ""
  } : latestDistribution ? {
    label: "Latest distribution",
    value: formatCurrency(latestDistribution.total_tip_amount),
    sub: formatDateRange(latestDistribution.start_date, latestDistribution.end_date)
  } : {
    label: "Latest distribution",
    value: "No distributions yet",
    sub: "Create your first distribution to see results"
  };

  const card2 = loading ? {
    label: "Tip per hour",
    value: "Loading...",
    sub: ""
  } : error ? {
    label: "Tip per hour",
    value: "Error loading data",
    sub: ""
  } : latestDistribution ? {
    label: "Tip per hour",
    value: formatCurrency(latestDistribution.tip_per_hour),
    sub: `Across ${latestDistribution.total_computed_hours} computed hours`
  } : {
    label: "Tip per hour",
    value: "—",
    sub: "Across 0.00 computed hours"
  };

  const card3 = loading ? {
    label: "Employees",
    value: "Loading...",
    sub: ""
  } : error ? {
    label: "Employees",
    value: "Error loading data",
    sub: ""
  } : {
    label: "Employees",
    value: employees.length.toString(),
    sub: "Registered employees"
  };

  const holidayCard = holidayLoading ? {
    label: "Upcoming UK public holiday",
    value: "Loading...",
    sub: ""
  } : holidayError ? {
    label: "Upcoming UK public holiday",
    value: "Unable to load",
    sub: holidayError
  } : upcomingHoliday ? {
    label: "Upcoming UK public holiday",
    value: upcomingHoliday.name,
    sub: formatHolidayDate(upcomingHoliday.date)
  } : {
    label: "Upcoming UK public holiday",
    value: "No upcoming holidays",
    sub: "No more 2026 UK public holidays"
  };

  return (
    <div>
      <div className="page-h">
        <div className="titles">
          <h1>Dashboard</h1>
          <div className="sub">Overview of tips, hours, and recent distributions.</div>
        </div>
        <div className="actions">
          <FtButton variant="primary" icon="plus" onClick={onNewDistribution}>New distribution</FtButton>
        </div>
      </div>

      <div className="grid-3 dashboard-stats" style={{marginBottom: 20}}>
        <FtStat label={card1.label} value={card1.value} sub={card1.sub} />
        <FtStat label={card2.label} value={card2.value} sub={card2.sub} />
        <FtStat label={card3.label} value={card3.value} sub={card3.sub} />
        <FtStat label={holidayCard.label} value={holidayCard.value} sub={holidayCard.sub} />
      </div>

      <FtCard
        title="Recent distributions"
        actions={<FtButton variant="ghost" size="sm" icon="arrow-right" onClick={() => window.location.href = '/distributions'}>View all</FtButton>}
        flush
      >
        {loading ? (
          <div>Loading distributions...</div>
        ) : error ? (
          <div>Failed to load distributions: {error}</div>
        ) : distributions.length > 0 ? (
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

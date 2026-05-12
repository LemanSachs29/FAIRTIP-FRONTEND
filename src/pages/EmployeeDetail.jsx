import React from 'react';
import { useParams } from 'react-router-dom';

import { getEmployee, updateEmployee } from '../services/employees.js';
import {
  addEmployeeDayOff,
  deleteEmployeeDayOff,
  getEmployeeDayOffs,
} from '../services/dayOffs.js';
import {
  addEmployeeAbsence,
  deleteEmployeeAbsence,
  getEmployeeAbsences,
} from '../services/absences.js';

// Fairtip - Employee detail screen (day-offs + absences management)
const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

const FtEmployeeDetail = ({ employeeId, onBack }) => {
  const params = useParams();
  const activeEmployeeId = employeeId || params.id;
  const [profile, setProfile] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [daysOff, setDaysOff] = React.useState([]);
  const [absences, setAbsences] = React.useState([]);
  const [absDate, setAbsDate] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');
  const [dayOffError, setDayOffError] = React.useState('');
  const [absenceError, setAbsenceError] = React.useState('');
  const [mutatingDay, setMutatingDay] = React.useState('');
  const [isAddingAbsence, setIsAddingAbsence] = React.useState(false);
  const [deletingAbsenceId, setDeletingAbsenceId] = React.useState(null);

  const loadDetail = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const [employee, dayOffData, absenceData] = await Promise.all([
        getEmployee(activeEmployeeId),
        getEmployeeDayOffs(activeEmployeeId),
        getEmployeeAbsences(activeEmployeeId),
      ]);
      setProfile(employee);
      setDaysOff(normalizeList(dayOffData, 'day_offs'));
      setAbsences(normalizeList(absenceData, 'absences'));
    } catch (err) {
      setLoadError(err?.message || 'Unable to load employee details.');
    } finally {
      setIsLoading(false);
    }
  }, [activeEmployeeId]);

  const refreshDayOffs = React.useCallback(async () => {
    const data = await getEmployeeDayOffs(activeEmployeeId);
    setDaysOff(normalizeList(data, 'day_offs'));
  }, [activeEmployeeId]);

  const refreshAbsences = React.useCallback(async () => {
    const data = await getEmployeeAbsences(activeEmployeeId);
    setAbsences(normalizeList(data, 'absences'));
  }, [activeEmployeeId]);

  React.useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const toggleDay = async (weekday) => {
    const existing = daysOff.find(d => d.weekday === weekday);

    setDayOffError('');
    setMutatingDay(weekday);

    try {
      if (existing) {
        await deleteEmployeeDayOff(activeEmployeeId, existing.id);
      } else {
        await addEmployeeDayOff(activeEmployeeId, weekday);
      }
      await refreshDayOffs();
    } catch (err) {
      setDayOffError(err?.message || 'Unable to update regular days off.');
    } finally {
      setMutatingDay('');
    }
  };

  const addAbs = async () => {
    if (!absDate) return;

    setAbsenceError('');
    setIsAddingAbsence(true);

    try {
      await addEmployeeAbsence(activeEmployeeId, absDate);
      await refreshAbsences();
      setAbsDate('');
    } catch (err) {
      setAbsenceError(err?.message || 'Unable to add absence.');
    } finally {
      setIsAddingAbsence(false);
    }
  };

  const delAbs = async (absenceId) => {
    setAbsenceError('');
    setDeletingAbsenceId(absenceId);

    try {
      await deleteEmployeeAbsence(activeEmployeeId, absenceId);
      await refreshAbsences();
    } catch (err) {
      setAbsenceError(err?.message || 'Unable to remove absence.');
    } finally {
      setDeletingAbsenceId(null);
    }
  };

  if (isLoading) {
    return (
      <FtCard>
        <FtEmpty icon="loader" title="Loading employee..." body="Fetching profile, regular days off, and absences." />
      </FtCard>
    );
  }

  if (loadError || !profile) {
    return (
      <FtCard>
        <FtEmpty
          icon="circle-alert"
          title="Could not load employee."
          body={loadError || 'Employee details were not returned by the API.'}
          action={<FtButton variant="secondary" onClick={loadDetail}>Try again</FtButton>}
        />
      </FtCard>
    );
  }

  const averageDailyHours = profile.average_daily_hours;

  return (
    <div>
      <div className="page-h">
        <div className="titles" style={{display:'flex', alignItems:'center', gap: 12}}>
          <button className="btn btn-icon btn-ghost" onClick={onBack} aria-label="Back">
            <Icon name="arrow-left" className="ic" />
          </button>
          <div>
            <h1>{profile.name} {profile.surname}</h1>
            <div className="sub">{averageDailyHours}h average per day - employee #{activeEmployeeId.toString().padStart(4,'0')}</div>
          </div>
        </div>
        <div className="actions">
          <FtButton variant="secondary" icon="pencil" onClick={() => setEditing(true)}>Edit</FtButton>
          <FtButton variant="danger" icon="trash-2">Delete</FtButton>
        </div>
      </div>

      {editing && (
        <FtEditEmployee
          initial={profile}
          employeeId={activeEmployeeId}
          onCancel={() => setEditing(false)}
          onSave={async (next) => {
            const updated = await updateEmployee(activeEmployeeId, next);
            setProfile(updated || {
              ...profile,
              name: next.name,
              surname: next.surname,
              average_daily_hours: next.average_daily_hours,
            });
            setEditing(false);
          }}
        />
      )}

      <div className="grid-2">
        <FtCard title="Regular days off" actions={<span className="caption">Recurring weekly</span>}>
          {dayOffError && <div className="auth-error" role="alert" style={{marginBottom: 12}}>{dayOffError}</div>}
          <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 6}}>
            {WEEKDAYS.map(d => {
              const on = daysOff.some(x => x.weekday === d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  disabled={Boolean(mutatingDay)}
                  className="btn"
                  style={{
                    height: 56, flexDirection: 'column', gap: 2, padding: 0,
                    background: on ? 'var(--accent-soft)' : 'var(--surface)',
                    borderColor: on ? 'var(--accent)' : 'var(--border-strong)',
                    color: on ? 'var(--accent-press)' : 'var(--fg-muted)',
                    fontWeight: on ? 500 : 400,
                  }}
                >
                  <span style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em'}}>{d.slice(0,3)}</span>
                  {on && <Icon name="check" style={{width:14, height:14, display:'inline-flex'}} />}
                </button>
              );
            })}
          </div>
          <p className="caption" style={{marginTop: 12}}>Days off are excluded from worked-day counts in every distribution.</p>
        </FtCard>

        <FtCard title="Absences" actions={
          <div style={{display:'flex', gap:6}}>
            <input className="inp" type="date" value={absDate} onChange={e => setAbsDate(e.target.value)} style={{height: 32, fontSize: 13}}/>
            <FtButton size="sm" variant="primary" icon="plus" onClick={addAbs} disabled={isAddingAbsence}>{isAddingAbsence ? 'Adding...' : 'Add'}</FtButton>
          </div>
        } flush>
          {absenceError && <div className="auth-error" role="alert" style={{margin: 12}}>{absenceError}</div>}
          {absences.length === 0
            ? <FtEmpty icon="calendar-check" title="No absences." body="Use the date picker above to register one." />
            : (
              <table className="tbl">
                <thead><tr><th>Date</th><th>Weekday</th><th className="r" style={{width: 96}}>Action</th></tr></thead>
                <tbody>
                  {absences.map(a => {
                    const d = new Date(a.date + 'T00:00:00');
                    const wd = d.toLocaleDateString('en', { weekday: 'long' });
                    return (
                      <tr key={a.id}>
                        <td><span className="mono">{a.date}</span></td>
                        <td><span className="muted">{wd}</span></td>
                        <td className="r">
                          <FtButton
                            size="sm"
                            variant="danger"
                            icon="trash-2"
                            onClick={() => delAbs(a.id)}
                            disabled={deletingAbsenceId === a.id}
                          >
                            {deletingAbsenceId === a.id ? 'Deleting...' : 'Delete'}
                          </FtButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </FtCard>
      </div>

      <div style={{marginTop: 20}}>
        <FtCard title="Distribution history" flush>
          <table className="tbl">
            <thead><tr>
              <th>Period</th>
              <th className="r">Worked days</th>
              <th className="r">Computed h</th>
              <th className="r">Share</th>
            </tr></thead>
            <tbody>
              <tr><td>May 1 - May 31, 2026</td><td className="r">24</td><td className="r">204.00</td><td className="r"><strong>EUR 988.40</strong></td></tr>
              <tr><td>Apr 1 - Apr 30, 2026</td><td className="r">22</td><td className="r">187.00</td><td className="r"><strong>EUR 878.42</strong></td></tr>
              <tr><td>Mar 1 - Mar 31, 2026</td><td className="r">25</td><td className="r">212.50</td><td className="r"><strong>EUR 1,050.62</strong></td></tr>
            </tbody>
          </table>
        </FtCard>
      </div>
    </div>
  );
};
window.FtEmployeeDetail = FtEmployeeDetail;

const FtEditEmployee = ({ initial, employeeId, onSave, onCancel }) => {
  const [name, setName] = React.useState(initial.name);
  const [surname, setSurname] = React.useState(initial.surname);
  const [avg, setAvg] = React.useState(initial.average_daily_hours);
  const [error, setError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const trimmedName = name.trim();
  const trimmedSurname = surname.trim();
  const avgNum = parseFloat(avg);
  const avgValid = !isNaN(avgNum) && avgNum > 0 && avgNum <= 24;
  const canSave = trimmedName && trimmedSurname && avgValid;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setError('');
    setIsSaving(true);

    try {
      await onSave({ name: trimmedName, surname: trimmedSurname, average_daily_hours: avgNum.toFixed(2) });
    } catch (err) {
      setError(err?.message || 'Unable to save employee changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FtModal
      title={`Edit employee - #${employeeId.toString().padStart(4,'0')}`}
      onClose={onCancel}
      footer={
        <>
          <FtButton variant="secondary" onClick={onCancel} disabled={isSaving}>Cancel</FtButton>
          <FtButton variant="primary" onClick={submit} disabled={!canSave || isSaving}>{isSaving ? 'Saving...' : 'Save changes'}</FtButton>
        </>
      }
    >
      <form onSubmit={submit} style={{display:'grid', gap: 14}}>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <div className="grid-2">
          <div className="field">
            <label className="l">First name</label>
            <input className="inp" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label className="l">Surname</label>
            <input className="inp" value={surname} onChange={e => setSurname(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="l">Average daily hours</label>
          <div className="inp-h">
            <input className="inp" type="number" step="0.25" min="0" max="24"
              value={avg} onChange={e => setAvg(e.target.value)} />
            <span className="prefix" style={{borderLeft:0, borderRight:'1px solid var(--border-strong)', borderRadius:'0 var(--radius-xs) var(--radius-xs) 0'}}>h / day</span>
          </div>
          <div className="auth-hint">Used to compute this employee's share in new distributions.</div>
        </div>
        <div style={{
          display:'flex', gap:10, padding:'10px 12px',
          background:'var(--info-soft)', border:'1px solid var(--border)',
          borderRadius:'var(--radius-md)',
        }}>
          <Icon name="info" style={{width:16, height:16, color:'var(--info)', flex:'0 0 16px', marginTop:2, display:'inline-flex'}} />
          <div className="caption" style={{color:'var(--fg)'}}>
            <strong className="strong">Changes apply going forward only.</strong> Past distributions stay untouched -
            historical shares were computed with the prior values and will not recompute.
          </div>
        </div>
        <button type="submit" style={{display:'none'}} aria-hidden="true"></button>
      </form>
    </FtModal>
  );
};
window.FtEditEmployee = FtEditEmployee;

export { FtEmployeeDetail, FtEditEmployee };

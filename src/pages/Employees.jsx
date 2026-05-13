import React from 'react';

import { createEmployee, getEmployees } from '../services/employees.js';

// Fairtip - Employees list + create modal
const FtEmployees = ({ onOpenEmployee }) => {
  const [list, setList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', surname: '', avg: '8.00' });
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');
  const [createError, setCreateError] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const loadEmployees = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const data = await getEmployees();
      setList(Array.isArray(data) ? data : data?.employees || []);
    } catch (err) {
      setLoadError(err?.message || 'Unable to load employees.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const closeModal = () => {
    setOpen(false);
    setCreateError('');
  };

  const submit = async () => {
    if (!form.name.trim() || !form.surname.trim()) return;

    setCreateError('');
    setIsCreating(true);

    try {
      await createEmployee({
        name: form.name.trim(),
        surname: form.surname.trim(),
        average_daily_hours: form.avg,
      });
      await loadEmployees();
      setForm({ name: '', surname: '', avg: '8.00' });
      setOpen(false);
    } catch (err) {
      setCreateError(err?.message || 'Unable to create employee.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="page-h">
        <div className="titles">
          <h1>Employees</h1>
          <div className="sub">Staff included in tip distributions.</div>
        </div>
        <div className="actions">
          <FtButton variant="primary" icon="user-plus" onClick={() => setOpen(true)}>Add employee</FtButton>
        </div>
      </div>

      <FtCard flush={!isLoading && !loadError && list.length > 0}>
        {isLoading ? (
          <FtEmpty icon="loader" title="Loading employees..." body="Fetching the latest staff list." />
        ) : loadError ? (
          <FtEmpty
            icon="circle-alert"
            title="Could not load employees."
            body={loadError}
            action={<FtButton variant="secondary" onClick={loadEmployees}>Try again</FtButton>}
          />
        ) : list.length === 0 ? (
          <FtEmpty icon="users" title="No employees yet." body="Add your first employee to start building distributions." />
        ) : (
          <table className="tbl">
            <thead><tr>
              <th>Employee</th>
              <th className="r">Avg. daily hours</th>
              <th>Regular days off</th>
              <th className="r">Absences (30d)</th>
              <th style={{width: 40}}></th>
            </tr></thead>
            <tbody>
              {list.map(e => {
                const daysOff = (e.day_offs && Array.isArray(e.day_offs) && e.day_offs.length > 0)
                  ? e.day_offs.join(', ')
                  : '-';
                const absenceCount = e.absence_count_30d ?? 0;

                return (
                  <tr key={e.id} onClick={() => onOpenEmployee && onOpenEmployee(e.id)}>
                    <td>
                      <div className="name">{e.name} {e.surname}</div>
                      <div className="sub">#{e.id.toString().padStart(4,'0')}</div>
                    </td>
                    <td className="r">{e.average_daily_hours}h</td>
                    <td><span className={daysOff === '-' ? 'muted' : ''}>{daysOff}</span></td>
                    <td className="r"><span className={absenceCount === 0 ? 'muted' : ''}>{absenceCount}</span></td>
                    <td onClick={(ev) => ev.stopPropagation()}>
                      <FtIconButton icon="more-horizontal" label="Row actions" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </FtCard>

      {open && (
        <FtModal
          title="Add employee"
          onClose={closeModal}
          footer={<>
            <FtButton variant="secondary" onClick={closeModal} disabled={isCreating}>Cancel</FtButton>
            <FtButton variant="primary" onClick={submit} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create employee'}</FtButton>
          </>}
        >
          {createError && <div className="auth-error" role="alert" style={{marginBottom: 16}}>{createError}</div>}
          <div className="grid-2">
            <div className="field">
              <label className="l">Name</label>
              <input className="inp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="First name" />
            </div>
            <div className="field">
              <label className="l">Surname</label>
              <input className="inp" value={form.surname} onChange={e => setForm({...form, surname: e.target.value})} placeholder="Last name" />
            </div>
          </div>
          <div className="field">
            <label className="l">Average daily hours</label>
            <div className="inp-h"><span className="prefix">h</span>
              <input className="inp" value={form.avg} onChange={e => setForm({...form, avg: e.target.value})} />
            </div>
            <span className="caption" style={{color:'var(--fg-subtle)'}}>Used as the snapshot in future distributions.</span>
          </div>
        </FtModal>
      )}
    </div>
  );
};
window.FtEmployees = FtEmployees;

export { FtEmployees };

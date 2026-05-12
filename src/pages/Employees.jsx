import React from 'react';

// Fairtip — Employees list + create modal
const SEED_EMPLOYEES = [
  { id: 1, name: 'Maria',  surname: 'Lopez',    avg: '8.50', daysOff: ['Monday'],          absences: 1 },
  { id: 2, name: 'Andrés', surname: 'Vega',     avg: '7.50', daysOff: ['Sunday'],          absences: 0 },
  { id: 3, name: 'Sofía',  surname: 'Ruiz',     avg: '8.00', daysOff: ['Sunday','Monday'], absences: 2 },
  { id: 4, name: 'Pedro',  surname: 'Martín',   avg: '8.00', daysOff: ['Tuesday'],         absences: 0 },
  { id: 5, name: 'Lucía',  surname: 'Herrera',  avg: '6.00', daysOff: ['Wednesday'],       absences: 1 },
  { id: 6, name: 'Diego',  surname: 'Fernández',avg: '8.50', daysOff: ['Thursday'],        absences: 0 },
  { id: 7, name: 'Elena',  surname: 'Castro',   avg: '7.00', daysOff: ['Monday','Tuesday'],absences: 0 },
  { id: 8, name: 'Tomás',  surname: 'Reyes',    avg: '8.00', daysOff: ['Sunday'],          absences: 0 },
];

const FtEmployees = ({ onOpenEmployee }) => {
  const [list, setList] = React.useState(SEED_EMPLOYEES);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', surname: '', avg: '8.00' });

  const submit = () => {
    if (!form.name.trim() || !form.surname.trim()) return;
    setList([...list, { id: Date.now(), name: form.name, surname: form.surname, avg: form.avg, daysOff: [], absences: 0 }]);
    setForm({ name: '', surname: '', avg: '8.00' });
    setOpen(false);
  };

  return (
    <div>
      <div className="page-h">
        <div className="titles">
          <h1>Employees</h1>
          <div className="sub">Staff included in tip distributions.</div>
        </div>
        <div className="actions">
          <FtButton variant="secondary" icon="download">Export CSV</FtButton>
          <FtButton variant="primary" icon="user-plus" onClick={() => setOpen(true)}>Add employee</FtButton>
        </div>
      </div>

      <FtCard flush>
        <table className="tbl">
          <thead><tr>
            <th>Employee</th>
            <th className="r">Avg. daily hours</th>
            <th>Regular days off</th>
            <th className="r">Absences (30d)</th>
            <th style={{width: 40}}></th>
          </tr></thead>
          <tbody>
            {list.map(e => (
              <tr key={e.id} onClick={() => onOpenEmployee && onOpenEmployee(e.id)}>
                <td>
                  <div className="name">{e.name} {e.surname}</div>
                  <div className="sub">#{e.id.toString().padStart(4,'0')}</div>
                </td>
                <td className="r">{e.avg}h</td>
                <td>
                  {e.daysOff.length === 0
                    ? <span className="muted">—</span>
                    : <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                        {e.daysOff.map(d => <FtBadge key={d} tone="neutral">{d.slice(0,3)}</FtBadge>)}
                      </div>}
                </td>
                <td className="r">
                  {e.absences === 0
                    ? <span className="muted">0</span>
                    : <FtBadge tone="warning">{e.absences}</FtBadge>}
                </td>
                <td onClick={(ev) => ev.stopPropagation()}>
                  <FtIconButton icon="more-horizontal" label="Row actions" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FtCard>

      {open && (
        <FtModal
          title="Add employee"
          onClose={() => setOpen(false)}
          footer={<>
            <FtButton variant="secondary" onClick={() => setOpen(false)}>Cancel</FtButton>
            <FtButton variant="primary" onClick={submit}>Create employee</FtButton>
          </>}
        >
          <div className="grid-2">
            <div className="field">
              <label className="l">Name</label>
              <input className="inp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Maria" />
            </div>
            <div className="field">
              <label className="l">Surname</label>
              <input className="inp" value={form.surname} onChange={e => setForm({...form, surname: e.target.value})} placeholder="Lopez" />
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
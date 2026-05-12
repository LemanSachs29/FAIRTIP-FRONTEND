import React from 'react';

// Fairtip — Employee detail screen (day-offs + absences management)
const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const FtEmployeeDetail = ({ employeeId = 1, onBack }) => {
  const [profile, setProfile] = React.useState({ name: 'Maria', surname: 'Lopez', avg: '8.50' });
  const [editing, setEditing] = React.useState(false);
  const [daysOff, setDaysOff] = React.useState(['Monday']);
  const [absences, setAbsences] = React.useState([
    { id: 1, date: '2026-06-15' },
  ]);
  const [absDate, setAbsDate] = React.useState('');

  const toggleDay = (d) => {
    setDaysOff(daysOff.includes(d) ? daysOff.filter(x => x !== d) : [...daysOff, d]);
  };
  const addAbs = () => {
    if (!absDate) return;
    setAbsences([{ id: Date.now(), date: absDate }, ...absences]);
    setAbsDate('');
  };
  const delAbs = (id) => setAbsences(absences.filter(a => a.id !== id));

  return (
    <div>
      <div className="page-h">
        <div className="titles" style={{display:'flex', alignItems:'center', gap: 12}}>
          <button className="btn btn-icon btn-ghost" onClick={onBack} aria-label="Back">
            <Icon name="arrow-left" className="ic" />
          </button>
          <div>
            <h1>{profile.name} {profile.surname}</h1>
            <div className="sub">{profile.avg}h average per day · employee #{employeeId.toString().padStart(4,'0')}</div>
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
          employeeId={employeeId}
          onCancel={() => setEditing(false)}
          onSave={(next) => { setProfile(next); setEditing(false); }}
        />
      )}

      <div className="grid-2">
        <FtCard title="Regular days off" actions={<span className="caption">Recurring weekly</span>}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 6}}>
            {WEEKDAYS.map(d => {
              const on = daysOff.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
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
            <FtButton size="sm" variant="primary" icon="plus" onClick={addAbs}>Add</FtButton>
          </div>
        } flush>
          {absences.length === 0
            ? <FtEmpty icon="calendar-check" title="No absences." body="Use the date picker above to register one." />
            : (
              <table className="tbl">
                <thead><tr><th>Date</th><th>Weekday</th><th style={{width: 40}}></th></tr></thead>
                <tbody>
                  {absences.map(a => {
                    const d = new Date(a.date + 'T00:00:00');
                    const wd = d.toLocaleDateString('en', { weekday: 'long' });
                    return (
                      <tr key={a.id}>
                        <td><span className="mono">{a.date}</span></td>
                        <td><span className="muted">{wd}</span></td>
                        <td><FtIconButton icon="x" label="Remove" onClick={() => delAbs(a.id)} /></td>
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
              <tr><td>May 1 – May 31, 2026</td><td className="r">24</td><td className="r">204.00</td><td className="r"><strong>€988.40</strong></td></tr>
              <tr><td>Apr 1 – Apr 30, 2026</td><td className="r">22</td><td className="r">187.00</td><td className="r"><strong>€878.42</strong></td></tr>
              <tr><td>Mar 1 – Mar 31, 2026</td><td className="r">25</td><td className="r">212.50</td><td className="r"><strong>€1,050.62</strong></td></tr>
            </tbody>
          </table>
        </FtCard>
      </div>
    </div>
  );
};
window.FtEmployeeDetail = FtEmployeeDetail;

// ── Edit employee modal ─────────────────────────────────────────────────────
// Updates basic info (first name, surname, average daily hours) ONLY going
// forward. Historical distribution records are immutable — the banner inside
// the modal makes that explicit so managers know prior shares won't recompute.
const FtEditEmployee = ({ initial, employeeId, onSave, onCancel }) => {
  const [name, setName] = React.useState(initial.name);
  const [surname, setSurname] = React.useState(initial.surname);
  const [avg, setAvg] = React.useState(initial.avg);

  const trimmedName = name.trim();
  const trimmedSurname = surname.trim();
  const avgNum = parseFloat(avg);
  const avgValid = !isNaN(avgNum) && avgNum > 0 && avgNum <= 24;
  const canSave = trimmedName && trimmedSurname && avgValid;

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ name: trimmedName, surname: trimmedSurname, avg: avgNum.toFixed(2) });
  };

  return (
    <FtModal
      title={`Edit employee · #${employeeId.toString().padStart(4,'0')}`}
      onClose={onCancel}
      footer={
        <>
          <FtButton variant="secondary" onClick={onCancel}>Cancel</FtButton>
          <FtButton variant="primary" onClick={submit} disabled={!canSave}>Save changes</FtButton>
        </>
      }
    >
      <form onSubmit={submit} style={{display:'grid', gap: 14}}>
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
            <strong className="strong">Changes apply going forward only.</strong> Past distributions stay untouched — historical
            shares were computed with the prior values and won't recompute.
          </div>
        </div>
        <button type="submit" style={{display:'none'}} aria-hidden="true"></button>
      </form>
    </FtModal>
  );
};
window.FtEditEmployee = FtEditEmployee;

export { FtEmployeeDetail, FtEditEmployee };
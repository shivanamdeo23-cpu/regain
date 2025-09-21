'use client';
import { useState, useEffect } from 'react';

const FIELDS = [
  { key: 'age', label: 'Age range', type: 'select', options: ['<30','30-45','46-60','>60'] },
  { key: 'activity', label: 'Movement level', type: 'select', options: ['Low','Moderate','High'] },
  { key: 'calcium', label: 'Dietary calcium', type: 'select', options: ['Low','Adequate'] },
  { key: 'vitd', label: 'Vitamin D exposure', type: 'select', options: ['Low','Adequate'] },
  { key: 'goal', label: 'Primary goal', type: 'text' },
];

export default function Profile() {
  const [data, setData] = useState<Record<string, string>>({});
  useEffect(() => {
    const raw = localStorage.getItem('bonehealth-profile');
    if (raw) setData(JSON.parse(raw));
  }, []);
  const save = () => {
    localStorage.setItem('bonehealth-profile', JSON.stringify(data));
    alert('Saved');
  };
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="h1">Your Profile</h1>
      <div className="card p-6 space-y-4">
        {FIELDS.map(f => (
          <div key={f.key} className="space-y-2">
            <label className="block text-sm text-white/80">{f.label}</label>
            {f.type === 'select' ? (
              <select
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-2"
                value={data[f.key] || ''}
                onChange={e => setData(prev => ({ ...prev, [f.key]: e.target.value }))}
              >
                <option value="" disabled>Select…</option>
                {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-2"
                value={data[f.key] || ''}
                onChange={e => setData(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={save} className="btn-primary">Save</button>
          <button onClick={() => { localStorage.removeItem('bonehealth-profile'); setData({}); }} className="btn-ghost">Reset</button>
        </div>
      </div>
    </div>
  );
}

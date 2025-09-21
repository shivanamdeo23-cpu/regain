'use client';
import { useEffect, useState } from 'react';
import { useXP, type User } from '../../store/xp';


function randomId() { return Math.random().toString(36).slice(2, 10); }


export default function Account() {
const { user, setUser } = useXP();
const [name, setName] = useState('');
const [premium, setPremium] = useState(false);


useEffect(() => {
const raw = localStorage.getItem('regain-user');
if (raw) {
const u = JSON.parse(raw) as User;
setUser(u);
setName(u?.name || '');
setPremium(Boolean(u?.premium));
}
}, [setUser]);


const save = () => {
const u: User = { id: user?.id || randomId(), name, premium };
localStorage.setItem('regain-user', JSON.stringify(u));
setUser(u);
alert('Saved');
};


return (
<div className="space-y-6 max-w-xl">
<h1 className="h1">Account</h1>
<div className="card p-6 space-y-4">
<div className="space-y-2">
<label className="block text-sm text-white/80">Display name</label>
<input className="w-full bg-white/5 border border-white/10 rounded-2xl p-2" value={name} onChange={e=>setName(e.target.value)} />
</div>
<label className="inline-flex items-center gap-2">
<input type="checkbox" checked={premium} onChange={e=>setPremium(e.target.checked)} />
<span>Premium (demo toggle)</span>
</label>
<button className="btn-primary" onClick={save}>Save</button>
</div>
</div>
);
}

import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="badge">Evidence-guided micro-habits</div>
          <h1 className="h1">Build stronger bones, one tiny win a day.</h1>
          <p className="muted">Personalised actions based on risk, lifestyle, and goals. Track progress, earn XP, and keep a steady streak.</p>
          <div className="flex gap-2">
            <Link href="/profile" className="btn-primary">Create Profile / Log In</Link>
            <Link href="/dashboard" className="btn-ghost">View Dashboard</Link>
          </div>
        </div>
        <div className="card p-6">
          <p className="mb-3">Weekly progress</p>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: '40%' }} />
          </div>
          <p className="muted mt-3">Demo data — connect your habits to see this move.</p>
        </div>
      </section>

      {/* About Me */}
      <section className="space-y-3">
        <h2 className="h2">About Me</h2>
        <p className="muted">Save a few basics so we can tailor your plan: age range, movement level, vitamin D exposure, dietary calcium, and goals.</p>
        <Link href="/profile" className="btn-ghost">Update Profile</Link>
      </section>

      {/* How It Works */}
      <section className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Assess', desc: 'Short intake to gauge fracture risk factors.' },
          { title: 'Act', desc: 'Daily micro-habits with clear “why”.' },
          { title: 'Adapt', desc: 'Your plan evolves with your progress.' },
        ].map((s) => (
          <div key={s.title} className="card p-5">
            <div className="h3">{s.title}</div>
            <p className="muted mt-1">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Evidence */}
      <section className="space-y-3">
        <h2 className="h2">Why these habits?</h2>
        <p className="muted">Everything in your feed is mapped to fall-prevention and bone health guidelines. Each action shows its rationale.</p>
      </section>
    </div>
  );
}

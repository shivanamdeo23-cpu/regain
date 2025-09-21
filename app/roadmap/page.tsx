export default function Roadmap() {
return (
<div className="space-y-8 max-w-3xl">
<h1 className="h1">Regain Roadmap</h1>


<section className="space-y-3">
<h2 className="h2">Near‑term</h2>
<ul className="list-disc pl-6 text-white/90">
<li>Toast notifications (replace alerts)</li>
<li>Weekly chart and task breakdowns</li>
<li>Real authentication (Clerk) + database (Supabase)</li>
<li>Personalised task packs based on profile</li>
<li>Accessibility polish (focus states, keyboard shortcuts)</li>
</ul>
</section>


<section className="space-y-3">
<h2 className="h2">Premium</h2>
<ul className="list-disc pl-6 text-white/90">
<li>Advanced insights & trends</li>
<li>Adaptive challenges and streak protection</li>
<li>Export to PDF for clinical reviews</li>
<li>Wearable integration (steps / sunlight proxy)</li>
</ul>
</section>


<section className="space-y-3">
<h2 className="h2">Later</h2>
<ul className="list-disc pl-6 text-white/90">
<li>Coach chat & Q&A with vetted sources</li>
<li>Physio flows and post‑op bundles</li>
<li>Family / caregiver view</li>
<li>Localization (EN, HI, BN …)</li>
</ul>
</section>
</div>
}

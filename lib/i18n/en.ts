export default {
  common: {
    today: "Today",
    roadmap: "Your Roadmap",
    roadmapTag: "Projections use your last 28 days of completion.",
    currentAdherence: "Current adherence",
    stayingAbove: "Staying above 70% steadily pushes your score upward.",
    in1: "In 1 month",
    in2: "In 2 months",
    in3: "In 3 months",
    focus: "Where to focus",
    backToToday: "Back to Today",
    seePremium: "See Premium",
    futureProjects: "Future Projects",
    viewFuture: "View Future Projects",
  },
  tasks: { calcium: "Calcium", vitd: "Vitamin D", protein: "Protein", walk10: "Walk", hydrate2l: "Hydration" },
  roadmap: {
    consistent: "Consistent habits begin to raise your baseline.",
    compound: "Adaptations compound with steady effort.",
    meaningful: "Meaningful improvement — keep the streak alive.",
    assuming: "Assuming your recent completion pace.",
  },
  future: {
    pageTitle: "Future Projects",
    subtitle: "What we’re building next (subject to change).",
    statuses: { planned: "Planned", building: "Building", research: "Research" },
    items: {
      socialSeasons: { title: "Social Seasons", desc: "Weekly leaderboards, private groups, and seasonal rewards." },
      coach: { title: "Smart Coaching", desc: "Adaptive nudges and micro-plans based on your data." },
      analytics: { title: "Advanced Analytics", desc: "Correlations, streak insights, plateau detection." },
      healthSync: { title: "Health Sync", desc: "Apple Health / Google Fit / Garmin integrations." },
      dexa: { title: "DEXA / FRAX", desc: "Import metrics and map them to your roadmap." },
      rehab: { title: "Rehab Packs", desc: "Procedure-specific (pre-op, post-op, fracture) protocols." }
    }
  }
} as const;

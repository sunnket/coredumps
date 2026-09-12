/* Case study collections — order here drives the studies index.
   Same shape as a category: id, name, short, icon, two accent colours and a
   description. Adding a collection is one entry plus a data file. */
TD.defineCollections([
  { id: "failures", name: "Failures & Outages", short: "Failures",
    icon: "gauge", col: "#fb923c", colL: "#c2410c",
    desc: "The incidents every engineer eventually references — what actually broke, how long it took, and the practice that changed afterwards." },

  { id: "breaches", name: "Breaches & Security", short: "Breaches",
    icon: "shield", col: "#f87171", colL: "#b91c1c",
    desc: "The vulnerabilities and intrusions that rewrote how the industry thinks about dependencies, build systems and trust." },

  { id: "systems", name: "Landmark Systems", short: "Systems",
    icon: "server", col: "#38bdf8", colL: "#0369a1",
    desc: "The architectures and decisions that shaped how everyone else builds — Unix, Git, Amazon's services, Google's data stack, Netflix on the cloud." },

  { id: "breakthroughs", name: "Papers & Breakthroughs", short: "Breakthroughs",
    icon: "atom", col: "#a78bfa", colL: "#6d28d9",
    desc: "The handful of results that moved the ground under the field, from information theory in 1948 to the moment everyone's manager started asking about AI." },

  { id: "lore", name: "Laws, Moments & Lore", short: "Lore",
    icon: "book", col: "#34d399", colL: "#047857",
    desc: "The principles people quote in meetings — usually correctly, occasionally not — and the small events that turned into industry-wide lessons." }
]);

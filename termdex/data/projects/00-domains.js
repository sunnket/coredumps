/* Project Lab — Domain Definitions */
(function (TD) {
  TD.projectDomains = [
    {
      id: "backend",
      name: "Full-Stack & Backend Systems",
      short: "Full-Stack & Backend",
      icon: "server",
      col: "#38bdf8",
      colL: "#0284c7",
      desc: "Distributed microservices, real-time protocols, database internals, caching layers, and high-concurrency API backends."
    },
    {
      id: "aiml",
      name: "AI, Machine Learning & Deep Learning",
      short: "AI, ML & Vision",
      icon: "atom",
      col: "#a78bfa",
      colL: "#7c3aed",
      desc: "Computer vision pipelines, neural architecture design, multimodal embeddings, time-series forecasting, and mathematical modeling."
    },
    {
      id: "llm",
      name: "Generative AI & LLM Engineering",
      short: "LLMs & Agents",
      icon: "spark",
      col: "#f472b6",
      colL: "#db2777",
      desc: "Autonomous coding agents, long-context RAG pipelines, local voice assistants, prompt firewalls, and model evaluation harnesses."
    },
    {
      id: "systems",
      name: "Systems, OS & Cloud Engineering",
      short: "Systems & DevOps",
      icon: "cpu",
      col: "#34d399",
      colL: "#059669",
      desc: "In-memory database engines, container runtimes, distributed consensus clusters, custom protocols, and low-level Linux systems."
    },
    {
      id: "data",
      name: "Data Engineering & Streaming",
      short: "Data & Streaming",
      icon: "pipeline",
      col: "#fb923c",
      colL: "#ea580c",
      desc: "High-throughput stream processors, distributed DAG workflow engines, columnar parquet lakehouses, and real-time clickstream analytics."
    },
    {
      id: "security",
      name: "Cybersecurity & Network Engineering",
      short: "Cybersecurity",
      icon: "shield",
      col: "#f87171",
      colL: "#dc2626",
      desc: "Zero-trust reverse proxies, packet sniffers & intrusion detection, static code vulnerability analyzers, and cryptographic key vaults."
    }
  ];

  TD.projects = [];
  TD.projectById = {};

  TD.addProjects = function (domainId, list) {
    list.forEach(function (p) {
      p.domain = domainId;
      TD.projects.push(p);
      TD.projectById[p.id] = p;
    });
  };
})(window.TD = window.TD || {});

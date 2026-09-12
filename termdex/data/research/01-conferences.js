/* Research Hub — Tier-1 Conferences & Journals Directory */
(function (TD) {
  TD.conferences = [
    /* AI & Machine Learning */
    {
      id: "neurips",
      name: "NeurIPS",
      full: "Conference on Neural Information Processing Systems",
      domain: "AI & Machine Learning",
      col: "#7c3aed",
      tier: "Tier 1 (Flagship)",
      h5Index: 320,
      acceptRate: "20–25%",
      reviewFormat: "Double-Blind + OpenReview",
      deadline: "May (Annual)",
      desc: "The world's premier and largest research conference in machine learning, deep learning, reinforcement learning, and neural algorithms.",
      url: "https://neurips.cc/"
    },
    {
      id: "icml",
      name: "ICML",
      full: "International Conference on Machine Learning",
      domain: "AI & Machine Learning",
      col: "#7c3aed",
      tier: "Tier 1 (Flagship)",
      h5Index: 260,
      acceptRate: "22–27%",
      reviewFormat: "Double-Blind",
      deadline: "January / February (Annual)",
      desc: "Leading international machine learning venue with a strong focus on theoretical foundations, optimization, and scalable algorithms.",
      url: "https://icml.cc/"
    },
    {
      id: "iclr",
      name: "ICLR",
      full: "International Conference on Learning Representations",
      domain: "AI & Machine Learning",
      col: "#7c3aed",
      tier: "Tier 1 (Flagship)",
      h5Index: 290,
      acceptRate: "25–30%",
      reviewFormat: "Double-Blind + Public OpenReview",
      deadline: "September (Annual)",
      desc: "The top conference for deep learning architectures, foundation models, representation learning, and LLM reasoning.",
      url: "https://iclr.cc/"
    },
    {
      id: "acl",
      name: "ACL",
      full: "Association for Computational Linguistics",
      domain: "Natural Language Processing",
      col: "#db2777",
      tier: "Tier 1 (Flagship)",
      h5Index: 210,
      acceptRate: "21–25%",
      reviewFormat: "Double-Blind (ARR Rolling Review)",
      deadline: "Bi-Monthly via ARR",
      desc: "The premier global conference for natural language processing, computational linguistics, and language models.",
      url: "https://www.aclweb.org/"
    },
    {
      id: "cvpr",
      name: "CVPR",
      full: "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
      domain: "Computer Vision",
      col: "#ec4899",
      tier: "Tier 1 (Flagship)",
      h5Index: 380,
      acceptRate: "23–26%",
      reviewFormat: "Double-Blind",
      deadline: "November (Annual)",
      desc: "The highest-impact conference in computer vision, 3D reconstruction, generative diffusion, and multimodal perception.",
      url: "https://cvpr.thecvf.com/"
    },

    /* Systems, OS & Cloud */
    {
      id: "osdi",
      name: "USENIX OSDI",
      full: "Symposium on Operating Systems Design and Implementation",
      domain: "Systems & Cloud",
      col: "#059669",
      tier: "Tier 1 (Flagship)",
      h5Index: 85,
      acceptRate: "14–18%",
      reviewFormat: "Double-Blind + Artifact Evaluation",
      deadline: "December (Annual)",
      desc: "The most prestigious research venue for production operating systems, distributed architectures, cloud infrastructure, and cluster schedulers.",
      url: "https://www.usenix.org/conference/osdi24"
    },
    {
      id: "sosp",
      name: "ACM SOSP",
      full: "Symposium on Operating Systems Principles",
      domain: "Systems & Cloud",
      col: "#059669",
      tier: "Tier 1 (Flagship)",
      h5Index: 78,
      acceptRate: "15–19%",
      reviewFormat: "Double-Blind + Artifact Evaluation",
      deadline: "April (Annual)",
      desc: "The flagship biannual/annual symposium establishing fundamental breakthroughs in operating systems, storage, and distributed consistency.",
      url: "https://sosp.org/"
    },
    {
      id: "eurosys",
      name: "EuroSys",
      full: "European Conference on Computer Systems",
      domain: "Systems & Cloud",
      col: "#059669",
      tier: "Tier 1",
      h5Index: 65,
      acceptRate: "16–20%",
      reviewFormat: "Double-Blind",
      deadline: "May & October (Dual-Deadline)",
      desc: "Premier conference spanning all areas of computer systems: virtualization, serverless, operating systems, and systems for machine learning.",
      url: "https://www.eurosys.org/"
    },
    {
      id: "usenix-atc",
      name: "USENIX ATC",
      full: "USENIX Annual Technical Conference",
      domain: "Systems & Cloud",
      col: "#059669",
      tier: "Tier 1",
      h5Index: 60,
      acceptRate: "17–21%",
      reviewFormat: "Double-Blind",
      deadline: "January (Annual)",
      desc: "High-impact venue focusing on practical software engineering, cloud virtualization, container runtimes, and Linux kernel innovations.",
      url: "https://www.usenix.org/conference/atc24"
    },

    /* Databases & Big Data */
    {
      id: "sigmod",
      name: "ACM SIGMOD",
      full: "International Conference on Management of Data",
      domain: "Databases & Data",
      col: "#ea580c",
      tier: "Tier 1 (Flagship)",
      h5Index: 92,
      acceptRate: "18–22%",
      reviewFormat: "Double-Blind (Multi-Round Submission)",
      deadline: "Quarterly Deadlines",
      desc: "The definitive research venue for database engine internals, distributed SQL, indexing structures, and transaction processing.",
      url: "https://sigmod.org/"
    },
    {
      id: "vldb",
      name: "VLDB (PVLDB)",
      full: "International Conference on Very Large Data Bases",
      domain: "Databases & Data",
      col: "#ea580c",
      tier: "Tier 1 (Flagship)",
      h5Index: 90,
      acceptRate: "19–24%",
      reviewFormat: "Hybrid Journal/Conference (Monthly Deadlines)",
      deadline: "1st of Every Month",
      desc: "Premier forum for large-scale data engineering, streaming engines, columnar formats, lakehouses, and hardware-accelerated databases.",
      url: "https://vldb.org/"
    },

    /* Cybersecurity & Cryptography */
    {
      id: "ieee-sp",
      name: "IEEE S&P (Oakland)",
      full: "IEEE Symposium on Security and Privacy",
      domain: "Cybersecurity & Cryptography",
      col: "#dc2626",
      tier: "Tier 1 (The Big 4)",
      h5Index: 110,
      acceptRate: "12–16%",
      reviewFormat: "Double-Blind (Tri-Annual Deadlines)",
      deadline: "January / May / September",
      desc: "The most prestigious and rigorous academic conference in computer security, cryptography, and privacy.",
      url: "https://www.ieee-security.org/TC/SP-Index.html"
    },
    {
      id: "usenix-sec",
      name: "USENIX Security",
      full: "USENIX Security Symposium",
      domain: "Cybersecurity & Cryptography",
      col: "#dc2626",
      tier: "Tier 1 (The Big 4)",
      h5Index: 98,
      acceptRate: "15–19%",
      reviewFormat: "Double-Blind (Tri-Annual Deadlines)",
      deadline: "February / June / September",
      desc: "Top venue for practical system security, binary exploitation, malware analysis, network defenses, and hardware side-channels.",
      url: "https://www.usenix.org/conference/usenixsecurity24"
    },
    {
      id: "acm-ccs",
      name: "ACM CCS",
      full: "ACM Conference on Computer and Communications Security",
      domain: "Cybersecurity & Cryptography",
      col: "#dc2626",
      tier: "Tier 1 (The Big 4)",
      h5Index: 105,
      acceptRate: "16–20%",
      reviewFormat: "Double-Blind (Dual-Deadline)",
      deadline: "January & May",
      desc: "Flagship ACM conference on applied cryptography, protocol verification, zero-trust architectures, and web security.",
      url: "https://www.sigsac.org/ccs.html"
    },

    /* Networks & Communications */
    {
      id: "sigcomm",
      name: "ACM SIGCOMM",
      full: "ACM Special Interest Group on Data Communication",
      domain: "Networks & Distributed Systems",
      col: "#0284c7",
      tier: "Tier 1 (Flagship)",
      h5Index: 82,
      acceptRate: "15–19%",
      reviewFormat: "Double-Blind",
      deadline: "January (Annual)",
      desc: "The absolute pinnacle conference in computer networking, data center architectures, congestion control, and software-defined networking (SDN).",
      url: "https://www.sigcomm.org/"
    },
    {
      id: "nsdi",
      name: "USENIX NSDI",
      full: "Symposium on Networked Systems Design and Implementation",
      domain: "Networks & Distributed Systems",
      col: "#0284c7",
      tier: "Tier 1 (Flagship)",
      h5Index: 78,
      acceptRate: "16–20%",
      reviewFormat: "Double-Blind (Fall & Spring Rounds)",
      deadline: "April & September",
      desc: "Focuses on the intersection of large-scale systems and high-speed networking, including programmable switches (P4), RDMA, and optical interconnects.",
      url: "https://www.usenix.org/conference/nsdi24"
    },

    /* Software Engineering & Programming Languages */
    {
      id: "icse",
      name: "ACM/IEEE ICSE",
      full: "International Conference on Software Engineering",
      domain: "Software Engineering",
      col: "#4f46e5",
      tier: "Tier 1 (Flagship)",
      h5Index: 95,
      acceptRate: "18–22%",
      reviewFormat: "Double-Blind",
      deadline: "August (Annual)",
      desc: "The premier global conference on software engineering, program analysis, automated testing, debugging, and AI for code.",
      url: "https://conf.researchr.org/series/icse"
    },
    {
      id: "pldi",
      name: "ACM PLDI",
      full: "Conference on Programming Language Design and Implementation",
      domain: "Programming Languages & Compilers",
      col: "#4f46e5",
      tier: "Tier 1 (Flagship)",
      h5Index: 70,
      acceptRate: "19–23%",
      reviewFormat: "Double-Blind",
      deadline: "November (Annual)",
      desc: "The premier conference on compiler optimizations, programming language design, runtime virtual machines, and formal verification.",
      url: "https://pldi.org/"
    }
  ];
})(window.TD = window.TD || {});

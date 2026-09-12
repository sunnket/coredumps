# CoreDumps

> **The Engineer's Technical Dictionary & Learning Platform**  
> The definitive platform for engineering foundations, algorithms, ML/AI, distributed backend systems, hardcore interview drills, and real-world architectures.

---

## Overview

CoreDumps is an interactive, browser-first engineering encyclopedia and mastery platform featuring:

- **Encyclopedia**: Over 1,200+ deeply researched engineering terms across 19+ fields (Systems, Cloud, AI/ML, Security, Web, Compilers, Networking, and more) with concise explanations, production examples, flows, and hand-crafted diagrams.
- **Code Dojo**: Interactive coding problem bank and verification pipeline with reference solutions, test assertion harness, and typing blueprint ghost mode.
- **System Designs & Case Studies**: In-depth breakdowns of real-world production incidents, architectures, and engineering landmarks (e.g., Knight Capital, Heartbleed, Log4Shell, Amazon Dynamo, AlexNet).
- **Interactive Visualizers**: Hand-crafted SVG diagrams, interactive mental models, and algorithmic visualizers.
- **Zero Heavy Frameworks**: Pure HTML5, CSS3, and modern vanilla JavaScript. Fast, accessible, and runs anywhere.

---

## Directory Structure

```
coredumps/
├── termdex/                  # Main CoreDumps web application
│   ├── index.html            # Core application entrypoint
│   ├── server.js             # Zero-dependency local development server
│   ├── assets/               # Stylesheets, icons, and UI scripts
│   ├── data/                 # Encyclopedia topics, case studies, guides, quizzes
│   └── tools/                # Content generator scripts and diagnostics
├── dojo/                     # Code Dojo problem authoring and build suite
│   ├── tools/                # Python assertion verification & test harness
│   ├── dist/                 # Standalone bundled blueprints
│   └── README.md             # Code Dojo pipeline documentation
├── check_syntax.js           # Syntax and integrity validator for all data files
├── package.json              # Workspace root scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or newer)
- Optional for Code Dojo pipeline: [Python 3](https://python.org/)

### Running Locally

Clone the repository and start the development server:

```bash
npm start
```

Or run the server directly:

```bash
node termdex/server.js
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. If port 8000 is occupied, the server automatically selects the next available port (8001, 8002, etc.).

### Integrity & Syntax Check

Run the syntax validator across all data scripts:

```bash
node check_syntax.js
```

---

## License

Private repository. All rights reserved.

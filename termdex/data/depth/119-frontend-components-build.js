/* ==========================================================================
   Depth pass 119 — Web Frontend batch 4: Component State & Build Optimization.
   Component, Props, State Management, Bundler,
   Tree Shaking, Code Splitting, Lazy Loading.

   Unidirectional data flows, AST module dependency graphs, rollup ES static exports,
   and dynamic dynamic-import chunk boundaries power modern frontend architectures.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "component",

      why: {
        before: "Frontend codebases separated concerns artificially by file type (a massive `index.html`, a global `styles.css`, and sprawling `app.js`), making it impossible to reuse UI widgets across pages without copy-pasting HTML and causing CSS style collisions.",
        problem: "Modern web applications require an autonomous, reusable, and composable architectural primitive that encapsulates markup, styling, and behavior into a cohesive, self-contained unit.",
        shift: "**Component: A self-contained, reusable building block of a user interface that encapsulates its own structure (HTML/JSX), style (CSS), and logic (JavaScript).** Pioneered by Web Components, React, Vue, and Svelte, components transform UI engineering into composable component trees."
      },

      num: {
        t: "Component Paradigms: React Functional vs Web Components vs Svelte",
        h: ["Component Model", "Encapsulation Boundary", "State Reactivity Mechanism", "Styling Scope", "Runtime Overhead"],
        r: [
          ["React Function Component", "JavaScript function returning Virtual DOM", "Hooks (`useState`, `useReducer`)", "CSS Modules, CSS-in-JS, Tailwind", "Medium (React runtime + VDOM diffing)"],
          ["Web Components (W3C Native)", "Custom Elements (`class extends HTMLElement`)", "Attribute observation (`attributeChangedCallback`)", "Shadow DOM (true native CSS encapsulation)", "Zero (built directly into browser C++ engine)"],
          ["Vue Single-File Component (SFC)", "Unified `<template>`, `<script>`, `<style>`", "Vue Reactivity Proxy system", "Scoped CSS (`<style scoped>`)", "Low-to-medium (compact Vue runtime)"],
          ["Svelte Component", "Compiled reactive HTML/JS/CSS file", "Compile-time assignment instrumentation (`count += 1`)", "Compile-time scoped CSS hashing", "Minimal (no virtual DOM; compiles to vanilla JS)"],
          ["Server Component (RSC)", "Server-side function returning serialized stream", "Stateless / Server data fetching", "Shared server styling", "Zero client JS bundle footprint"]
        ],
        n: "A Component is the fundamental building block of modern declarative UI engineering. In mathematical terms, a component is a pure function that maps inputs (Props and State) to a visual representation: $\\text{View} = f(\\text{Props}, \\text{State})$. Components form a **Hierarchical Component Tree**: parent components pass immutable properties (**Props**) downwards to children, while children communicate upwards via **Event Callbacks** (Unidirectional Data Flow). Under the **Single Responsibility Principle**, components are composed: higher-level container components manage data fetching and state, while lower-level presentational ('dumb') components receive data via props and render UI with zero side effects."
      },

      miss: [
        {
          w: "Components must be big, full-screen views like a Dashboard or Profile page.",
          r: "Components should follow **Atomic Design**: atomic components represent tiny, single-purpose primitives (Button, Input, Avatar, Badge). Molecules combine atoms (SearchBar = Input + Button); Organisms combine molecules (Header = Logo + SearchBar + Nav). Full pages are simply assemblies of small, focused components."
        },
        {
          w: "Web Components (Custom Elements) have replaced React and Vue components.",
          r: "Web Components provide native browser-level encapsulation via Custom Elements and Shadow DOM, but lack rich data-binding, state management, and ergonomic templating. In practice, Web Components are used primarily for cross-framework design systems, while React, Vue, and Svelte handle complex application logic."
        },
        {
          w: "Every component needs its own internal state.",
          r: "Overusing internal state creates difficult-to-debug state synchronization issues. The majority of components in a healthy design system are **stateless (presentational) components** that receive all data via props and emit events, making them pure, testable, and reusable."
        },
        {
          w: "Defining a component inside another component's render function is fine.",
          r: "Defining a component inside another component is a **major anti-pattern**. Every time the parent re-renders, a completely new component type reference is created in memory. React treats it as a completely new component, unmounting and remounting the entire subtree, which destroys child state and resets cursor focus."
        }
      ],

      trade: {
        buys: [
          "High reusability: write a component (Button, Modal, DatePicker) once and reuse it across hundreds of pages and products.",
          "Encapsulated maintainability: isolating HTML, CSS, and logic makes bugs easy to locate and fix within a single file.",
          "Composable architecture: enables building complex enterprise dashboards by assembling simple, atomic building blocks.",
          "Design system consistency: guarantees that brand styling, colors, and accessibility behaviors remain identical across the app."
        ],
        costs: [
          "Prop drilling overhead: passing data through multiple intermediate component layers requires context or global state stores.",
          "Performance re-render cascades: a state update in a high-level parent component can trigger wasteful re-renders across all child components.",
          "Cognitive architectural complexity: decomposing interfaces into the right granularity of components requires thoughtful design.",
          "Framework lock-in: components written in React JSX cannot be used natively in Vue or Angular without wrapper shims."
        ],
        avoid: [
          "Never define a component inside the render body of another component; declare components at module top-level.",
          "Do not create monolithic 'God Components' containing thousands of lines of mixed logic; decompose into small sub-components.",
          "Avoid duplicate state: if a value can be derived from props or existing state, calculate it dynamically rather than creating new state.",
          "Never mutate props directly inside a child component; props must be treated as strictly immutable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "props",

      why: {
        before: "Parent and child UI modules communicated via global variables, custom DOM event buses, or direct internal method mutation, making data dependencies opaque and leading to fragile, non-deterministic state corruption.",
        problem: "Component trees need a clear, explicit, and deterministic mechanism for parent components to pass data and event callbacks downward to child components without violating component boundaries.",
        shift: "**Props (Properties): The inputs passed into a component from its parent component, governing how the component should be rendered and behaved.** Adhering strictly to unidirectional data flow, props are immutable from the perspective of the receiving component."
      },

      num: {
        t: "Props Mechanics & Data Flow Constraints Across Frameworks",
        h: ["Framework / Language", "Props Declaration Syntax", "Mutability Invariant", "Type Validation Tool", "Default Props Strategy"],
        r: [
          ["React (TypeScript)", "`interface ButtonProps { ... }`", "Strictly Immutable (`Readonly<Props>`)", "TypeScript compile-time type checking", "ES6 default destructuring (`{ size = 'md' }`)"],
          ["Vue 3 (Composition API)", "`defineProps<{ title: string }>()`", "Readonly Proxy (warning on mutation)", "TypeScript / Vue runtime validator", "`withDefaults(defineProps<...>(), { ... })`"],
          ["Svelte 5", "`let { title, count = 0 } = $props();`", "Immutable binding (unless `$bindable()`)", "TypeScript / Svelte check", "ES6 default assignment in destructuring"],
          ["Web Components (Native)", "`observedAttributes()` / getters & setters", "Mutable internal property reflections", "Manual runtime string parsing", "Default values in class constructor"]
        ],
        n: "Props establish **Unidirectional Data Flow** (Top-Down Data Binding). In React, props are passed as a plain JavaScript object argument into the component function: `function Card({ title, count }: CardProps)`. Under the rules of functional programming, **props are strictly read-only**: a component must never modify its own props (`props.count = 5` is strictly forbidden and triggers runtime errors or silent bugs). To communicate state changes back to the parent, the parent passes a **callback function** as a prop (`onUpdate={(val) => ...}`), which the child invokes when an event occurs. When props must travel through dozens of intermediary components that do not need the data themselves (**Prop Drilling**), architectures utilize **Context APIs** or state management stores."
      },

      miss: [
        {
          w: "A child component can mutate its own props to update data.",
          r: "Props are **strictly immutable** from the perspective of the child component. Attempting to mutate `props.title = 'New'` violates unidirectional data flow, leads to desynchronized state, and is actively blocked in strict mode. If a child needs to modify data, the parent must pass an updater callback, or the child must copy the prop into local state."
        },
        {
          w: "Passing a function as a prop causes the child to re-render on every parent render.",
          r: "Passing a function prop only triggers re-renders if the function reference changes **and** the child is wrapped in `React.memo`. If an inline arrow function (`onClick={() => ...}`) is passed, a new function reference is created on every render; wrapping the callback in **`useCallback`** preserves the stable reference."
        },
        {
          w: "Props and State are basically the same thing with different names.",
          r: "**Props** are passed **into** a component from the outside (like function arguments) and cannot be changed by the receiving component. **State** is created and managed **internally inside** the component (like local variables) and can be modified over time via state setter functions."
        },
        {
          w: "Default props can only be defined using the legacy `Component.defaultProps` object.",
          r: "Modern JavaScript and React have deprecated `Component.defaultProps` for functional components. Default props should be defined cleanly using native **ES6 object destructuring default values**: `function User({ role = 'guest', status = 'active' })`."
        }
      ],

      trade: {
        buys: [
          "Predictable data flow: top-down props flow makes tracing where data originates and changes straightforward in devtools.",
          "High reusability: components become pure, parameterized templates that render different data simply by changing props.",
          "Compile-time type safety: TypeScript interfaces validate that required props are never omitted at build time.",
          "Simplified unit testing: components can be tested deterministically by passing mock props and asserting rendered output."
        ],
        costs: [
          "Prop Drilling: passing props through 5-10 intermediate components that don't need the data clutters component signatures.",
          "Re-render propagation: passing unstable object/array literals as props breaks memoization and triggers child re-renders.",
          "Boilerplate interfaces: complex components require verbose TypeScript interface declarations for dozens of props.",
          "Tight parent-child coupling: deeply specialized props bind a child component tightly to a specific parent's data schema."
        ],
        avoid: [
          "Never mutate props directly inside a child component; treat props as read-only values.",
          "Do not pass props through more than 3-4 intermediate components; use React Context or a state store (Zustand) to avoid Prop Drilling.",
          "Avoid passing unstable inline object literals (`style={{ color: 'red' }}`) if the child component is wrapped in `React.memo`.",
          "Never copy props into local component state unless you explicitly intend to create a detached draft that ignores future prop updates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "state-management",

      why: {
        before: "Application state was scattered haphazardly across DOM data attributes, global JavaScript variables, and disconnected component instances, leading to synchronization nightmares where updating a user profile updated the header but left the sidebar out of date.",
        problem: "Complex client-side web applications need a centralized, predictable, and traceable mechanism to store, update, and propagate shared state across deeply nested, distant component hierarchies.",
        shift: "**State Management: The architectural practice of managing and synchronizing the state (data) of a user interface across multiple components and user interactions.** Evolving from Flux and Redux to modern atomic state (Jotai, Recoil), reactive signals (Zustand, MobX), and server-state caches (TanStack Query), state management is the core architectural challenge of frontend engineering."
      },

      num: {
        t: "State Management Paradigms: Architecture, Reactivity & Trade-offs",
        h: ["Paradigm", "Architectural Structure", "Update Mechanism", "Re-render Granularity", "Primary Production Standard"],
        r: [
          ["Unidirectional Store (Flux/Redux)", "Single global immutable state tree", "Pure Reducers dispatched via Actions (`dispatch`)", "Coarse (requires selectors / `useSelector`)", "Redux Toolkit (RTK), enterprise finance apps"],
          ["Mini / Hook-Based Stores", "Modular closures outside React", "Direct action setters / shallow equality", "Fine-grained per-slice subscription", "Zustand (modern industry standard)"],
          ["Atomic State", "Decentralized state graph of discrete 'atoms'", "Atoms update independently; derived selectors", "Precise component-level atom re-renders", "Jotai, Recoil"],
          ["Fine-Grained Reactive Signals", "Observable signal graph with dependency tracking", "Direct variable mutation with automatic subscriber notification", "Hyper-fine (updates single text node, bypasses VDOM)", "Solid.js, Preact Signals, Svelte 5 runes"],
          ["Server-State Cache", "Dedicated async server-cache store", "Automated revalidation, deduplication, background polling", "Component-level query hook subscription", "TanStack Query (React Query), SWR, RTK Query"]
        ],
        n: "State in modern web applications is fundamentally divided into two distinct domains: (1) **Client State** (ephemeral UI state: dark mode toggle, modal visibility, active tab, draft form inputs), and (2) **Server State** (remote database data: user accounts, order history, product lists). The fatal historical flaw of early Redux was storing server cache data inside global client stores, forcing developers to manually write thousands of lines of boilerplate reducers, loading spinners, and cache invalidation logic. Modern architecture separates these concerns completely: **Server State is managed by specialized cache engines (TanStack Query / SWR)** that handle caching, background refetching, and deduplication automatically, while lightweight client stores (**Zustand, Jotai**) manage pure local UI state."
      },

      miss: [
        {
          w: "All state in an application should be stored in a single global Redux store.",
          r: "Putting all state in a global store is a **massive anti-pattern**. Local component state (e.g., whether a dropdown is open or an input is typing) should remain **local to that specific component** (`useState`). State should only be elevated to global stores if it is genuinely shared across distant, independent component trees."
        },
        {
          w: "React Context API is a full replacement for state management libraries like Zustand or Redux.",
          r: "React Context is a **dependency injection mechanism**, NOT a state management engine. Context lacks selector-based re-render optimization: when a Context value changes, **EVERY single component that consumes that context re-renders**, even if it only uses a property that didn't change, causing severe performance degradation in large apps."
        },
        {
          w: "State management libraries are required for every new web application.",
          r: "Many applications can be built entirely using native local component state (`useState`, `useReducer`), Context for global themes, and TanStack Query for server data. Introducing a heavy global state store prematurely adds unnecessary complexity and boilerplate."
        },
        {
          w: "Redux requires dozens of boilerplate files for every simple state change.",
          r: "Legacy 2015 Redux required heavy boilerplate (actions, action creators, constants, reducers). Modern **Redux Toolkit (RTK)** eliminated this with `createSlice()`, reducing boilerplate to concise, immer-powered mutating syntax and automated action generation."
        }
      ],

      trade: {
        buys: [
          "Single source of truth: ensures all components across the entire page display consistent, synchronized data.",
          "Time-travel debugging: immutable state updates allow developers to record, inspect, and rewind user state transitions in devtools.",
          "Eliminates prop drilling: deeply nested components can subscribe directly to specific state slices without intermediate props.",
          "Optimistic UI updates: enables interfaces to instantly update UI state before the server API response returns."
        ],
        costs: [
          "Architectural boilerplate: introducing global stores requires action types, selectors, and store configuration code.",
          "Performance pitfalls: un-optimized selector subscriptions cause unnecessary re-renders across unaffected components.",
          "Over-engineering hazard: teams frequently put simple local state into global stores, complicating basic UI logic.",
          "Stale cache synchronization: keeping client state synchronized with remote database mutations requires complex invalidation logic."
        ],
        avoid: [
          "Never put server API data into a global Redux/Zustand store when a dedicated server-cache tool (TanStack Query) is available.",
          "Do not use React Context for high-frequency state updates (e.g., mouse coordinates, animation timers); it causes massive re-render thrashing.",
          "Avoid storing derived state in stores; compute derived values dynamically on-the-fly using selectors or `useMemo`.",
          "Never mutate state directly in libraries expecting immutability (like classic Redux); always return new state copies."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bundler",

      why: {
        before: "Web developers had to manually manage hundreds of global `<script>` tags in HTML in exact chronological dependency order; circular dependencies crashed apps, variable names collided globally, and browsers stalled under hundreds of separate HTTP/1.1 network requests.",
        problem: "Modern codebases are organized into thousands of modular ES modules, TypeScript files, CSS modules, and assets that must be resolved, optimized, and packaged into minimal production bundles for fast network delivery.",
        shift: "**Bundler: A development tool that analyzes a project's module dependencies, processes various file types (JS, TS, CSS, images), and packages them into optimized static assets for the browser.** Evolving from Webpack and Rollup to modern native-speed bundlers (esbuild, Turbopack, Vite/Rollup), bundlers are the operational engine of the modern frontend build toolchain."
      },

      num: {
        t: "Frontend Bundler Evolution: Architecture, Speed & Standards",
        h: ["Bundler", "Implementation Language", "Build Architecture", "HMR (Hot Module Replacement) Speed", "Primary Production Role"],
        r: [
          ["Webpack (Classic Standard)", "JavaScript (Node.js)", "Full AST module graph compilation upfront", "Slow on large projects ($2\\text{--}10$ seconds)", "Legacy enterprise codebases, complex custom loaders"],
          ["Vite (Modern Standard)", "JS + Go (esbuild dev, Rollup prod)", "Native ESM dev server; bundles on-demand via Rollup", "Instantaneous ($< 50$ ms via native browser ESM)", "Default standard for modern React, Vue, Svelte SPAs"],
          ["esbuild", "Go (Compiled native binary)", "Massive multi-threaded CPU parallel compilation", "Sub-millisecond", "High-speed transpilation and minification engine in build tools"],
          ["Turbopack", "Rust (SWC based)", "Incremental computation engine with caching", "Instantaneous", "Next.js App Router default development bundler"],
          ["Rollup", "JavaScript (Node.js)", "ES Module static analysis & scope hoisting", "Moderate", "Library authoring and Vite's production bundling engine"]
        ],
        n: "A bundler operates by constructing a **Module Dependency Graph**. Starting from one or more **Entry Points** (e.g., `src/index.tsx`), the bundler's parser analyzes static `import` and `export` statements, building a Directed Acyclic Graph (DAG) of all project files and `node_modules`. Along the pipeline, **Loaders / Transformers** transpile modern TypeScript into JavaScript, process CSS Modules, and optimize images. The bundler then executes **Scope Hoisting** and **Tree Shaking** to eliminate dead code, applies **Code Splitting** to partition the graph into multiple output chunks (e.g., `main.[hash].js`, `vendor.[hash].js`), and runs **Minification** (mangling identifiers, stripping whitespace) to output production-ready static assets."
      },

      miss: [
        {
          w: "Native browser ES Modules (`<script type='module'>`) eliminate the need for bundlers entirely.",
          r: "While modern browsers natively support `import`, loading hundreds of unbundled module files over the network causes severe **network round-trip waterfalls** and latency bottlenecks. Bundlers remain mandatory for production to perform **tree shaking, code splitting, minification, CSS pre-processing, and chunk optimization**."
        },
        {
          w: "A bundler and a task runner (like Gulp or Grunt) are the same thing.",
          r: "A **task runner** simply executes predefined scripts sequentially (e.g., copy files, run linter). A **bundler** understands the **semantic module dependency graph** of the code, dynamically traversing imports, resolving circular references, and transforming the dependency tree."
        },
        {
          w: "Vite is a completely new bundler that replaces Rollup and esbuild.",
          r: "Vite is an orchestrator: in development, it uses the browser's native ESM combined with **esbuild** for high-speed dependency pre-bundling; for production builds, Vite internally uses **Rollup** for highly optimized chunking and tree shaking."
        },
        {
          w: "Bundlers always package your entire website into a single massive `bundle.js` file.",
          r: "Packing everything into a single file is an anti-pattern. Modern bundlers automatically perform **Code Splitting**: separating third-party vendor libraries into long-lived cacheable chunks, and splitting application code into lazy-loaded route chunks."
        }
      ],

      trade: {
        buys: [
          "Seamless modularity: write modern modular TypeScript and CSS without worrying about global scope collisions.",
          "Dead code elimination: Tree Shaking strips unused exports, shrinking production download sizes.",
          "Automated asset optimization: minifies JavaScript, inlines small SVG icons, and hashes filenames for immutable caching.",
          "Instant developer ergonomics: Hot Module Replacement (HMR) updates UI components in milliseconds without refreshing the page."
        ],
        costs: [
          "Build toolchain complexity: configuring complex bundler setups (Webpack plugins, loaders) is notoriously painful.",
          "Build time overhead: compiling massive enterprise applications can take minutes in CI/CD build pipelines.",
          "Debugging abstraction: compiled, minified, and bundled code requires accurate Source Maps to debug in production.",
          "Dependency bloat: bundlers happily pull in massive unneeded `node_modules` libraries unless rigorously audited."
        ],
        avoid: [
          "Never ship production bundles without content hashing in filenames (e.g., `app.[contenthash].js`) to enable immutable CDN caching.",
          "Do not configure Webpack from scratch for standard new projects; use modern, pre-configured tools like Vite.",
          "Avoid importing entire massive utility libraries (`import _ from 'lodash'`); import specific modular paths (`import debounce from 'lodash/debounce'`).",
          "Never disable source maps in production without a secure strategy to upload them to error-monitoring platforms (Sentry)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tree-shaking",

      why: {
        before: "Importing a single helper function from a library (like `debounce` from Lodash) forced the bundler to include the entire 500KB library in the production bundle, bloating download sizes and slowing page loads with dead, un-executed code.",
        problem: "Frontend applications need a build-time optimization technique that statically analyzes module imports and exports, aggressively pruning dead, unreferenced code from final production bundles.",
        shift: "**Tree Shaking: A form of dead code elimination in modern JavaScript bundlers that relies on the static structure of ES2015 module syntax (`import`/`export`) to detect and remove unused exports from the final bundle.** Popularized by Rollup and adopted by Webpack, Vite, and esbuild, tree shaking dramatically shrinks bundle payloads."
      },

      num: {
        t: "Tree Shaking Compatibility: ES Modules vs CommonJS",
        h: ["Module System", "Syntax Example", "Static Analyzability", "Tree Shaking Behavior", "Production Bundle Consequence"],
        r: [
          ["ES Modules (ESM)", "`import { debounce } from 'lib';`", "100% statically analyzable at compile time", "Full Tree Shaking (prunes all unused exports)", "Only the exact imported function is included in bundle"],
          ["CommonJS (CJS)", "`const { debounce } = require('lib');`", "Dynamic runtime evaluation (`require` can be in `if`)", "Fails Tree Shaking (entire library bundled)", "Entire 500KB library included in output bundle"],
          ["`package.json` `sideEffects: false`", "`{ 'sideEffects': false }` in library", "Author declares files have zero side effects", "Maximum pruning (drops unused module files entirely)", "Guarantees complete elimination of unreferenced imports"],
          ["Library with Side Effects", "Top-level code mutates window or globals", "Bundler must preserve code to maintain side effects", "Tree shaking blocked for affected files", "Unused exports retained to avoid breaking runtime behavior"]
        ],
        n: "Tree shaking is rooted in the mathematical structure of **ECMAScript 2015 (ES6) Static Modules**. In CommonJS (`require()`), imports are dynamic: `require(condition ? 'a' : 'b')` can be executed conditionally at runtime, preventing static analysis. In contrast, ES6 `import` and `export` statements are **static**: they can only appear at the top-level of a module and cannot be enclosed inside conditionals or functions. The bundler constructs an **Abstract Syntax Tree (AST)** and creates a graph of **exports and export consumers**. Any export with zero incoming consumer edges in the graph is designated as **dead code**. During code generation, the bundler eliminates the dead export's AST nodes, and minifiers (Terser/esbuild) strip out any remaining orphan identifiers."
      },

      miss: [
        {
          w: "Tree shaking works automatically on any JavaScript library from npm.",
          r: "Tree shaking **ONLY works on libraries published as ES Modules (ESM)**. If a third-party npm package is distributed exclusively as compiled CommonJS (`module.exports`), the bundler cannot statically analyze the exports and is forced to include the **entire library** in your bundle."
        },
        {
          w: "Tree shaking and dead code elimination are the exact same thing.",
          r: "Dead code elimination (DCE) is a traditional compiler optimization that removes unreachable statements within a function (e.g., `if (false) { ... }`). **Tree shaking** specifically refers to **module-level export elimination**: pruning entire unreferenced functions and classes across module boundaries based on static import/export graphs."
        },
        {
          w: "A bundler can always safely delete any file you didn't explicitly import.",
          r: "If a module contains **top-level side effects** (e.g., running `window.customProperty = 5` or importing a CSS file), deleting it would break the application's runtime behavior. Unless a package explicitly declares **`'sideEffects': false`** in its `package.json`, bundlers must conservatively retain files to preserve potential side effects."
        },
        {
          w: "Destructuring an import (`import { a } from 'lib'`) always tree shakes.",
          r: "Destructuring only tree shakes if `lib` is written in native ESM. If `lib` is CommonJS or if the bundler's transpiler lowered ESM to CommonJS *before* tree shaking ran (a common Babel misconfiguration), the entire library will still be included."
        }
      ],

      trade: {
        buys: [
          "Dramatic bundle reduction: eliminates thousands of lines of dead library code, shrinking production payload sizes.",
          "Faster mobile load times: smaller bundles parse and execute significantly faster on constrained mobile CPUs.",
          "Encourages modular libraries: motivates package authors to publish clean, modular, tree-shakeable ES modules.",
          "Zero runtime overhead: dead code elimination occurs entirely at compile time in the build toolchain."
        ],
        costs: [
          "Fragile side-effect traps: top-level side effects or misconfigured `package.json` flags can accidentally prevent tree shaking.",
          "Transpilation ordering hazards: running Babel before the bundler can convert ESM to CommonJS, completely disabling tree shaking.",
          "Build time CPU cost: computing cross-module AST reachability graphs increases bundler build times.",
          "False sense of security: developers assume importing from bloated libraries is safe, unaware that CommonJS leaks through."
        ],
        avoid: [
          "Never configure Babel or TypeScript to compile ES modules into CommonJS (`'module': 'commonjs'`) before passing code to your bundler.",
          "Do not import from legacy CommonJS versions of libraries; use modern ESM distributions (`lodash-es` instead of `lodash`).",
          "Avoid top-level side effects (e.g., mutating prototypes, executing global code on import) in library modules.",
          "Never omit `'sideEffects': false` in the `package.json` of your own internal component libraries if they are pure."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "code-splitting",

      why: {
        before: "Bundlers packaged an entire multi-page application into a single massive `bundle.js` file, forcing a user who only wanted to view the homepage to download the code for the Admin Dashboard, Checkout System, and Settings pages upfront.",
        problem: "Applications need an architectural mechanism to split their JavaScript codebase into smaller, independent chunks that can be downloaded on-demand only when a user navigates to a specific route or opens a specific feature.",
        shift: "**Code Splitting: A build-time and runtime technique supported by bundlers (Webpack, Vite, Rollup) that splits an application's code into various smaller bundles (chunks) which can then be loaded on demand or in parallel.** Centered on dynamic `import()` syntax, code splitting drastically reduces initial page payload sizes."
      },

      num: {
        t: "Code Splitting Architectures: Entry vs Route vs Component Level",
        h: ["Splitting Strategy", "Implementation Syntax", "Chunk Trigger Timing", "Primary Payload Target", "Core Performance Impact"],
        r: [
          ["Route-Based Splitting", "`const Admin = React.lazy(() => import('./Admin'))`", "User navigates to new URL route", "Entire page-level route component code", "Drastically shrinks initial bundle; isolates heavy admin pages"],
          ["Component / Interaction", "`import('./HeavyChart').then(mod => ...)`", "User clicks button or opens modal", "Heavy localized widgets (charts, rich-text editors, video players)", "Defers loading 500KB chart libraries until user actually clicks view"],
          ["Vendor Chunk Splitting", "Bundler `splitChunks` / `manualChunks` config", "Cached on initial load", "Third-party `node_modules` (React, Lodash)", "Enables long-term browser HTTP caching across app updates"],
          ["Dynamic Polyfill Splitting", "Conditional `import('core-js/...')`", "Feature detection (`if (!window.IntersectionObserver)`)", "Legacy browser polyfills", "Modern browsers download 0 bytes of polyfill code"],
          ["Pre-fetching Splitting", "`<link rel='prefetch' href='checkout.chunk.js'>`", "Browser idle time", "Next likely navigation route", "Provides instant route navigation without upfront load penalty"]
        ],
        n: "Code Splitting transforms a single monolithic bundle into a network of modular chunks. It is powered by the ECMAScript **Dynamic Import Expression: `import('module-path')`**, which returns a Promise that resolves to the module namespace object. When a bundler encounters a dynamic `import()`, it automatically establishes a **Chunk Boundary**: the imported module and its unique dependency tree are extracted into a separate standalone file (e.g., `chunk-analytics-[hash].js`). In React, this is operationalized via **`React.lazy()`** paired with **`<Suspense fallback={<Spinner/>}>`**: React suspends rendering while the browser initiates an HTTP request to fetch the chunk file, resuming render seamlessly once the chunk script finishes loading and executing."
      },

      miss: [
        {
          w: "Code splitting requires complex manual configuration in Webpack.",
          r: "In modern bundlers (Vite, Next.js, Rollup), code splitting is **completely automated**. Merely writing a standard dynamic `import('./MyComponent')` or `React.lazy()` automatically instructs the bundler to split that code into an independent chunk file with zero custom configuration."
        },
        {
          w: "Splitting code into 100 tiny chunks is always better than having 2 larger chunks.",
          r: "Over-splitting creates **chunk fragmentation**. Loading dozens of tiny 2KB script chunks over the network introduces HTTP connection overhead, SSL round-trips, and waterfall latency. Modern bundlers optimize chunk thresholds (e.g., min chunk size $20\\text{ KB}$) to balance cacheability and network efficiency."
        },
        {
          w: "Code splitting reduces the total amount of code in your application.",
          r: "Code splitting does NOT reduce total application code; it actually increases total bytes slightly due to chunk loader runtime boilerplate. Its value is **temporal**: it defers downloading code that isn't needed right now, accelerating the critical initial page load."
        },
        {
          w: "Dynamic `import()` can only be used for React components.",
          r: "Dynamic `import()` is a native ECMAScript language primitive. It can be used anywhere in JavaScript to lazily load any module, function, or library: e.g., dynamically importing a heavy PDF export library only when the user clicks 'Download PDF'."
        }
      ],

      trade: {
        buys: [
          "Dramatically faster initial load: slashes initial JavaScript payload, accelerating First Contentful Paint (FCP) and LCP.",
          "Long-term caching efficiency: updates to application business logic don't invalidate unchanged vendor library chunks.",
          "On-demand resource loading: heavy features (admin panels, rich text editors, 3D viewers) load only when requested.",
          "Mobile data conservation: users only download the code for the specific features they actually utilize."
        ],
        costs: [
          "Navigation latency: users may experience a brief delay or spinner when navigating to a lazy-loaded route for the first time.",
          "Chunk loading failure risks: network drops or deployment version updates can cause dynamic chunk fetches to fail with 404s.",
          "Suspense boundary requirement: requires wrapping dynamic components in fallback loading indicators to prevent UI crashes.",
          "Testing complexity: automated integration tests must account for asynchronous chunk loading."
        ],
        avoid: [
          "Never code-split tiny 2KB components where chunk overhead exceeds the savings; split at the route or heavy-widget level.",
          "Do not forget to wrap `React.lazy()` components in a `<Suspense>` boundary to prevent uncaught runtime errors.",
          "Avoid code splitting without error boundaries; handle network chunk loading errors gracefully with auto-reload logic.",
          "Never lazily load components above the fold on the initial landing page; keep initial critical UI in the main bundle."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lazy-loading",

      why: {
        before: "Web pages loaded every single image, video, iframe, and script upfront the instant the page loaded, wasting megabytes of cellular data and choking browser network bandwidth on off-screen content that the user might never scroll to see.",
        problem: "Web applications need a strategy to defer the loading of non-critical off-screen resources (images, video streams, heavy components) until the precise moment the user actually needs them or scrolls them near the viewport.",
        shift: "**Lazy Loading: A design pattern in computer programming and web development that defers the initialization of an object or loading of a resource until the point at which it is actually needed.** Standardized natively via the HTML `loading='lazy'` attribute and the browser Intersection Observer API, lazy loading conserves bandwidth and accelerates critical rendering."
      },

      num: {
        t: "Lazy Loading Mechanisms: Images, Media, Components & Native APIs",
        h: ["Resource Type", "Lazy Loading Implementation", "Detection Mechanism", "Browser Overhead", "Core Performance Metric Impact"],
        r: [
          ["Native HTML Images", `<img src='photo.jpg' loading='lazy'>`, "Browser engine viewport threshold calculation", "Zero JavaScript runtime overhead (native C++)", "Massively improves Largest Contentful Paint (LCP)"],
          ["Native HTML iframes", `<iframe src='embed.html' loading='lazy'>`, "Browser engine viewport intersection", "Zero JS; defers heavy third-party embeds (YouTube)", "Drastically reduces Total Blocking Time (TBT)"],
          ["Intersection Observer API", "`new IntersectionObserver(callback, { rootMargin })`", "Asynchronous background GPU compositor intersection", "Minimal JS (off main thread calculation)", "Custom infinite scroll feeds, animated reveal effects"],
          ["Component Lazy Loading", "`React.lazy()` / dynamic `import()`", "Route changes or user click event triggers", "Minimal JS promise resolution", "Shrinks initial bundle size and JavaScript parse time"],
          ["Legacy Scroll Event (Anti-pattern)", "`window.addEventListener('scroll', handleScroll)`", "Synchronous main-thread scroll polling", "Severe (triggers continuous layout reflows and jank)", "Deprecated; completely replaced by IntersectionObserver"]
        ],
        n: "Lazy loading prevents non-essential resources from competing for network bandwidth during the critical initial page load. For images and iframes, modern browsers provide native support via **`<img loading='lazy'>`**: the browser's layout engine monitors the bounding box of the element and triggers the network fetch only when the image comes within a certain physical distance (e.g., $1000\\text{ px}$ above or below) of the viewport, ensuring the image is downloaded before the user scrolls it into view. In JavaScript, the **Intersection Observer API** replaced laggy `scroll` event listeners: it computes element-viewport intersections asynchronously on the browser's compositor thread, firing a callback only when an element enters or exits the target threshold without thrashing the main execution thread."
      },

      miss: [
        {
          w: "You should add `loading='lazy'` to every single image on your web page.",
          r: "Adding `loading='lazy'` to your **hero image (above-the-fold)** is a **catastrophic performance mistake**! Marking an above-the-fold hero image with `loading='lazy'` forces the browser to delay fetching it until the layout pass completes, severely degrading your **Largest Contentful Paint (LCP)** score. Top hero images should be loaded eagerly with `priority` or `<link rel='preload'>`."
        },
        {
          w: "Lazy loading images always requires a third-party JavaScript library.",
          r: "Native lazy loading has been supported in all major browsers (Chrome, Firefox, Safari, Edge) for years via the standard HTML attribute **`loading='lazy'`**, requiring exactly **zero lines of JavaScript**."
        },
        {
          w: "Lazy-loaded images don't need explicit `width` and `height` attributes.",
          r: "Lazy-loaded images **MUST have explicit `width` and `height` (or CSS `aspect-ratio`)**! Without explicit dimensions, the browser treats the unloaded image as $0 \\times 0$ pixels; when the image finally loads, it pushes all subsequent content down, causing massive **Cumulative Layout Shift (CLS)** penalties."
        },
        {
          w: "Search engine bots cannot see or index lazy-loaded content.",
          r: "Modern search engine crawlers (Googlebot) support native lazy loading and resize their virtual viewport to several thousand pixels tall to trigger all `loading='lazy'` and IntersectionObserver callbacks, ensuring all lazy content is indexed."
        }
      ],

      trade: {
        buys: [
          "Bandwidth savings: saves hundreds of megabytes of cellular data by only downloading media the user actually scrolls to.",
          "Accelerated initial page load: frees up network connections and CPU cycles for critical above-the-fold content.",
          "Battery and memory conservation: prevents low-end mobile devices from decoding dozens of off-screen images into RAM.",
          "Zero-JavaScript simplicity: native `loading='lazy'` provides effortless, zero-maintenance media optimization."
        ],
        costs: [
          "Scroll pop-in: aggressive scrolling on slow networks can cause users to see blank placeholders before images load.",
          "Layout shift hazard: omitting explicit image dimensions causes jarring Cumulative Layout Shift (CLS) when images load.",
          "LCP degradation if misused: applying lazy loading to above-the-fold hero images delays the primary page paint.",
          "Placeholder styling requirement: requires designing skeleton loaders or blur-up placeholders for smooth visual aesthetics."
        ],
        avoid: [
          "Never add `loading='lazy'` to the Largest Contentful Paint (LCP) hero image; load it eagerly with high priority.",
          "Do not lazy-load images without setting explicit `width` and `height` attributes or CSS `aspect-ratio` to prevent CLS.",
          "Avoid using legacy `window.addEventListener('scroll')` to implement lazy loading; use native `loading='lazy'` or `IntersectionObserver`.",
          "Never hide critical SEO text content behind lazy-loading components that require user click interaction to mount."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));

/* Career Roadmap — families, phases and the hiring playbook.

   A family is to a role what a category is to a term: the grouping that
   makes twenty cards navigable. Order here drives the roadmap index and
   the family filter.

   The phases below sit above families the same way stages sit above
   tracks — a family says what kind of work it is, a phase says where you
   are in the journey toward doing it for money.
*/

TD.defineFamilies([

  {
    id: "ai",
    name: "AI & Machine Learning",
    short: "AI & ML",
    icon: "brain",
    col: "#7f8cff", colL: "#4d5bd8",
    deck: "Roles that build systems which learn, predict or generate.",
    desc: "The fastest-moving corner of the industry and the one with the widest pay spread. The work splits cleanly in two: people who train models, and people who build products on top of models other people trained. Both are called AI Engineer by recruiters. They are not the same job."
  },

  {
    id: "data",
    name: "Data & Analytics",
    short: "Data",
    icon: "database",
    col: "#3ddc97", colL: "#08976a",
    deck: "Roles that move, model and explain the numbers a business runs on.",
    desc: "The most underrated entry point into tech. Data work has the shortest path from zero to employable, the friendliest interviews, and a straight road into AI once you are inside. If you want a job in six months rather than eighteen, start here."
  },

  {
    id: "soft",
    name: "Software Engineering",
    short: "Software",
    icon: "code",
    col: "#ffb454", colL: "#b46a05",
    deck: "Roles that build the products people actually open and click.",
    desc: "The largest hiring pool in the industry by an enormous margin. For every AI Engineer job posted in India there are roughly fifteen software engineering ones. It is also the surface most AI work eventually has to attach itself to — a model that nobody can click is a research artefact, not a product."
  },

  {
    id: "infra",
    name: "Infrastructure & Security",
    short: "Infra",
    icon: "server",
    col: "#56ccf2", colL: "#0b76b8",
    deck: "Roles that keep it running, keep it fast and keep it safe.",
    desc: "Less glamorous, harder to automate away, and paid accordingly. These roles rarely hire absolute freshers straight off a degree — but they pay a premium once you are two or three years in, and the skills stay valuable across every technology wave."
  },

  {
    id: "edge",
    name: "Product & Specialist",
    short: "Specialist",
    icon: "compass",
    col: "#ff8db4", colL: "#c53d75",
    deck: "Roles where the technical skill is the price of entry, not the job.",
    desc: "For people who are genuinely technical but do their best work in front of humans — deciding what to build, showing customers how, or explaining it to the world. These are excellent second roles and unusual first ones."
  }

]);


/* ======================================================================
   The phases.

   Every technical career passes through the same five phases, whichever
   role sits at the end of it. Roles differ in what you learn; nobody
   differs in the order of learn → build → prove → apply → grow.

     n      the phase number
     name   what this phase is for
     lede   one sentence you can act on today
     time   realistic duration for someone starting from zero
     do     the concrete actions of this phase
     done   how you know you are through it — the exit test
     trap   the way people get stuck here, because most people do
   ====================================================================== */

TD.definePhases([

  {
    n: 1,
    id: "orient",
    name: "Pick a direction and stop shopping",
    lede: "Choose one role. Not a field, a role. Then close every other tab.",
    time: "1–2 weeks",
    do: [
      "Read three role pages here end to end. Not ten — three.",
      "For each, read the *day in the life* and ask honestly whether that day sounds tolerable on a Tuesday in February.",
      "Pick the one where the boring parts bother you least. Everyone likes the exciting parts; the boring parts are what you actually do.",
      "Write the role name on something you will see daily. This is not motivational fluff — it is how you stop re-deciding every fortnight."
    ],
    done: "You can say what you are training to become in one sentence, without hedging, without an 'or'.",
    trap: "Direction-shopping. Six months of comparing AI against data against web is six months of nothing. Every one of these roles pays well. The cost of picking imperfectly is small. The cost of not picking is your entire timeline."
  },

  {
    n: 2,
    id: "found",
    name: "Build the foundation nobody can see",
    lede: "One language properly, plus the concepts underneath it. This is the part everyone skips and everyone regrets skipping.",
    time: "3–5 months",
    do: [
      "One language to real fluency. For almost every role on this page that is Python; for frontend it is JavaScript.",
      "The concepts under the syntax — variables, types, control flow, functions, data structures, errors. Language-independent, learned once, spent forever.",
      "Git from week three. Not week thirty. It makes experimenting free because nothing can ever be lost.",
      "SQL alongside, whatever your role. It is small, it takes a fortnight, and it never goes out of date."
    ],
    done: "You can open a blank file and write a hundred-line program that does something real, without a tutorial open in another window.",
    trap: "Tutorial hell — the loop where you complete courses, feel productive, and cannot write anything unaided. The exit is always the same: close the video and build something badly."
  },

  {
    n: 3,
    id: "spec",
    name: "Go deep on the role's actual stack",
    lede: "Now learn the specific tools the job description lists — and only now, because now they will make sense.",
    time: "3–6 months",
    do: [
      "Work through the skill matrix on your role page, top to bottom. The *must* tier first, entirely, before touching *should*.",
      "Learn each tool by building with it, never by reading about it. A tool you have only read about evaporates in about nine days.",
      "Read real code in your domain — open-source repos, not tutorial repos. This is where taste comes from.",
      "Start following the two or three people who actually publish in your area. The field moves; textbooks lag it by two years."
    ],
    done: "You can read a job description for your role and understand every line of it, even the ones you cannot do yet.",
    trap: "Collecting tools instead of using them. Nobody was ever hired for a list of technologies. They were hired for one thing they built that worked."
  },

  {
    n: 4,
    id: "prove",
    name: "Build proof a stranger can verify",
    lede: "Two or three real projects, deployed, documented, with your reasoning written down. This is your entire case.",
    time: "2–4 months, overlapping phase 3",
    do: [
      "Build two or three substantial projects. Not fifteen small ones — depth reads as competence, breadth reads as a course list.",
      "Deploy them. A project nobody can open is a claim; a link is evidence.",
      "Write a README that explains the problem, your approach, the trade-off you chose and what you would do differently. This document does more hiring work than the code.",
      "Contribute to one open-source project, even trivially. It proves you can work in code you did not write — the single most transferable signal there is.",
      "Solve the interview format too: enough DSA to survive a screen, or SQL and case questions if your role uses those instead."
    ],
    done: "You can send one link that makes a stranger believe you can do the job.",
    trap: "The tutorial-project portfolio. Five projects that are the same five tutorials every other applicant did are worth less than one weird original thing. Build for a problem you personally have."
  },

  {
    n: 5,
    id: "land",
    name: "Run the job hunt like a system",
    lede: "Applying is a process with a conversion rate, not a plea. Run it as one and it stops being demoralising.",
    time: "2–5 months, and it overlaps everything",
    do: [
      "One-page resume, projects above education, every bullet carrying a number.",
      "Referrals over portals — the difference in response rate is not small, it is roughly ten-fold.",
      "Apply in volume and track it. Fifteen a week, logged, reviewed every Sunday.",
      "Keep building while you apply. Every extra month of unemployment is also an extra month of portfolio if you use it.",
      "Take the first decent offer that puts you inside the industry. Your second job is where the money is; your first job's only real task is to exist."
    ],
    done: "You have signed something.",
    trap: "Waiting to feel ready. Nobody feels ready. The job description is a wish list, not a gate — apply at roughly sixty percent match and let them tell you no."
  }

]);


/* ======================================================================
   The hiring playbook — the things that are true across every role in
   the Indian market, kept in one place rather than repeated twenty
   times inside the role files.
   ====================================================================== */

TD.defineCareerGuide({

  /* The disclaimer that has to be visible, not buried. Salary figures are
     estimates of a fast-moving market, and presenting them as anything
     firmer than that would be dishonest. */
  payNote: "Every salary figure on these pages is a fixed-CTC estimate for the Indian market as of early 2026, gathered from public job postings, published levels data and reported offers. Treat them as ranges and as bargaining context — not as quotes. Real offers swing hugely with city, company tier, your interview performance and how badly they need someone that month.",

  truths: [
    {
      t: "Your first job is a door, not a destination",
      d: "Freshers routinely turn down ₹6 LPA waiting for ₹15 and end up at zero for another year. Inside the industry, your second job typically lands 60–120% above your first, and it arrives in eighteen months. Optimise for getting in and for what you will learn there — not for the opening number."
    },
    {
      t: "Referrals beat portals by roughly ten to one",
      d: "A cold application on a job portal converts to a callback around 2–3% of the time. A referral from someone inside converts around 25–30%. The work of finding one person to refer you is worth more than a hundred more applications."
    },
    {
      t: "Projects outrank marks after your first job — and often before it",
      d: "CGPA matters for campus placement filters and for a handful of service-company cutoffs, and then it stops mattering forever. A deployed project with a thoughtful README outperforms a 9.2 with nothing to show, in almost every non-campus process."
    },
    {
      t: "Tier-1 college is an advantage, not a requirement",
      d: "It changes which doors open without effort. It does not close any door permanently. Product companies hire from everywhere; they filter on the interview, and the interview does not know where you studied. Off-campus hiring is a slower road with the same destination."
    },
    {
      t: "The AI job title you want may need experience you can get elsewhere",
      d: "Very few companies hire a true fresher into a pure AI research role. Many hire freshers into data analyst, data engineer, backend and ML-adjacent roles — and internal moves into AI teams from those are extremely common at the 18–30 month mark. The side door is a real door."
    },
    {
      t: "Interviews test a format, not your ability",
      d: "This is unfair and it is also fixable. The DSA round, the SQL round, the system design round — each is a learnable game with a known question distribution. Two months of deliberate practice on the format moves you more than another year of general skill."
    }
  ],

  /* The resume section, because almost every fresher's is the same and
     almost every one of them is beaten by the same three fixes. */
  resume: [
    { t: "One page. Always one page.", d: "You do not have two pages of experience yet, and a recruiter reads yours for six to eight seconds. Two pages means the second is unread and the first is diluted." },
    { t: "Projects go above education", d: "Unless you are still in a campus placement process, the projects section is your strongest evidence and it belongs where the eye lands first." },
    { t: "Every bullet needs a number", d: "\"Built a recommendation system\" is a claim. \"Built a recommender over 50k ratings; cut cold-start error 23% against a popularity baseline\" is evidence. Same project, entirely different reader." },
    { t: "Name the stack, in their words", d: "Real screening still runs on keyword matching, human or automated. If the posting says PyTorch and you wrote 'deep learning frameworks', you have made yourself invisible for no reason." },
    { t: "Link everything", d: "GitHub, live demo, one written piece. Every link is a chance for a stranger to convince themselves, without you in the room." },
    { t: "Cut the skill bars", d: "Nobody believes you are 85% at Python. Rating yourself out of five tells a reader nothing except that the space could have held a project." }
  ],

  /* The maths of a job hunt, because the single most common cause of
     giving up is not knowing what normal looks like. */
  funnel: [
    { k: "Applications sent", v: "100", d: "A normal month for a serious fresher hunt is 60–120." },
    { k: "Replies of any kind", v: "10–15", d: "Higher with referrals, lower on portals alone. Silence is the default, not a verdict." },
    { k: "First-round interviews", v: "6–10", d: "This is the number to optimise. It responds to resume quality and referrals more than to skill." },
    { k: "Final rounds", v: "2–4", d: "From here it is preparation and nerve, both trainable." },
    { k: "Offers", v: "1–2", d: "One offer from a hundred applications is a normal, successful hunt — not a failure." }
  ],

  /* Where money actually comes from, ranked, because freshers systematically
     over-index on the first item and under-index on the rest. */
  levers: [
    { t: "Switching companies", d: "+40 to +110%", n: "The single largest lever in Indian tech, and it is available every 18–24 months early on. Internal raises rarely exceed 10–15%." },
    { t: "City", d: "+15 to +40%", n: "Bengaluru, Hyderabad, Gurugram and Pune pay meaningfully above tier-2 cities for the same role. Remote work has narrowed this, not closed it." },
    { t: "Company tier", d: "2× to 4×", n: "The same job title at a global product company and at a mass-hiring service company are different pay universes. Tier is the biggest single multiplier on your number." },
    { t: "Provable specialisation", d: "+20 to +50%", n: "Generalists are abundant. Someone who has demonstrably shipped RAG systems, or optimised inference, or owns a data platform, is not." },
    { t: "Negotiating at all", d: "+8 to +20%", n: "Most freshers accept the first number. Asking politely once, with a competing offer or a market figure in hand, is the highest hourly-rate work of your career." }
  ]

});

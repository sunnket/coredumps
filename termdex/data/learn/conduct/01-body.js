/* Professional Presence — how a body is read.

   The most-used and least-taught skill in the profession. Everything here
   is either a measurable physical cost or a signal other people demonstrably
   respond to; nothing is included because it is traditional. */
TD.addLessons("conduct", [

  {
    t: "How to Sit — the eighty thousand hours nobody prepares you for",
    m: "body",
    lvl: "core",
    s: "The neutral seated posture joint by joint, the four ways it goes wrong, and the one habit that matters more than all of the angles put together.",
    goal: [
      "Set up any chair you are handed in under two minutes",
      "Recognise your own default fault by name, and correct it without thinking about it",
      "Understand why the correct posture still is not enough on its own"
    ],
    b: [
      { p: "An engineer sits for roughly eighty thousand hours across a working life. Almost nobody is ever shown how, and the result is the occupational injury profile of the profession: low back pain, neck pain, and a wrist that starts complaining somewhere around the fourth year." },

      { p: "None of this is exotic. The whole of it is a handful of joint angles you can set once and a habit you have to keep, and the habit turns out to matter more than the angles." },

      { h: "The reference posture" },

      { p: "There is no single correct way to sit, and anybody selling you one is overselling. What there is, is a **neutral** posture — the arrangement in which no joint is at the end of its range and no muscle is working to hold you up. It is the position everything else is measured against and the one to return to." },

      { dg: "sit-neutral" },

      {
        tbl: {
          t: "What each check is actually protecting",
          h: ["Check", "Set it to", "What it prevents"],
          rows: [
            ["**Feet**", "Flat on the floor, taking real weight", "Feet dangling put the whole leg's weight on the underside of the thigh, which compresses the vessels there"],
            ["**Knees**", "Level with the hips or a little lower", "Knees above the hips roll the pelvis backwards, and the low back follows it into a C"],
            ["**Hips**", "Right at the back of the seat", "Sitting forward means the backrest is decorative and your muscles are doing its job"],
            ["**Elbows**", "About 90 degrees, close to the body", "Reaching forward loads the shoulders continuously for hours"],
            ["**Wrists**", "Flat, floating, not resting on an edge", "The classic path to wrist and forearm pain is a hard desk edge plus an angled keyboard"],
            ["**Screen**", "Top at or just below eye level, an arm away", "Everything above the shoulders. This one is covered properly in its own lesson"]
          ]
        }
      },

      { n: "Set the chair by height first, always. Adjust the seat until your **elbows** are level with the desk, then fix the feet — with a footrest, a box, or a ream of paper — rather than lowering the chair to reach the floor. Chair height is set by the desk, not by your legs. Almost everybody does this backwards.", nt: "The order that saves ten minutes of fiddling" },

      { h: "The four faults" },

      { p: "Every bad sitting posture an engineer produces is one of four, and each one is comfortable, which is exactly why it wins. Find yours here; you almost certainly have a default." },

      { dg: "sit-faults" },

      { trap: "The most common self-correction is worse than the fault. Told to sit up straight, people **arch the low back and pull the shoulders back**, which swaps a rounded spine for a hyper-extended one and tires out within four minutes. Neutral is not military. The ribs stay down, the shoulders stay heavy, and it should feel like *less* effort than what you were doing, not more." },

      { h: "The habit that beats the posture" },

      { p: "Here is the part that undoes most of the anxiety about all of the above. In studies of seated work, the strongest predictor of discomfort is not which posture somebody holds — it is **how long they hold any one of them**. Loaded tissue needs to be unloaded periodically, and a perfect posture held for three hours is worse than a mediocre one you keep leaving." },

      { ana: "Think of your chair the way you think of a long-running process: the problem is never the first minute, it is that nothing ever releases. Standing up is the release. Half an hour is the interval that most guidance converges on, and even sixty seconds counts.", at: "The leak, not the allocation" },

      {
        vs: {
          t: "Two ways to think about it",
          bad: { label: "The trap", c: "Find the one correct posture.\nHold it.\nFeel guilty when you stop.\nGive up in a week.", w: "Treats posture as a state to be achieved. It cannot be maintained, so it fails, and the failure feels personal." },
          good: { label: "The working version", c: "Set the chair once, properly.\nDefault to neutral.\nMove every half hour.\nChange position freely in between.", w: "Treats posture as a range to move within. Nothing to maintain, nothing to fail at, and it happens to be what the evidence supports." }
        }
      },

      { h: "Things that are not worth worrying about" },

      {
        l: [
          "**Crossing your legs occasionally.** It is a position change, and position changes are the goal. Living in it, always crossed the same way, is the part that skews the pelvis.",
          "**Sitting on the floor, or cross-legged, if that is what you grew up doing.** It is a perfectly good hip position. The same rule applies: change it before it sets.",
          "**Expensive chairs.** A chair you have adjusted beats a famous chair you have not. The single most common finding in any office is an excellent chair at factory settings.",
          "**Standing desks as a cure.** Standing all day produces its own set of complaints. The benefit is in the alternation, which is the same principle as everything else here."
        ]
      },

      {
        tryit: {
          t: "Two minutes, on the chair you are in now",
          task: "Run the setup in order and write down what you actually had to change. Most people find two of the six were wrong and had been wrong for years.",
          hint: "Elbows to desk height first. Then feet. Then hips to the back of the seat. Then the screen.",
          sol: { lang: "text", code: "1  Raise or lower the seat until your elbows are level with the desk.\n2  If your feet now dangle, put something under them. Anything flat.\n3  Slide your hips right back into the seat. Use the backrest.\n4  Drop the armrests until your shoulders are not being pushed up.\n5  Raise the screen until its top edge is at eye level.\n6  Push the screen back to roughly an arm's length away.\n\nThen set a repeating half-hour reminder, because step 7 is the\nonly step that actually needs willpower." },
          w: "The steps are ordered by dependency: seat height changes where your feet land, and screen height depends on where your eyes ended up. Doing them out of order is why people fiddle for ten minutes and end up worse."
        }
      }
    ],
    k: [
      "Neutral posture is where no joint is at the end of its range and nothing is being held up by effort.",
      "Set chair height from the desk and your elbows, then fix the feet. Never the other way round.",
      "The four faults are the slump, the perch, the crane and the lean. You have a default; learn to recognise it.",
      "Sitting up straight, done the usual way, replaces one bad posture with another. The ribs stay down.",
      "How long you hold a posture matters more than which posture it is. Stand up every half hour."
    ],
    r: ["Technical Debt"]
  },

  {
    t: "Standing, Walking and Taking Up Space",
    m: "body",
    lvl: "core",
    s: "The standing plumb line, what to do with your hands when there is nothing to do with them, and how to walk into a room you were not sure you belonged in.",
    goal: [
      "Stand for twenty minutes without shifting, locking or fidgeting",
      "Have a default resting position for your hands that does not look defensive",
      "Enter a room at a pace and posture that reads as belonging there"
    ],
    b: [
      { p: "Standing badly is less damaging than sitting badly and considerably more visible. It is also the posture you are in during every moment that carries social weight: the introduction, the whiteboard, the presentation, the first ten seconds of an interview." },

      { h: "The plumb line, and the handshake it leads to" },

      { dg: "stand-shake" },

      {
        l: [
          "**Weight over the midfoot**, split evenly. Not on the heels, which pushes the hips forward and the chest back; not on one leg, which is the hip-cocked stance that reads as impatience.",
          "**Knees soft.** Locked knees are the single most common standing fault and the reason people occasionally faint during long presentations.",
          "**Ribs down, shoulders heavy.** The military chest is a held position and it shows within a minute.",
          "**Chin level.** Not lifted, which reads as looking down at people, and not tucked, which reads as apologising."
        ]
      },

      { h: "Where the hands go" },

      { p: "The question nobody asks out loud. Standing with nothing to hold is genuinely uncomfortable the first few times, and every uncomfortable solution to it is legible to everyone in the room." },

      {
        tbl: {
          t: "The resting positions, ranked",
          h: ["Position", "Reads as", "Use it"],
          rows: [
            ["**Loosely at your sides**", "Neutral, settled, nothing to hide", "The default. Feels strange for about a week and then stops."],
            ["**Lightly clasped in front, low**", "Composed, formal", "Listening, waiting, a formal introduction. Keep it low and loose."],
            ["**One hand holding a notebook or cup**", "Occupied, relaxed", "The genuinely useful trick: give the hands a job and the problem disappears."],
            ["**Gesturing while speaking**", "Engaged, credible", "Do not suppress this. Gesture inside the box between your shoulders and your waist."],
            ["**Arms folded**", "Closed, or cold, or bored", "Almost never. It is comfortable and it costs you."],
            ["**Hands in pockets**", "Casual to dismissive, depending on the room", "Fine among peers, wrong in front of clients, wrong in an interview."],
            ["**Clasped behind the back**", "Formal to the point of stiff", "Rarely useful outside a parade."],
            ["**Fig-leaf clasp, low and in front**", "Defensive", "The one to actively unlearn. Raise the hands and loosen them."]
          ]
        }
      },

      { n: "If you talk with your hands, keep doing it. Suppressed gesture is one of the few things that makes a speaker measurably harder to follow, because the gestures are doing real work in structuring what you say. The only adjustment worth making is **scale** — big enough to be seen from the back of the room, contained enough not to be the story.", nt: "Do not sit on your hands" },

      { h: "Walking in" },

      {
        ol: [
          "**Pause at the threshold for one beat.** Not a hesitation — a scan. You are finding out who is in the room and where the space is.",
          "**Walk at a normal pace.** Rushing signals lateness even when you are early; strolling signals indifference. Normal is the whole instruction.",
          "**Look at people before you look at the chairs.** The eyes going straight to the seat is what makes an entrance look nervous.",
          "**Greet before you settle.** Bag down, coat off, phone away — but after the greeting, not before it.",
          "**Sit last, or at least not first**, if you are the guest. Wait to be shown, or ask. It takes two seconds and it never looks wrong."
        ]
      },

      { trap: "The most common entrance mistake is doing everything in the wrong order: coming in, putting a bag down, taking out a laptop, sitting, and *then* saying hello to the room from a seated position. It reads as though the equipment mattered more than the people. Greet first, unpack second, every time." },

      { h: "The handshake, in the four seconds it lasts" },

      {
        l: [
          "**Stand up for it.** Always, regardless of who is arriving. Remaining seated for a handshake is one of the few gestures that reliably reads as rude across every culture that shakes hands at all.",
          "**Web to web.** The soft crease between thumb and index finger should meet theirs. Grip the fingers only and you get the limp handshake everybody complains about.",
          "**Vertical palm.** Turning your palm downward is a dominance display, and enough people know it that it is worth avoiding by accident.",
          "**Firm, matched to theirs, two or three pumps, about two seconds.** Then let go. The crushing grip is not a strong handshake, it is a tell.",
          "**Say the name back.** *Good to meet you, Priya.* It fixes the name in your memory and it is the single warmest thing you can do in four seconds."
        ]
      },

      { n: "Not everybody shakes hands, and the exceptions are not exotic. Some people do not shake hands with the opposite sex for religious reasons; some cultures bow or press palms; some people have arthritis, or a hand injury, or simply prefer not to. **Offer, and read the response instantly.** If a hand does not come out, convert yours into a nod and a smile without the smallest flicker of comment. Recovering gracefully from this is far more impressive than the handshake would have been.", nt: "When the hand does not come" },

      {
        tryit: {
          t: "The mirror test",
          task: "Stand as you normally do and look at yourself sideways in a mirror or a dark window. Find the plumb line: ear, shoulder, hip, knee, midfoot. Which one of the five is out?",
          hint: "For most people who work at a screen, it is the ear, and it is forward.",
          sol: { lang: "text", code: "The usual answer, in order of how often it comes up:\n\n1  Ear forward of the shoulder      the screen posture, standing up\n2  Hips pushed forward, weight on heels   the phone-scrolling stance\n3  One hip cocked                     the waiting-in-a-queue habit\n4  Knees locked                       almost always unconscious\n5  Shoulders rolled forward           usually follows number 1" },
          w: "You are looking for one thing, not five. Fixing the ear position tends to drag the shoulders back with it, so start at the top and check again."
        }
      }
    ],
    k: [
      "Weight over the midfoot, knees soft, ribs down, chin level. Five points on one line.",
      "Hands loosely at your sides is the default; giving them an object to hold is the shortcut.",
      "Do not suppress gesture — adjust its size. Suppressed gesture makes you harder to follow.",
      "Greet the room before you unpack. Order matters more than anything you say.",
      "Stand up for a handshake, meet web to web, keep the palm vertical, and say the name back."
    ],
    r: ["Standup"],
    drill: {
      lang: "text",
      reps: 2,
      items: [
        { c: "Good to meet you, Priya.", w: "the name said back during the handshake", hint: "greeting, then the name" },
        { c: "Thanks for making the time — where would you like me to sit?", w: "the line that solves the seating question in a room you do not know" }
      ]
    }
  },

  {
    t: "What Your Body Says Before You Do",
    m: "body",
    lvl: "intermediate",
    s: "Open and closed, the honest joint, where to look and for how long, and the distance rule nobody will ever tell you that you are breaking.",
    goal: [
      "Read whether a conversation is still alive from three signals that are hard to fake",
      "Hold eye contact at a length that reads as attention rather than as a stare",
      "Know the working distance and notice, in the moment, when you have broken it"
    ],
    b: [
      { p: "This is the part of the track most likely to attract nonsense, so it is worth being precise about what is and is not known. **Individual gestures do not have fixed meanings.** Folded arms can mean defensiveness or it can mean the room is cold. Nobody can read a mind from a single tell, and anybody claiming otherwise is selling something." },

      { p: "What is true and useful is narrower: certain configurations of the whole body reliably *affect how you are perceived*, whatever they say about your inner state — and a small number of signals are hard enough to control that they leak. Those are worth knowing. The rest is folklore." },

      { h: "Open and closed" },

      { dg: "body-read" },

      { p: "The distinction is not moral, and closed is not a character flaw. It is simply that the open configuration makes people more likely to keep talking to you, and the closed one makes them more likely to wrap up. On days when you want the conversation to continue, the arms are the cheapest lever you have." },

      { n: "**Feet are the honest joint.** People manage their face first, their hands second, and their feet essentially never. In a group conversation, whoever's feet are pointed at you is actually engaged with you; if a person's shoulders are turned toward you but their feet are aimed at the door, the conversation is finished and only politeness is still running. Close it yourself and you will be remembered as perceptive rather than as someone who did not notice.", nt: "The tell worth knowing" },

      { h: "Eye contact, with actual numbers" },

      { p: "*Make more eye contact* is useless advice, because it names no target and no duration. Here are both." },

      { dg: "gaze-map" },

      {
        tbl: {
          t: "The three gaze triangles",
          h: ["Triangle", "Where you are looking", "When"],
          rows: [
            ["**Business**", "The two eyes and the middle of the forehead", "Work. All of it. Meetings, interviews, reviews, clients."],
            ["**Social**", "The two eyes and the mouth", "Friendly conversation, informal chat, after the meeting."],
            ["**Intimate**", "The eyes and anything below the chin", "Never at work, and the drop of the gaze is far more noticeable to the other person than it feels to you."]
          ]
        }
      },

      { trap: "The commonest error is breaking eye contact **downward**. Across a lot of cultures a downward break reads as submission, evasion or discomfort, and it is precisely what people do when they are nervous — which is when they can least afford it. Break sideways instead. It reads as thinking rather than as retreating, and it is a genuinely easy habit to swap." },

      { p: "Two more practical notes. First, **the 50/70 pattern**: roughly half the time while you are speaking, roughly seventy per cent while you are listening. Most nervous speakers have it exactly backwards — they stare while talking and look away while being talked to, which is the combination that feels least comfortable to the other person. Second, in front of a **panel**, give one complete thought to one person, then move. Sweeping the room mid-sentence looks like scanning for approval." },

      { n: "Eye contact norms vary more than almost anything else in this track. In much of East Asia, sustained direct eye contact with a senior person can read as challenging rather than as attentive, and a lowered gaze is respect rather than evasion. Several cultures maintain far less of it between people of different rank or gender than a Western handbook assumes. **Match the room; do not import a rule into it.**", nt: "Where this rule does not travel" },

      { h: "Distance" },

      { dg: "space-zones" },

      { p: "Standing too close is unique among workplace offences in that literally nobody will ever tell you that you are doing it. They will simply find your company slightly unpleasant and never work out why, and neither will you. The tell is entirely reliable: **they step back and you step forward.** If that happens once, you have your answer. Hold the new distance and do not close it again." },

      {
        tryit: {
          t: "Three days of noticing",
          task: "For three days, notice only one thing per day: day one, where people's feet point; day two, whether you break eye contact up, down or sideways; day three, whether anybody steps back from you. Write nothing down until the end of each day.",
          hint: "One signal per day. Trying to watch all three at once means watching none of them.",
          sol: { lang: "text", code: "What people usually find:\n\nDay 1  At least one conversation was over long before it ended,\n       and the feet had said so for several minutes.\n\nDay 2  The break is downward, and it happens most on the\n       sentences you are least sure about.\n\nDay 3  Either nobody steps back, in which case stop worrying,\n       or one specific person always does — and now you know." },
          w: "The point of separating the days is that self-observation is expensive. Watching one channel is a habit you can actually run in a real conversation; watching three makes you a worse conversationalist for the duration."
        }
      }
    ],
    k: [
      "Single gestures do not have fixed meanings. Whole configurations affect how you are perceived — that is the useful part.",
      "Open beats closed when you want a conversation to continue. Feet are the signal people cannot manage.",
      "Business gaze at work: the eyes and the forehead, never below the chin.",
      "Fifty per cent while speaking, seventy while listening, and break sideways rather than down.",
      "The working distance is about a metre. If someone steps back, hold the new distance permanently."
    ],
    r: ["Pair Programming"]
  }

]);

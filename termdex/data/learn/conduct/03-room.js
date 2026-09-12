/* Professional Presence — rooms, greetings and meetings. */
TD.addLessons("conduct", [

  {
    t: "The First Ninety Seconds — entering, greeting and names",
    m: "room",
    lvl: "core",
    s: "The order of operations for walking into any room, the introduction that works in every register, and a method for remembering names that actually holds.",
    goal: [
      "Enter a room you have never been in and know exactly what to do first",
      "Introduce yourself in one sentence that lands in any setting",
      "Remember four names from a single round of introductions"
    ],
    b: [
      { p: "The first ninety seconds are over before anything of substance has been said, and they set the frame that everything afterwards is heard through. They are also almost entirely procedural, which makes them the easiest part of this whole track to fix." },

      { h: "The order of operations" },

      {
        ol: [
          "**Arrive early enough to be settled.** Five minutes early for an internal meeting, ten for an interview, fifteen for a client office where you have to sign in. Being on time and flustered is worse than being three minutes early and calm.",
          "**Phone away before the door.** Not silenced in the room — away, in a pocket or a bag, before you cross the threshold. Walking in mid-scroll is the single most common entrance error and it is completely visible.",
          "**Pause for a beat and read the room.** Who is here, who is the host, where is the space.",
          "**Greet before you unpack.** Hello, hand, name, in that order. The bag goes down afterwards.",
          "**Take the seat you are offered**, or ask for one. *Where would you like me to sit?* has never once landed badly.",
          "**Settle deliberately.** Laptop out or not, notebook open, water, then still. Fidgeting with equipment during the first two minutes reads as nerves whether or not it is."
        ]
      },

      { trap: "Arriving *very* early is its own error, and a surprisingly common one before interviews. Turning up twenty-five minutes early puts a receptionist in an awkward position and often a host too. Get to the building early; arrive at the desk five to ten minutes before the time." },

      { h: "The self-introduction" },

      { p: "One sentence, three parts: **who you are, what you do, and why you are in this room.** It works everywhere because the third part changes and the first two do not." },

      {
        syn: {
          t: "The one-sentence introduction, labelled",
          parts: [
            { p: "Hi, I am Aryan", w: "**Name.** First name in most settings; add the surname in formal ones and with clients." },
            { p: " — " },
            { p: "I work on the payments backend", w: "**What you do**, in ordinary words. Not your job title, which is meaningless outside your company, and not your tech stack." },
            { p: ". " },
            { p: "I am here for the schema review", w: "**Why you are in this room.** The part everybody forgets and the part everybody actually wanted." },
            { p: "." }
          ],
          after: "Around fifteen words. It works in a meeting, at a conference, in a lift, and in an interview with only the third clause changing."
        }
      },

      {
        vs: {
          t: "The same person, twice",
          bad: { label: "The usual", c: "Hi, I am Aryan, I am a Senior Software Engineer II\nin the Platform Enablement organisation, I have\nfour years of experience mainly in Java and Spring\nBoot and some Kubernetes, and I have worked on a\nfew different things.", w: "Thirty-eight words, an internal job title nobody outside the company can decode, a technology list, and no reason for being in the room. The listener has nothing to reply to." },
          good: { label: "The working version", c: "Hi, I am Aryan — I work on the payments backend.\nI am here because the schema change touches our\nservice.", w: "Twenty words. Everybody now knows what you do, why you are present, and what to ask you about. The detail comes out later, when somebody wants it." }
        }
      },

      { h: "Names" },

      { p: "Forgetting a name immediately is not a memory failure. It is an attention failure: at the moment somebody says their name you are usually thinking about your own introduction, so the name is never encoded at all. The fix is procedural rather than mnemonic." },

      {
        ol: [
          "**Decide, before they speak, that you are going to catch the name.** This one step does most of the work.",
          "**Say it back immediately.** *Priya — good to meet you.* You have now heard it twice and produced it once.",
          "**Use it once more within the first two minutes.** *So Priya, are you on the platform side?*",
          "**Attach it to something already in your head** — a person you know, a place, the thing they just said they work on. Any hook will do; it does not have to be clever.",
          "**Write the four names down** as soon as you are seated, next to where each person is sitting. In a meeting this is entirely normal and nobody has ever objected."
        ]
      },

      { n: "If you miss it, ask straight away: *Sorry, I did not catch your name.* Asking within thirty seconds costs nothing. Asking in week three costs a little. Never asking, and spending a year addressing somebody as *mate*, costs the most and is what most people actually do.", nt: "The thirty-second window" },

      { h: "Names that are not from your own language" },

      {
        l: [
          "**Ask how it is said, once, and then say it properly.** *Am I saying that right?* is welcomed almost universally, because most people with a name outside the local norm have spent their whole life being approximated at.",
          "**Do not offer a nickname you invented.** Shortening somebody's name because you find it long is a small act with a long memory attached to it.",
          "**Use whatever they introduce themselves as.** If a person says a shortened form, that is the answer; if they use the full form, use the full form.",
          "**Get the order right.** In several cultures the family name comes first. If you are unsure, ask which name they would like you to use, which sidesteps the whole question."
        ]
      },

      {
        tryit: {
          t: "Four names, one round",
          task: "In your next meeting with people you do not know, catch every name using the five steps, and write them down in seating order. Check yourself at the end by naming everybody silently.",
          hint: "The decision to catch the name has to be made before the first person speaks.",
          sol: { lang: "text", code: "What usually happens the first time:\n\nName 1  caught, because you were ready\nName 2  caught\nName 3  lost, because you started composing your own\n        introduction somewhere in the middle of it\nName 4  caught\n\nThe third one is the diagnostic. Names are lost during the\nsentences where you are rehearsing rather than listening, which\nis also where most other things in a meeting are lost." },
          w: "The failure is almost never at the first name and almost always at the one just before your own turn to speak. Once you know that, you can spend attention there deliberately."
        }
      }
    ],
    k: [
      "Phone away before the threshold, greet before you unpack, sit where you are offered.",
      "One-sentence introduction: who you are, what you do in plain words, and why you are in this room.",
      "Job titles do not travel outside a company. What you work on does.",
      "Names are lost to attention, not memory. Decide to catch it, say it back, use it once more, write it down.",
      "Ask how an unfamiliar name is pronounced. Never invent a shortening."
    ],
    r: [],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Hi, I am Aryan — I work on the payments backend. I am here for the schema review.", w: "the three-part self-introduction: name, what you do, why you are here" },
        { c: "Sorry, I did not catch your name.", w: "the repair, used inside the first thirty seconds" },
        { c: "Am I saying that right?", w: "the pronunciation check, asked once, early" }
      ]
    }
  },

  {
    t: "How to Behave in a Meeting",
    m: "room",
    lvl: "intermediate",
    s: "Where to sit and what it signals, when to speak, what to do with a laptop, and how to disagree in a room without it becoming a thing.",
    goal: [
      "Choose a seat deliberately rather than taking whatever is nearest",
      "Contribute at least once in every meeting you are in, without waiting for a gap that never comes",
      "Disagree with somebody more senior in a way that leaves both of you intact"
    ],
    b: [
      { p: "Meetings are where a lot of technical people quietly lose ground, not because they have nothing to say but because the room has rules nobody stated. Most of them are about geometry and timing rather than content." },

      { h: "Where to sit" },

      { dg: "seat-map" },

      { p: "The short version, if you are not running the meeting and not the guest of honour: **a long side, one seat in from the end, on the side that lets you see the door.** You are in the working part of the table, you are visible to the chair without being opposite them, and you can see who arrives. It is the least dramatic seat in the room and the best one for actually taking part." },

      { n: "In many parts of the world the guest is walked to a seat and the host takes the end. If somebody indicates a chair, take it, even if it is the one this lesson advises against. Being led to a seat and then choosing a different one is a much louder signal than any seat could be.", nt: "When you are shown a chair" },

      { h: "The laptop question" },

      {
        tbl: {
          t: "Open or closed",
          h: ["Situation", "Laptop", "Why"],
          rows: [
            ["**Working meeting, your team**", "Open is fine", "Everybody is referencing things. The norm is set and it is shared."],
            ["**You are presenting or driving**", "Open, obviously", "But share the screen deliberately rather than narrating your own desktop."],
            ["**One-to-one**", "Closed, unless you agreed otherwise", "There is nowhere for the attention to go and the other person can see exactly where yours is."],
            ["**Client meeting**", "Closed, or a notebook", "A laptop screen is a wall. They cannot see what is on it and will assume the worst."],
            ["**Interview**", "Closed. Notebook and pen", "Every single time."],
            ["**Any meeting where somebody is being given hard news**", "Closed", "This one is not about productivity."]
          ]
        }
      },

      { trap: "Typing while somebody is speaking reads as *not listening*, even when you are taking notes about exactly what they are saying. If you are going to type, say so once at the start — *I take notes on the laptop, I am with you* — and the whole problem disappears for the rest of the meeting." },

      { h: "Speaking" },

      { p: "The most common pattern among competent people in meetings is waiting for a clean gap, never finding one, and leaving with the contribution still in their head. Gaps do not appear; they are taken. Three ways to take one that do not require interrupting anybody mid-sentence:" },

      {
        l: [
          "**Speak in the first five minutes.** Anything — a question, an agreement, a clarification. Having spoken once makes speaking again vastly easier, and the longer you go silent the higher the barrier gets.",
          "**Signal before you speak.** A small hand movement, leaning in, or an audible in-breath. In practice people yield to it, and it costs nothing if they do not.",
          "**Use a hinge.** *Can I add one thing to that?* / *Before we move on —* / *Building on what Priya said,* — a short opener that claims the floor without cutting anybody off mid-thought."
        ]
      },

      { n: "In a video meeting, none of the physical signals work and the audio delay eats the natural gaps. Use the chat to claim the floor, or the raise-hand button, or simply say the person's name first — *Sam, quick one* — which cuts through in a way that starting your sentence does not.", nt: "Why this is harder on video" },

      { h: "Disagreeing" },

      {
        vs: {
          t: "The same disagreement, two ways",
          bad: { label: "How it usually comes out", c: "I do not think that will work.\nWe tried that on the old service and it failed.", w: "Opens with the verdict. The other person now has to defend a position rather than examine a problem, and everybody else in the room has to pick a side." },
          good: { label: "The version that changes minds", c: "I like the direction. Can I test one part of it?\nWhen we did something similar on the old service,\nthe write volume was the thing that got us. Do we\nknow what that looks like here?", w: "Concede, then locate the disagreement precisely, then hand it back as a question. Nobody is defending anything, and the actual issue is now on the table where the room can look at it." }
        }
      },

      {
        l: [
          "**Disagree with the idea, by name, not with the person.** *That approach* rather than *your approach*.",
          "**Concede something real first.** Not a formality — find the part you genuinely agree with, because it tells the room you were listening rather than waiting.",
          "**Bring evidence or bring a question, never just a feeling.** A feeling is unanswerable and therefore unarguable, which makes it the least persuasive thing in the room.",
          "**Never say *with respect*.** Everybody in every English-speaking workplace knows what follows it.",
          "**Lose gracefully and mean it.** *Fair enough, let us go with that* — and then actually support the decision. This is the behaviour that gets people invited back into rooms."
        ]
      },

      { h: "Ending" },

      { p: "The last two minutes decide whether the meeting produced anything. If nobody else does it, do it yourself: *So to summarise — Priya is doing X by Friday, I am doing Y, and we are parking Z until the numbers are in. Have I got that right?* It takes fifteen seconds, it is never unwelcome, and it is one of the fastest ways for a junior person to become visibly useful." },

      {
        tryit: {
          t: "One meeting, three changes",
          task: "In your next meeting: choose your seat deliberately, speak once within the first five minutes, and summarise the actions at the end. Notice what happens.",
          hint: "The first contribution does not have to be clever. A clarifying question counts.",
          sol: { lang: "text", code: "The three, in order of how uncomfortable they feel and how\nmuch they return:\n\nSeat        costs nothing, feels like nothing, changes how often\n            you are looked at\nEarly word  the only genuinely hard one. It gets easier from\n            the second meeting and stops being a thing by the fifth\nSummary     feels presumptuous the first time and is welcomed\n            every time. It is the highest-return fifteen seconds\n            available to anybody junior in any meeting" },
          w: "They are ordered deliberately: the seat is free, the early word is the barrier, and the summary is the one that gets remembered afterwards."
        }
      }
    ],
    k: [
      "Long side, one in from the end, door in view. Unless somebody shows you to a chair, in which case take that one.",
      "Laptop closed in one-to-ones, client meetings and interviews. If you type notes, say so once.",
      "Speak in the first five minutes. The barrier only rises with silence.",
      "Concede first, name the idea rather than the person, and bring a question rather than a feeling.",
      "Summarise the actions at the end. Fifteen seconds, always welcome, disproportionately remembered."
    ],
    r: ["Standup", "Retrospective"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "I like the direction. Can I test one part of it?", w: "the opener that disagrees without putting anyone on the defensive" },
        { c: "So to summarise — Priya has X by Friday, I have Y, and Z is parked. Have I got that right?", w: "the end-of-meeting summary, offered by whoever notices it is missing" },
        { c: "Can I add one thing to that?", w: "the hinge that claims the floor without interrupting" }
      ]
    }
  },

  {
    t: "The Video Call — the room you are in most",
    m: "room",
    lvl: "core",
    s: "Camera height, framing, light, audio and the etiquette of a medium that removes every signal the previous two lessons relied on.",
    goal: [
      "Set up a camera position and light source once, and stop thinking about it",
      "Be understood on a bad connection without repeating yourself",
      "Handle the situations video creates that a room does not"
    ],
    b: [
      { p: "For a large share of engineers, video is now the majority of professional presence. It also strips out almost everything the room gave you for free: distance, feet, peripheral vision, the natural rhythm of turn-taking. What is left is a small rectangle, and the rectangle is entirely under your control." },

      { h: "The rectangle" },

      { dg: "video-frame" },

      { p: "The default laptop-on-a-desk position is a camera roughly twenty centimetres below your eyes, pointing up. It is unflattering in a way that has nothing to do with your face — it is the same lens geometry that makes any subject look like that — and it puts your head at the bottom of the frame with a ceiling above it. Raising the laptop fixes the whole thing in one move, and it is the same move the workstation lesson asks for anyway." },

      {
        tbl: {
          t: "Set once, forget",
          h: ["Thing", "Set it to", "Why it matters"],
          rows: [
            ["**Camera height**", "Level with your eyes", "The single largest improvement available, and it is free"],
            ["**Framing**", "Head and shoulders, eyes on the upper third", "Too close is confrontational, too far reads as absent"],
            ["**Distance**", "About an arm's length", "Lenses distort badly up close; nobody needs your face at that scale"],
            ["**Light**", "In front of you, ideally a window", "A window behind you makes a silhouette and no camera can recover from it"],
            ["**Background**", "Tidy and boring, or a plain blur", "It is on screen for the entire call. Boring is the goal"],
            ["**Microphone**", "Anything other than the laptop's own", "Audio quality affects how competent people judge you to be. Wired earphones beat a laptop mic and cost nothing"]
          ]
        }
      },

      { n: "That last row is not a stylistic point. In experiments where the same recorded talk was played back at different audio qualities, listeners rated the *speaker* — their intelligence, their credibility — lower when the audio was poor, while believing they were judging the content. Bad audio does not just make you harder to hear; it makes you sound worse at your job.", nt: "Audio outranks video, always" },

      { h: "The etiquette video invented" },

      {
        l: [
          "**Mute when not speaking** in anything above about five people. Below that, staying unmuted keeps the conversation human, and the small noises are worth it.",
          "**Camera on for the first meeting with anybody, and for anything difficult.** Beyond that, follow the team's norm rather than imposing one.",
          "**Say the name first when you want to speak.** *Sam —* cuts through latency in a way that beginning your sentence does not.",
          "**Leave a beat after somebody stops.** Network delay eats the natural turn-taking gap, and the double-talk collision is entirely a latency artefact rather than anybody being rude.",
          "**Look at the lens for the sentence that matters.** Not for the whole call, which is unnatural and exhausting. One or two lines, at the moment it counts.",
          "**Announce the screen share before you start it.** *Sharing my screen now* — it gives everybody two seconds and it saves you from sharing something you did not mean to."
        ]
      },

      { trap: "Before every share, look at what is actually on the screen: notifications, other people's names in a chat list, a browser tab that is nobody's business, a half-written message about the person you are talking to. Sharing a single window rather than the whole desktop makes most of this impossible, and turning off notifications makes the rest of it impossible. Do both." },

      { h: "The awkward cases" },

      {
        tbl: {
          t: "What to actually do",
          h: ["Situation", "Do", "Do not"],
          rows: [
            ["**A child or family member appears**", "Introduce them briefly, keep going", "Apologise repeatedly. It is universally forgiven and the apology is what makes it awkward"],
            ["**Your connection is failing**", "Say so once, turn the camera off to save bandwidth, continue on audio", "Keep freezing while insisting it is fine"],
            ["**You have to take a call at home with no quiet room**", "Use headphones, mute aggressively, say up front where you are", "Pretend the noise is not happening"],
            ["**You did not hear something twice**", "Ask a third time, specifically: *the part after the migration?*", "Nod and hope. This is how requirements get missed"],
            ["**Somebody is talking far too long**", "Use the chat, or wait for a breath and use their name", "Talk over them; on video it is unrecoverable"],
            ["**You joined the wrong meeting**", "Say so and leave", "Sit there silently hoping nobody looks at the participant list"]
          ]
        }
      },

      {
        tryit: {
          t: "Record ninety seconds",
          task: "Record yourself answering *tell me about a project you are proud of* on your normal video setup. Watch it once with the sound off, then once with your eyes closed.",
          hint: "Two passes, two different channels. Do not try to judge both at once.",
          sol: { lang: "text", code: "Sound off, you are checking:   camera height, framing, light,\n                               background, whether your head is\n                               in the bottom half of the frame\n\nEyes closed, you are checking: audio quality, pace, filler\n                               words, whether the ends of your\n                               sentences drop away\n\nAlmost everybody finds the camera is too low and the filler\ncount is higher than they thought. Both are fixable in a day:\none with a stack of books, one with an audible pause instead\nof a filled one." },
          w: "Separating the channels is what makes it useful. Watching a recording of yourself normally means watching your own face and noticing nothing else."
        }
      }
    ],
    k: [
      "Camera at eye level, head and shoulders, eyes on the upper third, an arm away.",
      "Light in front. A window behind you is unrecoverable.",
      "Audio quality changes how competent people judge you to be. Do not use the laptop microphone.",
      "Say the name before you speak, and leave a beat after somebody stops — latency, not rudeness.",
      "Check the screen before you share it, and share a window rather than the desktop."
    ],
    r: []
  }

]);

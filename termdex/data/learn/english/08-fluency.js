/* Professional English — fluency, pronunciation and listening. */
TD.addLessons("english", [

  {
    t: "Pronunciation That Actually Matters — clarity, not accent",
    m: "fluency",
    lvl: "intermediate",
    s: "The small number of sounds and stress patterns that genuinely cause misunderstanding, and how to fix them.",
    goal: [
      "Identify which pronunciation features affect comprehension and which do not",
      "Place word stress correctly, which matters more than any individual sound",
      "Fix the specific consonant and vowel contrasts most likely to cause a real misunderstanding"
    ],
    b: [
      { p: "Start with the thing most pronunciation courses will not say: **your accent is not a problem.** English has more non-native speakers than native ones, and a Nigerian, Indian, Brazilian or Polish accent is simply one of the ways English is spoken. Nobody needs to sound American." },

      { p: "What does matter is **intelligibility** — whether a listener can decode you without effort. That comes down to a short list of features, and word stress is at the top of it." },

      { h: "Word stress: the single highest-value fix" },

      { p: "English is a stress-timed language. Listeners locate a word by its stress pattern before they hear the individual sounds — which is why a word with the wrong stress can be completely unrecognisable even when every sound is perfect." },

      {
        code: {
          lang: "text", t: "Same letters, different word",
          lines: [
            { c: "RE-cord   (noun)    We keep a record of every change.", w: "Two-syllable noun: stress on the **first** syllable.", hi: true },
            { c: "re-CORD   (verb)    Could you record the session?", w: "Two-syllable verb: stress on the **second**. This pattern covers dozens of pairs.", hi: true },
            { c: "", w: "" },
            { c: "PRE-sent (noun/adj) / pre-SENT (verb)", w: "" },
            { c: "CON-tract (noun)    / con-TRACT (verb)", w: "" },
            { c: "IN-crease (noun)    / in-CREASE (verb)", w: "" },
            { c: "PRO-ject (noun)     / pro-JECT (verb)", w: "" },
            { c: "OB-ject (noun)      / ob-JECT (verb)", w: "" },
            { c: "PRO-duce (noun)     / pro-DUCE (verb)", w: "The noun-first, verb-second rule is reliable enough to guess with." }
          ]
        }
      },

      {
        tbl: {
          t: "Stress rules worth internalising",
          h: ["Ending", "Stress falls", "Examples"],
          rows: [
            ["**-tion, -sion, -cian**", "syllable *before* it", "commu-ni-**CA**-tion, de-**CI**-sion, tech-**NI**-cian"],
            ["**-ity, -ety**", "syllable *before* it", "a-**BI**-li-ty, se-**CU**-ri-ty, va-**RI**-e-ty"],
            ["**-ic, -ical**", "syllable *before* it", "spe-**CI**-fic, sta-**TIS**-ti-cal, e-co-**NO**-mic"],
            ["**-ical, -ogy, -graphy, -ometry**", "third from the end", "tech-**NO**-lo-gy, ge-**O**-me-try"],
            ["**-ate** (verb)", "third from the end", "**COM**-mu-ni-cate, **DE**-le-gate, **NE**-go-ti-ate"],
            ["**-ee, -eer, -ese, -esque**", "on the ending itself", "employ-**EE**, engin-**EER**, Portu-**GUESE**"],
            ["Compound nouns", "first word", "**DATA**base, **SOFT**ware, **CON**ference call"],
            ["Phrasal verbs", "the particle", "log **IN**, roll **OUT**, sign **OFF**"]
          ]
        }
      },

      { n: "Notice the last two rows together: **a LOG-in** *(noun)* versus **to log IN** *(verb)*. The same pattern runs through *setup / set up*, *backup / back up*, *handoff / hand off*, *rollout / roll out*. The noun stresses the first part; the verb stresses the particle.", nt: "The compound-noun rule in one line" },

      { h: "Sentence stress: which words get the emphasis" },

      { p: "English stresses content words — nouns, main verbs, adjectives, adverbs — and compresses everything else. Stressing every word equally is one of the strongest markers of a non-native rhythm, and it makes you slower to follow." },

      {
        code: {
          lang: "text", t: "The same sentence, meaning changed by stress alone",
          lines: [
            { c: "I did not say she took the file.        (someone else said it)", w: "" },
            { c: "I did NOT say she took the file.        (I deny saying it)", w: "" },
            { c: "I did not SAY she took the file.        (I implied it)", w: "" },
            { c: "I did not say SHE took the file.        (someone else took it)", w: "" },
            { c: "I did not say she TOOK the file.        (she did something else with it)", w: "" },
            { c: "I did not say she took THE file.        (she took a different one)", w: "**Seven meanings, one sentence, no words changed.** This is what stress does in English.", hi: true }
          ]
        }
      },

      { h: "The contrasts that cause real misunderstanding" },

      { p: "Most accent features are harmless. A handful genuinely produce the wrong word, and those are worth targeted practice." },

      {
        tbl: {
          t: "High-cost sound contrasts",
          h: ["Contrast", "Minimal pairs", "Who it affects", "Fix"],
          rows: [
            ["**/v/ vs /w/**", "vest / west, vine / wine, verse / worse", "Hindi, Urdu, German speakers", "/v/ = top teeth on bottom lip. /w/ = lips rounded, no teeth"],
            ["**/θ/ /ð/** (*think, this*)", "think / sink, three / tree, they / day", "Very many L1s", "Tongue tip lightly between the teeth. Substituting /t/ or /s/ is usually understood — low priority"],
            ["**/l/ vs /r/**", "light / right, collect / correct, glass / grass", "Japanese, Korean, some Chinese", "/l/ = tongue touches the ridge behind the teeth. /r/ = tongue touches nothing"],
            ["**/ɪ/ vs /iː/**", "ship / sheep, bit / beat, live / leave", "Spanish, Arabic, Hindi, Slavic", "The short one is relaxed and shorter, not just a shorter version of the long one"],
            ["**/æ/ vs /e/**", "bad / bed, man / men, sat / set", "Many L1s", "Open the jaw further for /æ/"],
            ["**Final consonants**", "*cars* not *car*, *asked* not *ask*", "Chinese, Vietnamese, Portuguese", "Grammatical information lives in final consonants — dropping them removes tense and plurality"],
            ["**Consonant clusters**", "strengths, texts, sixths, asked", "Speakers of syllable-timed languages", "Slow down rather than inserting a vowel"],
            ["**/s/ vs /ʃ/ vs /tʃ/**", "see / she, chair / share, watch / wash", "Various", "Genuinely produces wrong words in technical contexts"]
          ]
        }
      },

      { trap: "Prioritise ruthlessly. If you substitute /t/ for /θ/ in *think*, essentially nobody will be confused, and fixing it takes months. If you drop final `-s` and `-ed`, you are removing tense and number from your speech, and that *does* cause misunderstanding. Fix the second and ignore the first." },

      { h: "Words that are frequently mispronounced at work" },

      {
        tbl: {
          t: "Common workplace words with unexpected pronunciations",
          h: ["Word", "Pronounced", "Note"],
          rows: [
            ["**data**", "DAY-ta *(most common)* / DAH-ta", "Both accepted worldwide"],
            ["**schedule**", "SHED-yool *(BrE)* / SKED-jool *(AmE)*", "Both fine; be consistent"],
            ["**colleague**", "COL-eeg", "Stress the first syllable"],
            ["**determine**", "de-TER-min", "Not *-mine*"],
            ["**comfortable**", "COMF-ter-bul", "Three syllables in speech, not four"],
            ["**vegetable**", "VEJ-tuh-bul", "Three syllables"],
            ["**interesting**", "IN-tress-ting", "Three syllables"],
            ["**maintenance**", "MAIN-ten-ance", "Not *main-TAIN-ance*"],
            ["**suite**", "sweet", "Not *soot* — *a suite of tools*"],
            ["**queue**", "kyoo", "Only the first letter is pronounced"],
            ["**epitome**", "e-PIT-o-mee", "Four syllables"],
            ["**hierarchy**", "HIGH-er-ar-kee", "—"],
            ["**infrastructure**", "IN-fra-struc-ture", "Stress the first syllable"],
            ["**architecture**", "AR-ki-tec-ture", "—"],
            ["**cache**", "cash", "Not *ca-shay*"],
            ["**niche**", "neesh *(most common)* / nitch", "—"],
            ["**status**", "STAY-tus *(AmE)* / STAH-tus *(BrE)*", "Both fine"],
            ["**mobile**", "MO-bile *(BrE)* / MO-bul *(AmE)*", "—"],
            ["**Ubuntu, Kubernetes, PostgreSQL**", "oo-BOON-too, koo-ber-NET-eez, POST-gres-Q-L", "Worth checking any tool name before a presentation"]
          ]
        }
      },

      { n: "There is no shame in asking. *How do you say that — I have only ever read it?* is a completely normal question and marks you as someone who reads widely. Most native speakers have a list of words they learned from books and have never said aloud correctly either.", nt: "Just ask" },

      {
        tryit: {
          t: "Record and compare",
          task: "Record yourself saying: *We need to record the meeting, present the contract, and increase the project scope by Friday.* Then check each of the five stressed words against the noun/verb rule.",
          hint: "record, present, contract, increase, project — which are nouns here and which are verbs?",
          sol: { lang: "text", code: "We need to re-CORD the meeting     (verb  - second syllable)\npre-SENT the CON-tract             (verb, then noun)\nand in-CREASE the PRO-ject scope   (verb, then noun used as a modifier)\n\nMost speakers get one or two of these wrong on the first read, usually\nby stressing the noun pattern on a verb." },
          w: "This single rule — noun stresses first, verb stresses second — covers dozens of words that appear constantly in professional speech, and getting it right is far more noticeable than any individual vowel."
        }
      }
    ],
    k: [
      "Accent is not the target; intelligibility is. Word stress matters more than any individual sound.",
      "Two-syllable noun/verb pairs stress first/second respectively: RE-cord vs re-CORD.",
      "Compound nouns stress the first part; the matching phrasal verb stresses the particle: a LOG-in vs to log IN.",
      "Suffixes place stress predictably: -tion, -ity and -ic all pull stress onto the syllable before them.",
      "Dropping final -s and -ed removes grammar and genuinely causes misunderstanding. Fix that before fixing *th*."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Could you record the session? I will add it to the record.", w: "verb re-CORD, noun RE-cord" },
        { c: "We present the contract at the present time.", w: "verb pre-SENT, noun PRE-sent" },
        { c: "The rollout is Friday; we roll out at 09:00.", w: "compound noun stresses first, phrasal verb stresses the particle" }
      ]
    }
  },

  {
    t: "Fluency and Listening — thinking in English and following fast speech",
    m: "fluency",
    lvl: "intermediate",
    s: "Why you understand the textbook and not the meeting, and how to build speed that survives pressure.",
    goal: [
      "Understand connected speech — why native speakers do not say the words you learned",
      "Build fluency with chunks rather than by composing sentences word by word",
      "Handle the moments when you lose the thread of a fast conversation"
    ],
    b: [
      { p: "There is a specific and very common experience: you passed the exams, you read technical material comfortably, you write good English — and in a meeting with four native speakers you catch perhaps sixty per cent. Nothing is wrong with your English. You have been trained on written English and this is spoken English, and they are different systems." },

      { h: "Connected speech: why the words disappear" },

      { p: "Native speakers do not pronounce words individually. Words melt into each other according to consistent rules, and once you know the rules you can hear the joins." },

      {
        tbl: {
          t: "The five processes that hide words",
          h: ["Process", "What happens", "Written", "Heard as"],
          rows: [
            ["**Linking**", "Final consonant joins the next vowel", "an hour ago", "*a-nou-ra-go*"],
            ["**Elision**", "Sounds drop out entirely", "next day / friendship", "*nex day* / *fren-ship*"],
            ["**Assimilation**", "A sound changes to match its neighbour", "ten pounds / did you", "*tem pounds* / *dih-joo*"],
            ["**Weak forms**", "Function words reduce to a schwa", "a cup of tea / I can do it", "*a cuppa tea* / *I kn do it*"],
            ["**Contraction stacking**", "Several contractions run together", "What do you want to do?", "*Whaddaya wanna do?*"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "Real meeting speech, written as heard",
          lines: [
            { c: "\"What do you want to do about it?\"", w: "" },
            { c: "  -> Whaddya wanna do abou-dit?", w: "Four processes at once. This is normal speed, not sloppy speech.", hi: true },
            { c: "", w: "" },
            { c: "\"Let me know if you are going to be late.\"", w: "" },
            { c: "  -> Lemme know if yer gonna be late.", w: "" },
            { c: "", w: "" },
            { c: "\"I should have told you about it.\"", w: "" },
            { c: "  -> I shoulda toldya bouddit.", w: "*should have* becomes *shoulda*. This is why *should of* is such a common written error." },
            { c: "", w: "" },
            { c: "\"Did you get a chance to look at it?\"", w: "" },
            { c: "  -> Djou geda chance ta lookadit?", w: "The American /t/ between vowels becomes a /d/ sound - *geda*, *lookadit*.", hi: true }
          ]
        }
      },

      { n: "**Weak forms** are the key to the whole thing. Function words — *a, of, to, for, and, was, can, are, have, that* — are almost never pronounced fully in running speech. They collapse to a neutral *uh* sound. Once you stop listening for them and start listening for the stressed content words, comprehension jumps sharply.", nt: "Stop listening for the small words" },

      { h: "Training your ear" },

      {
        ol: [
          "**Listen to the same three minutes repeatedly.** Once with subtitles, once without, once reading the transcript aloud with the speaker. Three minutes done properly beats an hour of passive listening — and passive listening while doing something else does almost nothing.",
          "**Shadowing.** Play a recording and speak *along with it*, half a second behind, copying the rhythm rather than the words. This is the single most effective fluency exercise there is, and ten minutes a day shows results in weeks.",
          "**Choose speech, not broadcast.** News anchors speak unnaturally clearly. Podcasts with two people interrupting each other are what a meeting sounds like.",
          "**Vary the accents deliberately.** Scottish, Indian, Australian, Southern US, Nigerian. If your only input is one accent, everything else will sound like a different language.",
          "**Do not look up every word.** Getting the gist at speed is a separate skill from precision, and it is the one meetings require."
        ]
      },

      { h: "Fluency: chunks, not words" },

      { p: "Fluent speakers are not composing sentences word by word. They are assembling pre-built chunks. When you speak by translating from your first language a word at a time, you get slow, hesitant speech regardless of how good your vocabulary is." },

      {
        tbl: {
          t: "Chunks worth having automatic",
          h: ["Function", "Chunks"],
          rows: [
            ["**Starting**", "The way I see it… / What I would say is… / To be honest… / The thing is…"],
            ["**Buying time**", "That is a good question… / Let me think… / How can I put this…"],
            ["**Adding**", "On top of that… / What is more… / And the other thing is…"],
            ["**Contrasting**", "Having said that… / That said… / On the other hand… / Then again…"],
            ["**Giving reasons**", "The reason being… / Which is why… / That is because…"],
            ["**Concluding**", "So basically… / All in all… / At the end of the day… / Long story short…"],
            ["**Repairing**", "Sorry, what I mean is… / Let me rephrase that… / Actually, scratch that…"],
            ["**Softening**", "I might be wrong, but… / As far as I know… / Correct me if I am wrong…"],
            ["**Handing over**", "What do you reckon? / Does that make sense? / Over to you."]
          ]
        }
      },

      { trap: "Do not translate. Speakers who compose in their first language and translate produce sentences that are grammatically fine and subtly wrong — the collocations come out translated. Building chunks is what breaks the habit, because a chunk has no first-language original to translate from." },

      { h: "When you lose the thread" },

      {
        tbl: {
          t: "Recovery phrases",
          h: ["Situation", "Say"],
          rows: [
            ["Missed a few words", "Sorry, I missed the last bit — from *the migration* onwards?"],
            ["Missed the whole point", "Sorry, could you run that past me again?"],
            ["Too fast", "Could I ask you to slow down slightly? I want to make sure I get this."],
            ["Unfamiliar term", "What does [X] mean in this context? I have heard it used differently."],
            ["An acronym", "Sorry — what does TCO stand for?"],
            ["Need it in writing", "Could you drop that in the chat so I have the exact wording?"],
            ["Understood the words, not the point", "I follow the detail — what is the implication for us?"],
            ["Confirm before acting", "So the action for me is X by Thursday. Have I got that right?"]
          ]
        }
      },

      { n: "Asking someone to repeat is not a weakness signal. Native speakers do it constantly. What *does* signal a problem is nodding through something you did not understand and then delivering the wrong thing a week later — which is the actual cost of not asking.", nt: "Asking costs less than guessing" },

      { h: "Thinking in English" },

      {
        l: [
          "**Narrate mundane things silently in English.** What you are doing, what you will do next, what is on your desk. It builds automaticity with no stakes attached.",
          "**Keep one input in English permanently.** Phone language, notes, the podcast on your commute. Passive exposure is weak on its own and strong as a background layer.",
          "**Write a few lines a day.** Writing is thinking at a speed you can control, and it feeds directly into speaking.",
          "**Rehearse recurring situations aloud.** Your standup, your project summary, your introduction. These recur weekly; rehearsing them once makes them automatic forever.",
          "**Accept a plateau.** Improvement is not linear. The stretch where nothing seems to be improving is when listening comprehension is consolidating, and it is the point most people quit."
        ]
      },

      {
        tryit: {
          t: "Shadow for ten minutes",
          task: "Find a two-minute clip of two people talking naturally — a podcast, not a news bulletin. Play it and speak along half a second behind, five times. Do not try to understand it; copy the rhythm, the stress and the pauses.",
          hint: "The first pass will be a disaster. That is expected. By the fourth you will be riding the rhythm rather than chasing words.",
          sol: { lang: "text", code: "What shadowing trains that nothing else does:\n\n  - rhythm and stress timing, which is what makes you sound fluent\n  - connected speech - you physically produce the linking and elision\n  - speed - your mouth learns to move at conversational pace\n  - chunks - phrases enter your speech as units, not as words\n\nTen minutes a day for four weeks produces a change other people notice.\nIt is the highest-return exercise in this module and almost nobody\ndoes it, because it feels ridiculous for the first three days." },
          w: "Shadowing works because it bypasses composition entirely. You are not choosing words, so all your attention goes to the sound system — which is the part that written study never touches."
        }
      }
    ],
    k: [
      "Spoken English is a different system from written English: linking, elision, assimilation and weak forms hide the words you learned.",
      "Function words collapse to a neutral vowel. Listen for the stressed content words, not for every word.",
      "Fluency comes from pre-built chunks, not from composing word by word. Translating from your first language produces subtly wrong English.",
      "Shadowing — speaking along half a second behind a recording — is the highest-return fluency exercise there is.",
      "Have recovery phrases ready. Asking for a repeat costs far less than delivering the wrong thing a week later."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Sorry, I missed the last bit - from the migration onwards?", w: "recovering the thread precisely" },
        { c: "So the action for me is X by Thursday. Have I got that right?", w: "confirming before acting" },
        { c: "Having said that, I think the risk sits with the vendor.", w: "a contrast chunk, spoken as one unit" }
      ]
    }
  }

]);

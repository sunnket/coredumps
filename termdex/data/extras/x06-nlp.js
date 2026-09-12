/* Real-world examples and step-by-step flows — Natural Language Processing. */
TD.attach("nlp", {

"Natural Language Processing": {
 ex: { h: "Teaching a machine to read a complaint",
       b: "An airline receives forty thousand messages a week. NLP is what turns *my bag went to Lisbon and I did not* into a routed ticket with a category, a sentiment, an entity (Lisbon) and a priority — without a human reading it first. Everything else in this field is a variation on that: text in, structure out." },
 fl: { t: "The shape of almost every NLP system",
       s: ["Raw text arrives — messy, multilingual, full of typos",
           { s: "Normalise and tokenise it", n: "Unicode fixes, casing, splitting into units the model understands." },
           { q: "Do you need meaning, or just matching?",
             y: "Embed it — the model works on vectors, not strings",
             n: "Regex and keyword rules are faster, cheaper and often enough" },
           { s: "A model produces a label, a span, or new text", n: "Classification, extraction or generation — the three shapes." },
           "Evaluate on held-out human-labelled data, or you are guessing"] }
},

"Corpus": {
 ex: { h: "The library a model was raised in",
       b: "A sentiment model trained on film reviews will call a medical note negative because it is full of the word `pain`. The corpus is not neutral background — it is the entire world the model believes in, and its blind spots become the model's blind spots." },
 fl: { t: "Choosing what to train on",
       s: [{ s: "A corpus is simply the body of text you train or test on", n: "The word is old, from linguistics, and means nothing more complicated than that." },
           { s: "Start from the other end: what text will the model actually meet once it is live?", n: "Customer emails, medical notes, tweets, legal contracts — these are wildly different, and a model trained on one is poor at another." },
           { q: "Does your text look like that?",
             y: "Then a good score on held-out examples will roughly hold up in the real world",
             n: "Then you get a model that is confident and wrong in ways your testing cannot reveal, because your test data shares the same blind spot" },
           { s: "Check for the same document appearing more than once", n: "If a copy is in both your training and your testing text, the model has already seen the answer and every score you report is inflated." },
           { s: "Also check who is represented and who is not", n: "Text scraped from the internet over-represents some voices heavily. Whatever the text contains, the model will learn — including the gaps." }] }
},

"Stemming": {
 ex: { h: "Chopping words with a cleaver",
       b: "`running`, `runs` and `runner` all become `run` — and so do `universal`, `university` and `universe`, which collapse to `univers`. It is crude, it is wrong often, and it is one line of code that still improves keyword search enough to be worth it." },
 fl: { t: "Stemming or lemmatisation?",
       s: ["You want different word forms to match each other",
           { q: "Does a human ever read the output?",
             y: "Lemmatise — `better` becomes `good`, and the result is a real word",
             n: "Stem — far faster, and nobody ever sees `univers`" },
           { s: "Stemming needs no dictionary and no language model", n: "Which is why it survives inside search indexes." },
           "Transformer models need neither — subword tokenisation handles it"] }
},

"Lemmatisation": {
 ex: { h: "Looking the word up rather than guessing",
       b: "`was`, `is` and `were` all lemmatise to `be`, because the tool knows English grammar rather than just slicing suffixes. That knowledge costs time — a part-of-speech tag is usually needed first, since `saw` lemmatises to `see` or to `saw` depending on whether it is a verb or a tool." },
 fl: { t: "What the lemmatiser needs",
       s: ["A word arrives in context",
           { s: "Tag its part of speech first", n: "`saw` as a verb is `see`; as a noun it is `saw`." },
           { q: "Is the word in the dictionary?",
             y: "Return its canonical form",
             n: "Fall back to the surface form, or to a stemmer" },
           "Slower than stemming and more accurate — use it when the output is read"] }
},

"Stop Words": {
 ex: { h: "Removing the mortar and keeping the bricks",
       b: "In a keyword index `the` appears in every document and distinguishes nothing, so dropping it shrinks the index and speeds up search. Do the same to a transformer and you break it: *to be or not to be* becomes nothing at all, and `not` — a stop word in most standard lists — quietly inverts your sentiment model." },
 fl: { t: "Should you remove them?",
       s: ["You are preprocessing text",
           { q: "Is the model order-aware?",
             y: "Keep them — BERT and friends need the grammar",
             n: "Remove them — bag-of-words and TF-IDF gain from it" },
           { s: "Check the list for `not`, `no`, `never`", n: "Standard lists include them, and they carry the meaning." },
           "There is no universal stop list — it depends on the domain and the task"] }
},

"Bag of Words": {
 ex: { h: "Shaking the sentence in a jar",
       b: "*Dog bites man* and *man bites dog* produce the same vector, which is either a fatal flaw or an irrelevance depending on the task. For routing support email into eight categories, word counts alone get you most of the way — and a linear model over them trains in a second on a laptop." },
 fl: { t: "Building the representation",
       s: ["Fix a vocabulary from the training corpus",
           { s: "Each document becomes a vector as long as that vocabulary", n: "Mostly zeros — one slot per known word." },
           { q: "A word appears that was not in training?",
             y: "It is dropped entirely — the vector has no slot for it",
             n: "Its count goes into its slot" },
           { s: "Weight the counts with TF-IDF", n: "Raw counts over-reward common words." },
           "Add bigrams to recover a little word order without leaving the model"] }
},

"TF-IDF": {
 ex: { h: "The word that makes this document unusual",
       b: "In a folder of legal contracts `agreement` appears everywhere and tells you nothing; `indemnity` appears in nine documents and tells you exactly which ones matter. TF-IDF is that intuition as arithmetic, and it is still the retrieval baseline that dense embeddings have to beat." },
 fl: { t: "How the score is built",
       s: ["Count how often the term appears in this document — that is TF",
           { s: "Count how many documents contain it at all", n: "The document frequency." },
           { q: "Is it in nearly every document?",
             y: "IDF collapses toward zero — the term is effectively ignored",
             n: "IDF is high — the term is distinctive and gets weight" },
           { s: "Multiply the two and normalise the vector", n: "So long documents do not dominate." },
           "BM25 is the tuned production version — prefer it for real search"] }
},

"N-gram": {
 ex: { h: "Sliding a two-word window over the sentence",
       b: "`New York` as one bigram means something that a bag of `new` and `york` does not. The cost is combinatorial: a vocabulary of 50,000 words has 2.5 billion possible bigrams, almost all of which never occur — which is why n-gram models were always sparse and hungry, and why neural models replaced them." },
 fl: { t: "Choosing n",
       s: ["You need a little local word order",
           { q: "How much data do you have?",
             y: "Plenty — trigrams capture short phrases well",
             n: "Little — stay at bigrams or the counts are all zero" },
           { s: "Every increment of n multiplies the space", n: "Sparsity worsens faster than accuracy improves." },
           { s: "Character n-grams handle typos and morphology", n: "Useful for language ID and noisy user text." },
           "Above n=5 almost nothing repeats — the model memorises instead of generalising"] }
},

"Language Model": {
 ex: { h: "The thing finishing your sentence",
       b: "Phone keyboards, code completion and ChatGPT are one idea at wildly different scales: given what came before, what is likely next? Nothing in that objective mentions truth, reasoning or intention — which explains both how far it got and exactly where it fails." },
 fl: { t: "From next-token prediction to a useful assistant",
       s: ["Train on enormous text to predict the next token",
           { s: "Grammar, facts and style are learned as side effects", n: "None of it was labelled — the text itself was the supervision." },
           { q: "Is it now helpful?",
             y: "No — it completes text, it does not answer questions",
             n: "Instruction tuning and RLHF turn completion into conversation" },
           { s: "Sampling temperature decides how adventurous it is", n: "Zero is repetitive; high is creative and unreliable." },
           "It is still predicting tokens — fluency is not evidence of correctness"] }
},

"Perplexity": {
 ex: { h: "How many words the model was choosing between",
       b: "A perplexity of 20 means the model was, on average, as uncertain as if it had picked uniformly from twenty words. It is comparable only within a fixed tokeniser and dataset — a perplexity number quoted without both is marketing, not measurement." },
 fl: { t: "Reading the number",
       s: [{ s: "Perplexity measures how surprised a language model is by text it has not seen before", n: "Lower means less surprised, which means it predicted that text well." },
           { s: "Run the model over the text and, at each point, look at how much confidence it gave the word that actually came next", n: "High confidence in the right word is good. Being repeatedly caught out is bad." },
           { s: "Combine those into one number, scaled so it reads like a count of options", n: "Perplexity 10 means the model was about as unsure as someone guessing between ten equally likely words at every step." },
           { q: "So is lower always better?",
             y: "For predicting text, yes — it fits this kind of writing more closely",
             n: "But it says nothing about whether the model is helpful, truthful or safe. A model can predict text beautifully and still give terrible advice" },
           { s: "And never compare the number between two different models unless they chop text up identically", n: "Different chunking gives different numbers for identical quality, so the comparison is meaningless." }] }
},

"Part-of-Speech Tagging": {
 ex: { h: "Labelling every word noun, verb or otherwise",
       b: "In *book that flight*, `book` is a verb; in *read that book*, a noun. Getting this right is a prerequisite for lemmatisation, parsing and extraction rules — and modern taggers are around 97% accurate, which sounds excellent until you notice it means a mistake in almost every paragraph." },
 fl: { t: "How the tag is decided",
       s: ["Take the word together with the words around it",
           { q: "Is the word unambiguous?",
             y: "Assign its only tag — most words have exactly one",
             n: "Use the context: after `that`, `book` is likely a noun" },
           { s: "A sequence model tags the whole sentence at once", n: "The best combination overall, not the best word by word." },
           "Downstream rules inherit these errors — never assume the tags are clean"] }
},

"Named Entity Recognition": {
 ex: { h: "Highlighting the names in a contract",
       b: "Feed in ten thousand invoices and NER pulls out supplier, date and amount without anyone writing a regex per template. It fails in the predictable place: a model trained on news will not know your product names, and `Apple` in a fruit-supply contract is not an organisation." },
 fl: { t: "Extracting entities from a document",
       s: ["Tokenise the text",
           { s: "Tag each token with a BIO label", n: "Beginning, Inside or Outside of an entity span." },
           { s: "Merge consecutive tags into spans", n: "`New` + `York` + `City` becomes one location." },
           { q: "Are your entities domain-specific?",
             y: "Fine-tune on a few hundred labelled examples — off-the-shelf will not know them",
             n: "A general model handles people, places, orgs and dates well" },
           "Keep character offsets — downstream systems need to point back at the source"] }
},

"Dependency Parsing": {
 ex: { h: "Drawing arrows from each word to its boss",
       b: "*I saw the man with the telescope* has two valid parses, and the arrows are what distinguish them: does `with the telescope` attach to `saw` or to `man`? Parsers pick one, confidently, and extraction rules built on top inherit that decision without ever mentioning it." },
 fl: { t: "Using a parse for extraction",
       s: ["Parse the sentence into head-dependent arcs",
           { s: "Find the main verb — the root of the tree", n: "Everything else hangs off it, directly or indirectly." },
           { q: "Looking for who did what to whom?",
             y: "Follow the subject and object arcs out from the verb",
             n: "Follow modifier arcs for attributes and negation" },
           { s: "Negation is an arc too", n: "Miss it and `did not approve` reads as `approve`." },
           "Long sentences parse worse — split on punctuation before parsing"] }
},

"Sentiment Analysis": {
 ex: { h: "Counting how angry the inbox is",
       b: "A brand tracks ten thousand mentions a day and needs a trend line, not a reading of each one. It works well in aggregate and badly per message, because sarcasm, negation and domain language all break it — *this update is just brilliant* is negative and no lexicon will tell you that." },
 fl: { t: "Building one that survives contact with users",
       s: ["Define what the labels actually mean",
           { q: "Is a calm factual complaint negative?",
             y: "Decide now and write it into the guidelines — annotators will not agree otherwise",
             n: "Label consistency is the ceiling on model accuracy" },
           { s: "Label real data from your own channel", n: "Film-review models do not transfer to support tickets." },
           { s: "Report aggregate trends, not individual verdicts", n: "Per-message accuracy is where these systems embarrass you." },
           "Watch negation and sarcasm in error analysis — that is where the losses live"] }
},

"Text Classification": {
 ex: { h: "The routing desk that never sleeps",
       b: "Every incoming ticket goes to one of twelve queues. This is the highest-value, least glamorous NLP task in production, and the honest advice is that TF-IDF plus logistic regression solves most of it — reach for a transformer once you have measured that baseline and found it lacking." },
 fl: { t: "From zero to a deployed classifier",
       s: ["Collect and label a few thousand real examples",
           { s: "Split train, validation and test before touching anything", n: "Split by time if the data drifts." },
           { q: "Is the simple baseline good enough?",
             y: "Ship it — fast, cheap and explainable",
             n: "Fine-tune a pretrained model; expect a few points, not a miracle" },
           { s: "Read the confusion matrix, not the accuracy", n: "One dominant class can hide total failure on the rest." },
           "Monitor the live class distribution — drift shows up there first"] }
},

"Topic Modelling": {
 ex: { h: "Sorting a pile of documents nobody has read",
       b: "Ten years of survey free-text, no labels, and a question of what people are actually talking about. Topic models give you clusters of co-occurring words that a human then names — the model does not know the topic is *billing complaints*, only that those words travel together." },
 fl: { t: "From corpus to named themes",
       s: ["Clean and vectorise the documents",
           { s: "Choose a number of topics", n: "There is no correct value — try several and read the output." },
           { q: "Are the topics interpretable?",
             y: "Name them by hand and use them as labels",
             n: "Adjust k, prune the vocabulary, or cluster embeddings instead" },
           { s: "Every document is a mixture, not a single topic", n: "Realistic, and it makes reporting harder." },
           "Treat it as exploration — it generates hypotheses, it does not confirm them"] }
},

"Latent Dirichlet Allocation": {
 ex: { h: "Assuming every author picked topics, then picked words",
       b: "LDA imagines a writer choosing a mix — 70% sport, 30% politics — then drawing each word from one of those topics. Fitting the model runs that story backwards to recover the mixtures. It predates embeddings and still gives more readable topics than most clustering on short documents." },
 fl: { t: "What fitting actually does",
       s: ["Assume each document is a mixture of k topics",
           { s: "Assume each topic is a distribution over words", n: "Both are hidden — only the words are observed." },
           { s: "Iteratively reassign each word to the topic that best explains it", n: "Gibbs sampling or variational inference." },
           { q: "Are your documents short — tweets, titles?",
             y: "LDA struggles: too few words to infer a mixture from",
             n: "Full articles work well" },
           "Coherence scores help pick k, but human reading is still the real check"] }
},

"Machine Translation": {
 ex: { h: "The task that dragged the field into neural nets",
       b: "Statistical translation aligned phrases and stitched them together; the output was understandable and unmistakably machine. Sequence-to-sequence with attention changed that in about three years, and attention became the transformer — modern NLP is, historically, a translation side effect." },
 fl: { t: "How a neural translator works",
       s: ["Encode the source sentence into vectors",
           { s: "Decode target tokens one at a time", n: "Each conditioned on the source and on what has been produced so far." },
           { q: "Which source words matter for this output word?",
             y: "Attention decides, per token — no fixed alignment table",
             n: "That flexibility is why it beat phrase-based systems" },
           { s: "Beam search keeps several candidates alive", n: "Greedy decoding commits too early." },
           "Low-resource language pairs stay hard — the data simply is not there"] }
},

"Text Summarisation": {
 ex: { h: "The two-line version of a forty-page report",
       b: "Extractive summarisers pick existing sentences, so they cannot lie but often read like a highlight reel. Abstractive ones write new sentences, read beautifully, and will occasionally state a number that appears nowhere in the source — precisely the risk in the settings where summaries matter most." },
 fl: { t: "Choosing an approach",
       s: ["You need a shorter version of a document",
           { q: "Is factual fidelity critical?",
             y: "Extractive — every sentence is verbatim from the source",
             n: "Abstractive — much better prose, at the cost of hallucination risk" },
           { s: "Long documents exceed the context window", n: "Chunk, summarise each, then summarise the summaries." },
           { s: "Check the summary against the source automatically", n: "Entailment models catch a useful fraction of invented claims." },
           "ROUGE rewards overlap, not truth — never trust it alone"] }
},

"Question Answering": {
 ex: { h: "Answer from the page in front of you",
       b: "Extractive QA returns a span from a supplied passage — a system that literally cannot invent an answer. Open-book generative QA is more useful and much riskier, which is why retrieval-augmented generation exists: give the model the passage, and demand it cite the span." },
 fl: { t: "Answering questions over your own documents",
       s: ["Embed the question",
           { s: "Retrieve the most relevant passages", n: "This step decides answer quality more than the model does." },
           { q: "Does a retrieved passage contain the answer?",
             y: "Generate an answer grounded in it, with a citation",
             n: "Say so — a refusal beats a confident invention" },
           { s: "Show the source beside the answer", n: "So a human can check in two seconds." },
           "Evaluate retrieval separately from generation, or you cannot tell which failed"] }
},

"Coreference Resolution": {
 ex: { h: "Working out who *she* is",
       b: "*The nurse told the doctor she was late* — and every coreference system has a preferred answer, which is where measurable gender bias in NLP was first shown publicly. Get it wrong inside a summarisation pipeline and you attribute a quote to the wrong person, silently." },
 fl: { t: "Linking mentions to entities",
       s: ["Find every mention — names, nouns and pronouns",
           { s: "Score each pair of mentions for coreference", n: "Distance, gender, number and semantic compatibility." },
           { q: "Two mentions strongly linked?",
             y: "Merge them into one cluster with a canonical name",
             n: "Leave them separate — a false merge is worse than a miss" },
           { s: "Resolve across the whole document", n: "Chains run between paragraphs, not just within a sentence." },
           "Substituting canonical names before extraction makes downstream rules far simpler"] }
},

"Information Extraction": {
 ex: { h: "Turning a filing cabinet into a database",
       b: "Thirty years of pathology reports as prose, and a question that needs a `WHERE` clause. Extraction is the bridge: entities become columns, relations become foreign keys, and the whole archive becomes queryable — with an error rate that must be measured before anyone reports from it." },
 fl: { t: "The extraction pipeline",
       s: ["Segment and clean the documents",
           { s: "Recognise entities", n: "People, dates, amounts, and domain-specific things." },
           { s: "Classify the relations between them", n: "Who works for whom; which drug at which dose." },
           { q: "Is the schema fixed and known in advance?",
             y: "Train a supervised extractor per relation — accurate and boring",
             n: "Open extraction or an LLM, then validate hard against the schema" },
           "Store a source offset for every field, so any value can be audited later"] }
},

"Knowledge Graph": {
 ex: { h: "Facts with edges instead of rows",
       b: "*Which suppliers are two hops from a sanctioned entity* is a painful SQL query and a natural graph traversal. Search engines use one to answer *how tall is the Eiffel Tower* without ranking any page — and to notice the question is about a structure, not a film." },
 fl: { t: "Building one from documents",
       s: ["Extract entities and normalise them",
           { s: "Resolve duplicates to a single node", n: "`IBM`, `I.B.M.` and `International Business Machines` are one entity." },
           { s: "Extract typed relations as edges", n: "With a source citation on each — provenance is the whole value." },
           { q: "Two sources contradict each other?",
             y: "Keep both, with confidence and date — do not silently pick one",
             n: "Merge them and raise the confidence" },
           "Query with traversals, not joins — that is the reason it is a graph"] }
},

"BLEU": {
 ex: { h: "Grading a translation by word overlap",
       b: "It compares n-grams against a reference translation, so a perfect translation phrased differently scores badly and a fluent nonsense sentence sharing vocabulary scores well. It survives because it is cheap, deterministic and correlates with human judgement in aggregate — over a whole test set, never a single sentence." },
 fl: { t: "How the score is computed",
       s: ["Count matching n-grams between output and reference",
           { s: "Clip the counts so repetition cannot inflate them", n: "Otherwise `the the the the` scores well." },
           { s: "Combine precision for n = 1 to 4", n: "Geometric mean — all sizes must be decent." },
           { q: "Is the output shorter than the reference?",
             y: "A brevity penalty applies — precision alone rewards saying less",
             n: "No penalty" },
           "Report it over a corpus with a fixed tokeniser, or the number is not comparable"] }
},

"ROUGE": {
 ex: { h: "BLEU's recall-shaped sibling",
       b: "Summarisation cares about what you left out, so ROUGE measures how much of the reference appears in the output rather than the reverse. Same weakness: it rewards copying. An extractive summariser lifting sentences verbatim beats a better abstractive one on ROUGE and loses with human readers." },
 fl: { t: "Which variant to report",
       s: ["You need a summarisation metric",
           { q: "Comparing content coverage?",
             y: "ROUGE-1 and ROUGE-2 — unigram and bigram recall",
             n: "ROUGE-L — longest common subsequence, which rewards order" },
           { s: "One reference summary is thin evidence", n: "There are many valid summaries; more references help." },
           "Pair it with a faithfulness check — overlap is not accuracy"] }
},

"GloVe": {
 ex: { h: "Learning from the whole co-occurrence table at once",
       b: "Word2Vec slides a window and learns locally; GloVe builds the global count matrix first and factorises it. The famous arithmetic — king − man + woman ≈ queen — falls out of both, and so do the corpus's biases, which the vectors encode just as faithfully as the useful relationships." },
 fl: { t: "How the vectors are produced",
       s: ["Count how often each word appears near each other word",
           { s: "Build the global co-occurrence matrix", n: "Huge, but sparse and computed only once." },
           { s: "Factorise it so dot products match log co-occurrence", n: "That objective is the whole method." },
           { q: "A word never seen in training?",
             y: "It has no vector at all — GloVe has no fallback",
             n: "Look it up in the table" },
           "Fine for one vector per word; useless when meaning depends on context"] }
},

"FastText": {
 ex: { h: "Spelling out the word to guess its meaning",
       b: "Because a word is the sum of its character n-grams, `unhappiness` gets a sensible vector even if it never appeared in training — the pieces did. That makes it strong for morphologically rich languages like Finnish and Turkish, and for user text full of typos, where a whole-word model just shrugs." },
 fl: { t: "Handling an unseen word",
       s: ["Split the word into character n-grams",
           { s: "`where` becomes `<wh`, `whe`, `her`, `ere`, `re>`", n: "Plus the whole word as its own token." },
           { q: "Have those n-grams been seen before?",
             y: "Sum their vectors — you get a usable representation",
             n: "Almost never happens in practice" },
           { s: "Rare and misspelled words share substructure with common ones", n: "Which is where the robustness comes from." },
           "Bigger model files than Word2Vec — the n-gram table is large"] }
},

"Sentence Embedding": {
 ex: { h: "One vector for the whole sentence",
       b: "*How do I reset my password* and *I forgot my login details* share almost no words and should land in the same place. That is semantic search, and it is why averaging word vectors is not enough — sentence encoders are trained on pairs to pull similar meanings together and push different ones apart." },
 fl: { t: "Powering semantic search",
       s: ["Embed every document once, offline",
           { s: "Store the vectors in an index", n: "A vector database, or FAISS if it fits in memory." },
           { s: "Embed the incoming query with the same model", n: "Different models produce incompatible spaces." },
           { q: "Is nearest-neighbour enough?",
             y: "Return the top k by cosine similarity",
             n: "Rerank with a cross-encoder — slower per pair, much more accurate" },
           "Re-embed everything when you change model — mixed vectors are silently wrong"] }
},

"Text Normalisation": {
 ex: { h: "The unglamorous step that fixes most bugs",
       b: "`Café`, `Cafe` and `CAFÉ` are three keys in your dictionary and one word to a human. Add smart quotes, non-breaking spaces and two different unicode encodings of the same é, and a startling share of NLP bugs are resolved before any model is involved." },
 fl: { t: "A normalisation pass",
       s: ["Normalise unicode to a single form",
           { s: "NFC or NFKC — decide once and apply everywhere", n: "Two encodings of `é` compare unequal otherwise." },
           { s: "Standardise whitespace, quotes and dashes", n: "Copy-pasted text is full of exotic variants." },
           { q: "Is case meaningful in your task?",
             y: "Keep it — `US` and `us` differ, and NER needs the signal",
             n: "Lowercase for matching and indexing" },
           "Apply the identical pipeline at training and inference, or you build skew in"] }
},

"Regular Expression": {
 ex: { h: "The right tool far more often than admitted",
       b: "Extracting a postcode, a reference number or an ISO date needs a pattern, not a model — instant, exact and testable. The failure mode is famous: people reach for regex to parse HTML or validate email addresses, where the grammar is not regular and no pattern is ever quite finished." },
 fl: { t: "Regex or a model?",
       s: ["You need to find something in text",
           { q: "Does it have a rigid, describable shape?",
             y: "Regex — deterministic, fast, no training data, testable",
             n: "A model — names, sentiment and intent have no pattern" },
           { s: "Anchor the pattern and bound your quantifiers", n: "Nested unbounded repetition causes catastrophic backtracking." },
           { s: "Write the tests before the pattern", n: "Including the cases that must not match." },
           "A commented multi-line pattern is maintainable; a clever one-liner is not"] }
},

"Speech Recognition": {
 ex: { h: "Turning a call recording into searchable text",
       b: "A contact centre with a million minutes of audio and no idea what is in them. ASR makes it greppable — and the word error rate is not uniform: accents, background noise and domain vocabulary are where it collapses, which tends to correlate with exactly the callers you least want to fail." },
 fl: { t: "From audio to transcript",
       s: ["Segment the audio and extract acoustic features",
           { s: "An acoustic model maps sound to token probabilities", n: "Modern systems do this end to end." },
           { q: "Full of jargon or product names?",
             y: "Bias the decoder with a custom vocabulary — accuracy jumps",
             n: "The general language model handles it" },
           { s: "Add punctuation and speaker diarisation afterwards", n: "Raw ASR output is an unpunctuated wall of words." },
           "Measure word error rate per accent and speaker group, not just overall"] }
},

"Text-to-Speech": {
 ex: { h: "The voice that stopped sounding like a robot",
       b: "Concatenative systems stitched recorded fragments together and always had a seam. Neural vocoders generate the waveform directly, which is why current TTS is close to indistinguishable — and why voice cloning from thirty seconds of audio is a security problem rather than a demo." },
 fl: { t: "How speech is produced",
       s: ["Normalise the text — numbers, dates and abbreviations spelled out",
           { s: "`£12.50` becomes `twelve pounds fifty`", n: "This step causes most audible errors." },
           { s: "Convert to phonemes with prosody", n: "Where the stress and the pauses fall." },
           { s: "A vocoder generates the waveform", n: "This is the part that made it sound human." },
           { q: "Cloning a specific person's voice?",
             y: "You need consent and a provenance trail — treat it as biometric data",
             n: "Use a licensed stock voice" }] }
},

"Intent Recognition": {
 ex: { h: "What is this person actually trying to do?",
       b: "*My card is not working*, *payment failed* and *why was I declined* are one intent and three sentences. Classify the intent, extract the slots — card ending, date — and hand a structured request to the system that can act. The critical class is the one people forget: none of the above." },
 fl: { t: "Handling a user utterance",
       s: ["Classify the intent from a fixed set",
           { q: "Is confidence above threshold?",
             y: "Extract the slots and route to the handler",
             n: "Fall back — ask a clarifying question or hand to a human" },
           { s: "Missing a required slot?", n: "Ask for exactly that one thing, not the whole form again." },
           { s: "Log every low-confidence utterance", n: "That log is your list of intents you have not built yet." },
           "An honest fallback beats a confident wrong route every time"] }
},

"Word Sense Disambiguation": {
 ex: { h: "Which *bank* did they mean?",
       b: "River or financial — a search engine that gets this wrong returns fishing spots to someone looking for a mortgage. Static embeddings had one vector per word and could not choose; contextual models like BERT produce a different vector for each occurrence, which quietly solved most of this problem." },
 fl: { t: "Resolving the sense",
       s: ["Take the word together with its context",
           { q: "Using contextual embeddings?",
             y: "The vector already encodes the sense — no separate step needed",
             n: "Compare context words against each sense's dictionary gloss" },
           { s: "Nearby words carry the signal", n: "`interest rate` and `river bank` disambiguate themselves." },
           { s: "Domain is a strong prior", n: "In a finance corpus one sense is almost always right." },
           "Rare senses stay hard — by definition there is little training data for them"] }
}

});

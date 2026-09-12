/* NLP — Information extraction & knowledge. */
TD.addLessons("nlp", [

    {
        t: "Information Extraction — Turning Documents into Databases",
        m: "info",
        lvl: "intermediate",
        s: "The full IE pipeline: entity recognition, relation extraction, and event extraction from unstructured text.",
        goal: [
            "Design an information extraction pipeline from document ingestion to structured output",
            "Understand the difference between rule-based, supervised and LLM-based extraction",
            "Store source offsets for every extracted field to enable audit trails"
        ],
        b: [
            { p: "Thirty years of pathology reports as prose, and a question that needs a `WHERE` clause. Information extraction is the bridge: entities become columns, relations become foreign keys, and the whole archive becomes queryable — with an error rate that must be measured before anyone reports from it." },

            { h: "The IE Pipeline" },
            { p: "1. **Segment and clean** the documents. 2. **Recognise entities** (people, dates, amounts, domain terms). 3. **Classify relations** between them (who works for whom, which drug at which dose). 4. **Extract events** (acquisitions, appointments, incidents). Each step feeds the next, and errors compound." },

            {
                tbl: {
                    t: "Extraction approaches compared",
                    h: ["Approach", "Data Needed", "Accuracy", "Speed", "Best For"],
                    rows: [
                        ["**Rules / Regex**", "None (patterns)", "High on rigid formats", "Very fast", "Dates, codes, IDs, structured fields"],
                        ["**Supervised models**", "100s–1000s of labelled examples", "High on trained types", "Fast", "Domain entities, fixed schema"],
                        ["**LLM + schema prompt**", "A JSON schema + examples", "Good, improving", "Slow, expensive", "Flexible schemas, low data"],
                        ["**Hybrid**", "Rules for rigid + model for soft", "Best overall", "Moderate", "Production systems"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Relation extraction with an LLM and structured output",
                    lines: [
                        { c: "import json", w: "" },
                        { c: "from openai import OpenAI", w: "" },
                        { c: "", w: "" },
                        { c: "client = OpenAI()", w: "" },
                        { c: "", w: "" },
                        { c: "SCHEMA = '''Extract entities and relations as JSON:", w: "" },
                        { c: "{\"entities\": [{\"text\": str, \"type\": str, \"start\": int, \"end\": int}],", w: "" },
                        { c: " \"relations\": [{\"head\": str, \"relation\": str, \"tail\": str}]}'''", w: "**Schema forces structured output.**", hi: true },
                        { c: "", w: "" },
                        { c: "text = 'Anthropic, founded by Dario Amodei in 2021, is based in San Francisco.'", w: "" },
                        { c: "", w: "" },
                        { c: "response = client.chat.completions.create(", w: "" },
                        { c: "    model='gpt-4o-mini',", w: "" },
                        { c: "    messages=[", w: "" },
                        { c: "        {'role': 'system', 'content': SCHEMA},", w: "" },
                        { c: "        {'role': 'user', 'content': text}", w: "" },
                        { c: "    ],", w: "" },
                        { c: "    response_format={'type': 'json_object'})", w: "**Guarantees valid JSON output.**", hi: true },
                        { c: "", w: "" },
                        { c: "extracted = json.loads(response.choices[0].message.content)", w: "" },
                        { c: "print(json.dumps(extracted, indent=2))", w: "" }
                    ]
                }
            },

            { trap: "Store a source character offset for every extracted field. Without offsets, there is no audit trail — no way to verify an extracted value against the original document. Schema-valid is not the same as correct." },

            { vocab: ["Information Extraction", "Schema", "Structured Output"] }
        ],
        k: [
            "Information extraction turns unstructured text into structured records: entities become columns, relations become edges.",
            "Hybrid approaches (rules for rigid targets + models for soft targets) outperform either alone in production.",
            "Always store source offsets — without provenance, extracted facts cannot be verified or audited."
        ],
        r: ["Information Extraction", "Named Entity Recognition", "Knowledge Graph", "Structured Output"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "# Pipeline: segment → NER → relation extraction → schema validation", w: "the IE pipeline in order" },
                { c: "response_format={'type': 'json_object'}", w: "force structured JSON output from an LLM" },
                { c: "# Always store start/end character offsets per extracted field", w: "provenance for audit trails" }
            ]
        }
    },

    {
        t: "Knowledge Graphs & Topic Modelling — Organising What Text Says",
        m: "info",
        lvl: "intermediate",
        s: "Building knowledge graphs from extracted facts, and discovering themes with LDA and BERTopic.",
        goal: [
            "Construct a knowledge graph from extracted entities and relations",
            "Apply topic modelling to discover themes in unlabelled document collections",
            "Choose between LDA and BERTopic based on document length and corpus size"
        ],
        b: [
            { p: "Two ways to organise the knowledge in text. Knowledge graphs store explicit facts as triples (subject → predicate → object) and support multi-hop queries. Topic models discover latent themes across a corpus without any labels." },

            { h: "Knowledge Graphs: Facts as Edges" },
            { p: "`(Ada Lovelace, wrote, Note G)`. Because relationships are explicit and typed, a knowledge graph supports questions like 'which suppliers are two hops from a sanctioned entity' — a painful SQL query and a natural graph traversal." },

            { h: "Topic Modelling: What Is This Corpus About?" },
            { p: "Ten years of survey free-text, no labels. Topic models give you clusters of co-occurring words that a human then names. LDA is the classical approach (bag-of-words, Bayesian). BERTopic embeds documents, clusters them with HDBSCAN, and extracts topic keywords — generally more coherent." },

            {
                tbl: {
                    t: "LDA vs BERTopic",
                    h: ["Property", "LDA", "BERTopic"],
                    rows: [
                        ["**Input representation**", "Bag of words", "Sentence embeddings"],
                        ["**Topic coherence**", "Moderate", "Generally better"],
                        ["**Short documents**", "Struggles — too few words", "Handles better via embeddings"],
                        ["**Number of topics**", "Must specify k upfront", "Discovered automatically (HDBSCAN)"],
                        ["**Interpretability**", "Word distributions per topic", "Keywords + representative docs"],
                        ["**Speed**", "Fast", "Slower (embedding step)"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Topic modelling with BERTopic",
                    lines: [
                        { c: "from bertopic import BERTopic", w: "" },
                        { c: "", w: "" },
                        { c: "# Fit on a list of documents", w: "" },
                        { c: "topic_model = BERTopic(language='english', min_topic_size=10)", w: "" },
                        { c: "topics, probs = topic_model.fit_transform(documents)", w: "**Embeds, clusters and extracts topics.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Inspect discovered topics", w: "" },
                        { c: "print(topic_model.get_topic_info())", w: "Topic ID, count, name, representative words." },
                        { c: "", w: "" },
                        { c: "# Get top words for topic 0", w: "" },
                        { c: "print(topic_model.get_topic(0))", w: "**[('machine', 0.12), ('learning', 0.10), ...]**", hi: true },
                        { c: "", w: "" },
                        { c: "# Visualise topic clusters", w: "" },
                        { c: "fig = topic_model.visualize_topics()", w: "Interactive plot of topic distances." },
                        { c: "fig.show()", w: "" }
                    ]
                }
            },

            { trap: "Topic models discover themes — they do not confirm hypotheses. A topic that looks like 'billing complaints' is a cluster of co-occurring words a human named. Treat the output as exploration, not evidence." },

            { vocab: ["Knowledge Graph", "Topic Modelling", "LDA"] }
        ],
        k: [
            "Knowledge graphs store extracted facts as typed triples, enabling multi-hop queries impossible with flat retrieval.",
            "BERTopic generally produces more coherent topics than LDA by clustering sentence embeddings instead of word counts.",
            "Topic modelling is exploration — it generates hypotheses, it does not confirm them."
        ],
        r: ["Knowledge Graph", "Topic Modelling", "Latent Dirichlet Allocation", "Information Extraction"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "topic_model = BERTopic(language='english')", w: "create a BERTopic model" },
                { c: "topics, probs = topic_model.fit_transform(documents)", w: "discover topics from documents" },
                { c: "topic_model.get_topic(0)", w: "get the top words for topic 0" }
            ]
        }
    },

    {
        t: "Intent Recognition & Speech — Where NLP Meets Conversation and Audio",
        m: "info",
        lvl: "intermediate",
        s: "Intent classification, slot filling, speech recognition and text-to-speech — the conversational NLP stack.",
        goal: [
            "Design an intent + slot filling system for a conversational interface",
            "Understand the speech recognition pipeline from audio to text",
            "Know the critical role of fallback intents and confidence thresholds"
        ],
        b: [
            { p: "A user says 'Where is my order from last Tuesday'. The system must: 1) classify the **intent** (check_order_status), 2) extract **slots** (date: last Tuesday), and 3) route to the handler. This intent-slot architecture runs every chatbot and voice assistant." },

            { h: "Intent Recognition" },
            { p: "Classify what the user is trying to do from a fixed set of intents. `My card is not working`, `payment failed`, and `why was I declined` are one intent: `payment_issue`. The critical class is the one people forget: **none of the above** — a system without a fallback will confidently do the wrong thing." },

            { h: "Speech Recognition (ASR)" },
            { p: "Modern ASR converts audio waveforms to spectrograms, feeds them through a transformer encoder, and decodes text. Whisper demonstrated that large-scale training on diverse audio produces robust multilingual recognition. The remaining difficulties: accents, background noise, domain jargon, proper nouns." },

            {
                tbl: {
                    t: "The conversational NLP stack",
                    h: ["Layer", "Input", "Output", "Key Challenge"],
                    rows: [
                        ["**ASR (Speech → Text)**", "Audio waveform", "Raw transcript", "Accents, noise, domain vocabulary"],
                        ["**Intent Classification**", "User utterance", "Intent label + confidence", "Out-of-scope detection"],
                        ["**Slot Filling / NER**", "User utterance", "Extracted parameters", "Missing slots, ambiguous values"],
                        ["**Dialogue Management**", "Intent + slots + context", "Next action", "Multi-turn state tracking"],
                        ["**NLG / TTS**", "Response template + data", "Text or audio response", "Natural prosody, correct emphasis"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Intent classification with confidence thresholding",
                    lines: [
                        { c: "from transformers import pipeline", w: "" },
                        { c: "import numpy as np", w: "" },
                        { c: "", w: "" },
                        { c: "classifier = pipeline('zero-shot-classification',", w: "" },
                        { c: "    model='facebook/bart-large-mnli')", w: "" },
                        { c: "", w: "" },
                        { c: "intents = ['check_order', 'cancel_order', 'payment_issue', 'other']", w: "" },
                        { c: "", w: "" },
                        { c: "result = classifier('My payment was declined yesterday',", w: "" },
                        { c: "                    candidate_labels=intents)", w: "" },
                        { c: "", w: "" },
                        { c: "top_intent = result['labels'][0]", w: "" },
                        { c: "top_score = result['scores'][0]", w: "" },
                        { c: "", w: "" },
                        { c: "THRESHOLD = 0.6", w: "**Below this → fallback to human.**", hi: true },
                        { c: "if top_score < THRESHOLD:", w: "" },
                        { c: "    print('Low confidence — routing to human agent')", w: "" },
                        { c: "else:", w: "" },
                        { c: "    print(f'Intent: {top_intent} ({top_score:.2f})')", w: "**Route to the handler with extracted intent.**", hi: true }
                    ]
                }
            },

            { trap: "An honest fallback beats a confident wrong route every time. Log every low-confidence utterance — that log is your prioritised list of intents and training examples you have not built yet." },

            { vocab: ["Intent Recognition", "Speech Recognition", "Text-to-Speech", "TTS"] }
        ],
        k: [
            "Intent + slot filling is the classical conversational architecture: classify the goal, extract the parameters, route to the handler.",
            "Out-of-scope detection (fallback intent) matters more than in-scope accuracy — never force every utterance into a known category.",
            "Speech recognition accuracy varies by accent and noise — measure WER per speaker group, not just overall."
        ],
        r: ["Intent Recognition", "Speech Recognition", "Text-to-Speech", "Named Entity Recognition", "Word Sense Disambiguation"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "classifier = pipeline('zero-shot-classification')", w: "load zero-shot intent classifier" },
                { c: "result = classifier(utterance, candidate_labels=intents)", w: "classify user intent" },
                { c: "if result['scores'][0] < THRESHOLD: fallback()", w: "route to fallback on low confidence" }
            ]
        }
    }

]);

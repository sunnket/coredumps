/* NLP — Generation & translation. */
TD.addLessons("nlp", [

    {
        t: "Language Models — From Next-Token Prediction to Everything",
        m: "gen",
        lvl: "core",
        s: "How predicting the next word became the foundation of modern AI, and what that objective does and does not guarantee.",
        goal: [
            "Explain the language modelling objective and how it scaled from n-grams to transformers",
            "Understand the relationship between pre-training, instruction tuning and RLHF",
            "Know why fluency is not evidence of correctness"
        ],
        b: [
            { p: "A language model does one thing: estimate the probability of the next token given all previous tokens. Phone keyboards, code completion and ChatGPT are the same idea at different scales. The objective says nothing about truth, reasoning or intention — which explains both how far it got and exactly where it breaks." },

            { h: "The Three Eras of Language Modelling" },
            {
                tbl: {
                    t: "Evolution of language models",
                    h: ["Era", "Method", "Context Window", "Key Limitation"],
                    rows: [
                        ["**N-gram (1990s)**", "Count sequences in a corpus, smooth for unseen ones", "2–5 words", "Sparsity: most sequences never occur"],
                        ["**Neural (2013)**", "Word2Vec/LSTM predict next token from learned representations", "~200 tokens", "Vanishing gradients limit memory"],
                        ["**Transformer (2017+)**", "Self-attention over the full context window", "2K–1M+ tokens", "Compute scales quadratically with length"],
                        ["**Instruction-tuned (2022+)**", "RLHF/DPO align completion with helpfulness", "Full context", "Still predicting tokens — alignment is steering, not understanding"]
                    ]
                }
            },

            { h: "From Completion to Conversation" },
            { p: "A raw language model completes text — it does not answer questions. Instruction tuning (training on prompt-response pairs) and RLHF (reinforcement learning from human feedback) steer the model toward helpful, harmless responses. But underneath, it is still predicting tokens. Fluency is not evidence of correctness." },

            {
                code: {
                    lang: "python", t: "Language model generation with Hugging Face",
                    lines: [
                        { c: "from transformers import pipeline", w: "" },
                        { c: "", w: "" },
                        { c: "gen = pipeline('text-generation', model='gpt2')", w: "" },
                        { c: "", w: "" },
                        { c: "# Temperature controls randomness", w: "" },
                        { c: "result = gen('Natural language processing is',", w: "" },
                        { c: "             max_new_tokens=50,", w: "" },
                        { c: "             temperature=0.7,", w: "**Lower = more predictable, higher = more creative.**", hi: true },
                        { c: "             do_sample=True)", w: "" },
                        { c: "", w: "" },
                        { c: "print(result[0]['generated_text'])", w: "Completes the prompt with sampled tokens." },
                        { c: "", w: "" },
                        { c: "# Greedy (temperature=0) is deterministic but repetitive", w: "" },
                        { c: "result_greedy = gen('Natural language processing is',", w: "" },
                        { c: "                    max_new_tokens=50,", w: "" },
                        { c: "                    do_sample=False)", w: "**Always picks the highest-probability token.**", hi: true }
                    ]
                }
            },

            { trap: "A language model that sounds confident is not more likely to be correct. Confidence comes from fluency (high-probability tokens in sequence), not from factual knowledge. This is the fundamental reason hallucination exists." },

            { vocab: ["Language Model", "Temperature", "Sampling", "Greedy Decoding", "Instruction Tuning", "RLHF", "Perplexity"] }
        ],
        k: [
            "Language modelling is next-token prediction — the same objective from phone keyboards to GPT-4.",
            "Instruction tuning and RLHF steer completions toward helpfulness but do not add factual knowledge.",
            "Fluency is not evidence of correctness — confident, well-formed text can be entirely fabricated."
        ],
        r: ["Language Model", "Large Language Model", "Perplexity", "Hallucination", "Temperature"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "gen = pipeline('text-generation', model='gpt2')", w: "load a text generation pipeline" },
                { c: "gen('prompt', max_new_tokens=50, temperature=0.7, do_sample=True)", w: "generate with temperature sampling" },
                { c: "gen('prompt', max_new_tokens=50, do_sample=False)", w: "generate with greedy decoding" }
            ]
        }
    },

    {
        t: "Machine Translation — The Task That Invented the Transformer",
        m: "gen",
        lvl: "intermediate",
        s: "From phrase tables to neural sequence-to-sequence, and the remaining hard problems.",
        goal: [
            "Understand the encoder-decoder architecture for translation",
            "Know how beam search improves decoding over greedy token selection",
            "Identify the remaining hard problems: idiom, gender, low-resource languages, terminology"
        ],
        b: [
            { p: "Machine translation dragged the field into neural networks. Statistical systems aligned phrases and stitched them together — understandable output, unmistakably machine. The transformer was literally invented for this task, and the improvement was dramatic." },

            { h: "Encoder-Decoder for Translation" },
            { p: "The encoder reads the source sentence bidirectionally and produces contextual representations. The decoder generates target tokens one at a time, using cross-attention to look back at the encoder at each step. This architecture is why the transformer paper is called 'Attention Is All You Need'." },

            { h: "Beam Search: Keeping Options Open" },
            { p: "Greedy decoding picks the highest-probability token at each step. But the best first token does not guarantee the best overall translation. Beam search keeps the top-k candidates (beams) alive at each step, only committing when the sequence is complete." },

            {
                tbl: {
                    t: "Machine translation: what remains hard",
                    h: ["Problem", "Example", "Why It Is Hard"],
                    rows: [
                        ["**Idiom**", "'It's raining cats and dogs' → literal translation", "No word-level correspondence exists"],
                        ["**Gender ambiguity**", "'The doctor… they' → gendered language target", "Source lacks gender information the target requires"],
                        ["**Low-resource pairs**", "English↔Yoruba", "Too little parallel training data"],
                        ["**Terminology consistency**", "Same term translated differently across a document", "Sentence-level models lack document context"],
                        ["**Numeric/named entity**", "Dates, currencies, proper nouns", "Must be transferred, not translated"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Translation with Hugging Face",
                    lines: [
                        { c: "from transformers import pipeline", w: "" },
                        { c: "", w: "" },
                        { c: "translator = pipeline('translation_en_to_fr',", w: "" },
                        { c: "    model='Helsinki-NLP/opus-mt-en-fr')", w: "**Open-source translation model.**", hi: true },
                        { c: "", w: "" },
                        { c: "result = translator('The transformer was invented for this.',", w: "" },
                        { c: "                    max_length=128)", w: "" },
                        { c: "print(result[0]['translation_text'])", w: "Le transformateur a été inventé pour ça." },
                        { c: "", w: "" },
                        { c: "# Beam search width", w: "" },
                        { c: "result = translator('Attention is all you need.',", w: "" },
                        { c: "                    num_beams=5,", w: "**Keep 5 candidates at each step.**", hi: true },
                        { c: "                    max_length=128)", w: "" }
                    ]
                }
            },

            { trap: "BLEU scores are reported against specific test sets with specific tokenisers. A BLEU number without both is marketing, not measurement. And a high BLEU score says nothing about whether a specific sentence was translated correctly." },

            { vocab: ["Machine Translation", "Encoder-Decoder", "BLEU"] }
        ],
        k: [
            "Machine translation uses encoder-decoder architecture: encoder reads source bidirectionally, decoder generates target with cross-attention.",
            "Beam search keeps multiple candidate translations alive, improving quality over greedy single-token decoding.",
            "Idiom, gender ambiguity, low-resource pairs and terminology consistency remain genuinely hard problems."
        ],
        r: ["Machine Translation", "Transformer", "Encoder-Decoder", "BLEU"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "translator = pipeline('translation_en_to_fr', model='Helsinki-NLP/opus-mt-en-fr')", w: "load a translation model" },
                { c: "translator(text, num_beams=5, max_length=128)", w: "translate with beam search" },
                { c: "# BLEU measures n-gram overlap, not meaning — pair with human eval", w: "translation evaluation awareness" }
            ]
        }
    },

    {
        t: "Text Summarisation & Question Answering — Extracting and Generating Answers",
        m: "gen",
        lvl: "intermediate",
        s: "Extractive vs abstractive summarisation, QA systems, and why faithfulness is harder than fluency.",
        goal: [
            "Distinguish extractive and abstractive summarisation and their trade-offs",
            "Build an extractive QA system and understand when to refuse to answer",
            "Know why ROUGE rewards overlap and not truth, and why that matters"
        ],
        b: [
            { p: "Two tasks that compress information: summarisation reduces a document to its key points; question answering extracts or generates a specific answer. Both have the same core risk: the output may contain something that was never in the source." },

            { h: "Summarisation: Extractive vs Abstractive" },
            { p: "**Extractive** summarisation picks existing sentences from the document — it cannot lie, because every sentence is verbatim. **Abstractive** summarisation generates new text — it reads better but can introduce facts that were never in the source. For factual domains, this is the central risk." },

            { h: "Question Answering: Three Flavours" },
            { p: "**Extractive QA** returns a span from a supplied passage — the system literally cannot invent an answer. **Open-domain QA** retrieves passages first (RAG), then extracts or generates. **Generative QA** composes an answer in free text — most flexible, most dangerous." },

            {
                code: {
                    lang: "python", t: "Extractive QA with Hugging Face",
                    lines: [
                        { c: "from transformers import pipeline", w: "" },
                        { c: "", w: "" },
                        { c: "qa = pipeline('question-answering',", w: "" },
                        { c: "    model='distilbert-base-uncased-distilled-squad')", w: "" },
                        { c: "", w: "" },
                        { c: "context = '''The transformer architecture was introduced in 2017", w: "" },
                        { c: "by Vaswani et al. in the paper 'Attention Is All You Need'.", w: "" },
                        { c: "It replaced recurrent layers with self-attention mechanisms.'''", w: "" },
                        { c: "", w: "" },
                        { c: "result = qa(question='When was the transformer introduced?',", w: "" },
                        { c: "           context=context)", w: "" },
                        { c: "", w: "" },
                        { c: "print(result['answer'])", w: "**'2017'**", hi: true },
                        { c: "print(f\"score: {result['score']:.3f}\")", w: "Confidence score — low score = refuse to answer.", hi: true },
                        { c: "print(f\"span: [{result['start']}:{result['end']}]\")", w: "Character offsets into the context." }
                    ]
                }
            },

            { h: "Summarisation with a Model" },
            {
                code: {
                    lang: "python", t: "Abstractive summarisation pipeline",
                    lines: [
                        { c: "summariser = pipeline('summarization', model='facebook/bart-large-cnn')", w: "" },
                        { c: "", w: "" },
                        { c: "article = '''Your long article text here...'''", w: "" },
                        { c: "", w: "" },
                        { c: "summary = summariser(article,", w: "" },
                        { c: "    max_length=130, min_length=30, do_sample=False)", w: "" },
                        { c: "print(summary[0]['summary_text'])", w: "**Generated summary — verify it against the source.**", hi: true }
                    ]
                }
            },

            { trap: "ROUGE measures word overlap between generated and reference summaries. An extractive summariser that copies sentences verbatim scores higher than a better abstractive one. And neither ROUGE nor BLEU detects fabricated facts — always check faithfulness separately." },

            { vocab: ["Text Summarisation", "Question Answering", "ROUGE", "Hallucination"] }
        ],
        k: [
            "Extractive summarisation/QA returns verbatim text — safe but rigid. Abstractive generates new text — fluent but risky.",
            "Set a confidence threshold on QA and refuse to answer when the score is low — confident wrong answers are worse than no answer.",
            "ROUGE measures overlap, not truth. Always pair it with an explicit faithfulness check."
        ],
        r: ["Text Summarisation", "Question Answering", "ROUGE", "Hallucination", "Retrieval-Augmented Generation"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "qa = pipeline('question-answering', model='distilbert-base-uncased-distilled-squad')", w: "load an extractive QA pipeline" },
                { c: "result = qa(question=q, context=ctx); result['answer']", w: "extract an answer span from context" },
                { c: "summariser = pipeline('summarization', model='facebook/bart-large-cnn')", w: "load an abstractive summarisation model" }
            ]
        }
    }

]);

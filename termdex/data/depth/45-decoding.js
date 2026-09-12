/* ==========================================================================
   Depth pass 45 — how a language model turns probabilities into text.

   A model does not produce text. It produces a probability distribution over
   the next token, and *decoding* is the separate decision of what to do with
   that distribution. Nearly every complaint about a model being repetitive,
   incoherent or unreliable is a decoding setting, not a model property —
   which makes this the cheapest quality lever available.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "top-k-sampling",

      why: {
        before: "The two obvious decoding strategies both fail. **Greedy " +
          "decoding** always takes the most likely token and produces flat, " +
          "repetitive text that falls into loops. **Pure sampling** draws from " +
          "the full distribution and occasionally picks something absurd.",
        problem: "The tail is the issue. A vocabulary of 50,000 tokens means " +
          "tens of thousands of options each carrying a tiny probability, and " +
          "collectively that tail can hold substantial mass. Sample often " +
          "enough and you will eventually draw a token the model considered " +
          "almost impossible — one bad token then conditions everything after " +
          "it, so the whole continuation derails.",
        shift: "**Truncate the distribution before sampling.** Keep only the " +
          "`k` most likely tokens, renormalise, and sample among those. " +
          "Randomness is preserved for variety, and the implausible tail is " +
          "removed entirely."
      },

      num: {
        t: "Why a fixed k is the wrong shape",
        h: ["Context", "Distribution", "k = 40 gives"],
        r: [
          ["`The capital of France is`", "**one token at ~99%**", "**39 unwanted candidates**"],
          ["`Once upon a`", "flat — many valid", "reasonable"],
          ["`2 + 2 =`", "**near-certain**", "**risks a wrong answer**"],
          ["`He walked into the`", "**very flat**", "**may cut good options**"]
        ],
        n: "The table is the argument against `top-k` and for **top-p**. `k` " +
          "is a **fixed count applied to a distribution whose shape changes " +
          "every single token**. Where the model is confident, a fixed `k` " +
          "drags in 39 tokens it had all but ruled out, and one of them can " +
          "still be sampled — which is how a factual answer goes wrong. Where " +
          "the model is genuinely uncertain and 200 continuations are " +
          "plausible, `k = 40` discards most of the legitimate variety. " +
          "**Top-p (nucleus) sampling adapts** by taking however many tokens " +
          "are needed to reach a cumulative probability, so it is narrow when " +
          "the model is sure and wide when it is not. That is why top-p is the " +
          "modern default and top-k mostly appears alongside it as a safety " +
          "cap."
      },

      miss: [
        {
          w: "Higher k always means more creative output.",
          r: "It widens the **candidate pool**, and **temperature** controls " +
            "how flat the probabilities are within it. A large `k` with low " +
            "temperature still picks the top token nearly always. The two " +
            "interact and are frequently confused."
        },
        {
          w: "k = 1 is the same as greedy decoding.",
          r: "It is — that is the useful thing to notice. Setting `k = 1` " +
            "leaves exactly one candidate, so sampling becomes deterministic. " +
            "The whole family of strategies sits on a spectrum between greedy " +
            "and pure sampling."
        },
        {
          w: "Top-k is what modern APIs use by default.",
          r: "**Top-p** is the default in most current APIs, because it adapts " +
            "to distribution shape. Top-k is offered as an additional cap and " +
            "is more common in local inference stacks such as llama.cpp."
        },
        {
          w: "Truncation is applied before temperature.",
          r: "Order matters and differs between implementations. Typically " +
            "**temperature is applied first** to reshape the distribution, " +
            "then truncation selects from the reshaped version. Applying them " +
            "in the other order gives measurably different output, which is " +
            "one reason the same settings behave differently across runtimes."
        }
      ],

      trade: {
        buys: [
          "Removes the implausible tail that derails generations.",
          "Retains randomness and variety.",
          "Trivial to implement and cheap to compute.",
          "A single intuitive parameter.",
          "A useful safety cap alongside top-p."
        ],
        costs: [
          "A fixed count ignores distribution shape.",
          "Too wide when the model is confident.",
          "Too narrow when the model is genuinely uncertain.",
          "Interacts with temperature in non-obvious ways.",
          "The right `k` varies by task and by model."
        ],
        avoid: [
          "You want shape-adaptive truncation — use **top-p**.",
          "The task is factual and deterministic — use greedy or " +
            "temperature 0.",
          "You need reproducible output.",
          "The model already exposes better-tuned defaults."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "top-p-sampling",

      why: {
        before: "Top-k truncates to a **fixed number** of candidates, which " +
          "was a clear improvement over sampling the full vocabulary.",
        problem: "The right number is not fixed. After `The capital of France " +
          "is`, one token holds nearly all the mass and every other candidate " +
          "is noise. After `He walked into the`, hundreds of continuations are " +
          "genuinely reasonable. One `k` cannot serve both, and the model " +
          "already knows which situation it is in — that information is in the " +
          "distribution and top-k throws it away.",
        shift: "**Truncate by cumulative probability instead of by count.** " +
          "Sort the tokens, accumulate until the total reaches `p`, and sample " +
          "from that set — the *nucleus*. When the model is confident the " +
          "nucleus is one or two tokens; when it is uncertain it may be " +
          "hundreds. The cut adapts to the model's own confidence, which is " +
          "why top-p became the default."
      },

      num: {
        t: "How the nucleus adapts, p = 0.9",
        h: ["Context", "Distribution", "Tokens kept"],
        r: [
          ["`The capital of France is`", "**one token at 99%**", "**1**"],
          ["`2 + 2 =`", "near-certain", "**1–2**"],
          ["`Once upon a`", "moderately spread", "~10"],
          ["`He walked into the`", "**very flat**", "**~200**"],
          ["Typical settings", "**p = 0.9–0.95**", "**temperature 0.7–1.0**"]
        ],
        n: "Two parameters do different jobs and are constantly confused. " +
          "**Temperature reshapes** the distribution — dividing logits by `T` " +
          "before softmax, so below 1 sharpens toward the top token and above " +
          "1 flattens toward uniform — while **top-p truncates** it. Adjusting " +
          "both at once makes the effect of either hard to attribute, so the " +
          "practical advice is to **fix top-p at 0.9–0.95 and tune temperature " +
          "only**. Note that `temperature = 0` is not really sampling at all: " +
          "it collapses to greedy decoding, which is what you want for " +
          "extraction, classification and structured output. Even then, " +
          "**output is not perfectly reproducible** on GPU inference — " +
          "floating-point non-determinism from batching and reduction order " +
          "can flip a near-tie between two tokens, and one flipped token " +
          "changes everything downstream."
      },

      miss: [
        {
          w: "Top-p means keeping tokens above probability p.",
          r: "It keeps the smallest set whose **cumulative** probability " +
            "reaches `p`. With `p = 0.9`, tokens are added in descending order " +
            "until the running total hits 90%. It is a cumulative threshold, " +
            "not a per-token one."
        },
        {
          w: "Temperature and top-p do the same thing.",
          r: "**Temperature reshapes** the distribution — sharpening or " +
            "flattening it. **Top-p truncates** it — deciding where to cut. " +
            "You can have high temperature with low `p`, giving flat " +
            "probabilities over very few candidates."
        },
        {
          w: "Temperature 0 guarantees identical output every time.",
          r: "It makes decoding **greedy**, and GPU inference is not perfectly " +
            "deterministic — batching and floating-point reduction order can " +
            "flip a near-tie. Providers usually document this; a seed helps " +
            "but rarely guarantees it."
        },
        {
          w: "Tune temperature and top-p together for best results.",
          r: "Changing both makes attribution impossible. Standard practice is " +
            "to **fix `p` at 0.9–0.95 and vary temperature alone**. Most " +
            "provider documentation recommends adjusting only one."
        }
      ],

      trade: {
        buys: [
          "Adapts to the model's own confidence at each token.",
          "Narrow when the answer is clear, wide when it is open.",
          "One intuitive parameter, stable across tasks.",
          "The default in most modern APIs.",
          "Composes cleanly with temperature."
        ],
        costs: [
          "Requires sorting the vocabulary each step.",
          "Still probabilistic — a low-probability token can appear.",
          "Interacts with temperature confusingly.",
          "The nucleus can be very large on flat distributions.",
          "Not reproducible without greedy decoding."
        ],
        avoid: [
          "The task needs determinism — use temperature 0.",
          "You want a hard cap on candidates — add top-k.",
          "Output is parsed as structured data and must be exact.",
          "You are already tuning temperature and want one variable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "beam-search",

      why: {
        before: "Greedy decoding picks the most likely token at every step, " +
          "which is locally optimal and globally shortsighted.",
        problem: "The highest-probability **token** does not lead to the " +
          "highest-probability **sequence**. Choosing a slightly less likely " +
          "word now can open a far better continuation, and greedy decoding " +
          "can never discover that because it has already committed. " +
          "Evaluating all sequences is `vocabulary^length` — impossible.",
        shift: "**Keep the `k` best partial sequences at every step instead " +
          "of one.** Expand each, score all continuations, keep the best `k`, " +
          "repeat. It is a bounded breadth-first search over sequences — an " +
          "approximation, not a guarantee of the optimum, but it reliably " +
          "finds higher-probability sequences than greedy. It became standard " +
          "for translation and summarisation, and is largely **not** used for " +
          "open-ended chat."
      },

      num: {
        t: "Where beam search helps and where it hurts",
        h: ["Task", "Beam search", "Why"],
        r: [
          ["**Translation**", "**helps**", "**one correct output exists**"],
          ["Summarisation", "helps", "constrained target"],
          ["Speech recognition", "**helps**", "**a single true transcript**"],
          ["**Open-ended chat**", "**hurts**", "**bland, repetitive text**"],
          ["Creative writing", "**hurts**", "diversity is the goal"]
        ],
        n: "The split is the whole point, and the reason it holds is " +
          "counter-intuitive: **the highest-probability sequence is not the " +
          "best text**. Human language is not probability-maximal — real " +
          "writing constantly makes locally surprising choices, and a " +
          "likelihood-maximising decoder produces text that is fluent, safe " +
          "and dull. This is the *likelihood trap*, and it is why open-ended " +
          "generation uses sampling rather than search. Two mechanical notes: " +
          "beam search needs **length normalisation**, because each additional " +
          "token multiplies in a probability below 1, so raw scores " +
          "systematically favour short sequences and the model stops too " +
          "early. And cost scales linearly with beam width — `k = 5` means " +
          "roughly five times the compute and memory of greedy decoding, which " +
          "is a real consideration at serving scale."
      },

      miss: [
        {
          w: "Beam search finds the most likely sequence.",
          r: "It is a **heuristic**, not an exact search. Pruning to `k` " +
            "candidates can discard a prefix that would have led to the global " +
            "optimum. Wider beams search more and still guarantee nothing."
        },
        {
          w: "A wider beam always gives better output.",
          r: "Quality often **degrades** beyond moderate widths — the *beam " +
            "search curse*. Wider beams find higher-probability sequences, and " +
            "those tend to be shorter, blander and more repetitive. Typical " +
            "widths are 4–10 for good reason."
        },
        {
          w: "Modern chat models use beam search.",
          r: "They generally use **sampling** — top-p with temperature. Beam " +
            "search produces text that is fluent and dull, which is wrong for " +
            "conversation. It remains standard in translation and speech " +
            "recognition, where one correct output exists."
        },
        {
          w: "Length normalisation is a minor detail.",
          r: "Without it beam search is **badly biased toward short output**, " +
            "because every token multiplies by a probability below 1. " +
            "Dividing by length, or by `length^α`, is essential — a missing " +
            "normalisation is the classic cause of truncated translations."
        }
      ],

      trade: {
        buys: [
          "Higher-probability sequences than greedy decoding.",
          "Deterministic and reproducible.",
          "Strong on tasks with one correct answer.",
          "Beam width is a direct quality/compute dial.",
          "Naturally supports n-best lists for reranking."
        ],
        costs: [
          "Compute and memory scale with beam width.",
          "Produces bland, repetitive text on open-ended tasks.",
          "Needs length normalisation to avoid short output.",
          "Quality degrades beyond moderate widths.",
          "No optimality guarantee despite the extra cost."
        ],
        avoid: [
          "The task is open-ended or creative — use **sampling**.",
          "Diversity matters.",
          "Latency and cost are constrained.",
          "The model was trained and tuned for sampled decoding."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "causal-masking",

      why: {
        before: "Attention lets every token look at every other token, which " +
          "is exactly right for **understanding** a complete text — BERT reads " +
          "bidirectionally and builds representations informed by full " +
          "context.",
        problem: "That is fatal for **generation**. If a model predicting " +
          "token 5 can attend to tokens 6 through 10, it can simply read the " +
          "answer. Training would achieve near-zero loss and learn nothing, " +
          "because the task has been trivially leaked.",
        shift: "**Mask the future.** Before the attention softmax, set every " +
          "score for a position later than the current one to negative " +
          "infinity, so its weight becomes zero. Each position sees only " +
          "itself and what precedes it. This one change is what separates a " +
          "decoder from an encoder — and it is what allows the entire sequence " +
          "to be trained **in parallel** while still respecting causality."
      },

      num: {
        t: "The mask, and what it enables",
        h: ["Property", "With causal mask", "Without"],
        r: [
          ["Position i attends to", "**0…i**", "all positions"],
          ["**Training**", "**all positions in parallel**", "parallel"],
          ["**Suitable for generation**", "**yes**", "**no — leaks the answer**"],
          ["Suitable for classification", "weaker", "**yes — full context**"],
          ["**KV cache reusable**", "**yes**", "**no**"],
          ["Model family", "**GPT, Llama, Claude**", "**BERT**"]
        ],
        n: "The **parallel training** row is the reason transformers displaced " +
          "RNNs, and it is easy to miss. An RNN must process tokens one at a " +
          "time because each step depends on the previous hidden state. A " +
          "masked transformer computes **every position's loss simultaneously " +
          "in a single forward pass** — the mask enforces causality without " +
          "enforcing sequential computation. That is the entire scaling " +
          "unlock. The **KV cache** row follows from the same property: " +
          "because token `i`'s representation can never depend on anything " +
          "after it, the keys and values computed for earlier tokens are " +
          "**permanently valid** and can be cached across generation steps. " +
          "Without causal masking every new token would invalidate all " +
          "previous computation, making generation quadratic per step rather " +
          "than linear — so caching, and prompt caching above it, exist only " +
          "because of the mask."
      },

      miss: [
        {
          w: "Causal masking makes generation sequential.",
          r: "**Generation** is inherently sequential; **training** is not. The " +
            "mask lets all positions be trained in one parallel forward pass " +
            "while preserving causality. That combination is what made " +
            "transformers scale past RNNs."
        },
        {
          w: "The mask sets attention weights to zero.",
          r: "It sets the **scores** to negative infinity **before** the " +
            "softmax, which yields zero weight after it. Zeroing weights " +
            "afterwards would break normalisation — the remaining weights " +
            "would no longer sum to one."
        },
        {
          w: "It is only relevant during training.",
          r: "It applies at **inference** too. During prompt processing, all " +
            "prompt tokens are handled at once and the mask keeps each one " +
            "from seeing later prompt tokens — preserving the same " +
            "representations the model was trained to produce."
        },
        {
          w: "Bidirectional models are simply better since they see more.",
          r: "They are better at **understanding** tasks — classification, " +
            "retrieval embeddings, named entity recognition — and **cannot " +
            "generate autoregressively**. The choice follows the task, which " +
            "is why BERT-family encoders remain standard for embeddings."
        }
      ],

      trade: {
        buys: [
          "Makes autoregressive generation learnable.",
          "Parallel training over all positions at once.",
          "Enables the KV cache and therefore prompt caching.",
          "Implemented as an additive mask — nearly free.",
          "Guarantees no future leakage by construction."
        ],
        costs: [
          "Each position sees less context than bidirectional attention.",
          "Weaker representations for classification and embedding tasks.",
          "Generation remains inherently sequential.",
          "Early tokens have very little context to work with."
        ],
        avoid: [
          "The task is understanding, not generation — use an **encoder**.",
          "You need embeddings for retrieval — BERT-family models.",
          "The whole sequence is available and order does not matter.",
          "You are doing sequence classification."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "scaled-dot-product-attention",

      why: {
        before: "RNNs passed information forward through a hidden state, so a " +
          "token 500 positions back had to survive 500 sequential updates. " +
          "Signal decayed, gradients vanished, and nothing could be computed " +
          "in parallel.",
        problem: "The real requirement is **direct access**: any token should " +
          "be able to consult any other in one step, with the relevance " +
          "learned rather than fixed by position.",
        shift: "**Score every pair with a dot product, scale, softmax, and " +
          "take a weighted sum.** Each token emits a **query** (what it is " +
          "looking for), a **key** (what it offers) and a **value** (what it " +
          "contributes). `softmax(QKᵀ / √d)V` is the whole operation. Every " +
          "pair is scored simultaneously as one matrix multiplication, which " +
          "is both why it captures long-range structure and why GPUs run it " +
          "so efficiently."
      },

      num: {
        t: "The formula, term by term",
        h: ["Term", "Meaning", "Why"],
        r: [
          ["QKᵀ", "**every query against every key**", "**all pairs at once**"],
          ["**÷ √d**", "**scale by key dimension**", "**stops softmax saturating**"],
          ["softmax", "normalise to weights", "sums to 1"],
          ["× V", "weighted sum of values", "the output"],
          ["**Cost**", "**O(n² · d)**", "**quadratic in sequence length**"]
        ],
        n: "The **`√d` scaling** is the detail the name emphasises and people " +
          "skip. Dot products of `d`-dimensional vectors with unit-variance " +
          "components have variance `d`, so at `d = 128` raw scores spread " +
          "wide enough that softmax saturates — one weight near 1, the rest " +
          "near 0, and **gradients vanish**. Dividing by `√d` restores unit " +
          "variance and keeps the softmax in its useful range. Without it, " +
          "deep transformers do not train. The **`O(n²)`** row is the defining " +
          "constraint of the architecture: doubling context quadruples " +
          "attention compute, which is why long-context models need " +
          "**FlashAttention** (same maths, tiled to avoid materialising the " +
          "`n × n` matrix in memory) or sparse and linear approximations. " +
          "Note that attention itself has **no notion of order** — it is " +
          "permutation-invariant, which is exactly why positional encodings " +
          "must be added separately."
      },

      miss: [
        {
          w: "The `√d` scaling is a minor numerical tweak.",
          r: "Without it, dot-product variance grows with dimension, softmax " +
            "**saturates**, and gradients vanish. Deep transformers do not " +
            "train at all. It is load-bearing, which is why it is in the name."
        },
        {
          w: "Attention understands word order.",
          r: "It is **permutation-invariant** — shuffle the input and the " +
            "attention outputs are correspondingly shuffled but otherwise " +
            "identical. All order information comes from **positional " +
            "encodings** added to the embeddings beforehand."
        },
        {
          w: "Attention weights explain what the model is doing.",
          r: "They show where attention **flowed**, which is weaker than an " +
            "explanation. Research has repeatedly shown attention maps can be " +
            "altered without changing predictions. Treat them as a diagnostic " +
            "signal, not as interpretability."
        },
        {
          w: "FlashAttention changes the attention computation.",
          r: "It computes the **mathematically identical** result. The " +
            "improvement is **IO-aware tiling** that avoids writing the " +
            "`n × n` matrix to slow memory. It is faster and uses less memory " +
            "with no change in output — an implementation win, not an " +
            "approximation."
        }
      ],

      trade: {
        buys: [
          "Direct connection between any two positions, one step apart.",
          "Fully parallel — one matrix multiplication.",
          "Relevance is learned, not fixed by distance.",
          "Maps onto GPU hardware extremely well.",
          "Simple enough to reason about and optimise."
        ],
        costs: [
          "`O(n²)` in sequence length — the context bottleneck.",
          "Memory for the attention matrix without tiling.",
          "No inherent notion of order.",
          "Attention weights are not explanations.",
          "Quadratic cost dominates at long context."
        ],
        avoid: [
          "Sequences are extremely long — use sparse or linear attention.",
          "The task is genuinely local — convolution may be cheaper.",
          "Memory is tight and FlashAttention is unavailable.",
          "There is no sequence structure at all."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "encoder",

      why: {
        before: "Word embeddings such as word2vec gave each word **one fixed " +
          "vector**, so `bank` had a single representation regardless of " +
          "whether the sentence was about rivers or money.",
        problem: "Meaning is contextual. A useful representation of a word " +
          "must depend on the words around it — **all** of them, on both " +
          "sides. `The bank was steep` and `The bank was closed` should " +
          "produce different vectors for the same token.",
        shift: "**Read the whole sequence bidirectionally and build a " +
          "context-dependent representation for every token.** With no causal " +
          "mask, each position attends to the full sequence in both " +
          "directions. The encoder's output is not text — it is a set of " +
          "vectors that later layers use for classification, retrieval or " +
          "extraction. BERT is the canonical example, trained by **masking " +
          "random words** and predicting them, which is only possible because " +
          "the model sees both sides."
      },

      num: {
        t: "Encoder against decoder",
        h: ["", "Encoder (BERT)", "Decoder (GPT)"],
        r: [
          ["Attention", "**bidirectional**", "**causal — backwards only**"],
          ["Output", "**vectors per token**", "**next-token probabilities**"],
          ["Trained by", "**masked token prediction**", "next-token prediction"],
          ["**Can generate?**", "**no**", "**yes**"],
          ["Best at", "**classify, retrieve, extract**", "generate, reason"],
          ["Typical size", "**110M–340M**", "**7B–500B+**"]
        ],
        n: "The **size** row explains why encoders are far from obsolete: a " +
          "110M-parameter encoder runs on a CPU in milliseconds and beats a " +
          "much larger generative model on classification and retrieval, at a " +
          "fraction of the cost. **Every production RAG system uses an " +
          "encoder** for its embeddings — retrieval needs one vector per " +
          "chunk, computed once, and that is exactly what an encoder produces. " +
          "The bidirectional advantage is real: an encoder embedding a " +
          "document considers the whole document for every token, where a " +
          "decoder's representation of an early token cannot see anything " +
          "after it. There is also an **encoder-decoder** family — T5, BART, " +
          "the original translation transformer — where the encoder reads the " +
          "source bidirectionally and the decoder generates while attending to " +
          "it through **cross-attention**, which suits translation and " +
          "summarisation where input and output are distinct sequences."
      },

      miss: [
        {
          w: "Encoders are obsolete now that LLMs exist.",
          r: "They are the standard for **embeddings**, which every RAG system " +
            "depends on, and for classification at scale. A 110M encoder is " +
            "thousands of times cheaper than a generative model and often more " +
            "accurate on these tasks."
        },
        {
          w: "An encoder could generate text with the right prompting.",
          r: "It has **no autoregressive mechanism**. BERT predicts masked " +
            "tokens given full surrounding context — it cannot extend a " +
            "sequence one token at a time. Generation requires causal masking " +
            "and next-token training."
        },
        {
          w: "Encoder and decoder differ mainly in size.",
          r: "The architectural difference is **bidirectional versus causal " +
            "attention**, and that determines everything else — training " +
            "objective, output type, and what each can do. Size is a " +
            "consequence, not the distinction."
        },
        {
          w: "Encoder-decoder models are the same as encoder-only.",
          r: "**Encoder-decoder** models such as T5 and BART have both halves " +
            "joined by **cross-attention**: the encoder reads the input " +
            "bidirectionally, the decoder generates while attending to it. " +
            "They generate; encoder-only models do not."
        }
      ],

      trade: {
        buys: [
          "Bidirectional context — every token sees the full sequence.",
          "Strong representations for classification and retrieval.",
          "Small and fast — CPU-viable.",
          "One forward pass produces all embeddings.",
          "Cheap to fine-tune on specific tasks."
        ],
        costs: [
          "Cannot generate text.",
          "Fixed maximum sequence length, typically 512 tokens.",
          "Needs a task-specific head and usually fine-tuning.",
          "Masked-token training does not match downstream use exactly.",
          "Weaker at reasoning and open-ended tasks."
        ],
        avoid: [
          "You need generated text — use a **decoder**.",
          "The task requires reasoning or open-ended output.",
          "Input and output are distinct sequences — encoder-decoder.",
          "A general model with prompting is good enough and simpler."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "decoder",

      why: {
        before: "Encoders produce excellent representations and cannot produce " +
          "text. Sequence-to-sequence models paired an encoder with a decoder " +
          "for translation, and the decoder half was the piece that actually " +
          "generated.",
        problem: "For open-ended generation the encoder half is not needed. " +
          "The task is *continue this sequence*, and the prompt is simply the " +
          "beginning of the sequence rather than a separate input requiring " +
          "its own encoder.",
        shift: "**Keep only the decoder.** Train on next-token prediction with " +
          "causal masking over enormous text corpora. It turned out that this " +
          "single objective, scaled far enough, produces translation, " +
          "summarisation, question answering and reasoning **without " +
          "task-specific training** — because all of those can be expressed as " +
          "*continue this text*. GPT, Llama and Claude are all decoder-only, " +
          "and the architecture won on generality."
      },

      num: {
        t: "The two phases of decoder inference",
        h: ["Phase", "What happens", "Bound by"],
        r: [
          ["**Prefill**", "**process the whole prompt in parallel**", "**compute**"],
          ["**Decode**", "**one token at a time**", "**memory bandwidth**"],
          ["Prefill cost", "O(n²) attention", "parallelisable"],
          ["**Decode cost**", "**one token per forward pass**", "**cannot parallelise**"],
          ["**KV cache**", "**stores past keys and values**", "**grows with context**"]
        ],
        n: "The **prefill/decode split** explains nearly every practical " +
          "property of LLM serving. Prefill processes all prompt tokens at " +
          "once and is **compute-bound**, so a long prompt costs roughly what " +
          "you would expect. Decode generates one token per full forward pass " +
          "and is **memory-bandwidth-bound** — the GPU spends its time reading " +
          "weights, not computing — which is why generating 1,000 tokens costs " +
          "far more than reading 1,000, why batching many requests together " +
          "improves throughput so dramatically, and why **speculative " +
          "decoding** (a small model drafts several tokens, the large model " +
          "verifies them in one pass) is such an effective optimisation. The " +
          "**KV cache** makes decode linear rather than quadratic per step, " +
          "and its memory grows with context length — often becoming the " +
          "binding constraint on how many concurrent requests a GPU can hold."
      },

      miss: [
        {
          w: "Decoder-only models cannot understand text, only continue it.",
          r: "Understanding is **implicit in prediction**. Predicting the next " +
            "token well over a large enough corpus requires modelling syntax, " +
            "semantics, factual structure and reasoning. That capability is " +
            "what emerged from scale."
        },
        {
          w: "Generating a token costs the same as reading one.",
          r: "Reading happens in **parallel prefill**; generating requires a " +
            "**full forward pass per token**. Output tokens are typically " +
            "several times more expensive than input tokens, which is why " +
            "provider pricing separates them."
        },
        {
          w: "The KV cache is an optional optimisation.",
          r: "Without it, every generated token would recompute attention over " +
            "the entire sequence from scratch — quadratic cost per token " +
            "rather than linear. Generation would be impractically slow. Every " +
            "production serving stack depends on it."
        },
        {
          w: "Decoder-only won because it is architecturally superior.",
          r: "It won on **generality and scaling**: one objective, one " +
            "architecture, no task-specific heads, and it improved predictably " +
            "with scale. Encoder-decoder models still perform competitively on " +
            "translation and summarisation specifically."
        }
      ],

      trade: {
        buys: [
          "One architecture and objective for every text task.",
          "Scales predictably — capability grows with size and data.",
          "No task-specific fine-tuning required.",
          "In-context learning from examples in the prompt.",
          "KV caching makes generation linear per token."
        ],
        costs: [
          "Sequential generation — cannot parallelise decode.",
          "Memory-bandwidth-bound, so tokens are expensive.",
          "KV cache memory grows with context and limits concurrency.",
          "Unidirectional context weakens embedding quality.",
          "Very large compared with task-specific encoders."
        ],
        avoid: [
          "You need embeddings for retrieval — use an **encoder**.",
          "The task is high-volume classification — an encoder is far " +
            "cheaper.",
          "Latency is critical and the task is narrow.",
          "Input and output are distinct and encoder-decoder fits better."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prompt-caching",

      why: {
        before: "Every request reprocesses its entire prompt. A RAG " +
          "application sending a 20,000-token system prompt and document set " +
          "with each turn pays the full prefill cost every time, even though " +
          "the first 19,800 tokens are byte-identical to the previous call.",
        problem: "That is pure waste. The **KV cache** for those tokens was " +
          "computed and then discarded at the end of the request, and " +
          "recomputing it dominates both latency and cost for prompt-heavy " +
          "applications.",
        shift: "**Persist the KV cache for a prompt prefix across requests.** " +
          "Because causal masking guarantees a token's representation depends " +
          "only on what came before it, the cached keys and values for an " +
          "unchanged prefix remain **exactly valid**. A subsequent request " +
          "with the same prefix skips prefill for that portion — typically " +
          "**90% cheaper and several times faster** on the cached part."
      },

      num: {
        t: "Typical economics of a cached prefix",
        h: ["", "Uncached", "Cache write", "Cache read"],
        r: [
          ["Relative cost", "1×", "**~1.25×**", "**~0.1×**"],
          ["Break-even", "—", "**after ~2 reads**", "—"],
          ["Latency on prefix", "full prefill", "full prefill", "**near zero**"],
          ["**Typical TTL**", "—", "**~5 minutes, refreshed on use**", "—"]
        ],
        n: "The rule that follows from the mechanism: **caching matches an " +
          "exact prefix, so put everything stable at the front and everything " +
          "variable at the end**. System prompt, tool definitions and " +
          "retrieved documents first; the user's message last. Changing a " +
          "single character anywhere in the prefix invalidates the cache from " +
          "that point on — which is why injecting a timestamp or a request ID " +
          "near the top of a system prompt silently destroys the entire saving " +
          "and is one of the most common self-inflicted costs in production " +
          "LLM applications. The economics also set a floor: a **cache write " +
          "costs more than an uncached call**, so a prefix used once is a net " +
          "loss and it pays off from roughly the second read. The short TTL " +
          "means it helps conversations and bursts of related traffic, not " +
          "requests scattered across hours."
      },

      miss: [
        {
          w: "Caching works on any repeated text in the prompt.",
          r: "It matches an **exact prefix from the very beginning**. " +
            "Identical text in the middle of two prompts does not match if " +
            "anything before it differs. Prefix order is the entire mechanism."
        },
        {
          w: "It always saves money.",
          r: "A **cache write costs more than an uncached request** — around " +
            "25% more. A prefix read fewer than about two times is a net loss. " +
            "Cache deliberately chosen prefixes, not every prompt."
        },
        {
          w: "The cache lasts as long as the conversation.",
          r: "Typical TTL is around **five minutes**, refreshed on each use. A " +
            "user who returns after ten minutes pays full price again. It " +
            "helps active sessions and traffic bursts, not long gaps."
        },
        {
          w: "It changes the model's output.",
          r: "The cached keys and values are **identical** to what would have " +
            "been recomputed, so results are unchanged. It is purely a " +
            "computational saving — this is guaranteed by causal masking, not " +
            "an approximation."
        }
      ],

      trade: {
        buys: [
          "Around 90% cost reduction on cached prefix tokens.",
          "Much lower time-to-first-token.",
          "Identical output — no quality trade-off.",
          "Makes large system prompts and RAG context affordable.",
          "Enables long tool definitions without per-call penalty."
        ],
        costs: [
          "Cache writes cost more than uncached requests.",
          "Requires prompts structured stable-first.",
          "Short TTL limits it to active sessions.",
          "Any prefix change invalidates everything after it.",
          "Adds a structural constraint to prompt design."
        ],
        avoid: [
          "Prompts are short — there is nothing to save.",
          "Every request has a unique prefix.",
          "Requests are spread far beyond the TTL.",
          "The prefix would be read only once."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});

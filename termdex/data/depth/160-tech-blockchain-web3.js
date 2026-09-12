(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "blockchain",
      why: {
        before: "Digital transactions and financial ledgers required centralized trusted intermediaries (banks, clearing houses, governments) to prevent double-spending and maintain balance sheets.",
        problem: "Centralized ledgers represented single points of failure, were vulnerable to censorship, arbitrary confiscation, internal fraud, and charged high rent-seeking transaction fees.",
        shift: "Satoshi Nakamoto introduced the Blockchain in 2008: combining cryptographic hashing, peer-to-peer networks, Merkle trees, and proof-of-work consensus into an immutable, decentralized, append-only distributed ledger."
      },
      num: {
        t: "Blockchain Architecture & Ledger Primitives",
        h: ["Blockchain Component / Layer", "Underlying Cryptographic Primitive", "Data Structure / Storage Model", "Integrity & Validation Rule", "Primary Failure / Attack Vector"],
        r: [
          ["Block Header", "SHA-256 / Keccak-256 hash pointer", "Contains `prev_block_hash`, Merkle root, timestamp, nonce, bits", "Block hash must satisfy network difficulty target threshold", "51% majority hashrate reorganization attack"],
          ["Transaction Layer", "Asymmetric Cryptography (ECDSA secp256k1 / Ed25519)", "UTXO (Bitcoin) or Account/Balance state model (Ethereum)", "Digital signature verifies ownership of private key; zero double-spend", "Private key theft, signature replay attacks, signature malleability"],
          ["State & History Proofs", "Merkle Tree / Modified Patricia Merkle Tree", "Binary tree or 16-ary hexary trie of cryptographic hashes", "$O(\\log N)$ light-client SPV inclusion proofs without full ledger download", "State bloat; disk I/O saturation during state trie traversal"],
          ["Peer-to-Peer Gossiping", "Kademlia DHT / libp2p wire protocol", "TCP overlay network exchanging inventory packets (inv/getdata)", "Nodes independently validate every block and transaction before relaying", "Sybil attacks, eclipse attacks, network ISP censorship"]
        ],
        n: "A blockchain is fundamentally a cryptographically secured, append-only linked list of data blocks distributed across a peer-to-peer network without centralized administration. Each block contains a cryptographic hash pointer to the header of the immediately preceding block (`prev_block_hash`), creating an unbroken chain back to the Genesis Block. Inside each block, transactions are bundled and hashed into a Merkle Tree, where the root hash represents a tamper-evident fingerprint of all included transactions. If an adversary attempts to modify a single transaction in a historical block, the Merkle root changes, which alters the block's header hash, which invalidates all subsequent block pointers in the chain. Tampering with historical state thus requires mathematically re-mining every subsequent block at immense computational expense, rendering historical transactions functionally immutable."
      },
      miss: [
        {
          w: "A blockchain is just a slower, more expensive distributed relational SQL database.",
          r: "A blockchain is an adversarial Byzantine fault-tolerant state machine designed to operate across untrusted participants without a central coordinator; comparing it to a trusted SQL database misses its trust-minimization purpose."
        },
        {
          w: "Data stored on a blockchain is automatically encrypted and completely private.",
          r: "Blockchains are public, transparent ledgers; every transaction, smart contract code, and balance is visible to anyone running a node, unless specialized zero-knowledge cryptography (ZK-SNARKs) is used."
        },
        {
          w: "Once a transaction is included in a block, it is 100% permanently finalized and can never be reversed.",
          r: "In Proof-of-Work systems, finality is probabilistic; a temporary chain reorganization (reorg) can orphan recent blocks until sufficient confirmations (e.g. 6 blocks on Bitcoin) make reorganization statistically impossible."
        },
        {
          w: "Blockchains can easily process tens of thousands of transactions per second on base layer L1 without trade-offs.",
          r: "The Blockchain Trilemma (Vitalik Buterin) proves that maximizing throughput on L1 forces sacrifices in either decentralization (higher node hardware requirements) or security, necessitating Layer-2 rollups."
        }
      ],
      trade: {
        buys: [
          "Trust-minimized settlement: transacting parties settle high-value digital assets without requiring trusted intermediaries.",
          "Censorship resistance: no central authority or government can freeze accounts, reverse valid transactions, or block participation.",
          "Cryptographic auditability: immutable ledger history provides a mathematically verifiable audit trail of every transaction forever.",
          "Continuous uptime: decentralized peer-to-peer topology operates resiliently without single points of hardware failure."
        ],
        costs: [
          "Low transaction throughput: base-layer consensus constraints limit L1 throughput (Bitcoin ~7 TPS, Ethereum L1 ~15-30 TPS).",
          "High transaction costs (gas fees): network congestion creates fee bidding wars, making microtransactions economically impractical.",
          "State bloat overhead: running full archival nodes requires terabytes of high-performance NVMe SSD storage and fast bandwidth.",
          "Irreversible execution risk: lost private keys or sending funds to incorrect addresses results in permanent, irremediable financial loss."
        ],
        avoid: [
          "Using a public blockchain for applications that require high-throughput, low-latency relational queries (use PostgreSQL).",
          "Storing large multimedia files, video streams, or raw dataset blobs directly on-chain (use IPFS, Arweave, or S3).",
          "Assuming transactions are permanently final after 1 single block confirmation on Proof-of-Work chains.",
          "Using centralized permissioned blockchains when a standard distributed database (Spanner, CockroachDB) would be 1000x faster."
        ]
      }
    },
    {
      slug: "smart-contract",
      why: {
        before: "Blockchains like Bitcoin were restricted to simple value transfers using limited, non-Turing-complete scripting languages (`Script`), preventing complex business logic or programmable financial workflows.",
        problem: "Executing arbitrary logic across untrusted decentralized nodes risked infinite loops (Halting Problem) freezing the network, and lack of state storage prevented decentralized applications.",
        shift: "Vitalik Buterin conceived Ethereum and the Ethereum Virtual Machine (EVM) in 2013, creating Smart Contracts: self-executing, Turing-complete programs stored on-chain that run deterministically across all network nodes, metered by 'Gas'."
      },
      num: {
        t: "Smart Contract Execution Engines & Virtual Machines",
        h: ["Virtual Machine / Runtime", "Primary Smart Contract Language", "Bytecode & Memory Architecture", "Halting Problem Solution", "State Storage & Execution Model"],
        r: [
          ["Ethereum Virtual Machine (EVM)", "Solidity, Vyper", "256-bit stack-based architecture; 32-byte words", "Gas metering: every opcode costs gas; out-of-gas reverts state", "Account-based; global Merkle Patricia state trie"],
          ["Solana Sealevel", "Rust, C", "eBPF-based register bytecode; multi-threaded", "Transaction compute budget unit limits", "Account-based with explicit account pass lists; parallel execution"],
          ["CosmWasm (Cosmos)", "Rust", "WebAssembly (Wasm) sandbox execution", "Gas metering injected into Wasm bytecode at compile time", "Actor-based messaging; state stored in IAVL+ tries"],
          ["Move VM (Aptos / Sui)", "Move", "Resource-oriented bytecode with linear logic types", "Gas metering based on computational steps and memory units", "Assets are first-class resources that cannot be duplicated or dropped"]
        ],
        n: "A smart contract is an immutable, autonomous program deployed to a specific address on a blockchain. In the EVM, smart contracts are compiled from high-level languages like Solidity into EVM bytecode consisting of opcodes (`SSTORE`, `SLOAD`, `ADD`, `CALL`). Determinism is absolute: every node in the world must compute the exact same state transition given the same input transactions. To solve the Halting Problem and protect nodes against infinite loops or denial-of-service exploits, Ethereum introduces 'Gas'—an execution fee where every opcode has a fixed gas cost. If the gas limit provided by the transaction sender is exhausted before execution completes, the EVM triggers an Out-of-Gas exception: all state changes are completely reverted, but the consumed transaction fee is awarded to the block validator to compensate for consumed CPU cycles."
      },
      miss: [
        {
          w: "Smart contracts are legally binding contracts recognized automatically by international courts of law.",
          r: "Smart contracts are software programs executing deterministically on a blockchain; their legal enforceability depends entirely on real-world jurisdictional legal frameworks."
        },
        {
          w: "Smart contracts can fetch real-world data (like weather or stock prices) via standard HTTP REST APIs.",
          r: "Blockchains are isolated, deterministic state machines with no internet access; fetching external real-world data requires decentralized Oracle networks (such as Chainlink)."
        },
        {
          w: "Deploying an updated smart contract automatically overwrites the code of the existing contract.",
          r: "Smart contract code is immutable once deployed; upgrades require complex proxy patterns (ERC-1967 Transparent/UUPS proxies) where a proxy delegates calls to an updated implementation address."
        },
        {
          w: "If a smart contract compiles without errors, it is safe from security exploits and reentrancy attacks.",
          r: "Smart contracts are susceptible to severe logic vulnerabilities (reentrancy, integer overflow, flash loan exploits, front-running) that have resulted in billions of dollars in losses."
        }
      ],
      trade: {
        buys: [
          "Deterministic execution: guarantees that business logic and asset transfers execute exactly as coded without human interference.",
          "Composability ('Money Legos'): contracts interact with other contracts permissionlessly within a single atomic transaction.",
          "Disintermediation: removes expensive escrow agents, brokers, and clearing houses from financial and legal transactions.",
          "Transparent governance: operational rules and treasury allocations are publicly auditable in open-source contract code."
        ],
        costs: [
          "Code immutability liability: security bugs and logic flaws cannot be patched without complex proxy architectures or hard forks.",
          "High bug lethality: vulnerabilities are public to the entire world; exploits result in irreversible financial theft within seconds.",
          "Execution cost overhead: computational operations and on-chain storage are thousands of times more expensive than AWS/GCP.",
          "Oracle dependency: systems that require real-world external data depend on oracles, introducing external trust assumptions."
        ],
        avoid: [
          "Calling external untrusted contracts before updating internal state balances (violating Checks-Effects-Interactions, risking reentrancy).",
          "Storing large strings, images, or massive arrays in contract storage (`SSTORE` is the most expensive opcode).",
          "Using block timestamps (`block.timestamp`) as a source of secure random numbers (miners can manipulate timestamps).",
          "Deploying smart contracts to production without comprehensive formal verification and external independent security audits."
        ]
      }
    },
    {
      slug: "consensus-mechanism",
      why: {
        before: "Distributed database systems used classical crash-fault-tolerant consensus algorithms (Paxos, Raft), which assume all participating server nodes are known, authenticated, and honest.",
        problem: "In an open, permissionless network across the global internet, malicious actors can create millions of fake virtual nodes (Sybil Attack) to seize majority control and double-spend funds.",
        shift: "Consensus Mechanisms (Proof of Work, Proof of Stake, BFT) combine economic incentives, game theory, and cryptography to achieve decentralized agreement on the canonical history of transactions in adversarial environments."
      },
      num: {
        t: "Consensus Mechanism Taxonomy & Game-Theoretic Profiles",
        h: ["Consensus Mechanism", "Scarce Sybil Resource", "Consensus Protocol / Engine", "Energy Consumption", "Finality Type & Slashing Mechanism"],
        r: [
          ["Proof of Work (PoW)", "Physical compute hardware (ASIC hashing energy)", "Nakamoto Consensus (Longest / Heaviest Chain Rule)", "Massive (gigawatt-scale global electrical draw)", "Probabilistic finality; no in-protocol slashing (capital wasted in energy)"],
          ["Proof of Stake (PoS)", "Financial capital / tokens (staked coins)", "Casper FFG / Gasper / Tendermint BFT", "Negligible (< 0.01% of PoW energy)", "Deterministic / Economic finality; in-protocol slashing destroys validator stake"],
          ["Delegated Proof of Stake (DPoS)", "Token voting rights electing fixed delegates", "Round-robin block production among 21-100 elected witnesses", "Negligible", "Fast deterministic finality; voted out of office if validator acts maliciously"],
          ["Proof of Authority (PoA)", "Real-world legal identity and organizational reputation", "Raft / PBFT among authorized corporate nodes", "Zero", "Instant deterministic finality; revocation of node authority in private consortium"],
          ["Proof of History (PoH)", "Verifiable Delay Function (VDF) sequential time proofs", "Tower BFT (Solana) integrating continuous SHA-256 iterations", "Low", "Sub-second deterministic finality; synchronized clock without network overhead"]
        ],
        n: "The consensus mechanism is the mathematical and economic foundation of a decentralized state machine. In the presence of Byzantine faults (where nodes may crash, lie, or act maliciously), the FLP Impossibility Theorem proves that no deterministic asynchronous consensus protocol can guarantee both safety (nothing bad happens) and liveness (something good eventually happens). Nakamoto Consensus bypassed this by introducing economic work: validators solve SHA-256 computational puzzles where the probability of finding a valid block is proportional to the miner's fraction of global hashrate. Modern Proof-of-Stake protocols (such as Ethereum's Gasper combining Casper FFG and LMD-GHOST) replace physical energy with financial stake: validators deposit 32 ETH as collateral. If a validator double-signs or proposes conflicting blocks, their staked capital is programmatically destroyed ('slashed') by the protocol."
      },
      miss: [
        {
          w: "Proof of Stake makes the richest validator win every single block reward automatically.",
          r: "PoS selects block proposers pseudorandomly weighted by stake; while having more stake increases the statistical probability of being chosen, smaller validators still earn proportional yields."
        },
        {
          w: "Proof of Work consensus uses puzzle difficulty to encrypt user transactions.",
          r: "Proof of Work puzzles have nothing to do with encryption; the hashing puzzle is merely an artificial rate-limiter designed to make Sybil attacks and history rewriting computationally expensive."
        },
        {
          w: "Proof of Stake is completely unproven and fundamentally less secure than Proof of Work.",
          r: "Ethereum has secured hundreds of billions of dollars on PoS since 'The Merge' in 2022; PoS provides higher economic security per dollar of issuance because slashing destroys attacker capital."
        },
        {
          w: "Consensus mechanisms can prevent bugs or vulnerabilities in smart contract business logic.",
          r: "Consensus only guarantees that all nodes agree on the *ordering and execution* of transactions; it has zero ability to prevent bugs or economic exploits in smart contracts."
        }
      ],
      trade: {
        buys: [
          "Sybil attack immunity: anchors voting power to scarce physical (hashrate) or economic (capital stake) resources.",
          "Byzantine fault tolerance: maintains network integrity and ledger agreement even if up to 33% (BFT) or 50% (PoW) of nodes are malicious.",
          "Decentralized settlement: eliminates reliance on a central server, clearing house, or banking monopoly.",
          "Censorship resilience: valid transactions propagate and get included in blocks regardless of geographic or political boundaries."
        ],
        costs: [
          "Energy consumption (PoW): Proof of Work requires massive physical electrical power to secure network state.",
          "Capital lockup (PoS): validators must lock up substantial financial capital in staking contracts, reducing asset liquidity.",
          "Consensus messaging latency: achieving round-trip signature consensus across thousands of nodes takes seconds to minutes.",
          "Capital concentration risk: in PoS, large staking pools and liquid staking protocols (e.g. Lido) can amass centralized voting blocks."
        ],
        avoid: [
          "Relying on low-hashrate Proof of Work algorithms for new tokens, making them trivial targets for 51% rental attacks.",
          "Confusing private permissioned consortium consensus (PBFT/Raft) with open public permissionless consensus.",
          "Allowing single staking entities or cloud hosting providers (e.g. AWS) to control more than 33% of validator nodes.",
          "Assuming instant finality on Proof-of-Work chains before awaiting sufficient probabilistic block confirmations."
        ]
      }
    },
    {
      slug: "cryptocurrency",
      why: {
        before: "Digital money (PayPal, credit cards, bank wire networks) was entirely ledger entries inside centralized private databases, subject to government capital controls, chargebacks, and continuous monetary inflation.",
        problem: "Users did not truly own their digital wealth; accounts could be frozen arbitrarily, cross-border remittances took 3-5 business days with 5-10% fees, and central banks expanded money supply without limit.",
        shift: "Cryptocurrency established sovereign, bearer digital assets native to decentralized peer-to-peer networks, where cryptographic ownership is enforced mathematically by private keys and monetary policy is codified in software."
      },
      num: {
        t: "Cryptocurrency Asset Classes & Tokenomics Models",
        h: ["Cryptocurrency Category", "Primary Monetary Function", "Supply Mechanics / Issuance", "Underlying State Architecture", "Example Assets"],
        r: [
          ["Digital Gold / Hard Money", "Store of value; censorship-resistant wealth preservation", "Hard cap: 21,000,000 max supply; programmatic halving every 210k blocks", "Unspent Transaction Output (UTXO)", "Bitcoin (BTC)"],
          ["Programmable Smart Contract Gas", "Utility token powering decentralized state execution", "Dynamic issuance; EIP-1559 base fee burning creates deflationary pressure", "Account / Balance state model", "Ethereum (ETH), Solana (SOL), Avalanche (AVAX)"],
          ["Fiat-Collateralized Stablecoin", "Medium of exchange; unit of account; volatility hedge", "Elastic supply; 1:1 fiat reserves minted/redeemed via centralized custodian", "ERC-20 / SPL token smart contract", "USDC (Circle), USDT (Tether)"],
          ["Algorithmic / Crypto-Backed Stablecoin", "Decentralized stable medium of exchange", "Over-collateralized by crypto vaults (DAI) or dual-token algorithmic mint/burn", "MakerDAO Collateralized Debt Position (CDP) smart contracts", "DAI / USDS (Sky/Maker), LUSD (Liquity)"],
          ["Governance & Utility Tokens", "Decentralized protocol voting rights and fee sharing", "Emitted via liquidity mining; subject to vesting schedules and token unlocks", "Standard ERC-20 / ERC-721 token contracts", "UNI (Uniswap), AAVE (Aave), ARB (Arbitrum)"]
        ],
        n: "A cryptocurrency is fundamentally a digital bearer asset whose ownership is recorded on an append-only distributed ledger and secured by public-key cryptography. Unlike fiat bank accounts, which represent legal claims against a financial institution, holding the private key to a cryptocurrency address gives the holder unilateral, mathematical control over the asset ('Not your keys, not your coins'). Transactions are verified by decentralized nodes through cryptographic signature verification (e.g., ECDSA or Schnorr signatures). In the Bitcoin UTXO model, transactions consume previous unspent outputs and create new ones, preventing double-spending without needing an explicit balance table. In the Ethereum account model, transactions mutate global account balances and nonces, enabling rich programmable token ecosystems via ERC-20 fungible and ERC-721 non-fungible token standards."
      },
      miss: [
        {
          w: "Cryptocurrency transactions are completely anonymous and untraceable by law enforcement.",
          r: "Cryptocurrency is pseudonymous, not anonymous; the entire blockchain ledger is permanently public, allowing blockchain analytics firms (Chainalysis) to trace fund flows and link addresses to KYC exchanges."
        },
        {
          w: "Cryptocurrency coins are stored inside your physical hardware wallet (e.g. Ledger or Trezor).",
          r: "Cryptocurrency assets reside entirely on the decentralized blockchain; hardware wallets only store the *private keys* and seed phrases required to sign transactions authorizing transfers."
        },
        {
          w: "All cryptocurrencies are speculative Ponzi schemes with zero real-world utility.",
          r: "Cryptocurrencies provide multi-billion dollar real-world utility: borderless international remittances settling in seconds, stablecoins protecting against hyperinflation in emerging markets, and decentralized collateral."
        },
        {
          w: "If you lose your private key or seed phrase, customer support can recover your cryptocurrency.",
          r: "In non-custodial decentralized cryptocurrency networks, there is no central authority, company, or customer support; losing private keys results in irreversible, permanent asset loss."
        }
      ],
      trade: {
        buys: [
          "Financial sovereignty: true bearer ownership of wealth that cannot be confiscated, frozen, or debased by third parties.",
          "Permissionless global settlement: send millions of dollars globally in seconds for minor network fees 24/7/365.",
          "Predictable monetary policy: mathematical supply caps and issuance schedules are hardcoded in open-source software.",
          "Programmable liquidity: enables automated decentralized finance (DeFi) lending, borrowing, and token trading."
        ],
        costs: [
          "High market volatility: speculative price swings make many cryptocurrencies risky for short-term pricing and payments.",
          "Severe personal security burden: users are 100% responsible for seed phrase backup, key management, and phishing defense.",
          "Regulatory uncertainty: evolving international regulatory frameworks (taxation, securities laws) introduce compliance risk.",
          "Irreversibility liability: no chargeback or dispute resolution mechanism exists for accidental or fraudulent transfers."
        ],
        avoid: [
          "Storing large cryptocurrency balances on centralized exchanges (FTX, Mt. Gox collapse risk) instead of self-custody cold wallets.",
          "Entering seed phrases or private keys on any digital website, unverified app, or cloud storage document.",
          "Investing in high-yield algorithmic stablecoins that lack over-collateralization (e.g. Terra/Luna collapse).",
          "Sending transactions across blockchain networks without first sending a small test transaction to verify recipient addresses."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));

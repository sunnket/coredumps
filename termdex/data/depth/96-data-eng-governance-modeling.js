/* ==========================================================================
   Depth pass 96 — Data Engineering batch 4: Governance, Catalogs & Dimensional Modeling.
   Data Governance, Data Catalog, Schema Evolution,
   Star Schema, Snowflake Schema, Fact Table, Dimension Table.

   Role-based access policies secure centralized metadata assets;
   denormalized dimensional hierarchies optimize analytical join topologies.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "data-governance",

      why: {
        before: "Organizations dumped data into massive repositories with zero centralized policies, allowing sensitive employee salaries, customer credit cards, and PII to sit unencrypted and unmonitored with universal read permissions.",
        problem: "Unregulated data sprawl triggers catastrophic regulatory fines (GDPR, CCPA, HIPAA), security breaches, conflicting metric definitions, and zero organizational accountability for data accuracy.",
        shift: "**Data Governance: The overarching framework of people, processes, policies, and technologies that ensures an organization's data assets are secure, high-quality, discoverable, compliant, and effectively utilized.** Encompasses access control (RBAC/ABAC), privacy compliance, data cataloging, retention lifecycles, and data stewardship."
      },

      num: {
        t: "Data Governance Core Pillars, Regulatory Drivers & Technical Enforcements",
        h: ["Pillar", "Regulatory / Business Driver", "Primary Technical Mechanism", "Operational Implementation", "Risk of Omission"],
        r: [
          ["Security & Privacy", "GDPR, HIPAA, SOC 2, PCI-DSS", "Role-Based & Attribute-Based Access Control (RBAC/ABAC)", "Dynamic column-level data masking & row-level filtering", "Multi-million dollar regulatory fines / leaks"],
          ["Data Quality & Trust", "Executive decision-making / BI accuracy", "Automated schema tests & validation circuit breakers", "Continuous dbt/Great Expectations assertions", "Decisions based on false revenue figures"],
          ["Data Discoverability", "Engineering productivity & self-service BI", "Automated metadata cataloging & business glossaries", "Data catalogs (Atlan, Alation, DataHub)", "Duplicated engineering effort / data silos"],
          ["Compliance & Lineage", "GDPR 'Right to be Forgotten' / BCBS 239", "End-to-end Column-Level Lineage (OpenLineage)", "Automated AST parsing and PII tracing", "Inability to locate customer data during audits"],
          ["Lifecycle Management", "Cost optimization & legal discovery", "Object lifecycle rules & automated data retention policies", "S3 Glacier auto-tiering & partition drops", "Astronomical storage bills / legal exposure"]
        ],
        n: "Data Governance transforms data from an unmanaged liability into an audited, secure enterprise asset. In modern cloud data platforms, governance is enforced programmatically at the query compilation layer rather than through manual human gatekeeping. Using **Attribute-Based Access Control (ABAC)** and **Dynamic Data Masking**: when an analyst in role `finance_viewer` executes `SELECT email, ssn, salary FROM employees`, the warehouse query planner rewrites the AST on-the-fly, replacing sensitive values with cryptographic hashes or asterisks (`***-**-6789`) based on column tags (`tag:PII = confidential`). Governance establishes formal **Data Ownership**: assigning dedicated Data Stewards responsible for data contracts, schema approvals, and data freshness SLAs across business domains."
      },

      miss: [
        {
          w: "Data governance is just a legal compliance checklist created by HR and lawyers.",
          r: "Modern data governance is deeply technical: it is implemented through code as automated access policies, programmatic column masking, automated lineage extraction, schema registry rules, and CI/CD data quality assertions."
        },
        {
          w: "Strict data governance slows down data science and engineering teams.",
          r: "Poor governance slows teams down: engineers waste 40% of their time searching for data, deciphering column definitions, and fixing broken pipelines. Well-governed self-service platforms with automated access workflows accelerate analytics."
        },
        {
          w: "Granting read-only access to an entire database is safe for internal employees.",
          r: "Internal employees represent a primary vector for data leaks. Principle of Least Privilege mandates that employees receive access ONLY to specific curated data marts, with all PII and sensitive salary columns masked by default."
        },
        {
          w: "Data governance can be solved simply by buying a data catalog tool.",
          r: "A data catalog is merely software tooling. Governance requires clear organizational ownership, defined data stewardship roles, agreed-upon business glossaries, and cross-functional enforcement between software engineers and analytics teams."
        }
      ],

      trade: {
        buys: [
          "Guarantees legal and regulatory compliance with GDPR, CCPA, HIPAA, and SOC 2 audits.",
          "Protects enterprise reputation by preventing unauthorized leaks of sensitive customer PII and financial records.",
          "Eliminates metric confusion by establishing an authoritative, company-wide business glossary (e.g., universal definition of 'churn').",
          "Accelerates self-service analytics by making verified, high-quality data assets easily discoverable."
        ],
        costs: [
          "Organizational friction: establishing stewardship roles and access approval processes requires cross-departmental alignment.",
          "Software licensing and infrastructure costs for enterprise data governance and catalog platforms.",
          "Query processing overhead: dynamic row-filtering and column-masking functions add slight latency to warehouse query planning.",
          "Ongoing maintenance: metadata tags, access policies, and data contracts must be continually reviewed and audited."
        ],
        avoid: [
          "Never store raw, unmasked social security numbers or credit cards in plain-text analytical tables.",
          "Do not implement governance as a manual bureaucratic bottleneck; automate access grants via identity providers (Okta/Entra).",
          "Avoid defining business metrics ad-hoc inside individual BI dashboards; centralize definitions in the governance glossary."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-catalog",

      why: {
        before: "Data analysts joined companies and spent weeks asking colleagues on Slack where specific tables lived, which columns to trust, and how metrics were calculated, while data engineers unknowingly rebuilt tables that already existed.",
        problem: "Enterprise data lakes and warehouses contain tens of thousands of tables; without a centralized search index, data assets remain dark, undocumented, duplicated, and impossible to find.",
        shift: "**Data Catalog: An organized, searchable inventory of an enterprise's data assets, providing metadata, data lineage, schema documentation, profiling statistics, and business context.** Evolved from static wikis to active metadata platforms (Apache Atlas, DataHub, Amundsen, Atlan, Alation)."
      },

      num: {
        t: "Data Catalog Architectures: Metadata Crawling, Integrations & Capabilities",
        h: ["Generation", "Representative Systems", "Metadata Ingestion Model", "Search & Discovery", "Active Governance"],
        r: [
          ["1st Gen: Static Wikis", "Confluence, Google Sheets", "Manual human documentation entry", "Basic keyword text search", "Zero (disconnected from DB)"],
          ["2nd Gen: Passive Catalogs", "Apache Atlas, AWS Glue Catalog", "Scheduled batch crawlers & schema scrapers", "Relational schema indexing", "Static metadata repository"],
          ["3rd Gen: Graph Catalogs", "Lyft Amundsen, LinkedIn DataHub", "Push-based event streams + Graph DB (Neo4j)", "Elasticsearch full-text + PageRank ranking", "Lineage visualization & usage stats"],
          ["4th Gen: Active Metadata", "Atlan, Alation, Monte Carlo", "Bi-directional push/pull + LLM auto-tagging", "Semantic context + column lineage", "Automated policy enforcement & alerting"]
        ],
        n: "A modern Data Catalog serves as the search engine for enterprise data. It models metadata as a continuous graph connecting: **Datasets $\\leftrightarrow$ Schemas $\\leftrightarrow$ Pipelines $\\leftrightarrow$ Owners $\\leftrightarrow$ BI Dashboards**. Catalogs ingest technical metadata (column types, row counts, partition keys, null percentages) via automated API connectors and query log parsers. Full-text search engines (like Elasticsearch) index table descriptions, column names, and sample values, using ranking algorithms (such as PageRank applied to data lineage graphs) to ensure that the most popular and trusted tables appear first in search results. Catalogs bridge technical schemas with business semantics by linking columns to a centralized **Business Glossary**."
      },

      miss: [
        {
          w: "A data catalog stores a physical copy of all the company's data.",
          r: "A data catalog stores strictly **metadata** (data *about* data: schemas, column types, table descriptions, execution statistics, owners), never the actual raw underlying data records."
        },
        {
          w: "Engineers must manually type descriptions for every table for a catalog to be useful.",
          r: "Modern catalogs leverage automated metadata harvesting: extracting descriptions from Git repos (dbt docs), parsing SQL comments, inferring relationships from query history, and using LLMs to suggest draft column descriptions."
        },
        {
          w: "A data catalog is only useful for non-technical business users.",
          r: "Data engineers use catalogs daily to perform impact analysis, identify unused tables for deprecation, check pipeline run histories, and debug upstream schema changes."
        },
        {
          w: "All data catalogs keep metadata synchronized in real time automatically.",
          r: "Traditional catalogs rely on scheduled nightly crawler batch jobs. If a table schema changes at noon, the catalog remains outdated until the nightly crawl completes, unless configured with event-driven metadata streaming (DataHub)."
        }
      ],

      trade: {
        buys: [
          "Dramatically accelerates data discovery: analysts locate trusted datasets in seconds using natural language search.",
          "Prevents duplicated engineering effort: engineers verify existing tables before building redundant pipelines.",
          "Establishes clear data ownership: identifies the exact team and engineer responsible for maintaining each table.",
          "Bridges business and technical silos: maps abstract business terms directly to physical database columns."
        ],
        costs: [
          "Ongoing maintenance overhead: requires continuous culture and process enforcement to prevent metadata obsolescence.",
          "High enterprise software licensing costs for modern SaaS data catalog platforms.",
          "Crawler performance impact: poorly scheduled metadata crawlers can add read locks and query load on production warehouses.",
          "Requires integration maintenance across shifting cloud warehouses, orchestrators, and BI tools."
        ],
        avoid: [
          "Never deploy a data catalog without integrating automated dbt documentation and SQL lineage pipelines.",
          "Do not allow multiple conflicting business glossary definitions for core financial terms (e.g., 'Active Customer').",
          "Avoid using catalogs as passive read-only wikis; integrate catalog tags into automated warehouse access control."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "schema-evolution",

      why: {
        before: "Modifying a database column, adding a field, or changing a data type broke downstream ETL pipelines, corrupted historical records, or required taking the entire data platform offline for hours to rewrite petabytes of historical files.",
        problem: "Real-world business requirements evolve continuously; applications frequently add new attributes, rename fields, or alter data types without coordinating with downstream analytical consumers.",
        shift: "**Schema Evolution: The set of rules, protocols, and storage capabilities that allow a data platform to adapt to changing schemas over time without rewriting historical data or breaking downstream consumers.** Formalized via serialization frameworks (Avro, Protobuf) and modern open table formats (Iceberg, Delta Lake)."
      },

      num: {
        t: "Schema Evolution Compatibility Modes (Avro / Confluent Schema Registry)",
        h: ["Compatibility Mode", "Producer / Consumer Evolution Rule", "Allowed Operations", "Deployment Order", "Failure Scenario"],
        r: [
          ["BACKWARD", "Consumers with new schema can read old producer data", "Delete optional fields, add fields with defaults", "Upgrade consumers first", "New consumer fails on missing default values"],
          ["FORWARD", "Consumers with old schema can read new producer data", "Add new optional fields, delete fields with defaults", "Upgrade producers first", "Old consumer crashes on unexpected new required field"],
          ["FULL (Bidirectional)", "Simultaneously Backward and Forward compatible", "Add/delete ONLY optional fields with defaults", "Upgrade in any order", "Renaming a field or altering data type"],
          ["NONE", "No schema validation enforced", "Any arbitrary change permitted", "No guarantees", "Downstream pipelines crash with parsing exceptions"]
        ],
        n: "Schema evolution operates differently across streaming and storage layers: (1) In **Streaming (Kafka/Avro)**: Evolution is governed by mathematical compatibility modes enforced by the Schema Registry. To maintain **FULL compatibility**, any newly added field must include a default value (`\"default\": null`), and deleted fields must have had a default value, ensuring that old and new producers and consumers can interoperate across rolling deployments. (2) In **Modern Table Formats (Iceberg/Delta)**: Schemas evolve via **Metadata Re-mapping**. Instead of identifying columns by string name, columns are assigned immutable unique integer **Field IDs**. When a column is renamed (`cust_name` $\\rightarrow$ `customer_name`), the table format simply updates the metadata mapping for Field ID 4 without touching a single physical Parquet file on disk."
      },

      miss: [
        {
          w: "Renaming a column is a safe and backward-compatible schema evolution change.",
          r: "In classical systems, renaming a column is a breaking change: it is interpreted as deleting the old column and adding a new column with null historical values. Only modern formats with unique Field IDs (like Iceberg) support safe column renaming."
        },
        {
          w: "Adding a new required field without a default value is perfectly safe.",
          r: "Adding a required field without a default value breaks backward compatibility immediately: old consumers reading new messages will fail because the required field is missing from existing data."
        },
        {
          w: "Parquet files automatically evolve schemas seamlessly.",
          r: "Standalone Parquet files have fixed internal schemas in their footers. If you change a column type in newer files, reading a mixed directory of Parquet files in Spark triggers a `SchemaMergeException` unless explicit schema merging or an open table format is used."
        },
        {
          w: "Schema evolution can convert any data type to any other data type (e.g., string to integer).",
          r: "Type widening is strictly bounded: an integer can safely evolve to a long, or a float to a double. Narrowing conversions (long to integer) or converting arbitrary text strings to integers causes irreversible data loss or runtime casting exceptions."
        }
      ],

      trade: {
        buys: [
          "Zero-downtime migrations: allows engineering teams to deploy application database updates without breaking analytical pipelines.",
          "Long-term data longevity: historical data remains readable decades later alongside modern schema revisions.",
          "Decouples producer and consumer deployments: front-end and back-end services deploy independently without coordination locks.",
          "Iceberg/Delta metadata evolution eliminates expensive multi-terabyte data rewrites for simple column renames."
        ],
        costs: [
          "Strict engineering discipline: developers must adhere to rigid schema rules and configure automated CI/CD compatibility tests.",
          "Query complexity: query engines must handle sparse columns and dynamic type widening during plan compilation.",
          "Schema Registry dependency: requires managing a dedicated schema registry cluster in event streaming architectures.",
          "Subtle bugs: improperly configured default values can silently mask missing data in downstream reports."
        ],
        avoid: [
          "Never alter existing column data types in a production pipeline without verifying downstream compatibility.",
          "Do not add new fields to streaming schemas without explicit `default` values.",
          "Avoid renaming columns in traditional data lakes without verifying if the table format supports Field ID tracking."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "star-schema",

      why: {
        before: "Querying transactional databases normalized in Third Normal Form (3NF) required writing complex SQL queries joining 15 to 25 separate tables, creating unreadable queries and crippling database performance during analytical aggregations.",
        problem: "Business analysts need intuitive, fast data models where metrics (sales, revenue) and contextual dimensions (customer, date, store) can be sliced and aggregated with minimal joins.",
        shift: "**Star Schema: A dimensional modeling architecture where a single central Fact Table is directly connected to multiple surrounding denormalized Dimension Tables, forming a star-like structure.** Pioneered by Ralph Kimball in the 1990s, the Star Schema became the universal design pattern for data warehousing and BI."
      },

      num: {
        t: "Star Schema vs 3NF Normalized Modeling for Analytical Query Performance",
        h: ["Dimension", "Star Schema (Kimball)", "Third Normal Form (3NF Inmon)", "Analytical Impact"],
        r: [
          ["Table Structure", "1 Fact table directly joined to $N$ Dimension tables", "Dozens of normalized entity tables (3NF)", "Star schema reduces query joins by 70%"],
          ["Join Complexity", "Simple single-hop inner/left joins", "Complex multi-hop recursive foreign key joins", "Star schema enables fast Star Join optimization"],
          ["Data Redundancy", "Denormalized dimensions (redundant strings)", "Zero redundancy (strict mathematical normalization)", "Storage cost is negligible in modern cloud warehouses"],
          ["Business Understandability", "Intuitive: central business event surrounded by context", "Abstract: reflects software engineering entity ERDs", "Empowers non-technical business users to build BI reports"],
          ["Write / Read Optimization", "Optimized for high-speed analytical READS (OLAP)", "Optimized for fast transactional WRITES (OLTP)", "Star schema maximizes analytical aggregation speed"]
        ],
        n: "In a Star Schema, the architecture consists of: (1) **Fact Table**: Contains numerical, additive business metrics (e.g., `quantity_sold`, `revenue`, `discount_amount`) along with foreign key pointers to surrounding dimensions. Fact tables grow massive (billions of rows) but are narrow in column count. (2) **Dimension Tables**: Contain descriptive context attributes (e.g., `customer_name`, `store_city`, `product_category`). Crucially, dimension tables are completely **denormalized**: hierarchical attributes (e.g., city, state, country) are collapsed into a single `dim_location` table. Query engines optimize star schemas using **Star Join Optimization**: filtering dimensions first via bitmapped indexes to produce a compact list of surrogate keys, then executing a single fast hash join against the fact table."
      },

      miss: [
        {
          w: "Star schema is an outdated legacy concept irrelevant in modern cloud data warehouses.",
          r: "Modern columnar cloud warehouses (Snowflake, BigQuery, Databricks) execute significantly faster on star schemas than on normalized 3NF schemas. Columnar compression neutralizes denormalization storage overhead while simple joins eliminate query plan complexity."
        },
        {
          w: "Dimension tables in a star schema should be normalized to eliminate duplicate strings.",
          r: "Normalizing dimension tables into multiple sub-tables turns a Star Schema into a **Snowflake Schema**. Kimball dimensional modeling explicitly advocates denormalizing dimension tables to maximize query readability and minimize join overhead."
        },
        {
          w: "Fact tables contain customer names, product descriptions, and store addresses.",
          r: "Fact tables should NEVER store descriptive text strings. They store strictly numerical additive metrics and compact integer **Surrogate Keys** pointing to dimension tables, keeping fact table rows ultra-compact."
        },
        {
          w: "A star schema can only represent retail e-commerce sales.",
          r: "The star schema is a universal dimensional modeling paradigm applied across healthcare (facts: patient admissions), finance (facts: bank transfers), telecommunications (facts: call detail records), and SaaS (facts: product usage events)."
        }
      ],

      trade: {
        buys: [
          "Maximum query simplicity: queries require simple single-hop joins between the fact table and dimensions.",
          "Blazing analytical aggregation speed: enables database engines to leverage Star Join and hash join optimizations.",
          "Highly intuitive for business users: BI tools (Tableau, PowerBI) naturally understand star schemas.",
          "Columnar storage synergy: denormalized dimensions compress efficiently using dictionary encoding in Parquet/Snowflake."
        ],
        costs: [
          "Data redundancy: denormalized dimension tables store repetitive string values across thousands of rows.",
          "Dimension update overhead: updating an attribute (e.g., renaming a product category) requires updating many dimension rows.",
          "Inflexible for complex N:M many-to-many relationships without bridging tables.",
          "Requires upfront data modeling effort (dbt transformation layers) to transform raw transactional data into dimensional models."
        ],
        avoid: [
          "Never store raw operational natural keys (e.g., string UUIDs) as join keys; use compact integer Surrogate Keys.",
          "Do not put descriptive text attributes inside the fact table; extract them into dimension tables.",
          "Avoid normalizing dimension tables unless dimension cardinality is so massive that storage becomes a genuine constraint."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "snowflake-schema",

      why: {
        before: "In early on-premises relational databases, disk storage was extremely expensive, making the data redundancy and duplicated strings in denormalized star schema dimension tables a significant cost concern.",
        problem: "Denormalized dimensions in a star schema can contain anomalies during updates; if a city name is spelled differently across rows, reporting aggregates break.",
        shift: "**Snowflake Schema: A variation of the star schema where dimension tables are completely normalized into multiple related sub-dimension tables (Third Normal Form).** Resembles a snowflake geometry with branching hierarchical tables (e.g., `dim_product` $\\rightarrow$ `dim_subcategory` $\\rightarrow$ `dim_category`)."
      },

      num: {
        t: "Architectural Comparison: Star Schema vs Snowflake Schema",
        h: ["Characteristic", "Star Schema", "Snowflake Schema", "Operational Decision Driver"],
        r: [
          ["Dimension Normalization", "Completely denormalized (flat tables)", "Strictly normalized (split into 3NF sub-tables)", "Snowflake eliminates all string redundancy"],
          ["Number of Joins", "Minimal (1 join per dimension needed)", "High (multiple joins to traverse hierarchies)", "Star schema delivers significantly faster query performance"],
          ["Storage Consumption", "Slightly higher (redundant strings)", "Minimal (normalized foreign keys)", "Storage savings in Snowflake schema are negligible in cloud storage"],
          ["Maintenance & Updates", "Updates touch many rows in denormalized tables", "Updates touch exactly one row in normalized sub-table", "Snowflake simplifies dimension attribute updates"],
          ["BI Tool Usability", "Extremely intuitive (drag-and-drop)", "Complex (users must navigate multi-table hierarchies)", "Star schema vastly preferred by self-service business analysts"]
        ],
        n: "The Snowflake Schema modifies the dimensional model by decomposing hierarchical dimensions into normalized relational structures: Fact $\\rightarrow$ Dimension $\\rightarrow$ Sub-Dimension. For example, instead of a single flat `dim_store` containing `[store_id, store_name, city, state, country]`, the Snowflake Schema splits this into three normalized tables: `dim_store` (containing `city_id`), `dim_city` (containing `state_id`), and `dim_state` (containing `country_id`). This satisfies Third Normal Form ($3NF$), eliminating redundant storage of repeated city and country strings. However, when an analytical query aggregates revenue by country, the SQL engine must execute a 4-table join (`fact_sales` $\\bowtie$ `dim_store` $\\bowtie$ `dim_city` $\\bowtie$ `dim_state`), substantially increasing query planning complexity and execution latency."
      },

      miss: [
        {
          w: "Snowflake Schema was invented by the cloud database company Snowflake Inc.",
          r: "The Snowflake Schema was formalized by Ralph Kimball in the 1990s as a theoretical variation of the star schema, decades before Snowflake Inc. was founded. Snowflake Inc. actually recommends using denormalized Star Schemas for optimal query speed."
        },
        {
          w: "Snowflake Schema is faster than Star Schema on modern cloud data warehouses.",
          r: "Snowflake Schemas are almost universally **slower** than Star Schemas for analytical queries because traversing multiple normalized joins increases CPU hash table overhead, whereas modern columnar compression eliminates the storage benefit of normalization."
        },
        {
          w: "Snowflake Schema should never be used under any circumstances.",
          r: "Snowflake Schemas are appropriate when dimension tables have massive cardinality (tens of millions of rows) with complex, deeply nested multi-level hierarchies, or in specialized master data management (MDM) systems where single-point updating is paramount."
        },
        {
          w: "BI tools prefer Snowflake Schemas over Star Schemas.",
          r: "BI tools (PowerBI, Tableau, Looker) are specifically architected around Star Schemas. Navigating complex snowflaked dimension joins confuses non-technical users and complicates automated SQL generation."
        }
      ],

      trade: {
        buys: [
          "Zero data redundancy: eliminates duplicate string values across dimension tables via strict mathematical normalization.",
          "Simplified maintenance: modifying a shared dimension attribute (e.g., renaming a category) updates exactly one row.",
          "Protects data integrity: foreign key constraints prevent orphaned or inconsistently spelled hierarchical attributes.",
          "Efficient storage for massive, multi-million-row dimension tables with complex branching hierarchies."
        ],
        costs: [
          "Degraded query performance: requires complex multi-table joins that slow down analytical queries.",
          "Steep user complexity: business analysts must understand complex normalized entity-relationship graphs to write queries.",
          "Complicates BI reporting layers: requires building complex multi-hop join definitions inside BI tools.",
          "Negligible modern benefit: storage is cheap, and columnar compression already compresses repeated strings efficiently."
        ],
        avoid: [
          "Do not normalize dimensions into a snowflake schema purely to save storage space in modern cloud warehouses.",
          "Avoid snowflaking when your primary data consumers are non-technical business analysts writing ad-hoc SQL.",
          "Never build multi-hop snowflake hierarchies without validating query plan join latency against a flattened star alternative."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "fact-table",

      why: {
        before: "Early databases stored business transactions scattered across dozens of operational tables, mixing descriptive customer text, product specs, and transaction amounts together, making aggregate analytical calculations slow and resource-intensive.",
        problem: "Business intelligence requires measuring numerical performance metrics (sales revenue, website clicks, loan balances) aggregated over time, which requires a specialized table structure optimized for continuous numerical math.",
        shift: "**Fact Table: The primary central table in a dimensional model (star schema) that contains quantitative, numerical measurements (facts) and foreign keys referencing surrounding dimension tables.** The foundation of business metrics in data warehousing."
      },

      num: {
        t: "Fact Table Archetypes (Kimball Dimensional Modeling Taxonomy)",
        h: ["Fact Table Type", "Measurement Grain", "Row Insertion Behavior", "Additivity of Metrics", "Primary Business Example"],
        r: [
          ["Transaction Fact Table", "One row per discrete business event", "Continuous append-only (immutable)", "Fully Additive across all dimensions", "E-commerce order line items, point-of-sale receipts"],
          ["Periodic Snapshot Fact", "One row per entity per time period", "Periodic batch append (e.g. daily/monthly)", "Semi-Additive (cannot sum across time)", "End-of-month bank account balances, daily inventory levels"],
          ["Accumulating Snapshot", "One row per pipeline lifecycle instance", "Row updated as process moves through milestones", "Fully Additive milestone durations", "Order fulfillment tracking: order $\\rightarrow$ ship $\\rightarrow$ deliver"],
          ["Factless Fact Table", "One row per event occurrence (no metrics)", "Append-only tracking of associations", "Non-Additive (supports only `COUNT`)", "Student university class attendance, employee training records"]
        ],
        n: "A Fact Table is strictly defined by its **Grain**—the exact physical real-world event that a single row represents (e.g., 'one row per line item on a customer invoice'). A well-modeled fact table contains two distinct column types: (1) **Foreign Keys**: Integer surrogate keys linking to dimension tables (`customer_key`, `product_key`, `date_key`). (2) **Measures (Facts)**: Numerical values resulting from the event (`quantity`, `unit_price`, `tax_amount`, `gross_revenue`). Facts are mathematically categorized by their **Additivity**: (a) **Fully Additive**: can be meaningfully summed across all dimensions (e.g., sales revenue), (b) **Semi-Additive**: can be summed across some dimensions but NOT across time (e.g., bank account balance—summing balances across days yields garbage), and (c) **Non-Additive**: cannot be summed across any dimension (e.g., unit margins or percentage ratios; must be computed as $\\sum(\\text{margin}) / \\sum(\\text{revenue})$)."
      },

      miss: [
        {
          w: "A fact table should store calculated percentages and ratios directly.",
          r: "Storing ratios (like profit margin percentage) directly in a fact table is a severe anti-pattern because ratios are **non-additive** ($A/B + C/D \\ne (A+C)/(B+D)$). Fact tables must store the raw numerator (`profit`) and denominator (`revenue`), computing ratios on-the-fly in the query layer."
        },
        {
          w: "Fact tables can be modified without declaring a strict grain.",
          r: "Violating the grain destroys analytical integrity. If a fact table mixes invoice-level totals and line-item-level totals in the same table, running `SUM(sales)` double-counts revenue and produces corrupted financial reports."
        },
        {
          w: "Fact tables contain customer names, phone numbers, and addresses.",
          r: "Fact tables should never contain descriptive strings. Descriptive attributes belong in Dimension Tables; the fact table stores strictly an integer `customer_key` pointing to the dimension."
        },
        {
          w: "A fact table must always contain at least one numerical metric.",
          r: "**Factless Fact Tables** contain zero numerical measures, consisting entirely of foreign keys. They model event occurrences or relationships, such as tracking college class attendance or event participation, where the primary query operation is `COUNT()`."
        }
      ],

      trade: {
        buys: [
          "Engineered for analytical math: narrow, numerical columnar layout enables blistering fast aggregation scans.",
          "High compression ratio: columnar engines achieve 90%+ compression on sorted numerical surrogate keys and metrics.",
          "Establishes a single authoritative record of business events, eliminating conflicting departmental revenue figures.",
          "Clear, standardized grain definition prevents double-counting and data corruption in BI reporting."
        ],
        costs: [
          "Massive storage volume: transaction fact tables grow into billions of rows, requiring strict partitioning and clustering.",
          "Accumulating snapshots require in-place row updates, which are expensive in append-only columnar data lakes.",
          "Requires upfront data modeling effort to enforce surrogate key lookups and grain validation.",
          "Inflexible grain: altering the grain after building downstream models requires rebuilding the entire pipeline."
        ],
        avoid: [
          "Never create a fact table without explicitly defining and documenting its exact physical grain.",
          "Do not pre-aggregate ratios or percentages into fact tables; store the additive atomic components.",
          "Avoid storing descriptive text columns in fact tables; extract them into dimension tables."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dimension-table",

      why: {
        before: "Analytical queries had access to raw numbers (e.g., sold 5 units of Item #4029), but lacked human-readable business context (who bought it, which marketing campaign drove it, what store sold it, or what product category it belonged to).",
        problem: "Business users do not query raw database IDs; they slice, filter, and group analytical metrics by rich contextual attributes ('Show me sales for Female Customers aged 25-34 in Germany during Q3').",
        shift: "**Dimension Table: The companion table to a Fact Table in a dimensional model that contains descriptive, qualitative contextual attributes (the 'who, what, where, when, why') used for filtering and grouping business metrics.** Governed by Slowly Changing Dimension (SCD) lifecycle techniques."
      },

      num: {
        t: "Slowly Changing Dimension (SCD) Types & Historical Tracking Strategies",
        h: ["SCD Type", "Historical Tracking Strategy", "Attribute Modification Mechanism", "Historical Accuracy", "Implementation Overhead"],
        r: [
          ["Type 0: Retain Original", "None (immutable original state)", "Never updated; overwrites ignored", "Preserves original snapshot only", "Lowest (read-only)"],
          ["Type 1: Overwrite", "None (destroys historical state)", "Direct in-place update of old value", "Zero (rewrites history; historical revenue reflects new state)", "Low (simple `UPDATE`)"],
          ["Type 2: Add New Row", "Full historical timeline preservation", "Closes old row (`is_current=false`, `end_date`), inserts new row with new Surrogate Key", "100% (exact point-in-time historical reporting)", "Moderate (standard enterprise practice)"],
          ["Type 3: Add Previous Column", "Limited history (current + previous)", "Updates `current_val` and copies old to `prev_val`", "Preserves only 1 historical transition", "Low to moderate"],
          ["Type 4: Mini-Dimension", "Historical tracking via separate fast-changing table", "Splits rapidly changing demographics into dedicated mini-dimension", "High for rapidly shifting customer profiles", "Moderate to high"]
        ],
        n: "Dimension tables provide the entry points for slicing and dicing fact tables: $\\text{Query} = \\text{Filter}(\\text{Dim}) \\bowtie \\text{Fact} \\rightarrow \\text{Group By}(\\text{Dim})$. Dimension tables are wide (often containing 50 to 100+ descriptive string columns) but have significantly fewer rows than fact tables. Every dimension table requires a synthetic integer **Surrogate Key** (e.g., `customer_sk`), distinct from the operational source system's natural key (`customer_id`). Surrogate keys are mandatory to implement **Slowly Changing Dimensions (SCD Type 2)**: when a customer moves from London to New York, SCD Type 2 inserts a *new* row with a new surrogate key, marking the old row's `valid_to` timestamp. When historical sales from two years ago are analyzed, they link to the London surrogate key, preserving true point-in-time reporting."
      },

      miss: [
        {
          w: "Using the operational database's primary key (Natural Key) as the dimension primary key is fine.",
          r: "Natural keys fail in data warehousing: they cannot support SCD Type 2 (which requires multiple rows for the same natural key to track history), cannot handle merged data from multiple source systems, and are often strings that slow down join performance. Integer **Surrogate Keys** are mandatory."
        },
        {
          w: "SCD Type 1 (overwriting values) is acceptable for customer address changes.",
          r: "Overwriting an address via SCD Type 1 rewrites history. If a customer moved from California to Texas yesterday, an annual sales report for last year will erroneously credit all of their historical purchases to Texas, corrupting state tax audits."
        },
        {
          w: "Dimension tables should be normalized into multiple tables to eliminate duplicate strings.",
          r: "Normalizing dimensions into multiple tables creates a Snowflake Schema, which increases query joins and degrades analytical speed. Kimball dimensional modeling explicitly embraces wide, denormalized dimension tables."
        },
        {
          w: "Date dimensions are unnecessary because databases have native date functions.",
          r: "A dedicated `dim_date` table is essential: it stores fiscal calendars, holiday flags, trading days, week-of-year, and company-specific quarters, enabling complex temporal queries without complex SQL date math."
        }
      ],

      trade: {
        buys: [
          "Provides rich, human-readable context enabling non-technical users to filter, slice, and group metrics in BI tools.",
          "SCD Type 2 preserves complete historical accuracy, enabling true point-in-time reporting and regulatory auditing.",
          "Surrogate keys insulate the data warehouse from operational database primary key changes and system migrations.",
          "Dedicated date dimensions simplify complex temporal reporting (fiscal quarters, holiday flags, accounting periods)."
        ],
        costs: [
          "Denormalized tables store redundant strings, consuming storage (though minimized by columnar compression).",
          "Implementing robust SCD Type 2 pipelines requires complex snapshotting logic (e.g., `dbt snapshot`).",
          "Dimension updates require coordination to maintain surrogate key integrity across fact tables.",
          "Rapidly changing attributes (e.g., real-time customer account balances) can cause massive dimension table growth."
        ],
        avoid: [
          "Never use operational Natural Keys as foreign keys in fact tables; always generate integer Surrogate Keys.",
          "Do not use SCD Type 1 when historical regulatory auditing or point-in-time financial attribution is required.",
          "Avoid building analytical warehouses without a pre-populated, comprehensive `dim_date` table."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));

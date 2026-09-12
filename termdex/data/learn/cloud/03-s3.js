/* AWS for AI Engineers — S3 and storing things. */
TD.addLessons("cloud", [

{
 t: "S3 — Where Everything Lives",
 m: "s3",
 lvl: "core",
 s: "Buckets and keys, storage classes, lifecycle rules, versioning, presigned URLs, and laying out a document corpus.",
 goal: [
  "Store and retrieve objects, and understand what you are actually paying for",
  "Design a key layout for an AI pipeline that will still make sense at ten million files",
  "Let a browser upload directly to S3 without your server touching the bytes"
 ],
 b: [
  { p: "S3 is the service you will use in every project, and it is the easiest one to use badly. It looks like a folder of files. It is not — it is a flat key-value store with a very good imitation of folders, and almost every S3 surprise comes from forgetting that." },

  { h: "The model" },
  { code: { lang: "text", t: "There are no folders",
    lines: [
     { c: "bucket: rag-docs                 <- globally unique name, across ALL of AWS", hi: true },
     { c: "" },
     { c: "  key: raw/2026/03/invoice-88.pdf" },
     { c: "  key: raw/2026/03/invoice-89.pdf" },
     { c: "  key: parsed/2026/03/invoice-88.json" },
     { c: "" },
     { c: "  The '/' characters are just characters in the key." },
     { c: "  There is no 'raw' directory object. The console draws" },
     { c: "  folders by splitting keys on '/', which is a UI trick.", hi: true },
     { c: "" },
     { c: "  Consequences:" },
     { c: "   - 'renaming a folder' means copying every object", hi: true },
     { c: "   - listing is a prefix scan, and it costs money per 1000 keys" },
     { c: "   - an empty folder cannot exist" }
    ] } },

  { trap: "Bucket names are globally unique across every AWS account on Earth, and they appear in DNS. `documents` was taken in 2006. Use something like `acme-rag-docs-prod-apsouth1` — company, purpose, environment, region. And never put anything secret in the name, because bucket names leak through error messages and DNS." },

  { h: "The commands you will actually type" },
  { code: { lang: "bash", t: "Day-to-day S3",
    lines: [
     { c: "aws s3 mb s3://acme-rag-docs --region ap-south-1", w: "**Make bucket.** Region matters — the bucket lives in one region forever." },
     { c: "", w: "" },
     { c: "aws s3 cp report.pdf s3://acme-rag-docs/raw/2026/03/", w: "**Copy one file up.**" },
     { c: "aws s3 sync ./docs s3://acme-rag-docs/raw/ --exclude '*.tmp'", w: "**Sync a directory.** Only uploads what changed — this is the one you will use most.", hi: true },
     { c: "", w: "" },
     { c: "aws s3 ls s3://acme-rag-docs/raw/2026/ --recursive --human-readable --summarize", w: "**List with sizes and a total.** `--summarize` gives you the object count, which you need for cost estimates." },
     { c: "", w: "" },
     { c: "aws s3api head-object --bucket acme-rag-docs --key raw/2026/03/report.pdf", w: "**Metadata without downloading.** Size, ETag, storage class, encryption. Cheap, and the right way to check existence.", hi: true },
     { c: "", w: "" },
     { c: "aws s3 rm s3://acme-rag-docs/tmp/ --recursive --dryrun", w: "**`--dryrun` first, always.** S3 deletion is immediate and, without versioning, permanent.", hi: true }
    ],
    after: "Note the two command families. `aws s3` is the friendly high-level one (`cp`, `sync`, `ls`). `aws s3api` is the raw API (`head-object`, `put-bucket-policy`, `list-objects-v2`). You need both; the high-level one cannot do everything." } },

  { h: "Storage classes, and the one that bites" },
  { tbl: { t: "What each class costs and what it costs you",
    h: ["Class", "Storage", "Retrieval", "Use for"],
    rows: [
     ["**Standard**", "~₹2/GB/month", "Free", "**Default.** Anything read regularly"],
     ["**Intelligent-Tiering**", "Standard, then auto-cheaper", "Free", "**When you do not know the access pattern.** Small monitoring fee, no retrieval charge, no surprises"],
     ["Standard-IA", "~₹1.1/GB/month", "**Charged per GB**", "Read less than monthly, and you are sure"],
     ["Glacier Instant", "~₹0.35/GB/month", "Charged", "Archives you might need instantly"],
     ["Glacier Deep Archive", "~₹0.08/GB/month", "Charged, **12-hour wait**", "Compliance retention"]
    ] } },

  { trap: "Infrequent Access has a **128 KB minimum billable size and a 30-day minimum duration**. A million 4 KB JSON files in Standard-IA are billed as if each were 128 KB — you pay for 128 GB to store 4 GB, and it costs *more* than Standard. This catches people who move a chunk store to IA to save money. For many small objects, use Intelligent-Tiering or leave them in Standard." },

  { h: "Lifecycle rules — set once, save forever" },
  { code: { lang: "json", file: "lifecycle.json", t: "Ageing data out automatically",
    lines: [
     { c: "{", w: "" },
     { c: "  \"Rules\": [", w: "" },
     { c: "    {", w: "" },
     { c: "      \"ID\": \"raw-docs-cooldown\",", w: "" },
     { c: "      \"Status\": \"Enabled\",", w: "" },
     { c: "      \"Filter\": { \"Prefix\": \"raw/\" },", w: "**Scope by prefix.** This is another reason the key layout matters." },
     { c: "      \"Transitions\": [", w: "" },
     { c: "        { \"Days\": 90, \"StorageClass\": \"INTELLIGENT_TIERING\" }", w: "**After 90 days, stop paying Standard rates** for documents nobody reads." },
     { c: "      ]", w: "" },
     { c: "    },", w: "" },
     { c: "    {", w: "" },
     { c: "      \"ID\": \"abort-failed-multipart\",", w: "" },
     { c: "      \"Status\": \"Enabled\",", w: "" },
     { c: "      \"Filter\": {},", w: "" },
     { c: "      \"AbortIncompleteMultipartUpload\": { \"DaysAfterInitiation\": 7 }", w: "**Put this on every bucket you ever create.** Failed large uploads leave invisible partial data that you are billed for and cannot see in the console. It is the single most common phantom S3 cost.", hi: true },
     { c: "    },", w: "" },
     { c: "    {", w: "" },
     { c: "      \"ID\": \"expire-temp\",", w: "" },
     { c: "      \"Status\": \"Enabled\",", w: "" },
     { c: "      \"Filter\": { \"Prefix\": \"tmp/\" },", w: "" },
     { c: "      \"Expiration\": { \"Days\": 7 }", w: "**Delete scratch data automatically** rather than intending to." },
     { c: "    }", w: "" },
     { c: "  ]", w: "" },
     { c: "}", w: "" }
    ] } },

  { h: "Versioning and the thing that saves you" },
  { l: [
   "**Turn versioning on** for anything you would be upset to lose. An overwrite becomes a new version; a delete becomes a *delete marker* with the object still underneath.",
   "**Pair it with a lifecycle rule** expiring noncurrent versions after 30–90 days, or you pay to store every version of every file forever.",
   "**Object Lock** makes objects genuinely immutable for a retention period — the defence against ransomware and against your own `rm -rf`. It cannot be switched off once enabled, which is the point.",
   "**Block Public Access is on by default** at the account level. Leave it on. The overwhelming majority of \"S3 data breaches\" you have read about were buckets somebody deliberately opened."
  ] },

  { h: "Presigned URLs — the pattern to know" },
  { code: { lang: "python", file: "uploads.py", t: "Let the browser talk to S3 directly",
    lines: [
     { c: "import boto3", w: "" },
     { c: "from botocore.config import Config", w: "" },
     { c: "", w: "" },
     { c: "s3 = boto3.client('s3', region_name='ap-south-1',", w: "" },
     { c: "                  config=Config(signature_version='s3v4'))", w: "**Force SigV4.** Some regions require it and the failure without it is obscure." },
     { c: "", w: "" },
     { c: "def upload_url(key: str, content_type: str, max_mb: int = 25):", w: "" },
     { c: "    return s3.generate_presigned_post(", w: "**`generate_presigned_post`, not `generate_presigned_url`**, when you want to constrain the upload — it lets you set conditions.", hi: true },
     { c: "        Bucket='acme-rag-docs',", w: "" },
     { c: "        Key=key,", w: "" },
     { c: "        Fields={'Content-Type': content_type},", w: "" },
     { c: "        Conditions=[", w: "" },
     { c: "            {'Content-Type': content_type},", w: "**Pin the type**, or somebody uploads an executable as a PDF." },
     { c: "            ['content-length-range', 1, max_mb * 1024 * 1024],", w: "**Cap the size.** Without this a presigned upload URL is an unbounded write to your bucket at your expense.", hi: true },
     { c: "        ],", w: "" },
     { c: "        ExpiresIn=600,   # 10 minutes", w: "**Short.** A presigned URL is a bearer token — anyone holding it can use it." },
     { c: "    )", w: "" },
     { c: "", w: "" },
     { c: "def download_url(key: str):", w: "" },
     { c: "    return s3.generate_presigned_url(", w: "" },
     { c: "        'get_object',", w: "" },
     { c: "        Params={'Bucket': 'acme-rag-docs', 'Key': key},", w: "" },
     { c: "        ExpiresIn=300,", w: "" },
     { c: "    )", w: "" }
    ],
    after: "This pattern matters more than it looks. Without it, a 200 MB PDF flows through your API server — using its memory, its bandwidth and its request timeout. With it, your server issues a signed permission and the bytes never touch it. For any product where users upload documents, this is the difference between a service that scales and one that falls over on the first large file." } },

  { h: "Laying out a corpus" },
  { code: { lang: "text", t: "A key layout that survives ten million objects",
    lines: [
     { c: "s3://acme-rag-docs/" },
     { c: "  raw/<tenant>/<yyyy>/<mm>/<sha256>.pdf      original, never modified", hi: true },
     { c: "  parsed/<tenant>/<yyyy>/<mm>/<sha256>.json  extracted text + layout" },
     { c: "  chunks/<tenant>/<yyyy>/<mm>/<sha256>.jsonl chunk text + metadata" },
     { c: "  models/<name>/<version>/                    artefacts, adapters" },
     { c: "  exports/<tenant>/<date>/                    generated, expiring" },
     { c: "" },
     { c: "  Why this shape:" },
     { c: "   - tenant first  -> one IAM prefix condition isolates a customer", hi: true },
     { c: "   - date next     -> lifecycle rules and time-bounded reprocessing" },
     { c: "   - content hash  -> deduplication is free, and re-ingesting the" },
     { c: "                      same document is a no-op", hi: true },
     { c: "   - stage prefixes-> each pipeline step reads one prefix, writes" },
     { c: "                      another, and can be re-run independently" }
    ],
    after: "Naming files by content hash rather than by original filename is the detail worth stealing. Two users uploading the same PDF produce one object. Re-running ingestion is idempotent. And the key itself is the integrity check." } },

  { n: "S3 has been strongly read-after-write consistent since December 2020. Older tutorials and blog posts warn about eventual consistency and tell you to retry reads after a write — that advice is obsolete. If a colleague still repeats it, this is a small, useful thing to know.",
    nt: "One outdated warning to ignore" },

  { tryit: { t: "Build the document store you will actually use",
    task: "Create a bucket with versioning on, Block Public Access on, default encryption, and a lifecycle policy that aborts incomplete multipart uploads after 7 days and expires noncurrent versions after 30. Upload a document under a content-hash key. Generate a presigned upload URL with a size cap and test it with curl. Then delete the object and recover it from its version history.",
    hint: "The recovery step is the point of versioning, and most people never test it. A backup you have not restored is a hypothesis.",
    sol: { lang: "bash", code: "B=acme-rag-docs-$RANDOM\naws s3 mb s3://$B --region ap-south-1\naws s3api put-bucket-versioning --bucket $B \\\n  --versioning-configuration Status=Enabled\naws s3api put-public-access-block --bucket $B \\\n  --public-access-block-configuration \\\n  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\naws s3api put-bucket-encryption --bucket $B \\\n  --server-side-encryption-configuration \\\n  '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"AES256\"}}]}'\naws s3api put-bucket-lifecycle-configuration --bucket $B \\\n  --lifecycle-configuration file://lifecycle.json\n\n# content-hash key\nH=$(sha256sum report.pdf | cut -c1-64)\naws s3 cp report.pdf s3://$B/raw/tenant-1/2026/03/$H.pdf\n\n# --- delete, then recover ---\naws s3 rm s3://$B/raw/tenant-1/2026/03/$H.pdf\naws s3 ls s3://$B/raw/tenant-1/2026/03/          # gone\n\naws s3api list-object-versions --bucket $B \\\n  --prefix raw/tenant-1/2026/03/$H.pdf \\\n  --query '[Versions[].VersionId, DeleteMarkers[].VersionId]'\n\n# Deleting the DELETE MARKER restores the object.\naws s3api delete-object --bucket $B \\\n  --key raw/tenant-1/2026/03/$H.pdf \\\n  --version-id <delete-marker-version-id>\n\naws s3 ls s3://$B/raw/tenant-1/2026/03/          # back\n\naws s3 rb s3://$B --force   # clean up when finished" },
    w: "Everything in that script is what a competent engineer sets up in the first ten minutes of a new bucket, and none of it can be added convincingly afterwards — you cannot retroactively version an object you have already lost. Doing it once by hand means you will notice when a codebase has not." } },

  { vocab: ["Object Storage", "Durability", "Encryption", "Idempotency", "Content-Addressable Storage"] }
 ],
 k: [
  "S3 is flat: slashes are characters in a key, so renaming a prefix means copying every object.",
  "Put an abort-incomplete-multipart lifecycle rule on every bucket — it is the most common invisible cost.",
  "Infrequent Access bills a 128 KB minimum per object, so many small files cost more there than in Standard.",
  "Presigned URLs keep large uploads off your API server entirely; always cap size and content type.",
  "Key by content hash: deduplication and idempotent re-ingestion for free."
 ],
 r: ["Object Storage", "Durability", "Encryption", "Idempotency", "Data Lake"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws s3 sync ./docs s3://bucket/raw/ --exclude '*.tmp'", w: "upload only what changed, skipping temporary files" },
   { c: "aws s3api head-object --bucket B --key K", w: "check an object's metadata without downloading it" },
   { c: "aws s3 rm s3://bucket/tmp/ --recursive --dryrun", w: "see what a recursive delete would remove, before it does" },
   { c: "\"AbortIncompleteMultipartUpload\": { \"DaysAfterInitiation\": 7 }", w: "the lifecycle rule that stops invisible partial uploads costing money" }
  ]
 }
}

]);

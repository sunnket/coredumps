/* AWS for AI Engineers — infrastructure as code. */
TD.addLessons("cloud", [

{
 t: "Terraform From Zero",
 m: "iac",
 lvl: "core",
 s: "Why clicking does not scale, the four commands, state, environments, and how much of this belongs in an interview answer.",
 goal: [
  "Write, plan and apply Terraform for a real AWS service",
  "Explain what state is and why it must be shared and locked",
  "Structure environments without duplicating your whole configuration"
 ],
 b: [
  { p: "Everything so far has been done by hand, which is the right way to learn — you cannot debug an abstraction over something you have never touched. But an account built by clicking has three problems: nobody can tell what changed, nothing can be recreated, and the staging environment is never quite the production one." },

  { ana: "A recipe against a memory of a meal. You can cook a very good dinner once from memory. You cannot hand that memory to a colleague, diff it against last month's version, or reliably produce the same dinner in a different kitchen. Infrastructure as code is writing the recipe down — and the value is almost entirely in the second and third of those.",
    at: "Why it matters" },

  { h: "The options, briefly" },
  { tbl: { t: "Four ways to write infrastructure down",
    h: ["Tool", "Language", "Verdict"],
    rows: [
     ["**Terraform / OpenTofu**", "HCL", "**Learn this one.** Multi-cloud, the largest community, and the one job descriptions name"],
     ["**CloudFormation**", "YAML/JSON", "AWS-native, no state file to manage, and unpleasant to write by hand"],
     ["**AWS CDK**", "Python/TypeScript", "Real code that compiles to CloudFormation. Lovely if your team already writes TypeScript"],
     ["**SAM**", "YAML", "CloudFormation with shortcuts for serverless. Fine for Lambda-only projects"]
    ] } },

  { h: "The four commands" },
  { code: { lang: "bash", t: "The whole workflow",
    lines: [
     { c: "terraform init", w: "**Download providers and configure the backend.** Run it once per directory, and again whenever you change providers or the backend." },
     { c: "terraform plan -out=tfplan", w: "**Show what would change, and change nothing.** Read this output every single time. It is the safety mechanism, and skipping it is how infrastructure gets deleted.", hi: true },
     { c: "terraform apply tfplan", w: "**Apply exactly the plan you read.** Applying a saved plan file rather than re-planning removes the window where reality changed between the two." },
     { c: "terraform destroy", w: "**Tear it down.** For a learning project this is what keeps the bill at zero, and it is the reason to do this at all." }
    ] } },

  { h: "A real configuration" },
  { code: { lang: "hcl", file: "main.tf", t: "An S3 bucket and a Lambda, properly",
    lines: [
     { c: "terraform {", w: "" },
     { c: "  required_version = \">= 1.6\"", w: "" },
     { c: "  required_providers {", w: "" },
     { c: "    aws = { source = \"hashicorp/aws\", version = \"~> 5.0\" }", w: "**Pin the major version.** `~> 5.0` allows 5.x and refuses 6.0, whose breaking changes would otherwise arrive on somebody else's schedule.", hi: true },
     { c: "  }", w: "" },
     { c: "  backend \"s3\" {", w: "" },
     { c: "    bucket       = \"acme-tfstate\"", w: "**State in S3**, not on your laptop. See below." },
     { c: "    key          = \"rag-api/prod.tfstate\"", w: "" },
     { c: "    region       = \"ap-south-1\"", w: "" },
     { c: "    encrypt      = true", w: "**State contains secrets in plaintext.** Encrypt it, always." },
     { c: "    use_lockfile = true", w: "**Locking**, so two people cannot apply at once. Older guides use a DynamoDB table for this; native S3 locking replaced it.", hi: true },
     { c: "  }", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "provider \"aws\" {", w: "" },
     { c: "  region = var.region", w: "" },
     { c: "  default_tags {", w: "" },
     { c: "    tags = {", w: "" },
     { c: "      Project     = \"rag-api\"", w: "" },
     { c: "      Environment = var.environment", w: "" },
     { c: "      ManagedBy   = \"terraform\"", w: "**`default_tags` puts these on every resource automatically.** This is how cost attribution actually becomes complete rather than aspirational.", hi: true },
     { c: "    }", w: "" },
     { c: "  }", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "resource \"aws_s3_bucket\" \"docs\" {", w: "" },
     { c: "  bucket = \"${var.project}-docs-${var.environment}\"", w: "**Interpolation.** The same file produces `rag-docs-dev` and `rag-docs-prod`." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "resource \"aws_s3_bucket_versioning\" \"docs\" {", w: "**In provider v4+, bucket settings are separate resources**, not arguments on the bucket. Older tutorials will not work." },
     { c: "  bucket = aws_s3_bucket.docs.id", w: "**This reference creates the dependency graph.** Terraform works out the order itself; you never write one.", hi: true },
     { c: "  versioning_configuration { status = \"Enabled\" }", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "data \"aws_iam_policy_document\" \"lambda_trust\" {", w: "**A `data` block reads or computes something rather than creating it.** Building policies this way beats embedding raw JSON — it is validated at plan time." },
     { c: "  statement {", w: "" },
     { c: "    actions = [\"sts:AssumeRole\"]", w: "" },
     { c: "    principals {", w: "" },
     { c: "      type        = \"Service\"", w: "" },
     { c: "      identifiers = [\"lambda.amazonaws.com\"]", w: "" },
     { c: "    }", w: "" },
     { c: "  }", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "resource \"aws_iam_role\" \"ingest\" {", w: "" },
     { c: "  name               = \"${var.project}-ingest-${var.environment}\"", w: "" },
     { c: "  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "output \"bucket_name\" {", w: "" },
     { c: "  value = aws_s3_bucket.docs.bucket", w: "**Outputs are how other configurations and your CI read values back.**" },
     { c: "}", w: "" }
    ] } },

  { h: "State — the concept people misunderstand" },
  { code: { lang: "text", t: "What the state file is and why it matters",
    lines: [
     { c: "  Terraform holds three pictures of the world:" },
     { c: "" },
     { c: "    1. CONFIG   what you wrote in .tf files" },
     { c: "    2. STATE    what Terraform believes it created", hi: true },
     { c: "    3. REALITY  what is actually in AWS right now" },
     { c: "" },
     { c: "  plan = diff(CONFIG, STATE) refreshed against REALITY" },
     { c: "" },
     { c: "  Consequences:" },
     { c: "" },
     { c: "   - lose the state file  -> Terraform thinks nothing exists" },
     { c: "                             and tries to create everything again", hi: true },
     { c: "   - state on a laptop    -> nobody else can apply safely" },
     { c: "   - two applies at once  -> corrupted state. Hence locking.", hi: true },
     { c: "   - change in the console-> 'drift'. The next plan proposes" },
     { c: "                             undoing your manual change." }
    ],
    after: "Put state in S3 with encryption and locking on the first day of any real project. Recovering from a lost or corrupted state file is genuinely painful — it means importing every resource by hand — and it is entirely avoidable." } },

  { trap: "**The state file contains secrets in plaintext.** A database password generated by Terraform, an API key passed as a variable, an RDS master password — all of them are in the JSON. Never commit `terraform.tfstate` to git, always encrypt the bucket, and restrict who can read it as tightly as you would restrict the secret itself." },

  { h: "Environments without duplication" },
  { code: { lang: "text", t: "The layout that scales, and the one that does not",
    lines: [
     { c: "  BAD: copy the whole configuration per environment" },
     { c: "    infra/dev/main.tf     700 lines" },
     { c: "    infra/prod/main.tf    700 lines, drifting apart daily", hi: true },
     { c: "" },
     { c: "  GOOD: modules, thin environment roots" },
     { c: "    modules/network/       reusable, no environment knowledge" },
     { c: "    modules/service/       reusable" },
     { c: "    envs/dev/main.tf       30 lines: call the modules with dev values", hi: true },
     { c: "    envs/dev/terraform.tfvars" },
     { c: "    envs/prod/main.tf      30 lines: same modules, prod values" },
     { c: "    envs/prod/terraform.tfvars" },
     { c: "" },
     { c: "  Separate state per environment, always:" },
     { c: "    key = \"rag-api/dev.tfstate\"" },
     { c: "    key = \"rag-api/prod.tfstate\"", hi: true },
     { c: "" },
     { c: "  ...so a mistake in dev can never touch prod." }
    ] } },

  { h: "Habits that separate a competent user from a dangerous one" },
  { l: [
   "**Read every plan.** `Plan: 3 to add, 1 to change, 0 to destroy` is fine. A `destroy` you did not expect is the moment to stop and understand why.",
   "**Watch for forced replacement.** `# forces replacement` on a resource means Terraform will delete and recreate it. On an RDS instance that is your database, and it is the single most expensive Terraform mistake.",
   "**`prevent_destroy` on anything stateful.** A `lifecycle { prevent_destroy = true }` block on your database and your state bucket costs one line and prevents a career-defining afternoon.",
   "**`terraform fmt` and `terraform validate`** in CI, plus `tflint` and `checkov` for security rules.",
   "**Plan on every pull request, apply only on merge.** The plan output posted as a PR comment is how a team reviews infrastructure changes.",
   "**`terraform import`** brings existing hand-built resources under management, which is how you adopt Terraform in an account that already exists — the usual real-world situation."
  ] },

  { h: "How much of this belongs in an interview" },
  { n: "For an AI engineering role, you are not expected to be an infrastructure engineer. What is expected is that you know what infrastructure as code is, why the state file matters, and that you have used it. \"I defined my project's VPC, ECS service and RDS instance in Terraform, with state in S3 and separate workspaces for dev and prod\" is a complete and credible answer. Nobody will ask you to write a module for a multi-account landing zone.\n\nThe follow-up you should be ready for is *why bother for a personal project* — and the honest answer is: because I can destroy the whole thing when I am not using it and recreate it in four minutes, which is what keeps the bill near zero.",
    nt: "Calibrating the depth" },

  { tryit: { t: "Rebuild your deployment as code, then destroy and recreate it",
    task: "Take the service you deployed by hand and express it in Terraform: VPC, ECR repository, ECS cluster and service, ALB, RDS, and the IAM roles. Import what already exists rather than duplicating it. Then run `terraform destroy` and `terraform apply` and time how long a full rebuild takes.",
    hint: "The destroy-and-recreate is the whole exercise. If you are not willing to run it, your configuration does not actually describe your infrastructure — and finding that out now is much better than finding it out during an outage.",
    sol: { lang: "bash", code: "# Import rather than duplicate\nterraform import aws_s3_bucket.docs acme-rag-docs\nterraform import aws_ecr_repository.api rag-api\nterraform import aws_db_instance.main rag-prod-db\n\nterraform plan\n# Aim for: 'No changes. Your infrastructure matches the configuration.'\n# Getting there is the exercise -- every diff is a setting you did\n# not know you had.\n\n# Protect the things that must never be replaced\n#   resource \"aws_db_instance\" \"main\" {\n#     lifecycle {\n#       prevent_destroy = true\n#       ignore_changes  = [password]   # rotated outside Terraform\n#     }\n#   }\n\n# --- The real test ---\nterraform destroy -target=module.service   # keep the database\ntime terraform apply -auto-approve\n\n# real  4m12s\n#\n# Now the whole environment costs nothing overnight:\n#   terraform destroy      before bed\n#   terraform apply        next morning, 4 minutes\n#\n# For a learning account this is the difference between\n# Rs 6,000/month and Rs 400/month -- and it is only possible\n# because the infrastructure is written down." },
    w: "Two payoffs. Practically, you can now switch your whole learning environment off when you are not using it, which changes what you can afford to experiment with. Professionally, \"my infrastructure is in Terraform and I destroy and recreate it routinely\" tells an interviewer that your configuration is real rather than a file that drifted away from reality months ago — which, in most companies, it has." } },

  { vocab: ["Infrastructure as Code", "Terraform", "Immutable Infrastructure", "Idempotency", "Configuration Drift"] }
 ],
 k: [
  "Read every plan; an unexpected `destroy` or `forces replacement` is the moment to stop.",
  "State is Terraform's belief about what it created — keep it in S3, encrypted and locked, from day one.",
  "The state file holds secrets in plaintext; never commit it and restrict who can read it.",
  "Modules plus thin environment roots, with separate state per environment.",
  "For an AI role, having used Terraform on your own project is enough — being able to destroy and recreate it is the proof."
 ],
 r: ["Infrastructure as Code", "Terraform", "Immutable Infrastructure", "Idempotency", "Continuous Deployment"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "terraform plan -out=tfplan && terraform apply tfplan", w: "apply exactly the plan you read, not a fresh one" },
   { c: "lifecycle { prevent_destroy = true }", w: "stop Terraform ever deleting your database" },
   { c: "terraform import aws_s3_bucket.docs acme-rag-docs", w: "bring a hand-built resource under management" }
  ]
 }
}

]);

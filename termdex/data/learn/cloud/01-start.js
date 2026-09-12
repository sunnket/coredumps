/* AWS for AI Engineers — the account, the bill and the map. */
TD.addLessons("cloud", [

{
 t: "What the Cloud Actually Is",
 m: "start",
 lvl: "core",
 s: "Renting computers by the second, the fifteen services that matter, and where things physically are.",
 goal: [
  "Explain what you are renting and what you are not",
  "Name the AWS services an AI engineer actually uses, and what each is for",
  "Choose a region for a reason rather than by accident"
 ],
 b: [
  { p: "AWS has over 200 services. You need about fifteen. The reason the cloud feels overwhelming is that nobody tells beginners which fifteen, so every tutorial looks equally important. This lesson is the map, and the rest of the track is the territory." },

  { ana: "A hotel, not a house. You do not buy the building, wire it, or fix the plumbing. You take a room for as long as you need it, you pay per night, and you leave. The trade is that you never own anything, the nightly rate adds up, and if you forget to check out you keep paying — which is exactly how people get a surprise AWS bill.",
    at: "The cloud in one image" },

  { h: "What you are renting" },
  { l: [
   "**Compute** — a machine, or a slice of one, that runs your code. Priced per second it exists.",
   "**Storage** — disk that survives the machine being switched off. Priced per gigabyte per month.",
   "**Network** — moving bytes in and out. Inbound is usually free, **outbound is not**, and that surprises people.",
   "**Managed services** — a database, a queue, a model endpoint that somebody else patches, backs up and keeps alive. You pay a premium not to be on call for it.",
   "**Identity** — who is allowed to do what. Free, and the part that will block you most often."
  ] },

  { h: "Where things physically are" },
  { code: { lang: "text", t: "Region, availability zone, edge",
    lines: [
     { c: "ap-south-1                     <- REGION: Mumbai. A geographic area." },
     { c: "  ap-south-1a                  <- AVAILABILITY ZONE: one or more" },
     { c: "  ap-south-1b                     data centres, isolated from the" },
     { c: "  ap-south-1c                     others by power and network.", hi: true },
     { c: "" },
     { c: "us-east-1                      <- N. Virginia. Oldest, cheapest," },
     { c: "                                  most services first, and the one" },
     { c: "                                  that breaks the internet when it", hi: true },
     { c: "                                  breaks." },
     { c: "" },
     { c: "  Edge locations (CloudFront)  <- hundreds worldwide, for caching" },
     { c: "                                  content close to users." }
    ],
    after: "A region is a place. An availability zone is a failure boundary inside it. \"Highly available\" in AWS almost always means \"spread across at least two availability zones\", because a single zone can and does go down." } },

  { tbl: { t: "Choosing a region — three reasons, in order",
    h: ["Reason", "What it means", "Typical answer for an Indian project"],
    rows: [
     ["**Latency**", "Distance to your users is milliseconds you cannot get back", "`ap-south-1` (Mumbai) — ~20 ms from most of India"],
     ["**Data residency**", "Law or a customer contract requires data to stay in-country", "`ap-south-1`, and say so in writing"],
     ["**Cost and availability**", "`us-east-1` is cheapest and gets new services first", "Use it for experiments and for services that must be there"],
     ["Habit", "You picked whatever was selected", "**This is how most bad region choices happen**"]
    ] } },

  { trap: "Some things are **global** and live only in `us-east-1` whether you like it or not: IAM, Route 53, CloudFront, and ACM certificates used by CloudFront. If a tutorial tells you to switch to N. Virginia for a certificate, this is why — it is not arbitrary." },

  { h: "The fifteen services that matter" },
  { tbl: { t: "Your working set as an AI engineer",
    h: ["Service", "What it is", "You will use it for"],
    rows: [
     ["**IAM**", "Identity and permissions", "Everything. Learn this first"],
     ["**S3**", "Object storage", "Documents, models, datasets, backups"],
     ["**Lambda**", "Run a function, no server", "Small APIs, webhooks, glue, ingestion"],
     ["**ECS Fargate**", "Run a container, no server", "**Your AI service. The default answer**"],
     ["**ECR**", "Container registry", "Where your image lives before it runs"],
     ["**EC2**", "A virtual machine", "GPUs, and anything that must be long-lived"],
     ["**RDS**", "Managed Postgres/MySQL", "Your application data, and pgvector"],
     ["**DynamoDB**", "Managed key-value store", "Sessions, chat history, high write rates"],
     ["**Bedrock**", "Hosted models in your account", "Calling models without leaving AWS"],
     ["**SQS**", "A queue", "Decoupling slow work from a fast API"],
     ["**Secrets Manager**", "Encrypted secret storage", "API keys, database passwords"],
     ["**CloudWatch**", "Logs, metrics, alarms", "Knowing what happened at 3am"],
     ["**VPC**", "Your private network", "Where everything above actually sits"],
     ["**ALB**", "Load balancer", "HTTPS in front of your service"],
     ["**Route 53**", "DNS", "Pointing a domain at it"]
    ] } },

  { n: "That table is the syllabus. Everything else — 190 other services — is either a variant of one of these, a thing you will meet on a specific job, or a service AWS is quietly hoping you forget about. Nobody is going to reject you for not knowing what AWS Ground Station is.",
    nt: "What to ignore" },

  { h: "Two mental models that pay off later" },
  { l: [
   "**Everything is an API call.** The console is a website that makes API calls. The CLI makes the same calls. Terraform makes the same calls. When something works in the console but not in your code, the difference is almost always *which identity made the call*, not what the call was.",
   "**Managed means somebody else is on call.** RDS costs roughly twice what the same Postgres on EC2 costs. You are buying backups, patching, failover and a night's sleep. For one engineer building a product, that is usually the correct trade — and being able to say *why* you paid the premium is a better interview answer than having saved the money."
  ] },

  { tryit: { t: "Find your own coordinates",
    task: "Open the AWS console. Note which region is selected in the top-right. Then open the region dropdown and find `ap-south-1`. Switch to it, and look at the S3 page — notice that buckets appear regardless of region, because the *list* is global even though each bucket lives in one region. Then switch to IAM and notice there is no region selector at all.",
    hint: "The header region selector controls which regional API endpoint the console talks to. Services with no selector are global.",
    sol: { lang: "bash", code: "# The same question from the command line:\naws configure get region\n# ap-south-1\n\n# Which regions exist:\naws ec2 describe-regions --query 'Regions[].RegionName' --output text\n\n# Prove that IAM is global -- the same answer from any region:\naws iam list-users --region ap-south-1\naws iam list-users --region us-east-1\n# identical output; IAM ignores the region entirely" },
    w: "The point of this exercise is the distinction between regional and global services, because it is the source of a specific recurring confusion: a bucket you cannot find, a certificate that will not attach, a Lambda that is invisible. Nine times out of ten you are looking in the wrong region." } },

  { vocab: ["Cloud Region", "Availability Zone", "Serverless", "Container", "Load Balancer"] }
 ],
 k: [
  "You need about fifteen AWS services, not two hundred — the table above is the whole syllabus.",
  "A region is a place; an availability zone is a failure boundary inside it. Highly available means at least two zones.",
  "IAM, Route 53 and CloudFront are global and live in us-east-1 whether you like it or not.",
  "Everything is an API call — the console, the CLI and Terraform all make the same ones with different identities.",
  "Outbound data transfer costs money; inbound is generally free. This surprises people at invoice time."
 ],
 r: ["Cloud Region", "Availability Zone", "Serverless", "Load Balancer", "Container", "Virtual Private Cloud"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws configure get region", w: "ask which region the CLI is pointed at" },
   { c: "aws sts get-caller-identity", w: "ask who AWS thinks you are — the first debugging command" },
   { c: "aws ec2 describe-regions --query 'Regions[].RegionName' --output text", w: "list every region, extracting just the names" }
  ]
 }
},

{
 t: "An Account You Will Not Regret",
 m: "start",
 lvl: "core",
 s: "Root lockdown, MFA, an admin user, the CLI, and a budget alarm set before you spend anything.",
 goal: [
  "Set up an AWS account whose root credentials can never be casually stolen",
  "Work day to day as a non-root identity with the CLI configured",
  "Have a budget alarm and a cost dashboard in place on day one"
 ],
 b: [
  { p: "Two things go wrong for beginners on AWS, and both are preventable in twenty minutes. Somebody commits an access key to a public GitHub repository and wakes up to a bill for crypto mining. Or somebody leaves a GPU instance running over a weekend and discovers it on the invoice. Everything in this lesson exists to prevent one of those two." },

  { h: "The root user" },
  { p: "The email address you signed up with is the **root user**. It can do anything, including closing the account and changing the billing details, and no policy can restrict it. You should use it roughly four times ever." },

  { ol: [
   "Sign in as root **once**, immediately after creating the account.",
   "Turn on **MFA** — an authenticator app on your phone. This is the single most important thing on this page.",
   "Create an IAM user for yourself with administrator access, and a separate one for programmatic use if you want to be tidy.",
   "**Do not create root access keys.** If any exist, delete them. There is no legitimate reason for a root access key in 2026.",
   "Sign out. Store the root password in a password manager and do not use it again except for billing changes or closing the account."
  ] },

  { trap: "A leaked access key is the most common way a beginner loses money on AWS, and it usually happens through a committed `.env` file, a screenshot in a blog post, or a public notebook. Automated scanners find committed AWS keys within **minutes**. Add `.env` and `.aws/` to `.gitignore` before you create a single key, and use `git-secrets` or a pre-commit hook if you are prone to accidents." },

  { h: "Your working identity" },
  { code: { lang: "bash", t: "Setting up the CLI properly",
    lines: [
     { c: "# Install (macOS/Linux); on Windows use the MSI installer.", w: "" },
     { c: "curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o awscliv2.zip", w: "" },
     { c: "unzip awscliv2.zip && sudo ./aws/install", w: "" },
     { c: "", w: "" },
     { c: "aws --version", w: "**Confirm version 2.** Version 1 is still installable and lacks features you will want." },
     { c: "", w: "" },
     { c: "aws configure --profile personal", w: "**Always use a named profile.** The default profile is how you accidentally deploy to the wrong account.", hi: true },
     { c: "#   AWS Access Key ID:     AKIA...", w: "" },
     { c: "#   AWS Secret Access Key: ...", w: "" },
     { c: "#   Default region name:   ap-south-1", w: "" },
     { c: "#   Default output format: json", w: "" },
     { c: "", w: "" },
     { c: "export AWS_PROFILE=personal", w: "**Set it in your shell** so every command uses it. Put this in a per-project `.envrc`, not in your global profile." },
     { c: "aws sts get-caller-identity", w: "**The single most useful AWS command.** It answers *who am I* and it is the first thing to run when a permission fails.", hi: true }
    ],
    out: '{\n  "UserId": "AIDA...",\n  "Account": "123456789012",\n  "Arn": "arn:aws:iam::123456789012:user/aryan"\n}' } },

  { n: "Better than long-lived access keys: **IAM Identity Center** (formerly SSO) with `aws sso login`. It issues short-lived credentials that expire in hours rather than keys that live in a file forever. It is more setup on day one and it is what every company you join will use, so learning it now is not wasted.",
    nt: "The grown-up version" },

  { h: "The budget alarm, before anything else" },
  { code: { lang: "bash", t: "Set this before you create your first resource",
    lines: [
     { c: "# 1. Turn on cost data first (Billing console -> Cost Explorer -> Enable).", w: "**Takes up to 24 hours to populate.** Do it now so it is ready when you need it." },
     { c: "", w: "" },
     { c: "aws budgets create-budget \\", w: "" },
     { c: "  --account-id $(aws sts get-caller-identity --query Account --output text) \\", w: "**Your own account id, looked up rather than typed.**" },
     { c: "  --budget file://budget.json \\", w: "" },
     { c: "  --notifications-with-subscribers file://notify.json", w: "" },
     { c: "", w: "" },
     { c: "# budget.json", w: "" },
     { c: "# { \"BudgetName\": \"monthly\", \"BudgetLimit\": {\"Amount\": \"20\", \"Unit\": \"USD\"},", w: "**Start low.** A ₹1,700 ceiling is enough to learn on and small enough that breaching it is a lesson rather than a disaster.", hi: true },
     { c: "#   \"TimeUnit\": \"MONTHLY\", \"BudgetType\": \"COST\" }", w: "" },
     { c: "", w: "" },
     { c: "# notify.json -- alert at 50% and at 90% of forecast", w: "**Two thresholds.** 50% tells you the trend; 90% tells you to act today." }
    ],
    after: "A budget alarm is not a spending cap — AWS will not stop your resources. It is an email that arrives while the number is still small. That is the whole protection, and it is worth more than any amount of care." } },

  { h: "Free tier, honestly" },
  { tbl: { t: "What is genuinely free, and for how long",
    h: ["Thing", "Free tier", "The catch"],
    rows: [
     ["Lambda", "1M requests + 400,000 GB-seconds **per month, forever**", "Genuinely generous. Most learning projects never pay for Lambda"],
     ["S3", "5 GB, 12 months", "Then about ₹2 per GB per month. Cheap unless you store models"],
     ["DynamoDB", "25 GB **forever** (on-demand has its own free allowance)", "Easy to stay inside"],
     ["EC2", "750 hours of `t2.micro`/`t3.micro`, 12 months", "**One instance, continuously.** Two instances exhaust it in half a month"],
     ["RDS", "750 hours of `db.t3.micro`, 12 months", "**The most common surprise bill.** Storage and backups are extra, and it does not stop after 12 months"],
     ["**GPU instances**", "**Nothing. Never**", "`g5.xlarge` is roughly ₹100/hour. A forgotten weekend is ₹5,000"],
     ["Data transfer out", "100 GB/month", "Then roughly ₹8 per GB. Serving files from S3 directly can get expensive"]
    ] } },

  { vs: { t: "Two habits that decide whether AWS is cheap or expensive",
    lang: "bash",
    bad: { label: "How the bill happens", c: "# Spin up a GPU to try something\naws ec2 run-instances --instance-type g5.xlarge ...\n\n# ...get distracted, close the laptop, remember on Monday\n# 62 hours x ~$1.2 = ~$75 (~Rs 6,200)\n\n# No tags, no budget, no alarm. You find out from the invoice.",
      w: "Nothing here is wrong except that nothing is watching." },
    good: { label: "How it does not", c: "# Tag everything, always\naws ec2 run-instances --instance-type g5.xlarge \\\n  --tag-specifications 'ResourceType=instance,Tags=[\\\n    {Key=Project,Value=rag-demo},{Key=Owner,Value=aryan}]'\n\n# Auto-stop after 2 hours, from inside the instance\necho 'sudo shutdown -h +120' | at now\n\n# And a budget alarm that emails at 50%\n# ...set up once, protects you forever",
      w: "Tags make the bill readable. The self-shutdown makes forgetting survivable." } } },

  { h: "The five-minute setup checklist" },
  { ol: [
   "MFA on the root user. **Do this first.**",
   "An IAM admin user for yourself, with MFA. Sign out of root.",
   "No root access keys. Delete any that exist.",
   "CLI configured with a **named profile**, and `aws sts get-caller-identity` returning your ARN.",
   "Cost Explorer enabled and a monthly budget with alerts at 50% and 90%.",
   "A billing alarm in CloudWatch as a second line — budgets and alarms fail independently.",
   "`.gitignore` covering `.env`, `.aws/`, `*.pem` before you write any code."
  ] },

  { tryit: { t: "Do the setup, then prove it",
    task: "Complete the checklist above on a real AWS account. Then verify three things from the command line: that your identity is not root, that a budget exists, and that you have no access keys older than today. Finally, deliberately try an action you have not granted yourself and read the error.",
    hint: "The verification is the point. A checklist you did not check is a checklist you half did.",
    sol: { lang: "bash", code: "# 1. Am I root? (You must NOT be.)\naws sts get-caller-identity --query Arn --output text\n# arn:aws:iam::123456789012:user/aryan     <- good\n# arn:aws:iam::123456789012:root           <- stop and fix this\n\n# 2. Does a budget exist?\naws budgets describe-budgets \\\n  --account-id $(aws sts get-caller-identity --query Account --output text) \\\n  --query 'Budgets[].[BudgetName,BudgetLimit.Amount]' --output table\n\n# 3. How old are my access keys?\naws iam list-access-keys \\\n  --query 'AccessKeyMetadata[].[AccessKeyId,CreateDate,Status]' --output table\n# Rotate anything older than 90 days. Delete anything you do not recognise.\n\n# 4. Read a permission error on purpose\naws organizations list-accounts\n# An error occurred (AccessDeniedException) ...\n#\n# Read the whole message. It names the identity, the action and the\n# resource -- which is exactly what the next lesson teaches you to fix." },
    w: "Twenty minutes here removes the two failure modes that cost beginners money on AWS. It is also the first thing a competent reviewer looks for in somebody's account, so it is worth being able to say you did it." } },

  { vocab: ["Secrets Management", "Audit Log", "Encryption", "Multi-Factor Authentication"] }
 ],
 k: [
  "MFA on root, then never use root again — it cannot be restricted by any policy.",
  "Never create root access keys, and never commit any key; scanners find them within minutes.",
  "Use a named CLI profile, and make `aws sts get-caller-identity` your reflex when anything is denied.",
  "Set a budget with alerts at 50% and 90% before you create your first resource.",
  "GPU instances have no free tier. Tag everything and schedule a shutdown."
 ],
 r: ["Secrets Management", "Audit Log", "Encryption", "Least Privilege", "Cloud Region"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws sts get-caller-identity", w: "ask AWS who you are, before debugging anything else" },
   { c: "aws configure --profile personal", w: "set up a named profile rather than the default" },
   { c: "aws iam list-access-keys --query 'AccessKeyMetadata[].[AccessKeyId,CreateDate]'", w: "audit your own keys and their age" }
  ]
 }
}

]);

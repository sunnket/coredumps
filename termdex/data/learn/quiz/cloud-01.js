/* AWS for AI Engineers — question bank.

   Chaptered against the track's own modules. A large share are `hardcore`:
   every wrong option is a mistake somebody actually makes on AWS, usually the
   one that produces a bill or a two-hour debugging session rather than an
   error message. */

TD.addMCQ("cloud", "start", [
  {
    tag: "Regions and zones",
    lvl: "core",
    q: "What is the difference between an AWS **region** and an **availability zone**?",
    o: [
      "A region is a geographic area; an availability zone is one or more isolated data centres inside it",
      "A region is a data centre; an availability zone is a rack inside it",
      "They are the same thing under two names",
      "A region is a network boundary; an availability zone is a billing boundary"
    ],
    a: 0,
    x: "A region is a place (`ap-south-1` is Mumbai). An availability zone is a failure boundary inside that place, isolated by power and network. \"Highly available\" on AWS almost always means \"spread across at least two zones\".",
    note: "A subnet lives in exactly one availability zone, which is why you always create at least two."
  },
  {
    tag: "Global services",
    lvl: "intermediate",
    q: "You created an ACM certificate in `ap-south-1` and it will not attach to your CloudFront distribution. Why?",
    o: [
      "CloudFront only accepts certificates issued in `us-east-1`, because it is a global service",
      "ACM certificates cannot be used with CloudFront at all",
      "The certificate must be validated by email rather than DNS",
      "CloudFront requires an imported certificate, not an ACM-issued one"
    ],
    a: 0,
    x: "CloudFront is global and reads its certificate from `us-east-1` regardless of where your other resources live. IAM and Route 53 are global in the same way.",
    note: "This is not arbitrary: global services have their control plane in `us-east-1`."
  },
  {
    tag: "Free tier",
    lvl: "hardcore",
    q: "Which of these is genuinely free on a new AWS account?",
    o: [
      "1 million Lambda requests per month, permanently",
      "750 hours per month of a `g4dn.xlarge` GPU instance for 12 months",
      "Unlimited S3 storage for the first 12 months",
      "One RDS instance, free permanently"
    ],
    a: 0,
    x: "Lambda's free allowance — 1M requests and 400,000 GB-seconds per month — does not expire. Most learning projects never pay for Lambda at all.",
    note: "GPU instances have **no free tier of any kind**. RDS is free for 12 months only, and its storage and backups are billed separately even during that window — which is the single most common surprise on a beginner's invoice.",
    steps: [
      "Permanently free: Lambda requests and duration, DynamoDB storage up to 25 GB.",
      "Free for 12 months: S3 up to 5 GB, EC2 `t2/t3.micro` for 750 hours, RDS `db.t3.micro` for 750 hours.",
      "Never free: any GPU instance, NAT gateways, load balancers beyond the first trial period."
    ]
  },
  {
    tag: "Account safety",
    lvl: "hardcore",
    q: "You have just created an AWS account. Which action protects you most, done first?",
    o: [
      "Enable MFA on the root user and then stop using root",
      "Create an access key for the root user so scripts can automate everything",
      "Set the account's default region to the one nearest your users",
      "Enable CloudTrail in every region"
    ],
    a: 0,
    x: "Root can do anything and **no policy can restrict it**, so protecting it with MFA is the highest-value single action. Afterwards you work as an IAM user or through Identity Center.",
    note: "Creating a root access key is the trap here, and it is tempting because it makes everything work immediately. There is no legitimate reason for one — a leaked root key is total account compromise, and automated scanners find committed AWS keys within minutes."
  },
  {
    tag: "Cost control",
    lvl: "core",
    q: "What does an AWS **budget alert** actually do when you exceed the amount?",
    o: [
      "Sends a notification; it does not stop or delete anything",
      "Stops all running resources until you raise the budget",
      "Blocks new resource creation for the rest of the month",
      "Automatically moves storage to a cheaper class"
    ],
    a: 0,
    x: "A budget is an alarm, not a cap. AWS keeps running your resources and keeps billing you. The protection it offers is that a human finds out while the number is still small.",
    note: "Set thresholds at 50% and 90% of forecast, not just at 100% — by the time you have breached the budget the month is already spent."
  }
]);

TD.addMCQ("cloud", "iam", [
  {
    tag: "Users and roles",
    lvl: "core",
    q: "Your Lambda function needs to read from an S3 bucket. What should it use?",
    o: [
      "An IAM role that the Lambda service assumes, receiving temporary credentials",
      "An IAM user's access key stored in a Lambda environment variable",
      "The bucket's public URL, with Block Public Access disabled",
      "The root user's credentials, since the function runs inside your own account"
    ],
    a: 0,
    x: "Humans get users; everything else gets roles. The Lambda service assumes the role and AWS injects credentials that expire in hours — nothing to leak, nothing to rotate.",
    note: "Putting a long-lived access key in an environment variable of something running *inside* AWS is the clearest sign somebody has not learned the role model. It appears in deployment logs, it never expires, and it survives being copied."
  },
  {
    tag: "Policy evaluation",
    lvl: "hardcore",
    q: "An identity has a policy allowing `s3:*` on all resources, and a second policy denying `s3:DeleteObject` on one bucket. What happens when it calls `DeleteObject` on that bucket?",
    o: [
      "Denied — an explicit Deny always wins, whatever else allows it",
      "Allowed — the wildcard allow is broader and takes precedence",
      "Allowed — the two policies conflict, so AWS falls back to the more permissive one",
      "It depends which policy was attached most recently"
    ],
    a: 0,
    x: "AWS evaluates an explicit `Deny` first and nothing can override it. Only if no Deny matches does it look for an Allow, and the absence of one is an implicit deny.",
    note: "The tempting wrong answer is that the more specific or the more recent policy wins, which is how many other systems work. AWS has no such rule: Deny beats everything, and there is no ordering or specificity contest."
  },
  {
    tag: "S3 permissions",
    lvl: "hardcore",
    q: "Your policy grants `s3:GetObject` and `s3:ListBucket` on `arn:aws:s3:::my-docs/*`. Reading a file works; listing the bucket returns AccessDenied. Why?",
    o: [
      "`ListBucket` acts on the bucket itself, so it needs `arn:aws:s3:::my-docs` without the `/*`",
      "`ListBucket` requires a bucket policy and cannot be granted by an identity policy",
      "The bucket has Block Public Access enabled, which prevents listing",
      "`ListBucket` needs `s3:ListAllMyBuckets` as well"
    ],
    a: 0,
    x: "Object actions target the object ARN (`bucket/*`); bucket actions target the bucket ARN (`bucket`). A policy that lists both actions but only one ARN half-works, which is exactly why the failure is confusing.",
    note: "The correct `Resource` for this policy is both ARNs: `[\"arn:aws:s3:::my-docs\", \"arn:aws:s3:::my-docs/*\"]`."
  },
  {
    tag: "Trust policies",
    lvl: "intermediate",
    q: "You attached a correct permissions policy to a role, but ECS reports it cannot assume it. Which document is wrong?",
    o: [
      "The role's trust policy, which names who is permitted to assume the role",
      "The permissions policy, which must also list `sts:AssumeRole`",
      "The bucket policy on the resource being accessed",
      "The task definition's `taskRoleArn` field, which must equal the execution role"
    ],
    a: 0,
    x: "A role has two documents. The permissions policy says what the role can do; the trust policy says who may become it. An `sts:AssumeRole` failure is always the second one.",
    note: "The action named in an AccessDenied message tells you which document to open: `sts:AssumeRole` means the trust policy, and anything else means the permissions or resource policy."
  },
  {
    tag: "Debugging",
    lvl: "core",
    q: "Which command should be your first move when an AWS call is unexpectedly denied?",
    o: [
      "`aws sts get-caller-identity`, to confirm which identity is actually making the call",
      "`aws iam attach-user-policy` with `AdministratorAccess`, to rule out permissions",
      "`aws configure`, to re-enter your credentials",
      "`aws cloudtrail create-trail`, to start logging the failure"
    ],
    a: 0,
    x: "The most common cause is not a missing permission — it is the wrong profile, an expired session, or a different account entirely. One command rules that out in a second.",
    note: "Attaching administrator to make an error go away teaches you nothing and creates a permission nobody will ever dare remove."
  },
  {
    tag: "Least privilege",
    lvl: "hardcore",
    q: "You need to narrow an over-broad role without breaking it. Which approach gives you the narrowest policy that still works?",
    o: [
      "Use IAM Access Analyzer to generate a policy from the actions the role actually used in CloudTrail",
      "Remove permissions one at a time in production until something breaks, then add the last one back",
      "Replace the policy with `AdministratorAccess` scoped to one region",
      "Delete the role and recreate it with no policy, letting AWS infer the permissions"
    ],
    a: 0,
    x: "Access Analyzer reads the identity's CloudTrail history and emits a policy containing exactly the actions it used. It does the narrowing for you and it is based on evidence rather than guesswork.",
    note: "The trial-and-error option is the one people actually do, and it is bad for two reasons: it breaks production to gather information, and it only finds the permissions exercised during your test window — a monthly job's permission survives the test and is removed anyway."
  }
]);

TD.addMCQ("cloud", "s3", [
  {
    tag: "The storage model",
    lvl: "hardcore",
    q: "Renaming the prefix `raw/` to `ingested/` on a bucket holding two million objects costs what?",
    o: [
      "A copy of every object followed by a delete, because prefixes are not directories",
      "Nothing — it is a metadata operation on the folder",
      "One API call, since S3 supports atomic prefix rename",
      "A short period of unavailability while S3 reindexes"
    ],
    a: 0,
    x: "S3 is a flat key-value store. The `/` characters are ordinary characters in a key and the console's folder view is a UI convention. There is no directory object to rename.",
    note: "This is the single most consequential misunderstanding about S3, because it means key layout is a decision you effectively cannot revise cheaply — design it before you load two million objects."
  },
  {
    tag: "Storage classes",
    lvl: "hardcore",
    q: "You move a million 4 KB JSON files from Standard to Standard-Infrequent Access to save money. What happens?",
    o: [
      "The bill goes **up**, because IA has a 128 KB minimum billable object size",
      "The bill roughly halves, matching the per-GB price difference",
      "Nothing changes until the objects are 30 days old",
      "The objects become unreadable until restored"
    ],
    a: 0,
    x: "Infrequent Access bills a minimum of 128 KB per object and a minimum 30-day duration. A million 4 KB objects are billed as 128 GB rather than 4 GB, which costs more than leaving them in Standard.",
    note: "The tempting reasoning — cheaper per GB, so cheaper — is right for large objects and exactly backwards for many small ones. For a chunk store, use Intelligent-Tiering or stay in Standard."
  },
  {
    tag: "Lifecycle rules",
    lvl: "hardcore",
    q: "Which lifecycle rule should go on every S3 bucket you ever create?",
    o: [
      "Abort incomplete multipart uploads after a few days",
      "Transition everything to Glacier Deep Archive after 30 days",
      "Expire all objects after 90 days",
      "Enable versioning with no expiry on old versions"
    ],
    a: 0,
    x: "Failed large uploads leave partial data that is billed, invisible in the console object list, and accumulates forever. One rule removes an entire category of phantom cost.",
    note: "The other options are all plausible-sounding and all actively harmful as defaults: archiving everything makes reads slow and charged, expiring everything deletes data you need, and versioning without an expiry rule means you pay to store every version of every file indefinitely."
  },
  {
    tag: "Presigned URLs",
    lvl: "intermediate",
    q: "You issue presigned upload URLs so browsers can upload directly to S3. What must the presigned POST include besides the key?",
    o: [
      "A content-length range and a pinned content type, so the URL cannot be used for an unbounded or wrong-typed upload",
      "The AWS access key, so the browser can authenticate",
      "The bucket policy, so S3 knows the upload is permitted",
      "A CORS header generated per user"
    ],
    a: 0,
    x: "A presigned URL is a bearer token: whoever holds it can use it. Without a size condition it authorises an upload of any size at your expense, and without a content-type condition it authorises any file.",
    note: "Keep the expiry short as well — ten minutes is generous for an upload flow."
  },
  {
    tag: "Key layout",
    lvl: "intermediate",
    q: "Why key ingested documents by the SHA-256 of their contents rather than by original filename?",
    o: [
      "Deduplication and idempotent re-ingestion come free, and the key doubles as an integrity check",
      "It makes S3 listing faster",
      "Filenames are not permitted as S3 keys",
      "It reduces storage cost per object"
    ],
    a: 0,
    x: "Two users uploading the same PDF produce one object, re-running the pipeline is a no-op, and re-hashing the bytes verifies them. Content addressing turns three problems into a property of the key.",
    note: "Keep the original filename in object metadata so you can still show it to users."
  },
  {
    tag: "Consistency",
    lvl: "core",
    q: "You write an object and immediately read it back. What does S3 guarantee?",
    o: [
      "You will read the object you just wrote — S3 has been strongly read-after-write consistent since 2020",
      "You may read a stale version for a few seconds, so a retry loop is required",
      "Consistency depends on the storage class",
      "Reads are consistent only within the same availability zone"
    ],
    a: 0,
    x: "S3 became strongly consistent for all operations in December 2020. Blog posts and courses that tell you to retry reads after a write are describing a system that no longer exists.",
    note: "This one is worth knowing precisely because the outdated advice is still widely repeated."
  }
]);

TD.addMCQ("cloud", "compute", [
  {
    tag: "Choosing compute",
    lvl: "hardcore",
    q: "Your AI service occasionally takes 22 minutes to process a large document. Which compute service is ruled out immediately?",
    o: [
      "Lambda, because its maximum execution time is 15 minutes",
      "ECS Fargate, because containers are restarted every 15 minutes",
      "EC2, because on-demand instances have a runtime cap",
      "App Runner, because it only supports synchronous HTTP under 30 seconds"
    ],
    a: 0,
    x: "The 15-minute Lambda ceiling is hard and cannot be raised. A workload that sometimes exceeds it must either be decomposed or moved to a container or instance.",
    note: "The distractors describe limits that do not exist. Fargate, EC2 and App Runner all run indefinitely; only Lambda has a hard wall."
  },
  {
    tag: "Lambda tuning",
    lvl: "hardcore",
    q: "Your CPU-bound Lambda is slow. You raise its memory from 512 MB to 1,792 MB. What is the likely effect on cost?",
    o: [
      "Cost may **fall**, because CPU scales with memory and the function finishes proportionally faster",
      "Cost rises exactly 3.5×, matching the memory increase",
      "Cost is unchanged, since Lambda bills per request rather than per GB-second",
      "Cost rises, and latency is unaffected because memory does not influence CPU"
    ],
    a: 0,
    x: "Lambda allocates CPU in proportion to memory, and bills GB-seconds. Tripling memory triples the per-second rate but can cut duration by more than that, so the product falls.",
    note: "This is genuinely counter-intuitive and it is why the memory setting should be tuned empirically rather than set to the smallest value that avoids an out-of-memory error."
  },
  {
    tag: "ECS roles",
    lvl: "hardcore",
    q: "Your Fargate task fails to start with no application logs at all. Which role is the most likely cause?",
    o: [
      "The **execution** role, which ECS uses to pull the image, fetch secrets and create log streams",
      "The **task** role, which your application code uses to call AWS APIs",
      "The service-linked role, which cannot be modified",
      "The instance profile, which Fargate inherits from the cluster"
    ],
    a: 0,
    x: "The execution role acts before your container runs. If it cannot pull the image or create the log group, the task dies with nothing written — which is exactly the symptom described.",
    note: "The task role is the tempting answer because it is the one you think about while writing code. But a task-role failure produces an AccessDenied *inside* your application, with logs; an execution-role failure produces silence."
  },
  {
    tag: "Container architecture",
    lvl: "hardcore",
    q: "You build an image on an Apple silicon Mac and deploy to Fargate. The task starts and immediately stops. What is the likely cause?",
    o: [
      "The image was built for arm64 and the task is configured for x86-64",
      "Fargate does not support images built outside AWS CodeBuild",
      "The image exceeds Fargate's 500 MB size limit",
      "Docker Desktop images use a proprietary format Fargate cannot read"
    ],
    a: 0,
    x: "Docker builds for the host architecture by default. Either pass `--platform linux/amd64` or set the task's `runtimePlatform` to ARM64 — which is also about 20% cheaper.",
    note: "The failure is architecture mismatch (`exec format error`), and it often produces no logs at all, which makes it read like a permissions problem."
  },
  {
    tag: "GPU instances",
    lvl: "intermediate",
    q: "You need a GPU on a brand-new AWS account and `run-instances` fails with a quota error. What is happening?",
    o: [
      "New accounts have a GPU quota of zero and must request an increase, which can take hours or days",
      "GPU instances are only available in `us-east-1`",
      "GPU instances require an Enterprise Support plan",
      "The account must first run a CPU instance for 30 days"
    ],
    a: 0,
    x: "Accelerated-compute quotas start at zero. The request is free and routine, but it is not instant — raise it before the evening you plan to train.",
    note: "Ask for the vCPU quota for the instance *family* (for example `G and VT instances`), not for a specific instance type."
  }
]);

TD.addMCQ("cloud", "data", [
  {
    tag: "Choosing a vector store",
    lvl: "hardcore",
    q: "Your RAG corpus is 400,000 chunks and you already run Postgres on RDS. What is the sensible first choice for vector search?",
    o: [
      "pgvector in the Postgres you already have",
      "A dedicated managed vector database, because Postgres cannot do approximate nearest neighbour",
      "OpenSearch Serverless, because it is the AWS-native answer",
      "In-memory NumPy, reloaded on every deployment"
    ],
    a: 0,
    x: "At this size pgvector is fast enough, it gives you foreign keys and transactions with your metadata, and it removes an entire consistency problem. Most teams add a vector database years before they need one.",
    note: "The claim that Postgres cannot do ANN is simply false — pgvector supports both HNSW and IVFFlat. OpenSearch Serverless is a real option and carries a monthly floor of roughly $175 before you index anything, which for a 400k-chunk corpus is poor value."
  },
  {
    tag: "pgvector tuning",
    lvl: "hardcore",
    q: "Your pgvector HNSW queries return fewer relevant results than your offline test suggested. What is the most likely cause?",
    o: [
      "`hnsw.ef_search` is at its default of 40, and it is a per-session setting your connection pool never applies",
      "The index was built before the data was loaded and is therefore empty",
      "HNSW indexes silently expire and must be rebuilt weekly",
      "Cosine distance is not supported by HNSW and falls back to a sequential scan"
    ],
    a: 0,
    x: "`ef_search` is the recall/latency dial and it is set per connection. Setting it once at startup does nothing for pooled connections, so production quietly runs at the default while your test script ran at whatever you set interactively.",
    note: "The fix is to issue `SET hnsw.ef_search = 100` in the pool's connection-initialisation hook. This silently costs teams recall for months."
  },
  {
    tag: "Hybrid search",
    lvl: "hardcore",
    q: "Why does reciprocal rank fusion combine retrievers using rank position rather than their scores?",
    o: [
      "Cosine similarity and BM25 live on incomparable scales, so adding the raw scores is meaningless",
      "Rank is cheaper to compute than a score",
      "Scores are not available from most retrievers",
      "Using ranks makes the fused result deterministic, which scores do not"
    ],
    a: 0,
    x: "Cosine similarity is bounded in a narrow range; BM25 is unbounded and corpus-dependent. There is no principled normalisation between them, so RRF uses only the ordering, which is comparable by construction.",
    note: "The constant in `1/(k + rank)`, usually about 60, damps the dominance of whichever retriever put something at rank 1."
  },
  {
    tag: "DynamoDB modelling",
    lvl: "intermediate",
    q: "You are storing chat history and need to fetch one conversation in order. What is the right key design?",
    o: [
      "Partition key on the conversation id, sort key on the timestamp",
      "Partition key on the timestamp, sort key on the conversation id",
      "Partition key on the user id, with no sort key",
      "A single fixed partition key, with a global secondary index for everything"
    ],
    a: 0,
    x: "The partition key groups the items you fetch together; the sort key orders them within that group. This answers the access pattern in one constant-cost query.",
    note: "Partitioning on the timestamp spreads one conversation across every partition and forces a scan. In DynamoDB the key comes from the query, not from the entity."
  },
  {
    tag: "Queues",
    lvl: "hardcore",
    q: "Your SQS consumer occasionally processes the same document twice. What is the correct response?",
    o: [
      "Make the consumer idempotent, and check that the visibility timeout exceeds the worst-case processing time",
      "Switch to a FIFO queue, which guarantees each message is delivered exactly once",
      "Delete the message at the start of processing rather than at the end",
      "Reduce the number of consumers to one"
    ],
    a: 0,
    x: "Standard SQS is at-least-once by design, and a visibility timeout shorter than your processing time guarantees redelivery. Idempotent consumers make duplicates harmless.",
    note: "Deleting the message first is the dangerous option: it converts duplicate processing into silently lost work, which is far worse. FIFO reduces duplicates but does not remove the need for idempotency, and it costs throughput."
  }
]);

TD.addMCQ("cloud", "bedrock", [
  {
    tag: "When to use Bedrock",
    lvl: "intermediate",
    q: "What is the strongest technical reason to call a model through Bedrock rather than the provider's own API?",
    o: [
      "Requests stay inside AWS with IAM access control, CloudTrail audit and a choice of region for data residency",
      "Bedrock models are cheaper per token than the same models called directly",
      "Bedrock gets new models before the providers release them",
      "Bedrock removes the need for prompt engineering"
    ],
    a: 0,
    x: "The governance is the product: IAM instead of an API key, CloudTrail instead of nothing, and a region you choose. For a bank or a hospital that is often what makes an AI feature legally shippable.",
    note: "Bedrock is usually *behind* on new models rather than ahead, and pricing is broadly comparable. Choose it for the governance, not for the price or the release schedule."
  },
  {
    tag: "First call",
    lvl: "hardcore",
    q: "Your first Bedrock call from a new account returns `AccessDeniedException` even though your IAM policy allows `bedrock:InvokeModel`. Why?",
    o: [
      "Model access has not been requested — a new account has no models enabled by default",
      "Bedrock requires a VPC endpoint before any call succeeds",
      "The account needs a support plan above Basic",
      "The model id must include the account number as a prefix"
    ],
    a: 0,
    x: "Model access is granted per model in the Bedrock console and starts off. The error is indistinguishable from an IAM problem, which is why it costs people an afternoon.",
    note: "Request access on day one. Some models require a short use-case form and approval is not always instant — finding this out during a demo is a bad afternoon."
  },
  {
    tag: "Streaming and cost",
    lvl: "hardcore",
    q: "You stream Bedrock responses to a browser. Users frequently navigate away mid-generation. What happens to your cost accounting?",
    o: [
      "Abandoned streams are billed but never emit the final usage event, so they vanish from your data unless you count tokens locally",
      "Abandoned streams are not billed, so no accounting is needed",
      "The usage event always arrives, because Bedrock sends it before the content",
      "Cost is only billed on the input tokens, so partial output is free"
    ],
    a: 0,
    x: "Token usage arrives in the final metadata event. If the client disconnects you never see it, and the generation was still billed — so under-reporting concentrates on exactly the requests users abandoned.",
    note: "Count output tokens as they pass and record them in a `finally` block, which runs on cancellation. This is one of the most common cost-data leaks in a first production AI feature."
  },
  {
    tag: "Managed RAG",
    lvl: "hardcore",
    q: "For a 200-document portfolio project, why is a Bedrock Knowledge Base often the wrong choice?",
    o: [
      "Its vector store carries a monthly floor of roughly $175, and it removes the chunking decisions an interviewer wants to hear about",
      "It cannot handle PDF documents",
      "It does not support citations",
      "It requires a dedicated VPC and NAT gateway"
    ],
    a: 0,
    x: "OpenSearch Serverless has a minimum capacity charge before you index anything, which dwarfs a `db.t4g.micro` running pgvector. And \"why that chunk size?\" answered with \"the service chose it\" is a weak project deep-dive.",
    note: "The same service is excellent value for a 50,000-document enterprise pilot with a compliance review and a six-week deadline. The trade flips on scale and constraints, not on quality."
  }
]);

TD.addMCQ("cloud", "net", [
  {
    tag: "Public and private",
    lvl: "hardcore",
    q: "What actually makes a subnet **public**?",
    o: [
      "Its route table sends `0.0.0.0/0` to an Internet Gateway",
      "A checkbox labelled Public on the subnet",
      "It has instances with public IP addresses",
      "Its security group allows inbound traffic from `0.0.0.0/0`"
    ],
    a: 0,
    x: "There is no public flag. A subnet is public precisely when its route table has a default route to an Internet Gateway, and private when it does not.",
    note: "Assigning a public IP to an instance in a subnet with no Internet Gateway route achieves nothing — the address exists and the traffic has nowhere to go. That failure is common and completely silent."
  },
  {
    tag: "Lambda networking",
    lvl: "hardcore",
    q: "You attach a working Lambda to a VPC so it can reach RDS. It now times out on every external API call. Why?",
    o: [
      "Inside a VPC the function obeys its subnet's route table, and a private subnet has no route to the internet without a NAT gateway or endpoints",
      "Lambda functions cannot make outbound calls once attached to a VPC, by design",
      "The function's execution role loses its internet permissions when placed in a VPC",
      "VPC-attached Lambdas must use an Elastic IP, which has to be requested"
    ],
    a: 0,
    x: "A Lambda outside a VPC has internet access by default. Inside one, it is an ordinary VPC resource and needs a route out like anything else.",
    note: "The symptom is the giveaway: every outbound call hangs and then times out, with no error mentioning networking. That is routing, not permissions — but people spend an hour on IAM first."
  },
  {
    tag: "Cost",
    lvl: "hardcore",
    q: "Your ingestion pipeline pulls 500 GB per month from S3 into private-subnet containers. Which change removes the largest avoidable cost?",
    o: [
      "Add the free S3 gateway VPC endpoint, so the traffic stops being processed by the NAT gateway",
      "Move the containers to a public subnet with public IPs",
      "Switch the bucket to Infrequent Access storage",
      "Enable S3 Transfer Acceleration"
    ],
    a: 0,
    x: "A NAT gateway charges per gigabyte processed on top of its hourly rate. S3 and DynamoDB gateway endpoints are free and keep that traffic off the NAT entirely.",
    note: "This is the most common avoidable line on a small AWS bill. Transfer Acceleration would make it worse — it is a paid feature for long-distance uploads, not a saving."
  },
  {
    tag: "Security groups",
    lvl: "intermediate",
    q: "Your API's security group allows inbound 8000 from the load balancer's security group. Do you also need an outbound rule for the responses?",
    o: [
      "No — security groups are stateful, so return traffic for an allowed connection is permitted automatically",
      "Yes — every direction must be allowed explicitly",
      "Only if the response exceeds the MTU",
      "Only for HTTPS; HTTP responses are allowed by default"
    ],
    a: 0,
    x: "Security groups track connection state. Network ACLs are the stateless layer, operate on subnets, and you will rarely need to touch one.",
    note: "Referencing another security group rather than an IP range is the pattern worth adopting: task IPs change constantly, group ids do not."
  },
  {
    tag: "Diagnosis",
    lvl: "intermediate",
    q: "Which AWS tool tells you exactly which security group rule or missing route is blocking a path, without deploying anything?",
    o: [
      "VPC Reachability Analyzer",
      "AWS Trusted Advisor",
      "VPC Flow Logs",
      "AWS Config"
    ],
    a: 0,
    x: "Reachability Analyzer traces a path between two elastic network interfaces and names the blocking component in plain language.",
    note: "Flow Logs tell you what traffic happened; Reachability Analyzer tells you what *would* happen, which is what you want before you have deployed the thing."
  }
]);

TD.addMCQ("cloud", "deploy", [
  {
    tag: "Image tags",
    lvl: "hardcore",
    q: "Why should production deployments never reference `:latest`?",
    o: [
      "It is a moving pointer, so \"what version is running?\" and \"roll back to the previous one\" both become unanswerable",
      "AWS charges more for images tagged `latest`",
      "ECR refuses to serve `latest` to Fargate",
      "`latest` images skip vulnerability scanning"
    ],
    a: 0,
    x: "Tag with the git commit SHA. Then the running version and the code that produced it are the same question, and rollback is naming an earlier tag.",
    note: "Keep `latest` for local convenience if you like. The problem is not the name, it is that the mapping from tag to content changes underneath you."
  },
  {
    tag: "Health checks",
    lvl: "hardcore",
    q: "Your `/health` endpoint returns 200 unconditionally. The database is down and every real request fails. What does the load balancer do?",
    o: [
      "Nothing — it keeps routing traffic to a broken task indefinitely",
      "It detects the 5xx responses and removes the target automatically",
      "It fails the target after three consecutive slow responses",
      "It retries each failed request against a different target"
    ],
    a: 0,
    x: "The load balancer only knows what the health check tells it. A check that cannot fail is a check that conveys nothing.",
    note: "Split it: `/health` answers *is the process alive* (a failure means restart), and `/ready` answers *can I serve a request right now* (a failure means stop sending traffic). Point the load balancer at readiness."
  },
  {
    tag: "Zero-downtime deploys",
    lvl: "hardcore",
    q: "Requests fail during every deploy even though ECS starts the new task before stopping the old one. What is missing?",
    o: [
      "A SIGTERM handler that fails readiness first, plus a deregistration delay longer than the slowest request",
      "A second availability zone",
      "Blue-green deployment, which is the only way to avoid dropped requests",
      "A longer health-check interval"
    ],
    a: 0,
    x: "The old task must stop receiving *new* requests while finishing the ones in flight. Failing readiness on SIGTERM does the first; the deregistration delay allows the second.",
    note: "Blue-green solves this too and is much heavier. Fifteen lines of signal handling gets you zero dropped requests on a rolling deploy, and you can verify it by deploying under load and counting failures."
  },
  {
    tag: "Secrets",
    lvl: "hardcore",
    q: "Your task definition references a Secrets Manager secret and the task fails to start. Which role needs `secretsmanager:GetSecretValue`?",
    o: [
      "The execution role, because ECS fetches the secret before your container starts",
      "The task role, because the secret is used by your application",
      "Both roles, with identical policies",
      "Neither — Secrets Manager access is granted by the secret's resource policy alone"
    ],
    a: 0,
    x: "Injecting a secret as an environment variable happens during task startup, and ECS does it using the execution role. Your code never calls Secrets Manager at all.",
    note: "If your application fetches secrets itself at runtime with the SDK, then it is the task role — which is why the two cases feel identical and are not."
  },
  {
    tag: "Autoscaling",
    lvl: "hardcore",
    q: "Which metric should drive autoscaling for a service that spends most of its time waiting on a model API?",
    o: [
      "ALB request count per target, or your own queue depth",
      "CPU utilisation, since it is the standard scaling metric",
      "Memory utilisation, because model responses are large",
      "Network throughput on the load balancer"
    ],
    a: 0,
    x: "An I/O-bound service can be saturated with requests at 8% CPU. CPU is the reflex and it will never trigger, so the service silently fails to scale under load.",
    note: "Always set a maximum as well. Without one, a retry storm or a loop scales you into a bill nobody authorised."
  }
]);

TD.addMCQ("cloud", "ops", [
  {
    tag: "Logging cost",
    lvl: "hardcore",
    q: "What is the default retention on a new CloudWatch log group?",
    o: [
      "Never expire — you pay to store those logs indefinitely",
      "30 days",
      "7 days",
      "24 hours, after which logs move to S3 automatically"
    ],
    a: 0,
    x: "Logs accumulate forever unless you set a retention policy. On a chatty service this can cost more per month than the compute producing the logs.",
    note: "Set retention the day you create the group. It is one command, it is the cheapest saving on AWS, and almost every account has several groups where nobody did."
  },
  {
    tag: "Alarms",
    lvl: "hardcore",
    q: "Which of these alarms is most likely to be useful rather than ignored?",
    o: [
      "5xx rate above 1% sustained for five minutes",
      "CPU utilisation above 80%",
      "Any change in running task count",
      "Memory utilisation above 75%"
    ],
    a: 0,
    x: "It is a symptom a user experiences. The others are machine statistics that fire during normal healthy operation — a well-tuned autoscaling service *lives* at 80% CPU.",
    note: "Alarms that fire when nothing is wrong train people to ignore alarms, which is worse than having none. Six alarms you trust beat forty you scroll past."
  },
  {
    tag: "Missing data",
    lvl: "hardcore",
    q: "Your alarm on a low-traffic endpoint fires every night at 3am with no incident. What is the likely configuration mistake?",
    o: [
      "`treat-missing-data` is left at its default, so periods with no requests are evaluated as breaching",
      "The evaluation period is too long",
      "The alarm is in a different region from the metric",
      "CloudWatch does not support alarms on low-volume metrics"
    ],
    a: 0,
    x: "With no traffic there is no data point, and how CloudWatch interprets that is a setting. Use `notBreaching` for metrics that are legitimately absent when the system is idle.",
    note: "Decide this explicitly for every alarm. It is the most common cause of alarm fatigue on a service with daily traffic cycles."
  },
  {
    tag: "Custom metrics",
    lvl: "intermediate",
    q: "You want dozens of custom metrics without a large CloudWatch bill. What should you use?",
    o: [
      "Embedded Metric Format — emit specially-shaped JSON log lines and CloudWatch extracts the metrics",
      "`PutMetricData` for every value, batched hourly",
      "A separate metrics database, queried by CloudWatch",
      "Custom metrics are free, so any approach works"
    ],
    a: 0,
    x: "EMF avoids the per-metric charge entirely and keeps the log line and the metric consistent, because they are the same object.",
    note: "`PutMetricData` bills per metric per month and a well-intentioned dashboard can quietly become a significant line item."
  },
  {
    tag: "AI bill shape",
    lvl: "hardcore",
    q: "On a typical small AI product, which line dominates the AWS bill?",
    o: [
      "Model inference calls, usually 60–85% of the total",
      "Fargate compute, usually around half",
      "S3 storage of the document corpus",
      "The load balancer"
    ],
    a: 0,
    x: "For an AI service the infrastructure is a small fraction and the model calls are the rest. Optimisation effort should follow that proportion.",
    note: "The trap is spending a week shaving 30% off a ₹1,500 compute line while a ₹40,000 model line goes unexamined. Retrieval size, prompt caching and model routing are where the money is."
  }
]);

TD.addMCQ("cloud", "iac", [
  {
    tag: "State",
    lvl: "hardcore",
    q: "What happens if you lose your Terraform state file?",
    o: [
      "Terraform believes nothing exists and its next plan proposes creating everything again",
      "Terraform rebuilds it automatically from the AWS API",
      "Nothing — state is a cache and is regenerated on `plan`",
      "Terraform refuses to run until you restore from a backup"
    ],
    a: 0,
    x: "State is Terraform's record of what it created. Without it there is no mapping from your configuration to real resources, and recovery means importing every resource by hand.",
    note: "This is why state goes in S3 with encryption and locking from day one, not on somebody's laptop."
  },
  {
    tag: "State security",
    lvl: "hardcore",
    q: "Why must the Terraform state file be treated as a secret?",
    o: [
      "It contains resource attributes in plaintext, including generated passwords and any secret passed as a variable",
      "It contains your AWS access keys",
      "It contains the private half of every TLS certificate",
      "It is not sensitive; only the `.tf` files are"
    ],
    a: 0,
    x: "An RDS master password generated by Terraform, an API key passed as a variable, a database connection string — all appear as plaintext JSON in state.",
    note: "Never commit `terraform.tfstate`, always encrypt the backend bucket, and restrict read access as tightly as you would restrict the secret itself."
  },
  {
    tag: "Plan discipline",
    lvl: "hardcore",
    q: "Your plan output includes `# forces replacement` on your RDS instance. What does that mean?",
    o: [
      "Terraform will destroy the database and create a new empty one",
      "Terraform will restart the instance during the next maintenance window",
      "Terraform will resize the instance in place",
      "Terraform will create a replica and promote it"
    ],
    a: 0,
    x: "Some attribute changes cannot be applied in place, so Terraform deletes and recreates. On a stateful resource that means data loss.",
    note: "A `lifecycle { prevent_destroy = true }` block on databases and state buckets costs one line and prevents a career-defining afternoon."
  },
  {
    tag: "Drift",
    lvl: "intermediate",
    q: "Somebody edits a security group in the console during an incident. What does the next `terraform plan` do?",
    o: [
      "Proposes reverting the manual change, because the configuration and reality now disagree",
      "Adopts the manual change into the configuration automatically",
      "Fails with an error until the drift is resolved manually",
      "Ignores it, since Terraform only tracks resources it created in this run"
    ],
    a: 0,
    x: "That proposed revert is the tool reporting drift. It is a feature — the gap between declared and actual has become visible instead of silently accumulating.",
    note: "The durable fix is to make the declared configuration the only path to change, and to run drift detection on a schedule rather than discovering it six months later."
  }
]);

TD.addMCQ("cloud", "interview", [
  {
    tag: "The deployment answer",
    lvl: "hardcore",
    q: "In a system design round you are asked how you would deploy an AI service on AWS. Which element do most candidates omit and interviewers most remember?",
    o: [
      "A cost sentence saying where the money actually goes and what you would optimise first",
      "A named load balancer product",
      "The specific instance type",
      "A diagram of the VPC CIDR ranges"
    ],
    a: 0,
    x: "Almost every candidate lists services. Very few say \"compute is a few percent of this bill and model calls are the rest, so I would work on retrieval size and routing before touching infrastructure\".",
    note: "If you are short of time, cut a component from your architecture rather than the cost sentence."
  },
  {
    tag: "Certifications",
    lvl: "intermediate",
    q: "For an AI engineering role, what is the honest value of an AWS certification?",
    o: [
      "It can clear a recruiter keyword filter, but it never substitutes for a deployed system you can explain",
      "It is the primary hiring signal for cloud-adjacent AI roles",
      "It has no value in any context",
      "It replaces the need for a portfolio at services companies"
    ],
    a: 0,
    x: "No hiring manager offers an AI engineering role because of a badge. Recruiters at some companies do screen on them, which is a real but narrow benefit.",
    note: "The order that works: deploy something real, write it up, then certify if your target companies reward it. Not the reverse."
  },
  {
    tag: "The resume",
    lvl: "hardcore",
    q: "Which resume line is stronger for an AI engineering application?",
    o: [
      "\"Cut inference cost 68% (₹4.10 to ₹1.30 per request) by reranking to fewer chunks and routing simple queries to a smaller model, with quality flat on a 200-question evaluation set\"",
      "\"AWS: EC2, S3, Lambda, ECS, RDS, IAM, VPC, CloudWatch, SQS, SNS, DynamoDB, Bedrock, SageMaker\"",
      "\"Extensive experience with cloud technologies and AI/ML systems\"",
      "\"AWS Certified Solutions Architect – Associate\""
    ],
    a: 0,
    x: "It is checkable, it attaches a technology to a decision, and it invites exactly the follow-up you want — which you can answer.",
    fix: true,
    note: "The keyword list is the trap because it feels more comprehensive. It invites \"tell me about the SageMaker work\", and one unanswerable follow-up puts every other item on the list in doubt."
  }
]);

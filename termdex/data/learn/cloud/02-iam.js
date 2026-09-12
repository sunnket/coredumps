/* AWS for AI Engineers — IAM, the part that blocks everyone. */
TD.addLessons("cloud", [

{
 t: "Users, Roles and Policies",
 m: "iam",
 lvl: "core",
 s: "The four objects IAM is made of, why a role is not a user, and how a request is actually decided.",
 goal: [
  "Explain the difference between a user, a role, a policy and a trust policy",
  "Read a policy document and say exactly what it permits",
  "Give a service the permissions it needs without granting it everything"
 ],
 b: [
  { p: "IAM is where more beginners stall than anywhere else in AWS, and it is not because it is difficult. It is because tutorials skip it — they tell you to attach `AdministratorAccess` and move on, so you never learn the model, and then the first real job hands you an account where you cannot do that." },

  { ana: "A hotel again. A **user** is a guest with a permanent keycard. A **role** is a keycard kept at the front desk that anybody who meets the stated conditions may borrow for an hour. A **policy** is the list of doors a card opens. And a **trust policy** is the rule at the desk saying who is allowed to borrow that card at all.",
    at: "Four objects, one image" },

  { h: "The four objects" },
  { tbl: { t: "What each one is",
    h: ["Object", "What it is", "Credentials", "Use it for"],
    rows: [
     ["**User**", "A permanent identity for a human", "Password and/or long-lived access keys", "You, at your laptop. Ideally not even that — use Identity Center"],
     ["**Role**", "A set of permissions with no credentials of its own, that something *assumes*", "**Temporary**, expire in 1–12 hours", "**Everything else.** Services, applications, CI, cross-account access"],
     ["**Policy**", "A JSON document listing allowed or denied actions", "—", "Attached to users, roles or groups"],
     ["**Trust policy**", "A policy on a role saying *who may assume it*", "—", "The half of a role people forget exists"]
    ] } },

  { n: "The rule that resolves most confusion: **humans get users, everything else gets roles.** Your Lambda function does not have an access key; it assumes a role and AWS hands it credentials that expire in an hour. If you find yourself putting an access key into an environment variable of something running *inside* AWS, you have almost certainly reached for the wrong object.",
    nt: "The one-line summary" },

  { h: "Reading a policy" },
  { code: { lang: "json", file: "s3-read-policy.json", t: "A policy, statement by statement",
    lines: [
     { c: "{", w: "" },
     { c: "  \"Version\": \"2012-10-17\",", w: "**Always this exact string.** It is a policy-language version, not a date you choose. Omitting it silently changes how variables are parsed." },
     { c: "  \"Statement\": [", w: "**A list.** Each statement is evaluated independently." },
     { c: "    {", w: "" },
     { c: "      \"Sid\": \"ReadDocsBucket\",", w: "A human label. Optional, and worth writing — it appears in denial messages." },
     { c: "      \"Effect\": \"Allow\",", w: "**`Allow` or `Deny`.** Nothing else." },
     { c: "      \"Action\": [", w: "" },
     { c: "        \"s3:GetObject\",", w: "**Actions are `service:Operation`.** Read one object." },
     { c: "        \"s3:ListBucket\"", w: "**List the bucket — a different action on a different resource.** This is the pair people get wrong: `GetObject` acts on objects, `ListBucket` acts on the bucket itself.", hi: true },
     { c: "      ],", w: "" },
     { c: "      \"Resource\": [", w: "" },
     { c: "        \"arn:aws:s3:::my-docs\",", w: "**The bucket** — what `ListBucket` needs." },
     { c: "        \"arn:aws:s3:::my-docs/*\"", w: "**The objects inside it** — what `GetObject` needs. Two different ARNs for one bucket.", hi: true },
     { c: "      ],", w: "" },
     { c: "      \"Condition\": {", w: "**Optional, and where least privilege actually lives.**" },
     { c: "        \"StringLike\": { \"s3:prefix\": [\"tenant-42/*\"] }", w: "Only keys under that prefix. This one line is how a shared bucket becomes multi-tenant safe." },
     { c: "      }", w: "" },
     { c: "    }", w: "" },
     { c: "  ]", w: "" },
     { c: "}", w: "" }
    ] } },

  { syn: { t: "An ARN, taken apart",
    parts: [
     { p: "arn", w: "Always `arn`. Amazon Resource Name." },
     { p: ":aws" , w: "The partition. `aws` for commercial regions, `aws-cn` for China, `aws-us-gov` for GovCloud." },
     { p: ":s3", w: "The service." },
     { p: ":", w: "The region — **empty for S3 and IAM**, because bucket names and IAM entities are globally unique." },
     { p: ":", w: "The account id — also empty for S3, for the same reason." },
     { p: ":my-docs/reports/2026.pdf", w: "The resource path." }
    ],
    after: "Every AWS object has an ARN and every policy names objects by ARN. Being able to read one — and noticing when a region or account field is empty and why — removes a lot of guesswork." } },

  { h: "How a request is decided" },
  { code: { lang: "text", t: "The evaluation order, which is not negotiable",
    lines: [
     { c: "  request arrives" },
     { c: "        |" },
     { c: "  1. Is there an explicit DENY anywhere that matches?" },
     { c: "        yes -> DENIED. Nothing can override this.", hi: true },
     { c: "        |" },
     { c: "  2. Does an SCP (organisation policy) permit it?" },
     { c: "        no  -> denied" },
     { c: "        |" },
     { c: "  3. Does a permissions boundary permit it?" },
     { c: "        no  -> denied" },
     { c: "        |" },
     { c: "  4. Is there an explicit ALLOW in an identity or resource policy?" },
     { c: "        no  -> denied  (default deny)", hi: true },
     { c: "        |" },
     { c: "  ALLOWED" }
    ],
    after: "Two rules carry almost all the weight. **Default is deny** — an action nobody explicitly allowed is forbidden. And **an explicit Deny always wins** — no amount of Allow anywhere else overrides it. That is why a `Deny` statement is the right tool for a guardrail and the wrong tool for routine permission management." } },

  { h: "Roles, and the trust policy people forget" },
  { code: { lang: "json", file: "trust-policy.json", t: "The half of a role that says who may use it",
    lines: [
     { c: "{", w: "" },
     { c: "  \"Version\": \"2012-10-17\",", w: "" },
     { c: "  \"Statement\": [{", w: "" },
     { c: "    \"Effect\": \"Allow\",", w: "" },
     { c: "    \"Principal\": { \"Service\": \"lambda.amazonaws.com\" },", w: "**Who may assume this role.** Here: the Lambda service, on behalf of your function.", hi: true },
     { c: "    \"Action\": \"sts:AssumeRole\",", w: "**The only action a trust policy ever grants.**" },
     { c: "    \"Condition\": {", w: "" },
     { c: "      \"StringEquals\": { \"aws:SourceAccount\": \"123456789012\" }", w: "**Scope it to your own account.** Without this, a role trusted by a service can in some configurations be assumed on behalf of somebody else's resources — the confused deputy problem." },
     { c: "    }", w: "" },
     { c: "  }]", w: "" },
     { c: "}", w: "" }
    ],
    after: "A role has two policies and both must be right. The **permissions policy** says what the role can do; the **trust policy** says who can become it. \"I attached the policy but it still says AccessDenied\" is very often a trust policy that does not name the right principal." } },

  { vs: { t: "The permission a beginner writes, and the one a reviewer accepts",
    lang: "json",
    bad: { label: "What every tutorial does", c: "{\n  \"Effect\": \"Allow\",\n  \"Action\": \"*\",\n  \"Resource\": \"*\"\n}",
      w: "Works instantly, teaches nothing, and is the finding at the top of every security review. If this identity is ever compromised, so is the entire account." },
    good: { label: "What the job expects", c: "{\n  \"Effect\": \"Allow\",\n  \"Action\": [\n    \"s3:GetObject\",\n    \"s3:PutObject\"\n  ],\n  \"Resource\": \"arn:aws:s3:::rag-docs/ingested/*\",\n  \"Condition\": {\n    \"StringEquals\": {\n      \"s3:x-amz-server-side-encryption\": \"aws:kms\"\n    }\n  }\n}",
      w: "Two actions, one prefix, and a condition that refuses an unencrypted write. Takes five extra minutes and is the difference between a mistake and an incident." } } },

  { h: "Identity policies and resource policies" },
  { l: [
   "**Identity policy** — attached to a user or role. *This identity may do X.*",
   "**Resource policy** — attached to the resource itself: an S3 bucket policy, a KMS key policy, a Lambda resource policy. *This resource may be acted on by Y.*",
   "**Within one account, either is enough.** Across accounts, **both** are required — the target resource must allow the caller and the caller's account must allow the call. This is the single most common cause of a cross-account permission that will not work.",
   "**KMS is the exception that catches everyone.** A KMS key policy is not optional: even an account administrator cannot use a key that the key policy does not mention."
  ] },

  { tryit: { t: "Build a least-privilege role and prove it is tight",
    task: "Create an IAM role that a Lambda function can assume, which may read from exactly one S3 prefix and write to one CloudWatch log group, and nothing else. Then verify: confirm it can read the allowed prefix, confirm it cannot read a different prefix in the same bucket, and confirm it cannot list other buckets.",
    hint: "Remember that `ListBucket` needs the bucket ARN while `GetObject` needs the object ARN. Getting one and not the other produces a confusing half-working state.",
    sol: { lang: "bash", code: "# Create the role with its trust policy\naws iam create-role --role-name rag-ingest \\\n  --assume-role-policy-document file://trust-policy.json\n\n# Attach the narrow permissions policy\naws iam put-role-policy --role-name rag-ingest \\\n  --policy-name ReadDocsPrefix --policy-document file://s3-read-policy.json\n\n# --- Prove it, without deploying anything ---\n# The policy simulator answers 'would this call be allowed' offline.\n\nROLE=arn:aws:iam::123456789012:role/rag-ingest\n\naws iam simulate-principal-policy --policy-source-arn $ROLE \\\n  --action-names s3:GetObject \\\n  --resource-arns arn:aws:s3:::rag-docs/ingested/a.pdf \\\n  --query 'EvaluationResults[].EvalDecision' --output text\n# allowed\n\naws iam simulate-principal-policy --policy-source-arn $ROLE \\\n  --action-names s3:GetObject \\\n  --resource-arns arn:aws:s3:::rag-docs/private/salaries.csv \\\n  --query 'EvaluationResults[].EvalDecision' --output text\n# implicitDeny        <- correct: no statement allows it\n\naws iam simulate-principal-policy --policy-source-arn $ROLE \\\n  --action-names s3:ListAllMyBuckets --resource-arns '*' \\\n  --query 'EvaluationResults[].EvalDecision' --output text\n# implicitDeny        <- correct" },
    w: "`simulate-principal-policy` is the tool almost nobody knows about and it turns permission work from guesswork into something you can test. Being able to say in an interview that you test policies with the simulator rather than by deploying and seeing what breaks is a small, very specific credibility signal." } },

  { vocab: ["Least Privilege", "Authentication", "Authorisation", "Audit Log", "Zero Trust"] }
 ],
 k: [
  "Humans get users; everything else gets roles with temporary credentials.",
  "Default is deny, and an explicit Deny can never be overridden by any Allow.",
  "A role has two policies — permissions and trust — and both must be right.",
  "`ListBucket` acts on the bucket ARN, `GetObject` on the object ARN; you need both.",
  "Cross-account access needs an allow on both sides, and KMS always needs a key policy entry."
 ],
 r: ["Least Privilege", "Authentication", "Authorisation", "Zero Trust", "Audit Log"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws iam simulate-principal-policy --policy-source-arn $ROLE --action-names s3:GetObject --resource-arns $ARN", w: "test whether a call would be allowed, without deploying" },
   { c: "\"Principal\": { \"Service\": \"lambda.amazonaws.com\" }", w: "the trust-policy line that lets Lambda assume a role" },
   { c: "\"Resource\": [\"arn:aws:s3:::bucket\", \"arn:aws:s3:::bucket/*\"]", w: "both ARNs — the bucket for listing, the objects for reading" }
  ]
 }
},

{
 t: "Debugging AccessDenied",
 m: "iam",
 lvl: "core",
 s: "A repeatable procedure for the error you will see more than any other, without granting yourself administrator.",
 goal: [
  "Read an AccessDenied message and extract the three facts it contains",
  "Work through a fixed diagnostic sequence rather than guessing",
  "Know the five specific causes that account for most denials"
 ],
 b: [
  { p: "You will meet `AccessDenied` more often than any other AWS error, and the instinct is to widen the policy until it works. That instinct is how accounts end up with `Action: \"*\"` everywhere. There is a procedure instead, and it takes about four minutes." },

  { h: "Read the message properly" },
  { out: "User: arn:aws:sts::123456789012:assumed-role/rag-api-task/abc123\nis not authorized to perform: bedrock:InvokeModel\non resource: arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0\nbecause no identity-based policy allows the bedrock:InvokeModel action",
    ot: "Everything you need is in here" },

  { l: [
   "**The identity** — `assumed-role/rag-api-task`. Note it is an *assumed role*, not the user you are logged in as. The thing failing is your task, not you.",
   "**The action** — `bedrock:InvokeModel`. The exact string your policy must contain.",
   "**The resource** — the full model ARN, including the region. Your policy's `Resource` must match this, wildcards included.",
   "**The reason** — `no identity-based policy allows` means an *implicit* deny: nothing granted it. Compare with `with an explicit deny in a service control policy`, which is a completely different problem with a completely different fix."
  ] },

  { n: "Implicit deny means *add a permission*. Explicit deny means *find and remove the Deny*, which is usually an organisation-level policy you cannot change yourself and must escalate. Telling the two apart from the message saves an afternoon.",
    nt: "The distinction that decides your next move" },

  { h: "The procedure" },
  { ol: [
   "**Who am I really?** `aws sts get-caller-identity`. Very often the answer is *a different profile from the one you thought*, or a role you assumed twenty minutes ago whose credentials have expired.",
   "**Am I in the right region and account?** A resource ARN in `us-east-1` will not match a policy scoped to `ap-south-1`, and the error looks identical to a missing permission.",
   "**Simulate it.** `aws iam simulate-principal-policy` tells you allowed or denied without deploying anything, and names the statement responsible.",
   "**Check the trust policy** if the identity is a role. The permissions may be perfect and the role unassumable.",
   "**Check for a resource policy.** S3 buckets, KMS keys and Lambda functions have their own; the identity policy is only half the decision.",
   "**Look in CloudTrail.** Every denied call is logged with the full request context, including the condition keys that were evaluated — which is how you find out that your condition did not match for a reason you could not have guessed."
  ] },

  { code: { lang: "bash", t: "The commands, in order",
    lines: [
     { c: "aws sts get-caller-identity", w: "**Step one, always.** Wrong profile is the single most common cause.", hi: true },
     { c: "", w: "" },
     { c: "aws iam simulate-principal-policy \\", w: "" },
     { c: "  --policy-source-arn arn:aws:iam::123456789012:role/rag-api-task \\", w: "**Use the role ARN, not the assumed-role ARN** from the error message. `sts::.../assumed-role/...` is a session; `iam::.../role/...` is the role." },
     { c: "  --action-names bedrock:InvokeModel \\", w: "" },
     { c: "  --resource-arns 'arn:aws:bedrock:ap-south-1::foundation-model/*'", w: "" },
     { c: "", w: "" },
     { c: "aws iam get-role --role-name rag-api-task \\", w: "" },
     { c: "  --query 'Role.AssumeRolePolicyDocument'", w: "**The trust policy.** Does it name the right principal?" },
     { c: "", w: "" },
     { c: "aws iam list-attached-role-policies --role-name rag-api-task", w: "**Managed policies attached.**" },
     { c: "aws iam list-role-policies --role-name rag-api-task", w: "**Inline policies.** People forget these exist and then cannot find where a permission came from." },
     { c: "", w: "" },
     { c: "aws s3api get-bucket-policy --bucket rag-docs", w: "**The resource side of the decision.**" },
     { c: "", w: "" },
     { c: "aws cloudtrail lookup-events \\", w: "" },
     { c: "  --lookup-attributes AttributeKey=EventName,AttributeValue=InvokeModel \\", w: "" },
     { c: "  --max-results 5", w: "**The full request as AWS saw it**, including every condition key. The last resort and the one that always answers it.", hi: true }
    ] } },

  { h: "The five causes that account for most of it" },
  { tbl: { t: "In rough order of frequency",
    h: ["Cause", "How it looks", "Fix"],
    rows: [
     ["**Wrong profile or expired session**", "Worked yesterday, fails today", "`aws sts get-caller-identity`; re-login"],
     ["**Missing the second ARN**", "Can read a file, cannot list the bucket", "Add both `arn:...:bucket` and `arn:...:bucket/*`"],
     ["**Trust policy does not name the principal**", "\"is not authorized to perform sts:AssumeRole\"", "Add the service or account to the trust policy"],
     ["**KMS key policy**", "S3 permissions look right, `GetObject` still fails on an encrypted bucket", "Add the role to the **key policy**, not just the IAM policy"],
     ["**Region or account mismatch in the ARN**", "Identical-looking policy, still denied", "Compare the ARN in the error against the ARN in the policy, character by character"]
    ] } },

  { trap: "Granting `AdministratorAccess` to make an error go away teaches you nothing and creates a permission nobody will ever remove, because removing it risks breaking something. If you must unblock yourself quickly, grant the **service-level** managed policy (`AmazonS3ReadOnlyAccess`), confirm that fixes it, and then narrow it the same day while you still remember what you needed." },

  { h: "Getting it right the first time" },
  { l: [
   "**Start from the AWS-managed policy** for the service, confirm it works, then replace it with an inline policy containing only the actions you saw in CloudTrail. This is the fastest honest path to least privilege.",
   "**Use IAM Access Analyzer** — it reads CloudTrail history and generates a policy containing exactly the actions an identity actually used over the last 90 days. It does most of the narrowing for you and almost nobody knows it exists.",
   "**Attach permissions boundaries** if you let others create roles, so a colleague cannot create a role more powerful than they are.",
   "**Never reuse one role for several services.** A role per task keeps every blast radius small and makes the CloudTrail story readable."
  ] },

  { tryit: { t: "Break it deliberately, then fix it by procedure",
    task: "Create a role with permission to read one S3 prefix. Then deliberately introduce each of three faults in turn — remove the bucket ARN leaving only the object ARN, point the resource at the wrong region, and remove the service from the trust policy — and each time, work through the procedure until the diagnostic step identifies the fault. Write down which command found each one.",
    hint: "Do not fix by inspection. Run the procedure even when you know the answer; the point is to make the sequence automatic before you need it under pressure.",
    sol: { lang: "bash", code: "# Fault 1: only the object ARN\naws s3 ls s3://rag-docs/ingested/\n# An error occurred (AccessDenied) ... ListObjectsV2\n# Found by: reading the ACTION in the message -- ListObjectsV2,\n#           not GetObject. Different action, different ARN.\n\n# Fault 2: wrong region in the resource ARN\naws bedrock-runtime invoke-model --model-id ... --region ap-south-1 out.json\n# AccessDeniedException ...\naws iam simulate-principal-policy ... \\\n  --resource-arns 'arn:aws:bedrock:ap-south-1::foundation-model/...'\n# implicitDeny\n#   ...same call with us-east-1 in the ARN: allowed\n# Found by: the simulator, comparing two ARNs.\n\n# Fault 3: trust policy missing the service\naws lambda invoke --function-name ingest out.json\n# The role defined for the function cannot be assumed by Lambda\n# Found by: the message names sts:AssumeRole, so it is the trust\n#           policy, not the permissions policy.\naws iam get-role --role-name rag-ingest \\\n  --query 'Role.AssumeRolePolicyDocument.Statement[].Principal'\n\n# The lesson: the ACTION named in the error tells you which of the\n# two policies to look at. sts:AssumeRole -> trust. Anything else\n# -> permissions or resource policy." },
    w: "Deliberately breaking things and following the procedure is how the procedure becomes reflex. In a job you will hit these under time pressure with somebody waiting, and the difference between four minutes and an afternoon is entirely whether you have a sequence or a habit of guessing." } },

  { vocab: ["Least Privilege", "Audit Log", "Authorisation", "Incident Response"] }
 ],
 k: [
  "The error message names the identity, the action, the resource and whether the deny was implicit or explicit — read all four.",
  "Implicit deny means add a permission; explicit deny means find the Deny, usually an org policy you must escalate.",
  "`aws sts get-caller-identity` first, every time — wrong profile is the most common cause.",
  "sts:AssumeRole in the error means the trust policy; anything else means permissions or a resource policy.",
  "Use Access Analyzer to generate a least-privilege policy from what the identity actually used."
 ],
 r: ["Least Privilege", "Authorisation", "Audit Log", "Incident Response", "Zero Trust"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws iam get-role --role-name X --query 'Role.AssumeRolePolicyDocument'", w: "read the trust policy when the error mentions AssumeRole" },
   { c: "aws iam list-role-policies --role-name X", w: "list inline policies, which people forget exist" },
   { c: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=InvokeModel", w: "find the denied call with its full request context" }
  ]
 }
}

]);

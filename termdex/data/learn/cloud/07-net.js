/* AWS for AI Engineers — VPC and networking, without the fear. */
TD.addLessons("cloud", [

{
 t: "VPC Without the Fear",
 m: "net",
 lvl: "core",
 s: "Subnets, route tables, security groups, NAT and endpoints — and why your Lambda cannot reach the internet.",
 goal: [
  "Draw the standard two-tier VPC from memory and say what each piece is for",
  "Diagnose a connectivity failure with a fixed sequence rather than by guessing",
  "Avoid the two networking decisions that quietly cost the most money"
 ],
 b: [
  { p: "Networking is the second thing that blocks people on AWS, after IAM, and for the same reason: tutorials skip it. But there is only one diagram, it has six parts, and once you can draw it the errors stop being mysterious." },

  { h: "The diagram" },
  { code: { lang: "text", t: "The standard two-tier VPC. Learn this shape.",
    lines: [
     { c: "  VPC  10.0.0.0/16          <- your private address space" },
     { c: "  |" },
     { c: "  |-- Internet Gateway (IGW)  <- the only door to the internet", hi: true },
     { c: "  |" },
     { c: "  |-- PUBLIC subnet   10.0.1.0/24   (az: ap-south-1a)" },
     { c: "  |     route: 0.0.0.0/0 -> IGW          <- THIS is what makes", hi: true },
     { c: "  |     contains: load balancer, NAT gateway    it 'public'" },
     { c: "  |" },
     { c: "  |-- PUBLIC subnet   10.0.2.0/24   (az: ap-south-1b)" },
     { c: "  |" },
     { c: "  |-- PRIVATE subnet  10.0.11.0/24  (az: ap-south-1a)" },
     { c: "  |     route: 0.0.0.0/0 -> NAT Gateway  <- outbound only", hi: true },
     { c: "  |     contains: your Fargate tasks, Lambdas" },
     { c: "  |" },
     { c: "  |-- PRIVATE subnet  10.0.12.0/24  (az: ap-south-1b)" },
     { c: "  |" },
     { c: "  |-- ISOLATED subnet 10.0.21.0/24  (az: ap-south-1a)" },
     { c: "        route: no default route at all         <- no internet, in", hi: true },
     { c: "        contains: RDS                             either direction" }
    ],
    after: "Every AWS network you will meet is a variation on this. Two availability zones because one can fail; three tiers because the load balancer must be reachable, your code must not be, and your database must be neither." } },

  { n: "**A subnet is public if and only if its route table sends `0.0.0.0/0` to an Internet Gateway.** There is no checkbox called public. If you remember one sentence from this lesson, that is the one — it explains most confusion about why something can or cannot be reached.",
    nt: "The definition people never get told" },

  { h: "The six parts" },
  { tbl: { t: "What each piece does",
    h: ["Part", "What it does", "The thing people get wrong"],
    rows: [
     ["**VPC**", "A private address range, isolated from everything else", "Pick a /16 that does not clash with your office or another VPC you may peer with"],
     ["**Subnet**", "A slice of that range, pinned to **one** availability zone", "A subnet cannot span zones. That is why you always need at least two"],
     ["**Route table**", "Where traffic leaving a subnet goes", "**This is what makes a subnet public or private**"],
     ["**Internet Gateway**", "The door in and out", "One per VPC, free"],
     ["**NAT Gateway**", "Lets private subnets reach out, without being reachable", "**~₹3,000/month each, plus per-GB.** The most common surprise on a small bill"],
     ["**Security group**", "A stateful firewall on a resource", "Return traffic is allowed automatically — do not add outbound rules for replies"]
    ] } },

  { h: "Security groups, and the pattern worth learning" },
  { code: { lang: "text", t: "Reference groups, not IP ranges",
    lines: [
     { c: "  sg-alb        inbound  443 from 0.0.0.0/0" },
     { c: "                         (the internet may reach the load balancer)" },
     { c: "" },
     { c: "  sg-api        inbound  8000 from sg-alb          <- a GROUP, not a CIDR", hi: true },
     { c: "                         (only the load balancer may reach the API)" },
     { c: "" },
     { c: "  sg-db         inbound  5432 from sg-api          <- again, a group", hi: true },
     { c: "                         (only the API may reach the database)" },
     { c: "" },
     { c: "  Why this beats IP ranges:" },
     { c: "   - tasks get new IPs constantly; groups do not change", hi: true },
     { c: "   - the rule reads like the architecture diagram" },
     { c: "   - scaling from 2 tasks to 200 needs no rule changes" }
    ],
    after: "Security groups are **stateful**: if an inbound rule allows a connection, the reply is allowed automatically. Network ACLs are stateless and operate at the subnet level, and you will almost never need to touch one. If a tutorial has you editing NACLs to fix connectivity, it is probably solving the wrong problem." } },

  { h: "The two questions that cause most failures" },
  { ol: [
   "**\"Why can my Lambda not reach the internet?\"** Because you attached it to a VPC. A Lambda outside a VPC has internet access by default. The moment you put it in one — usually to reach RDS — it obeys that subnet's route table, and a private subnet without a NAT gateway has no route out. Symptom: every outbound call hangs and then times out, with no error that mentions networking.",
   "**\"Why can my Fargate task not pull its image?\"** Same cause. Pulling from ECR is an internet call unless you have VPC endpoints. In a private subnet with no NAT, the task fails to start with a message about being unable to pull, which reads like a permissions problem."
  ] },

  { code: { lang: "text", t: "Three fixes, and what each costs",
    lines: [
     { c: "  1. NAT Gateway" },
     { c: "     works for everything, no per-service setup" },
     { c: "     ~$32/month each  +  $0.045/GB processed", hi: true },
     { c: "     x2 for high availability = ~$64/month before any traffic" },
     { c: "" },
     { c: "  2. VPC Endpoints  (PrivateLink)" },
     { c: "     traffic to AWS services never leaves the AWS network" },
     { c: "     ~$7/month per endpoint per AZ  +  $0.01/GB" },
     { c: "     needed: ecr.api, ecr.dkr, logs, secretsmanager, bedrock..." },
     { c: "     -- and S3/DynamoDB GATEWAY endpoints are FREE. Always add", hi: true },
     { c: "        those two, on every VPC, without thinking about it." },
     { c: "" },
     { c: "  3. Put it in a public subnet with a public IP" },
     { c: "     free, and now your task is directly addressable" },
     { c: "     fine for a demo, wrong for anything real" }
    ],
    after: "The economics are not obvious. Four interface endpoints across two zones is about $56/month — comparable to one NAT gateway, cheaper than two. But the S3 and DynamoDB gateway endpoints are genuinely free and reduce NAT data-processing charges, which for a document pipeline moving gigabytes is often the largest saving of all. Add them always." } },

  { trap: "A NAT gateway charges **$0.045 per gigabyte processed** on top of its hourly rate. An ingestion pipeline pulling 500 GB of documents from S3 through a NAT costs about $22 in data processing — for traffic that never needed to leave AWS at all. A free S3 gateway endpoint eliminates it entirely. This is the single most common avoidable line on a small AWS bill." },

  { h: "Where each thing belongs" },
  { tbl: { t: "The default placement",
    h: ["Resource", "Subnet", "Why"],
    rows: [
     ["Application Load Balancer", "**Public**", "The internet must reach it"],
     ["NAT Gateway", "**Public**", "It is the thing with the route out"],
     ["ECS/Fargate tasks", "**Private**", "Reachable only through the load balancer"],
     ["Lambda (needing RDS)", "**Private**", "And add endpoints or a NAT for outbound calls"],
     ["Lambda (not needing a VPC)", "**No VPC at all**", "Simpler, faster to start, has internet by default"],
     ["RDS", "**Isolated**", "No route to or from the internet, ever"],
     ["ElastiCache / Redis", "**Isolated**", "Same reasoning"],
     ["Bastion host", "**Public**", "Better: do not have one. Use SSM Session Manager"]
    ] } },

  { h: "Diagnosing a connectivity failure" },
  { code: { lang: "bash", t: "The sequence — outside-in",
    lines: [
     { c: "# 1. Is DNS resolving?", w: "" },
     { c: "nslookup mydb.abc123.ap-south-1.rds.amazonaws.com", w: "**A private RDS endpoint resolves to a private IP.** If it returns nothing, the VPC lacks DNS hostnames or resolution enabled — two separate settings, both needed." },
     { c: "", w: "" },
     { c: "# 2. Is the security group letting me in?", w: "" },
     { c: "aws ec2 describe-security-groups --group-ids sg-db \\", w: "" },
     { c: "  --query 'SecurityGroups[].IpPermissions'", w: "**Check the source.** Is it the API's security group, or a CIDR that no longer matches?" },
     { c: "", w: "" },
     { c: "# 3. Is there a route at all?", w: "" },
     { c: "aws ec2 describe-route-tables \\", w: "" },
     { c: "  --filters Name=association.subnet-id,Values=subnet-abc123 \\", w: "" },
     { c: "  --query 'RouteTables[].Routes'", w: "**Look for `0.0.0.0/0`.** Its absence is the whole answer for outbound failures.", hi: true },
     { c: "", w: "" },
     { c: "# 4. Let AWS answer it for you", w: "" },
     { c: "aws ec2 create-network-insights-path \\", w: "" },
     { c: "  --source $ENI_A --destination $ENI_B --protocol tcp --destination-port 5432", w: "**Reachability Analyzer.** It traces the path and names the exact component that blocks it. Almost nobody uses it and it answers the question directly.", hi: true },
     { c: "", w: "" },
     { c: "# 5. Get a shell inside the network without a bastion", w: "" },
     { c: "aws ecs execute-command --cluster prod --task $TASK \\", w: "" },
     { c: "  --container api --interactive --command '/bin/sh'", w: "**ECS Exec.** Then `curl` and `nc` from exactly where your code runs, which is the only place the answer is true." }
    ] } },

  { n: "**Reachability Analyzer** deserves a sentence of its own. Give it a source and a destination and it tells you, in plain language, which security group rule or missing route blocks the path — before you have deployed anything. Mentioning it in an interview is a small, unusual signal that you have actually operated a VPC rather than copied one.",
    nt: "The tool worth remembering" },

  { tryit: { t: "Build the VPC, then break it on purpose",
    task: "Create a VPC with two public and two private subnets across two availability zones, a NAT gateway, and free S3 and DynamoDB gateway endpoints. Put a Fargate task in a private subnet and confirm it can reach S3 and the internet. Then remove the NAT route and observe exactly how the failure presents. Finally, add ECR and CloudWatch Logs interface endpoints, remove the NAT gateway entirely, and confirm the task still starts.",
    hint: "That last step is the real exercise. Running Fargate with no NAT gateway at all is both cheaper and more secure, and doing it once teaches you which endpoints a container genuinely needs.",
    sol: { lang: "bash", code: "# The endpoints a private Fargate task needs to start with no NAT:\n#\n#   com.amazonaws.<region>.ecr.api          pull auth\n#   com.amazonaws.<region>.ecr.dkr          pull layers\n#   com.amazonaws.<region>.s3   (GATEWAY)   layers live in S3 -- FREE\n#   com.amazonaws.<region>.logs             write logs\n#   com.amazonaws.<region>.secretsmanager   inject secrets\n#   com.amazonaws.<region>.bedrock-runtime  if you call models\n\naws ec2 create-vpc-endpoint --vpc-id $VPC \\\n  --service-name com.amazonaws.ap-south-1.s3 \\\n  --route-table-ids $PRIVATE_RT \\\n  --vpc-endpoint-type Gateway        # free, do this always\n\naws ec2 create-vpc-endpoint --vpc-id $VPC \\\n  --service-name com.amazonaws.ap-south-1.ecr.dkr \\\n  --vpc-endpoint-type Interface \\\n  --subnet-ids $PRIV_A $PRIV_B \\\n  --security-group-ids $SG_ENDPOINTS \\\n  --private-dns-enabled              # essential, or the normal\n                                     # hostname will not resolve to it\n\n# --- What breaking it looks like ---\n#\n# Remove the 0.0.0.0/0 -> NAT route, redeploy:\n#\n#   CannotPullContainerError: ... i/o timeout\n#\n# Note it does NOT say 'no route to host'. It looks exactly like\n# a permissions or registry problem, which is why people spend an\n# hour on IAM before checking the route table.\n#\n# --- The cost difference ---\n#   NAT gateway x2:        ~$64/month + $0.045/GB\n#   5 interface endpoints: ~$50/month + $0.01/GB\n#   ...plus S3 gateway free, removing most of the GB entirely\n#\n# For an ingestion workload moving hundreds of GB from S3,\n# endpoints are dramatically cheaper AND the traffic never\n# touches the public internet." },
    w: "Two things come out of this. You now recognise `i/o timeout` on a container pull as a routing problem rather than a permissions one, which will save you an hour at some point. And you have a genuine cost-and-security argument for VPC endpoints that you can make in a design round — which is exactly the kind of specific, unglamorous knowledge that distinguishes someone who has run infrastructure." } },

  { vocab: ["Virtual Private Cloud", "Network Address Translation", "Firewall", "Subnet", "DNS", "Load Balancer"] }
 ],
 k: [
  "A subnet is public only because its route table sends 0.0.0.0/0 to an Internet Gateway — there is no checkbox.",
  "Attaching a Lambda to a VPC removes its default internet access; that is the cause of most mysterious timeouts.",
  "Security groups are stateful and should reference other security groups, not IP ranges.",
  "S3 and DynamoDB gateway endpoints are free — add them to every VPC and cut NAT data charges.",
  "Reachability Analyzer names the exact component blocking a path, before you deploy anything."
 ],
 r: ["Virtual Private Cloud", "Network Address Translation", "Firewall", "DNS", "Load Balancer", "Zero Trust"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=$SUBNET", w: "find whether a subnet has a route out at all" },
   { c: "--service-name com.amazonaws.ap-south-1.s3 --vpc-endpoint-type Gateway", w: "add the free S3 endpoint that removes NAT data charges" },
   { c: "aws ecs execute-command --cluster C --task T --container api --interactive --command '/bin/sh'", w: "get a shell where your code actually runs" }
  ]
 }
}

]);

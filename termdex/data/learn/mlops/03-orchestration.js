/* MLOps & Pipelines — Workflow Orchestration & Automation. */
TD.addLessons("mlops", [

    {
        t: "Workflow Orchestration with Apache Airflow & Prefect",
        m: "orchestration",
        lvl: "intermediate",
        s: "How to design robust DAGs (Directed Acyclic Graphs) for automated ML pipelines.",
        goal: [
            "Understand DAG architecture (Nodes = tasks, Edges = dependencies)",
            "Implement task retries, SLAs, and dynamic parameters in Airflow / Prefect",
            "Isolate data extraction, preprocessing, training, and evaluation into modular tasks"
        ],
        b: [
            { p: "Running cron jobs that execute Python scripts blindly leads to silent failures. Workflow orchestrators like Apache Airflow and Prefect manage complex dependencies, retries, alerts, and execution state across distributed clusters." },

            { h: "What is a DAG?" },
            { p: "A **DAG** (Directed Acyclic Graph) is a collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies. Tasks run in strict topological order; if `preprocess` fails, `train` never starts." },

            {
                code: {
                    lang: "python", t: "Defining a simple ML pipeline DAG in Airflow",
                    lines: [
                        { c: "from airflow import DAG", w: "" },
                        { c: "from airflow.operators.python import PythonOperator", w: "" },
                        { c: "from datetime import datetime, timedelta", w: "" },
                        { c: "", w: "" },
                        { c: "default_args = {", w: "" },
                        { c: "    'owner': 'mlops_team',", w: "" },
                        { c: "    'retries': 2,", w: "**Retry failed tasks twice before alerting.**", hi: true },
                        { c: "    'retry_delay': timedelta(minutes=5)", w: "" },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: "with DAG(", w: "" },
                        { c: "    'ml_retraining_pipeline',", w: "" },
                        { c: "    default_args=default_args,", w: "" },
                        { c: "    schedule_interval='@weekly',", w: "**Runs automatically every Sunday midnight.**", hi: true },
                        { c: "    start_date=datetime(2026, 1, 1),", w: "" },
                        { c: "    catchup=False", w: "" },
                        { c: ") as dag:", w: "" },
                        { c: "    t1 = PythonOperator(task_id='extract_data', python_callable=extract_fn)", w: "" },
                        { c: "    t2 = PythonOperator(task_id='preprocess', python_callable=preprocess_fn)", w: "" },
                        { c: "    t3 = PythonOperator(task_id='train_model', python_callable=train_fn)", w: "" },
                        { c: "    t4 = PythonOperator(task_id='evaluate_and_gate', python_callable=eval_fn)", w: "" },
                        { c: "", w: "" },
                        { c: "    # Set DAG task dependency order", w: "" },
                        { c: "    t1 >> t2 >> t3 >> t4", w: "**Bitshift operator sets execution sequence.**", hi: true }
                    ]
                }
            },

            { trap: "Monolithic pipeline scripts inside a single Airflow task defeat the purpose of orchestration. If training crashes after 3 hours of data extraction, the whole task restarts. Break pipelines into separate atomic tasks so Airflow can resume from the failed step." },

            { vocab: ["DAG", "Apache Airflow", "Retry"] }
        ],
        k: [
            "Orchestrators construct DAGs that enforce execution order and handle failures with automatic retries.",
            "Keep tasks atomic and idempotent so broken runs resume from the point of failure rather than restarting completely.",
            "Schedule retraining runs periodically (`@weekly`, `@daily`) or trigger them via API webhooks."
        ],
        r: ["MLOps", "Model Registry", "Python"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "t1 >> t2 >> t3", w: "Airflow bitshift operator defining task order" },
                { c: "PythonOperator(task_id='train', python_callable=train_fn)", w: "create airflow task operator" },
                { c: "default_args = {'retries': 2, 'retry_delay': timedelta(minutes=5)}", w: "configure task retry policy" }
            ]
        }
    },

    {
        t: "Automated Retraining Pipelines & Event-Driven Triggers",
        m: "orchestration",
        lvl: "intermediate",
        s: "Building event-driven triggers that initiate model retraining when data updates or drift is detected.",
        goal: [
            "Distinguish scheduled vs event-driven retraining pipelines",
            "Trigger DAG execution via Webhook API / S3 Event notifications",
            "Implement shadow deployments & blue-green deployment strategies"
        ],
        b: [
            { p: "Static weekly schedules are fine for slow-moving data, but sudden shifts (like market volatility or viral events) require event-driven retraining triggered directly by data stream thresholds or drift alerts." },

            {
                tbl: {
                    t: "Deployment release strategies",
                    h: ["Strategy", "Mechanism", "Pros", "Cons"],
                    rows: [
                        ["**Blue/Green Deployment**", "Switch 100% live traffic instantly from old (Blue) to new (Green) container", "Zero downtime, fast rollback", "Requires 2x production capacity during deployment"],
                        ["**Canary Deployment**", "Route 5% traffic to candidate model, gradually scale to 100%", "Limits blast radius of faulty model", "Requires smart load balancing router"],
                        ["**Shadow Deployment**", "Send 100% traffic to champion, duplicate copy to candidate (ignore candidate response)", "Zero risk to real users, real production load test", "Doubles compute cost per request"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Triggering Airflow DAG via REST API from drift detector",
                    lines: [
                        { c: "import requests", w: "" },
                        { c: "", w: "" },
                        { c: "AIRFLOW_URL = 'http://airflow.company.com/api/v1/dags/ml_retraining_pipeline/dagRuns'", w: "" },
                        { c: "headers = {'Content-Type': 'application/json'}", w: "" },
                        { c: "payload = {", w: "" },
                        { c: "    'conf': {'trigger_reason': 'Data Drift Alert - PSI > 0.25'},", w: "" },
                        { c: "    'note': 'Automated trigger by Evidently AI monitoring service'", w: "" },
                        { c: "}", w: "" },
                        { c: "# Send POST request to trigger DAG execution", w: "" },
                        { c: "response = requests.post(AIRFLOW_URL, json=payload, auth=('admin', 'secret'), headers=headers)", w: "**Triggers DAG remotely.**", hi: true },
                        { c: "print('DAG Trigger Status:', response.status_code)", w: "" }
                    ]
                }
            },

            {
                tryit: {
                    t: "Identify deployment strategy",
                    task: "If you want to test candidate model latency under full production load without risking customer experience, which deployment strategy should you use?",
                    hint: "Think about shadow deployments.",
                    sol: { lang: "text", code: "Shadow Deployment. Candidate processes production requests in parallel, but its predictions are discarded while champion predictions are returned to users." },
                    w: "Shadow deployment is the safest way to load-test candidate models in production."
                }
            },

            { vocab: ["Canary Deployment", "Shadow Deployment"] }
        ],
        k: [
            "Event-driven retraining triggers DAG runs when data drift metrics cross defined thresholds.",
            "Canary deployments limit blast radius by routing a tiny percentage of production traffic to candidate models.",
            "Shadow deployments run candidate models in parallel with zero impact on actual user experience."
        ],
        r: ["MLOps", "Model Serving", "Monitoring"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "requests.post(AIRFLOW_API_URL, json={'conf': {'reason': 'drift'}})", w: "trigger airflow DAG via REST API" },
                { c: "canary_traffic_split = {'champion': 0.95, 'candidate': 0.05}", w: "route 5 percent traffic to canary model" },
                { c: "shadow_predict(X_live)", w: "execute shadow prediction without returning output to user" }
            ]
        }
    }

]);

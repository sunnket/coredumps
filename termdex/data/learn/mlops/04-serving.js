/* MLOps & Pipelines — Model Serving & Inference. */
TD.addLessons("mlops", [

    {
        t: "High-Throughput Model Serving with FastAPI & Docker",
        m: "serving",
        lvl: "core",
        s: "How to wrap ML models in lightweight, asynchronous REST microservices.",
        goal: [
            "Build high-performance async prediction endpoints with FastAPI and Pydantic",
            "Implement request validation and batch prediction handlers",
            "Containerize ML model serving applications using Docker"
        ],
        b: [
            { p: "Inference is where models encounter actual traffic. Wrapping a model inside a production-grade FastAPI microservice ensures low latency, strict input schema validation, and horizontal scalability across Kubernetes pods." },

            { h: "Designing a FastAPI Inference Service" },
            {
                code: {
                    lang: "python", t: "FastAPI inference microservice implementation",
                    lines: [
                        { c: "from fastapi import FastAPI, HTTPException", w: "" },
                        { c: "from pydantic import BaseModel, Field", w: "" },
                        { c: "import mlflow.pyfunc", w: "" },
                        { c: "import numpy as np", w: "" },
                        { c: "", w: "" },
                        { c: "# 1. Define strict Pydantic input schema", w: "" },
                        { c: "class InferenceRequest(BaseModel):", w: "" },
                        { c: "    age: int = Field(..., ge=18, le=120)", w: "Validates bounds automatically." },
                        { c: "    income: float = Field(..., gt=0)", w: "" },
                        { c: "    credit_score: int = Field(..., ge=300, le=850)", w: "" },
                        { c: "", w: "" },
                        { c: "# 2. Initialize FastAPI app and load champion model at startup", w: "" },
                        { c: "app = FastAPI(title='Credit Risk Inference Service')", w: "" },
                        { c: "model = None", w: "" },
                        { c: "", w: "" },
                        { c: "@app.on_event('startup')", w: "" },
                        { c: "def load_model():", w: "" },
                        { c: "    global model", w: "" },
                        { c: "    model = mlflow.pyfunc.load_model('models:/Credit_Risk@champion')", w: "**Load model ONCE at container boot.**", hi: true },
                        { c: "", w: "" },
                        { c: "@app.post('/predict')", w: "" },
                        { c: "async def predict(req: InferenceRequest):", w: "" },
                        { c: "    features = np.array([[req.age, req.income, req.credit_score]])", w: "" },
                        { c: "    prob = float(model.predict(features)[0])", w: "" },
                        { c: "    return {'risk_probability': prob, 'approved': prob < 0.35}", w: "**Returns clean JSON response.**", hi: true }
                    ]
                }
            },

            { trap: "Loading the model binary from disk *inside* the `/predict` route handler causes every HTTP request to spend 500ms reloading the pickle file from disk. Always load the model into memory *once* during startup!" },

            { h: "Dockerfile for ML Serving" },
            {
                code: {
                    lang: "dockerfile", t: "Production Dockerfile for FastAPI model service",
                    lines: [
                        { c: "FROM python:3.11-slim", w: "Lightweight base image." },
                        { c: "WORKDIR /app", w: "" },
                        { c: "COPY requirements.txt .", w: "" },
                        { c: "RUN pip install --no-cache-dir -r requirements.txt", w: "" },
                        { c: "COPY main.py .", w: "" },
                        { c: "EXPOSE 8000", w: "" },
                        { c: "CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\", \"--workers\", \"4\"]", w: "**Run 4 worker processes concurrently.**", hi: true }
                    ]
                }
            },

            { vocab: ["Docker"] }
        ],
        k: [
            "Load model binaries into RAM once at container startup, never inside the per-request route handler.",
            "Use Pydantic models for strict runtime type enforcement and automatic input validation.",
            "Containerize services with Docker and run Uvicorn with multiple workers for multi-core concurrency."
        ],
        r: ["Docker", "Model Serving", "FastAPI", "Kubernetes"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "@app.on_event('startup')", w: "FastAPI startup event hook for loading model into memory" },
                { c: "class Request(BaseModel): age: int", w: "pydantic data validation schema" },
                { c: "uvicorn main:app --workers 4", w: "run uvicorn ASGI server with 4 worker processes" }
            ]
        }
    },

    {
        t: "Model Optimization with ONNX Runtime & Triton",
        m: "serving",
        lvl: "advanced",
        s: "How to export Python models to ONNX formats for sub-millisecond execution.",
        goal: [
            "Export PyTorch / scikit-learn models to open ONNX (Open Neural Network Exchange) format",
            "Run inference using ONNX Runtime C++ backend bindings",
            "Understand Triton Inference Server dynamic batching and GPU acceleration"
        ],
        b: [
            { p: "Python GIL (Global Interpreter Lock) constraints and overhead limit pure Python inference throughput. Converting models to ONNX decouples execution from Python, running models via highly optimized C++ / CUDA runtimes." },

            {
                code: {
                    lang: "python", t: "Exporting PyTorch model to ONNX runtime format",
                    lines: [
                        { c: "import torch", w: "" },
                        { c: "import torch.onnx", w: "" },
                        { c: "", w: "" },
                        { c: "# Dummy input matching expected tensor shape (batch_size=1, channels=3, h=224, w=224)", w: "" },
                        { c: "dummy_input = torch.randn(1, 3, 224, 224)", w: "" },
                        { c: "", w: "" },
                        { c: "# Export PyTorch model graph to ONNX binary", w: "" },
                        { c: "torch.onnx.export(", w: "" },
                        { c: "    pytorch_model,", w: "" },
                        { c: "    dummy_input,", w: "" },
                        { c: "    'model.onnx',", w: "**Output optimized .onnx graph binary file.**", hi: true },
                        { c: "    input_names=['input'],", w: "" },
                        { c: "    output_names=['output'],", w: "" },
                        { c: "    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}", w: "**Enables dynamic batch sizes.**", hi: true },
                        { c: ")" },
                        { c: "print('Model successfully exported to ONNX format!')", w: "" }
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Running inference with ONNX Runtime in Python/C++",
                    lines: [
                        { c: "import onnxruntime as ort", w: "" },
                        { c: "import numpy as np", w: "" },
                        { c: "", w: "" },
                        { c: "# Create ONNX inference session with CPU or CUDA Execution Provider", w: "" },
                        { c: "session = ort.InferenceSession('model.onnx', providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])", w: "**Bypasses Python GIL.**", hi: true },
                        { c: "", w: "" },
                        { c: "input_name = session.get_inputs()[0].name", w: "" },
                        { c: "outputs = session.run(None, {input_name: input_data.astype(np.float32)})", w: "" },
                        { c: "print('ONNX Output shape:', outputs[0].shape)", w: "" }
                    ]
                }
            },

            {
                tryit: {
                    t: "Compare ONNX benefits",
                    task: "Name two key speed advantages of exporting models to ONNX format for production serving.",
                    hint: "Think about Python GIL and hardware execution providers.",
                    sol: { lang: "text", code: "1. Removes Python interpreter overhead and GIL lock.\n2. Leverages specialized execution providers (CUDA, TensorRT, OpenVINO) for hardware acceleration." },
                    w: "ONNX enables portable, high-performance model execution across hardware targets."
                }
            },

            { vocab: ["ONNX"] }
        ],
        k: [
            "ONNX exports model graphs into a portable format that runs outside Python runtime environments.",
            "ONNX Runtime provides significant latency improvements by using native C++ and CUDA execution providers.",
            "Enterprise serving frameworks like NVIDIA Triton handle dynamic batching to maximize GPU utilization."
        ],
        r: ["PyTorch", "Model Serving", "MLOps"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "torch.onnx.export(model, dummy_input, 'model.onnx')", w: "export PyTorch model to ONNX format" },
                { c: "ort.InferenceSession('model.onnx', providers=['CUDAExecutionProvider'])", w: "initialize ONNX runtime session" },
                { c: "session.run(None, {'input': x})", w: "execute ONNX runtime inference" }
            ]
        }
    }

]);

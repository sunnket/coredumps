/* Project Lab — AI, Machine Learning & Deep Learning */
(function (TD) {
  TD.addProjects("aiml", [
    {
      id: "neural-network-from-scratch-numpy",
      title: "Deep Neural Network & Autograd Engine from Scratch in NumPy",
      domain: "aiml",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "1–2 weeks",
      tagline: "Build a micrograd-style automatic differentiation engine and multi-layer perceptron using pure matrix calculus.",
      problem: "Beginners often call `model.fit()` in TensorFlow or `loss.backward()` in PyTorch without understanding the underlying computational graph, matrix Jacobian chain rule calculations, or how gradient descent actually updates weight tensors.",
      outcome: "A functional deep learning library built using only NumPy that builds dynamic computational DAGs, performs reverse-mode automatic differentiation, and trains on MNIST with >97% accuracy.",
      stack: ["Python 3", "NumPy", "Matplotlib"],
      diagram:
"Input x ──► [ MatMul W1 ] ──► [ Add Bias b1 ] ──► [ ReLU Activation ] ──► [ MatMul W2 ] ──► [ Softmax + Cross-Entropy ] ──► Loss L\n                                                                                                              │\n◄── dW1 ◄────── [ Backprop dZ1 ] ◄─────────────── [ Backprop dZ2 ] ◄──────────────────────────────────────────┘\n(Computes exact analytical gradients via reverse-mode automatic differentiation DAG)",
      steps: [
        { title: "Phase 1: Tensor Node & Computation Graph", desc: "Build a `Value` / `Tensor` class that tracks operands and operations (`+`, `*`, `matmul`, `relu`, `sigmoid`) in a Directed Acyclic Graph (DAG)." },
        { title: "Phase 2: Reverse-Mode Autograd", desc: "Implement `.backward()` using topological sorting. For each node, apply the calculus chain rule to propagate gradients from output loss backward to input weights." },
        { title: "Phase 3: Optimizers & Loss Functions", desc: "Implement SGD with Momentum, Adam optimizer with exponential moving averages ($m_t, v_t$), and numerically stable Cross-Entropy loss with log-sum-exp trick." },
        { title: "Phase 4: Training on MNIST / Fashion-MNIST", desc: "Train a 3-layer neural network on the 70,000-image MNIST dataset, visualizing loss curves, confusion matrices, and weight heatmap activations." }
      ],
      resources: [
        { title: "Andrej Karpathy: Building Micrograd from Scratch", url: "https://github.com/karpathy/micrograd" },
        { title: "Matrix Calculus for Deep Learning (Terence Parr & Jeremy Howard)", url: "https://explained.ai/matrix-calculus/" },
        { title: "The Adam Optimizer Paper (Kingma & Ba)", url: "https://arxiv.org/abs/1412.6980" }
      ],
      pitfalls: [
        "Be careful with broadcasting in NumPy: matrix multiplication shapes must align precisely during the backward pass (e.g. transposing weight matrices).",
        "Always use the log-sum-exp trick when computing Softmax loss to avoid numerical floating-point underflow/overflow."
      ],
      interview: [
        "Walk through the mathematical derivation of backpropagation for a single fully connected layer with ReLU activation.",
        "How does the Adam optimizer combine Momentum and RMSProp to adapt learning rates per parameter?"
      ]
    },
    {
      id: "autonomous-lane-detection",
      title: "Computer Vision Autonomous Lane & Vehicle Detector",
      domain: "aiml",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "2 weeks",
      tagline: "Build a classical computer vision pipeline that detects highway lanes and estimates road curvature.",
      problem: "Autonomous driving systems require real-time perception of road boundaries, lane markings, and vehicle trajectories even under varying sunlight, shadows, and highway curves.",
      outcome: "A real-time computer vision system that processes dashboard camera video streams, isolates lane markings, computes road curvature radius, and projects an augmented driving corridor overlay.",
      stack: ["Python", "OpenCV", "NumPy", "Matplotlib"],
      diagram:
"Input Dashcam Video Frame (1080p)\n               │\n               ▼\n┌────────────────────────────────────────┐\n│ Camera Distortion Calibration (cv2)    │\n└──────────────┬─────────────────────────┘\n               ▼\n┌────────────────────────────────────────┐\n│ Color Thresholding (HLS S-Channel)     │ ──► Sobel Gradient Edge Filter (cv2.Sobel)\n└──────────────┬─────────────────────────┘\n               ▼\n┌────────────────────────────────────────┐\n│ Perspective Transform (Bird's-Eye View)│ (Warp matrix via source/destination points)\n└──────────────┬─────────────────────────┘\n               ▼\n┌────────────────────────────────────────┐\n│ Sliding Window Histogram Peak Search   │ ──► 2nd-Order Polynomial Fit (x = Ay² + By + C)\n└──────────────┬─────────────────────────┘\n               ▼\nProject Unwarped Lane Polygon + Curvature Radius (Meters) onto Live Stream (60 FPS)",
      steps: [
        { title: "Phase 1: Camera Calibration & Undistortion", desc: "Use chessboard calibration images with `cv2.findChessboardCorners()` to calculate camera intrinsic matrix and radial distortion coefficients." },
        { title: "Phase 2: Color Space & Gradient Thresholding", desc: "Convert frames to HLS and LAB color spaces to isolate yellow and white lane lines under harsh lighting. Apply Sobel directional gradient filters." },
        { title: "Phase 3: Perspective Transform (Bird's Eye)", desc: "Define a trapezoidal region of interest on the road and compute a perspective transformation matrix (`cv2.getPerspectiveTransform`) to generate a top-down view." },
        { title: "Phase 4: Polynomial Fitting & Curvature Calculation", desc: "Use sliding window histogram peaks to locate lane pixel coordinates. Fit a 2nd-degree polynomial ($x = Ay^2 + By + C$) and calculate real-world road radius of curvature in meters." }
      ],
      resources: [
        { title: "OpenCV Camera Calibration & 3D Reconstruction", url: "https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html" },
        { title: "Udacity Self-Driving Car: Advanced Lane Finding", url: "https://github.com/udacity/CarND-Advanced-Lane-Lines" }
      ],
      pitfalls: [
        "Avoid using raw RGB thresholds; shadows on asphalt will break color detection. Always use HLS (Luminance & Saturation) or LAB color spaces.",
        "Ensure perspective transform source points are calibrated on flat straight roads to avoid distorted curvature calculations."
      ],
      interview: [
        "Explain how the Hough Transform detects linear structures in noisy image gradients.",
        "How is radius of curvature mathematically calculated from a 2nd-degree fitted polynomial?"
      ]
    },
    {
      id: "realtime-object-tracking-vision",
      title: "Real-Time Object Tracking & Speed Estimator with YOLOv8 & ByteTrack",
      domain: "aiml",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a traffic analytics system that detects, tracks unique vehicle IDs across frames, and calculates velocity.",
      problem: "Object detection identifies objects in isolated frames, but real-world video surveillance requires assigning persistent IDs across occlusions, tracking movement trajectories, and calculating physical real-world speeds from 2D pixel coordinates.",
      outcome: "A multi-threaded Python application running YOLOv8 + ByteTrack on RTSP traffic camera feeds, counting vehicles per lane, detecting speed limit violations, and logging telemetry to a database.",
      stack: ["Python", "YOLOv8 / Ultralytics", "ByteTrack / Kalman Filter", "OpenCV", "FastAPI / SQLite"],
      diagram:
"RTSP Video Stream (Traffic Cam)\n               │\n               ▼\n┌────────────────────────────────────────┐\n│ YOLOv8 Real-Time TensorRT / ONNX Engine│ ──► Bounding Boxes [x, y, w, h, conf, class]\n└──────────────┬─────────────────────────┘\n               ▼\n┌────────────────────────────────────────┐\n│ ByteTrack Association Engine           │\n│ • Kalman Filter Motion State (Velocity)│\n│ • Hungarian Algorithm IoU Matching     │\n└──────────────┬─────────────────────────┘\n               ▼\nPersistent Vehicle Track IDs [ID: 104, Speed: 68 km/h, Lane: 2]\n               │\n       ┌───────┴────────────────────────┐\n       ▼                                ▼\nAnnotated Video UI (OpenCV / WebRTC)   REST Telemetry API (Speed Violations)",
      steps: [
        { title: "Phase 1: YOLOv8 Inference Optimization", desc: "Export YOLOv8 weights to ONNX / TensorRT for GPU-accelerated inference running at >60 FPS on 1080p video." },
        { title: "Phase 2: ByteTrack & Kalman Filter Tracking", desc: "Integrate ByteTrack algorithm. Maintain a state vector $(x, y, a, h, \dot{x}, \dot{y}, \dot{a}, \dot{h})$ with Kalman Filtering to predict object positions through occlusions." },
        { title: "Phase 3: Perspective Homography & Speed Estimation", desc: "Calibrate pixel-to-meter homography matrix using known road distance markers. Calculate speed as distance traveled over elapsed frame timestamps." },
        { title: "Phase 4: Zone Counting & Violation Alerts", desc: "Implement virtual entry/exit tripwires. If calculated speed exceeds threshold, capture frame snapshot and trigger an API webhook." }
      ],
      resources: [
        { title: "ByteTrack: Multi-Object Tracking by Associating Every Detection Box (ECCV)", url: "https://arxiv.org/abs/2110.06864" },
        { title: "Ultralytics YOLOv8 Documentation", url: "https://docs.ultralytics.com/" },
        { title: "Kalman Filter Explained with Python Code", url: "https://www.kalmanfilter.net/" }
      ],
      pitfalls: [
        "Do not discard low-confidence detection boxes prematurely; ByteTrack's key innovation is matching low-score boxes with existing tracks to prevent ID switches during occlusions.",
        "Ensure frame drops do not distort speed calculations; use hardware timestamps (`frame_time`) rather than assuming constant 30 FPS intervals."
      ],
      interview: [
        "How does the Hungarian algorithm solve the bipartite matching problem in multi-object tracking?",
        "Why is ByteTrack superior to classical DeepSORT in crowded scenes with frequent occlusions?"
      ]
    },
    {
      id: "multimodal-image-search-engine",
      title: "Multimodal Vector Search Engine with CLIP & Qdrant",
      domain: "aiml",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a reverse image search and natural language visual query system with 512D joint embeddings.",
      problem: "Traditional e-commerce search relies on keyword tags (e.g. 'blue striped cotton shirt'). When users search with descriptive phrases ('retro 90s aesthetic summer outfit') or upload a photo of a dress, keyword search fails completely.",
      outcome: "A production visual search platform that indexes 100,000+ product images into a vector database and executes sub-10ms similarity queries using text or image prompts.",
      stack: ["Python", "OpenAI CLIP (ViT-B/32)", "Qdrant / Milvus Vector DB", "FastAPI", "React / Next.js"],
      diagram:
"Text Query: 'vintage leather armchair'           Image Query: Upload Photo\n               │                                              │\n               ▼                                              ▼\n┌───────────────────────────────┐              ┌───────────────────────────────┐\n│ CLIP Text Encoder (Transformer│              │ CLIP Vision Encoder (ViT)     │\n└──────────────┬────────────────┘              └──────────────┬────────────────┘\n               │ 512-Dimensional Vector                       │ 512-Dimensional Vector\n               └───────────────────────┬──────────────────────┘\n                                       ▼\n                    ┌──────────────────────────────────────┐\n                    │ Qdrant Vector Database (HNSW Index)  │\n                    │ Cosine Similarity Search: cos(u, v)  │\n                    └──────────────────┬───────────────────┘\n                                       │ Sub-10ms Ranked Results\n                                       ▼\n                    Top-K Matching Product Catalog Cards",
      steps: [
        { title: "Phase 1: Dataset & Image Feature Extraction", desc: "Batch process a product catalog using OpenAI CLIP (`ViT-B/32`). Normalize embedding vectors to unit length." },
        { title: "Phase 2: Vector DB Indexing with HNSW", desc: "Set up Qdrant vector database. Create a collection with Cosine distance metric and configure Hierarchical Navigable Small World (HNSW) index parameters." },
        { title: "Phase 3: Hybrid & Filtered Search API", desc: "Build FastAPI endpoints supporting pure text search, reverse image search, and hybrid metadata filtering (e.g. visual similarity + price < $50 + in_stock: true)." },
        { title: "Phase 4: Interactive Web UI", desc: "Build a React UI supporting drag-and-drop image search, visual similarity sliders, and multi-modal query refinement." }
      ],
      resources: [
        { title: "OpenAI CLIP: Learning Transferable Visual Models From Natural Language", url: "https://arxiv.org/abs/2103.00020" },
        { title: "Qdrant Vector Database Documentation", url: "https://qdrant.tech/documentation/" },
        { title: "HNSW Algorithm: Efficient and Robust Approximate Nearest Neighbor Search", url: "https://arxiv.org/abs/1603.09320" }
      ],
      pitfalls: [
        "Always normalize embedding vectors to unit norm before inserting into the vector index so that Cosine similarity equals the dot product.",
        "Avoid computing embeddings on the fly on CPU during user requests; deploy the CLIP encoder on GPU or ONNX Runtime for <20ms latency."
      ],
      interview: [
        "Explain how CLIP trains text and vision encoders jointly using symmetric cross-entropy contrastive loss.",
        "How does the HNSW graph index achieve logarithmic $O(\\log N)$ search complexity across millions of high-dimensional vectors?"
      ]
    },
    {
      id: "time-series-anomaly-detection",
      title: "Real-Time Cloud Telemetry Anomaly Detector with LSTM Autoencoders",
      domain: "aiml",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Detect server infrastructure memory leaks and CPU spikes using unsupervised LSTM reconstruction loss.",
      problem: "Static metric alerting (e.g. alert if CPU > 85%) produces endless false alarms during expected daily traffic spikes while missing subtle memory leaks, creeping latency degradation, and anomalous microservice crash loops.",
      outcome: "An unsupervised machine learning service that consumes Prometheus/Kafka server metrics, learns normal seasonal patterns, and flags multivariate anomalies in real-time.",
      stack: ["Python", "PyTorch / Scikit-Learn", "FastAPI", "InfluxDB / Prometheus", "Grafana"],
      diagram:
"Multi-Variate Server Telemetry [CPU, Memory, Network IO, Latency, RPS]\n                              │\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Sliding Window Rolling Normalization (MinMax / RobustScaler) │\n└─────────────────────────────┬────────────────────────────────┘\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ LSTM Autoencoder (PyTorch)                                   │\n│ • Encoder: Compresses 60s window into compact latent vector  │\n│ • Decoder: Reconstructs expected baseline server metrics     │\n└─────────────────────────────┬────────────────────────────────┘\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Reconstruction Error Calculation: e = ||x - x_reconstructed||│\n│ If error > Dynamic Mahalanobis Threshold ──► TRIGGER ANOMALY │\n└──────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Metric Ingestion & Feature Engineering", desc: "Ingest multivariate time-series data. Create rolling features, seasonal lag indicators, and normalize using `RobustScaler`." },
        { title: "Phase 2: LSTM Autoencoder Architecture", desc: "Build an Encoder-Decoder LSTM network in PyTorch that trains on normal server operations to minimize mean squared reconstruction error." },
        { title: "Phase 3: Dynamic Thresholding (Extreme Value Theory)", desc: "Instead of fixed threshold limits, use Extreme Value Theory (EVT) / Generalized Pareto Distribution to compute probabilistic anomaly bounds." },
        { title: "Phase 4: Real-time Alerting Pipeline", desc: "Connect the inference engine to live streaming data, publishing anomaly scores and root-cause metric contributions to Slack/PagerDuty." }
      ],
      resources: [
        { title: "Deep Learning for Anomaly Detection: A Survey", url: "https://arxiv.org/abs/1901.03407" },
        { title: "Unsupervised Anomaly Detection via LSTM Autoencoders", url: "https://towardsdatascience.com/lstm-autoencoder-for-anomaly-detection-e1f4f2ee7ccf" },
        { title: "Prometheus Monitoring Documentation", url: "https://prometheus.io/docs/introduction/overview/" }
      ],
      pitfalls: [
        "Do not train autoencoders on datasets containing unlabelled corrupted anomalies, or the model will learn to reconstruct the bugs as normal behavior.",
        "Account for diurnal (day/night) and weekly cycles; a traffic spike at 2 PM is normal, while the same spike at 4 AM is an anomaly."
      ],
      interview: [
        "Why are reconstruction-based autoencoders effective for unsupervised anomaly detection when failure labels are unavailable?",
        "What are the advantages of Isolation Forests over classical statistical z-score methods?"
      ]
    },
    {
      id: "semantic-segmentation-medical",
      title: "Medical Image Segmentation with U-Net & Focal Loss",
      domain: "aiml",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Train a deep U-Net convolutional network to segment cellular nuclei and MRI brain tumors at pixel precision.",
      problem: "Classifying an entire medical image as 'healthy' or 'tumor' is insufficient for surgical planning and oncology. Physicians need pixel-level boundary masks identifying the exact size, morphology, and volume of lesions with high sensitivity against extreme class imbalance.",
      outcome: "A trained deep learning segmentation model reaching >0.90 Dice coefficient on CT/MRI scans with an interactive DICOM medical viewer UI.",
      stack: ["PyTorch", "Albumentations", "U-Net / ResNet Encoder", "MONAI Medical AI", "Streamlit / Gradio"],
      diagram:
"Input MRI Scan (512×512×1)\n          │\n          ▼\n┌───────────────────┐ Skip Connection (High-Resolution Spatial Features)\n│ Encoder (Conv+Pool├─────────────────────────────────────────────┐\n└─────────┬─────────┘                                             │\n          │ Downsampling (Abstract Semantics)                     │\n          ▼                                                       ▼\n┌───────────────────┐                                   ┌───────────────────┐\n│ Bottleneck Latent │ ─────────────────────────────────►│ Decoder (UpConv)  │\n└───────────────────┘                                   └─────────┬─────────┘\n                                                                  │\n                                                                  ▼\n                                                        Binary Mask (Tumor Area)\n                                                        Loss = 0.5×Dice + 0.5×Focal",
      steps: [
        { title: "Phase 1: DICOM Preprocessing & Heavy Augmentation", desc: "Load medical DICOM/NIfTI scans, apply Hounsfield unit windowing, and use Albumentations for elastic deformations, grid distortions, and rotation." },
        { title: "Phase 2: U-Net Architecture with Skip Connections", desc: "Implement the contracting encoder and expansive decoder with skip connections to preserve high-resolution spatial boundary information." },
        { title: "Phase 3: Hybrid Loss Function (Combo Loss)", desc: "Combine Soft Dice Loss (measuring overlap agreement) and Focal Loss (penalizing hard foreground pixels) to combat 99:1 background-to-tumor class imbalance." },
        { title: "Phase 4: Clinical Evaluation & Interactive GUI", desc: "Compute Dice Similarity Coefficient, Hausdorff distance, and build an interactive web interface where doctors can adjust segmentation confidence thresholds." }
      ],
      resources: [
        { title: "Ronneberger et al. — U-Net: Convolutional Networks for Biomedical Image Segmentation", url: "https://arxiv.org/abs/1505.04597" },
        { title: "MONAI: Medical Open Network for AI Documentation", url: "https://monai.io/" },
        { title: "Focal Loss for Dense Object Detection (Lin et al.)", url: "https://arxiv.org/abs/1708.02002" }
      ],
      pitfalls: [
        "Do not use standard Binary Cross-Entropy loss alone; when 98% of pixels are healthy background, a model predicting all zeros achieves 98% accuracy but 0% clinical utility. Always use Dice / Tversky loss.",
        "Never apply aggressive lossy compression (like low-quality JPEG) to medical radiological scans."
      ],
      interview: [
        "Why are skip connections crucial in the U-Net architecture for biomedical image segmentation?",
        "Explain how the Dice Coefficient metric relates to the F1 score in pixel-level classification."
      ]
    },
    {
      id: "speech-emotion-recognition",
      title: "Speech Emotion Recognition with Mel-Spectrograms & BiLSTM",
      domain: "aiml",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Classify human acoustic vocal emotion in real-time audio streams using 2D CNN-BiLSTM architectures.",
      problem: "Natural conversation assistants and customer service call centers cannot understand user frustration or distress from text transcripts alone (e.g. sarcastic 'Oh great'). The acoustic properties of the voice (pitch, tone, energy, jitter) carry the emotional state.",
      outcome: "A real-time microphone audio classifier that visualizes live Mel-spectrograms and predicts emotional states (Neutral, Happy, Angry, Sad, Frustrated) with confidence scores.",
      stack: ["Python", "Librosa", "PyTorch (CNN + BiLSTM + Attention)", "WebAudio API", "FastAPI"],
      diagram:
"Raw Microphone Audio Stream (.wav 16kHz)\n                     │\n                     ▼\n┌────────────────────────────────────────┐\n│ Short-Time Fourier Transform (STFT)    │ ──► Log-Mel Spectrogram (128 Mel Bins)\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ 2D Convolutional Layers (Local Acoustic│ (Extracts pitch contours & formant transitions)\n│ Feature Extraction)                    │\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ Bidirectional LSTM + Temporal Attention│ (Captures emotional cadence over time)\n└────────────────────┬───────────────────┘\n                     ▼\nSoftmax Probability Distribution [Happy: 8%, Angry: 84%, Neutral: 8%]",
      steps: [
        { title: "Phase 1: Audio Signal Processing & Feature Engineering", desc: "Use Librosa to extract Mel-Frequency Cepstral Coefficients (MFCCs), Chroma energy, zero-crossing rates, and log-mel spectrograms from audio chunks." },
        { title: "Phase 2: CNN-BiLSTM Network Architecture", desc: "Build a hybrid model: 2D CNN layers treat spectrograms as images, feeding temporal feature sequences into a 2-layer Bidirectional LSTM." },
        { title: "Phase 3: Training on RAVDESS & TESS Datasets", desc: "Train with SpecAugment (frequency and time masking data augmentation) to prevent overfitting across different speakers." },
        { title: "Phase 4: Real-Time Web Audio Streaming", desc: "Stream microphone audio over WebSockets using the Web Audio API, running rolling 2.5-second inference buffers in real-time." }
      ],
      resources: [
        { title: "Librosa: Python Audio and Music Signal Processing", url: "https://librosa.org/doc/latest/index.html" },
        { title: "SpecAugment: A Simple Data Augmentation Method for Speech Recognition", url: "https://arxiv.org/abs/1904.08779" },
        { title: "RAVDESS Emotional Speech and Song Audio Dataset", url: "https://zenodo.org/record/1188976" }
      ],
      pitfalls: [
        "Do not train models without speaker-independent train/val splits; if the same actor's voice appears in both train and validation sets, the model overfits to speaker identity rather than acoustic emotion.",
        "Ensure all audio recordings are resampled to a consistent sample rate (e.g. 16,000 Hz) before computing Fourier transforms."
      ],
      interview: [
        "What is the physical meaning of the Mel scale compared to standard linear acoustic frequencies in Hertz?",
        "How does SpecAugment improve model robustness against background noise and varied recording hardware?"
      ]
    },
    {
      id: "graph-neural-network-fraud",
      title: "Graph Neural Network for Financial Fraud Ring Detection",
      domain: "aiml",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Detect coordinated money laundering and credit card fraud rings using Graph Convolutional Networks (GCN).",
      problem: "Traditional tabular machine learning evaluates transactions in isolation (e.g. checking amount, timestamp). Sophisticated money laundering rings distribute stolen funds through complex webs of mule accounts that look innocent individually but reveal dense circular topologies when analyzed as a graph.",
      outcome: "A complete Graph Neural Network pipeline that converts transaction ledgers into heterogeneous graphs, executes neighborhood message-passing, and flags high-risk accounts with explainable sub-graph visualizations.",
      stack: ["Python", "PyTorch Geometric (PyG)", "NetworkX", "DGL", "Neo4j / Memgraph", "Gradio"],
      diagram:
"Transaction Ledger [User A ──$500──► User B ──$490──► User C ──$480──► User A]\n                              │\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Heterogeneous Graph Construction (Nodes: Users, Cards, IPs)  │\n│ (Edges: TransferredMoney, SharedDevice, SharedAddress)       │\n└─────────────────────────────┬────────────────────────────────┘\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Graph Attention Network (GAT / GraphSAGE Message Passing)    │\n│ h_v^(k+1) = σ( ∑ α_uv W h_u^(k) )                            │\n│ Aggregates neighbor embeddings weighted by attention scores  │\n└─────────────────────────────┬────────────────────────────────┘\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Node Classification Head ──► Fraud Probability Score [0.96]  │\n│ Subgraph Explainability via GNNExplainer (Highlights Ring)   │\n└──────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Graph Construction & Feature Engineering", desc: "Model entities as nodes (Users, Credit Cards, Device Fingerprints) and interactions as directed edges. Build node feature vectors with transaction statistics." },
        { title: "Phase 2: GraphSAGE / GAT Architecture", desc: "Build a Graph Attention Network (GAT) in PyTorch Geometric. Implement neighborhood sampling to handle massive graphs that do not fit into single GPU memory." },
        { title: "Phase 3: Class Imbalance & Loss Tuning", desc: "Use focal loss and negative sampling since fraudulent accounts typically represent <0.1% of all nodes in realistic financial graphs." },
        { title: "Phase 4: Graph Visualization & Explainability", desc: "Use GNNExplainer to identify the most influential neighbor sub-graphs that triggered the fraud alert, rendering interactive D3.js / PyVis network maps." }
      ],
      resources: [
        { title: "PyTorch Geometric (PyG) Documentation & Tutorials", url: "https://pytorch-geometric.readthedocs.io/" },
        { title: "Hamilton et al. — Inductive Representation Learning on Large Graphs (GraphSAGE)", url: "https://arxiv.org/abs/1706.02216" },
        { title: "Veličković et al. — Graph Attention Networks (GAT)", url: "https://arxiv.org/abs/1710.10903" }
      ],
      pitfalls: [
        "Avoid data leakage during graph construction: never include future transaction edges when predicting fraud labels at time $T$.",
        "Watch out for over-smoothing in deep GNNs: stacking more than 3–4 graph convolution layers causes all node embeddings to converge to the same average vector."
      ],
      interview: [
        "Explain the message-passing paradigm in Graph Convolutional Networks (GCN).",
        "What is the 'over-smoothing' pathology in deep Graph Neural Networks, and how does GraphSAGE neighborhood sampling alleviate it?"
      ]
    },
    {
      id: "reinforcement-learning-robotics",
      title: "Robotic Locomotion Agent with Proximal Policy Optimization (PPO)",
      domain: "aiml",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "4–6 weeks",
      tagline: "Train a simulated bipedal robot to walk, balance, and navigate uneven terrain using Deep Reinforcement Learning.",
      problem: "Programming continuous motor torques for multi-joint articulated robots using hand-written kinematic equations is brittle and fails when encountering unexpected slopes, obstacles, or payload changes. You will train an end-to-end Deep RL policy.",
      outcome: "A reinforcement learning agent trained with PPO in a physics engine (MuJoCo / Gymnasium) that learns stable bipedal walking gait from scratch, adapting to randomized terrain.",
      stack: ["Python", "PyTorch", "Gymnasium / MuJoCo", "Stable-Baselines3", "Weights & Biases (W&B)"],
      diagram:
"Continuous State Observation s_t [Joint Angles, Velocities, Torso Orientation, LiDAR Raycasts]\n                                      │\n                                      ▼\n                        ┌───────────────────────────┐\n                        │ Actor-Critic Network (PPO)│\n                        └──────┬─────────────┬──────┘\n                               │             │\n               Continuous Action a_t         State Value V(s_t)\n               [Motor Joint Torques]         [Expected Cumulative Reward]\n                               │\n                               ▼\n┌──────────────────────────────────────────────────────────────┐\n│ MuJoCo Physics Simulator                                     │\n│ Computes forward dynamics, joint friction, and ground contact│\n└──────────────────────────────┬───────────────────────────────┘\n                               ▼\nReward r_t = +forward_velocity - energy_penalty - excessive_torque - fall_penalty",
      steps: [
        { title: "Phase 1: Environment & Reward Function Design", desc: "Configure Gymnasium MuJoCo environment (`BipedalWalker-v3` or `Humanoid-v4`). Design shaped reward functions balancing forward progress and energy efficiency." },
        { title: "Phase 2: PPO Algorithm Implementation", desc: "Build the Actor-Critic PPO architecture with Generalized Advantage Estimation (GAE) and clipped surrogate objective $L^{CLIP}(\\theta)$ to prevent destructive policy updates." },
        { title: "Phase 3: Vectorized Parallel Training", desc: "Run 16–32 parallel simulator environments using `SubprocVecEnv` to collect millions of trajectory steps rapidly on multi-core CPUs/GPUs." },
        { title: "Phase 4: Domain Randomization & Video Rendering", desc: "Apply domain randomization (varying ground friction, robot mass, and motor backlash) so the policy develops robust balance reflexes. Export high-res simulation MP4s." }
      ],
      resources: [
        { title: "Schulman et al. — Proximal Policy Optimization Algorithms (OpenAI PPO)", url: "https://arxiv.org/abs/1707.06347" },
        { title: "Deep Reinforcement Learning: OpenAI Spinning Up in Deep RL", url: "https://spinningup.openai.com/" },
        { title: "Gymnasium MuJoCo Environments Documentation", url: "https://gymnasium.farama.org/environments/mujoco/" }
      ],
      pitfalls: [
        "Beware of reward hacking: if reward weights are unbalanced, the agent may learn to somersault, vibrate in place, or dive forward rather than walking.",
        "Always normalize state observations and scale rewards to avoid exploding gradients during early policy exploration."
      ],
      interview: [
        "Why does PPO use a clipped probability ratio objective instead of standard vanilla Policy Gradients?",
        "How does Generalized Advantage Estimation (GAE) balance the bias-variance trade-off in value estimation?"
      ]
    },
    {
      id: "custom-diffusion-model-scratch",
      title: "Generative Diffusion Model from Scratch in PyTorch",
      domain: "aiml",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "6–8 weeks",
      tagline: "Build a Denoising Diffusion Probabilistic Model (DDPM) with U-Net, sinusoidal time embeddings, and classifier-free guidance.",
      problem: "Modern generative AI is powered by diffusion models (Stable Diffusion, Midjourney, Sora). Understanding the underlying stochastic differential equations, forward Gaussian noising schedules, and reverse denoising U-Net architectures requires building one from foundational math.",
      outcome: "A fully trained generative diffusion model capable of synthesizing novel 64x64 / 128x128 photorealistic images with text prompt conditioning and interactive denoising step visualizers.",
      stack: ["Python", "PyTorch", "U-Net with Self-Attention", "CUDA", "Accelerate / W&B"],
      diagram:
"Forward Noising Process (q): Gradually adds Gaussian noise over T = 1000 steps\n  x_0 (Clean Image) ──► x_1 ──► x_t ──► x_T (Pure Gaussian Noise N(0, I))\n\nReverse Denoising Process (p_θ): Neural Network estimates and removes noise\n  x_T (Pure Noise)  ──► ... ──► x_t ──► x_t-1 ──► x_0 (Generated Image)\n                                 ▲\n                                 │ Subtract Predicted Noise ε_θ(x_t, t, prompt)\n┌────────────────────────────────┴─────────────────────────────┐\n│ U-Net Denoising Engine                                       │\n│ • Sinusoidal Positional Time Embedding                       │\n│ • Cross-Attention on Text Prompt Vectors (CLIP)              │\n│ • ResNet Blocks with Multi-Head Self-Attention               │\n└──────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Forward Diffusion Math & Noise Schedules", desc: "Implement linear and cosine variance schedules ($\\beta_t, \\alpha_t, \\bar{\\alpha}_t$). Write closed-form sampling for arbitrary step $t$: $x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon$." },
        { title: "Phase 2: Denoising U-Net Architecture", desc: "Build a multi-scale U-Net with downsampling ResNet blocks, self-attention layers at lower resolutions (16×16), and sinusoidal timestep embeddings." },
        { title: "Phase 3: Classifier-Free Guidance (CFG)", desc: "Implement conditional generation by randomly dropping prompt embeddings (10% of the time) during training, blending conditional and unconditional noise predictions at inference: $\\hat{\\epsilon} = \\epsilon_{uncond} + s \\cdot (\\epsilon_{cond} - \\epsilon_{uncond})$." },
        { title: "Phase 4: Fast Samplers (DDIM) & Web Playground", desc: "Implement DDIM (Denoising Diffusion Implicit Models) deterministic sampling to generate high-quality images in 25–50 steps instead of 1,000 steps." }
      ],
      resources: [
        { title: "Ho et al. — Denoising Diffusion Probabilistic Models (DDPM 2020)", url: "https://arxiv.org/abs/2006.11239" },
        { title: "Song et al. — Denoising Diffusion Implicit Models (DDIM)", url: "https://arxiv.org/abs/2010.02502" },
        { title: "The Annotated Diffusion Model (Hugging Face)", url: "https://huggingface.co/blog/annotated-diffusion" }
      ],
      pitfalls: [
        "Do not compute the forward noise addition iteratively in a for-loop during training; use the analytical closed-form formula $x_t = \\sqrt{\\bar{\\alpha}_t}x_0 + \\sqrt{1-\\bar{\\alpha}_t}\\epsilon$ in $O(1)$ time.",
        "Ensure attention layers are restricted to low-resolution bottleneck layers to avoid GPU out-of-memory errors on high-resolution feature maps."
      ],
      interview: [
        "Explain the mathematical justification for training the U-Net to predict added noise $\\epsilon$ rather than predicting the clean image $x_0$ directly.",
        "How does Classifier-Free Guidance (CFG) boost sample fidelity and prompt alignment during sampling?"
      ]
    }
  ]);
})(window.TD = window.TD || {});

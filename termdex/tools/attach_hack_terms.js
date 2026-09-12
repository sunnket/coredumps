const fs = require("fs");
const path = require("path");

const guidesPath = path.join(__dirname, "..", "data", "guides.js");

// Mapping of guide ID to related terms
const guideTermsMap = {
  "reverse-search-history": ["Bash", "Zsh", "Terminal", "Command-Line Interface (CLI)"],
  "xargs-parallel-processing": ["Process", "Concurrency", "Standard Streams (stdin/stdout/stderr)", "Bash"],
  "alias-functions-that-save-hours": ["Bash", "Zsh", "Environment Variable", "Shell"],
  "ssh-tunnel-port-forwarding": ["SSH", "Port", "Proxy", "Firewall", "TCP"],
  "dns-how-domains-work": ["DNS", "IP Address", "Time to Live (TTL)", "Host"],
  "network-sniffing-wireshark-tcpdump": ["Wireshark", "Raw Socket", "TCP", "UDP", "Packet"],
  "process-explorer-what-is-eating-my-cpu": ["Process", "Thread", "CPU Cache", "Memory Leak"],
  "environment-variables-deep-dive": ["Environment Variable", "Process", "Secrets Management", "Shell"],
  "cron-jobs-scheduled-tasks": ["Daemon", "Process", "Task Queue", "Bash"],
  "git-reflog-undo-anything": ["Git", "Version Control", "Commit", "Branch"],
  "git-bisect-find-breaking-commit": ["Git", "Binary Search", "Regression Testing", "Commit"],
  "find-exposed-secrets-in-code": ["Secrets Management", "Regular Expression (Regex)", "Entropy", "Git"],
  "vscode-multi-cursor-magic": ["Integrated Development Environment (IDE)", "Refactoring", "Text Editor"],
  "vscode-snippets-code-templates": ["Integrated Development Environment (IDE)", "Autocompletion", "Snippet"],
  "chrome-devtools-performance-profiling": ["Flamegraph", "Call Stack", "Event Loop", "Memory Leak"],
  "docker-exec-into-running-container": ["Docker", "Container", "Namespaces", "Process"],
  "jq-json-swiss-army-knife": ["JSON", "Data Serialization", "Standard Streams (stdin/stdout/stderr)", "Pipeline"],
  "sed-awk-text-transformation": ["Regular Expression (Regex)", "Pipeline", "Standard Streams (stdin/stdout/stderr)", "Bash"],
  "zero-downtime-deployment": ["Zero-Downtime Deployment", "Load Balancer", "Blue-Green Deployment", "Health Check"],
  "prompt-injection-defense": ["Prompt Injection", "Large Language Model (LLM)", "Guardrails", "Allow-list Validation"],
  "strace-system-call-spy": ["strace", "System Call (Syscall)", "Kernel", "Process"],
  "memory-leak-heap-snapshot": ["Heap", "Memory Leak", "Garbage Collection", "Call Stack"],
  "curl-latency-profiling": ["Latency", "TCP", "TLS", "DNS", "HTTP"],
  "ramdisk-tmpfs-speedup": ["File System", "Virtual Memory", "Random Access Memory (RAM)", "I/O Throughput"],
  "sql-explain-analyze-deep": ["Query Plan", "Index", "Database Index", "PostgreSQL"],
  "db-connection-pooling-tuning": ["Connection Pool", "Database", "Deadlock", "Socket Exhaustion"],
  "subprocess-ipc-deadlocks": ["Inter-Process Communication (IPC)", "Deadlock", "Standard Streams (stdin/stdout/stderr)", "Buffer Overflow"],
  "docker-distroless-security": ["Container", "Attack Surface", "Docker", "Security"],
  "mitmproxy-api-reverse-engineer": ["Proxy", "Reverse Engineering", "TLS", "HTTP/2", "Certificate Authority (CA)"],
  "hybrid-search-rrf-rag": ["Reciprocal Rank Fusion (RRF)", "Retrieval-Augmented Generation (RAG)", "Vector Search", "BM25"],
  "linux-systemd-service-mastery": ["Daemon", "System Call (Syscall)", "Process", "Linux"],
  "git-blame-ignore-revs": ["Git", "Commit", "Code Review", "Version Control"],
  "mkcert-local-https-trusted": ["Certificate Authority (CA)", "TLS", "Public Key Infrastructure (PKI)", "HTTPS"],
  "cut-sort-uniq-log-pipelines": ["Standard Streams (stdin/stdout/stderr)", "Pipeline", "Hash Table", "Log Parsing"],
  "windows-job-objects-resource-limits": ["Job Object", "Control Groups", "Process", "Virtual Memory"],
  "windows-tcp-tuning-socket-exhaustion": ["Socket Exhaustion", "TIME_WAIT", "TCP Window Auto-Tuning", "Ephemeral Port", "TCP"],
  "powershell-fzf-ripgrep-supercharged": ["Fuzzy Finding", "Regular Expression (Regex)", "Virtual Environment", "Command-Line Interface (CLI)"],
  "windows-pktmon-packet-capture": ["PktMon", "Raw Socket", "Wireshark", "Promiscuous Mode"],
  "python-raw-socket-sniffer-windows": ["Raw Socket", "Promiscuous Mode", "PktMon", "TCP", "UDP"],
  "python-cprofile-snakeviz-flamegraph": ["cProfile", "Flamegraph", "Call Stack", "Profiling"],
  "pytorch-dynamic-quantization-int8": ["Quantization", "Knowledge Distillation", "Inference", "Tensor"],
  "knowledge-distillation-pytorch": ["Knowledge Distillation", "KL Divergence", "Quantization", "Loss Function"],
  "python-defensive-input-validation": ["Allow-list Validation", "Unicode Normalization", "Input Sanitization", "SQL Injection"],
  "python-pip-audit-vulnerability-scan": ["pip-audit", "Virtual Environment", "Software Bill of Materials (SBOM)", "Dependency Injection"],
  "windows-powershell-threat-hunting": ["Portable Executable", "Reverse Engineering", "Process", "Hash Function"],
  "python-pefile-inspect-executables": ["Portable Executable", "Import Address Table", "Shannon Entropy", "Reverse Engineering"],
  "windows-extract-binary-strings-powershell": ["Shannon Entropy", "Portable Executable", "Reverse Engineering", "Entropy"],
  "python-invoke-windows-automation": ["Invoke", "Continuous Integration (CI)", "Build Tool", "Task Runner"]
};

// Load guides
global.window = {};
eval(fs.readFileSync(guidesPath, "utf8"));
const TD = global.window.TD;

let count = 0;
TD.guides.forEach(g => {
  if (guideTermsMap[g.id]) {
    g.r = guideTermsMap[g.id];
    count++;
  }
});

console.log(`Updated ${count} guides with r terms`);

// Format output
let content = `(function () {
  'use strict';

  var TD = window.TD = window.TD || {};

  TD.guideGroups = ${JSON.stringify(TD.guideGroups, null, 2)};

  TD.guides = ${JSON.stringify(TD.guides, null, 2)};

})();
`;

fs.writeFileSync(guidesPath, content, "utf8");
console.log("Successfully wrote updated guides.js");

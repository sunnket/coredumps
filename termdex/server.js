/* NodeCraft dev server — zero dependencies.
   Usage: node server.js [port]                                            */
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = __dirname;
const START_PORT = Number(process.argv[2]) || 8000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(url.parse(req.url).pathname);
  if (pathname === "/") pathname = "/index.html";

  // resolve and confine to ROOT (no path traversal)
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        '<!doctype html><meta charset="utf-8"><title>404</title>' +
        '<body style="font:16px system-ui;padding:3rem;background:#07090e;color:#e9edf5">' +
        "<h1>404 — not found</h1><p>" + pathname +
        '</p><p><a style="color:#3ddc97" href="/">Back to CoreDumps</a></p>'
      );
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(data);
  });
});

function listen(port, attemptsLeft) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
      console.log("  port " + port + " busy, trying " + (port + 1) + "…");
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error(err.message);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    const line = "  CoreDumps running at  http://localhost:" + port + "  ";
    const bar = "─".repeat(line.length);
    console.log("\n┌" + bar + "┐");
    console.log("│" + " ".repeat(line.length) + "│");
    console.log("│" + line + "│");
    console.log("│" + " ".repeat(line.length) + "│");
    console.log("└" + bar + "┘\n");
    console.log("  Press Ctrl+C to stop.\n");
  });
}

listen(START_PORT, 15);

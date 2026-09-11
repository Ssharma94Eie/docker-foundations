const http = require("http");
const fs = require("fs");

// Read a secret from the file Docker mounts at run time. Never log its value.
const hasSecret = fs.existsSync("/run/secrets/api_token");

http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
    return;
  }
  res.writeHead(200);
  res.end(`secure demo. running as uid ${process.getuid()}. secret mounted: ${hasSecret}\n`);
}).listen(3000, () => console.log("listening on 3000"));

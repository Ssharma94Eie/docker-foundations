const http = require("http");

http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
    return;
  }
  res.writeHead(200);
  res.end("operating demo: healthy, resource-limited, and self-healing\n");
}).listen(3000, () => console.log("listening on 3000"));

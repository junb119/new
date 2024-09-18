const http = require("http");
const fs = require("fs");
const path = require("path");

// 서버 생성
const server = http.createServer((req, res) => {
  // 요청된 파일 경로 설정
  let filePath = path.join(__dirname, req.url === "/" ? "main.html" : req.url);
  console.log(`Requested file path: ${filePath}`); // 경로 출력

  // 파일 확장자에 따른 MIME 타입 설정
  let extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".wav":
      contentType = "audio/wav";
      break;
    default:
      contentType = "text/html";
  }

  // 파일 읽기
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error("Error reading file:", err);
      res.writeHead(500);
      res.end("Error loading the page");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// 포트 설정 및 서버 실행
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

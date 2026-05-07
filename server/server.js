const express = require("express");
const cors = require("cors");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

let documents = [];

app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files;

  files.forEach((file) => {
    documents.push({
      name: file.originalname,
      size: file.size,
      date: new Date(),
    });
  });

  res.json({
    success: true,
  });
});

app.get("/documents", (req, res) => {
  res.json(documents);
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
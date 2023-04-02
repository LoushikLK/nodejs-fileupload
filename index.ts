import express, { Express, NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { createReadStream, createWriteStream, readdir, statSync } from "fs";
import path from "path";

const app: Express = express();

app.use(express.json());

app.use(fileUpload());

app.use(express.static(path.join(__dirname, "./public")));

app.get("/upload-data", async (req, res, next) => {
  try {
    readdir(path.join(__dirname, "./upload/"), (error, data) => {
      if (error) throw new Error(error?.message);

      res.send(data);
    });
  } catch (error) {
    next(error);
  }
});
app.get("/upload-data/:uploadPath", async (req, res) => {
  const range = req.headers.range;

  const videoSize = statSync(
    path.join(__dirname, "./upload/" + req?.params?.uploadPath)
  ).size;

  const CHUNK_SIZE = 10 ** 6;

  const start = Number(range?.replace(/\D/g, ""));

  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    // "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  const videoStream = createReadStream(
    path.join(__dirname, "./upload/" + req?.params?.uploadPath),
    { start, end }
  );
  videoStream.pipe(res);
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/" + "index.html"));
});
app.get("/upload", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/" + "upload.html"));
});
app.get("/video", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/" + "video.html"));
});

app.post("/upload", async (req: any, res) => {
  if (!req?.files?.file && Array.isArray(req?.files?.file))
    throw new Error("File not found");

  const writablePath = createWriteStream(`./upload/${req?.files?.file?.name}`, {
    encoding: "utf-8",
  });
  writablePath.write(req?.files?.file?.data);
  res.send("success");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err);
});

app.listen(8000, () => {
  console.log("server listening on 8000");
});

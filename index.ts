import express, { Express, NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { createReadStream, createWriteStream, readdir } from "fs";
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
  const data = createReadStream(
    path.join(__dirname, "./upload/" + req?.params?.uploadPath)
  );

  data.on("data", (chunk) => {
    res.write(chunk);
  });
  data.on("end", () => {
    res.end();
  });
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/" + "index.html"));
});
app.get("/upload", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/" + "upload.html"));
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

import express from "express";
import { join } from "path";
import { cwd } from "process";
import { createReadStream, statSync } from "fs";
const app = express();
const PORT = 9000;

app.get("/", (req, res) => {
    console.log("connected");
    res.sendFile(join(cwd(), "index.html"));
});

app.get("/videoplayer", (req, res) => {
    // console.log("serving");
    const range = req.headers.range;
    const videoPath = "./video.mp4";
    const videoSize = statSync(videoPath).size;
    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const stream = createReadStream(videoPath, {
        start,
        end,
    });
    stream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

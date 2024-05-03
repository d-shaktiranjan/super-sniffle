import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createReadStream, statSync, readdirSync } from "fs";
import testRouter from "./routes.js";

const app = express();
const PORT = 9000;

app.use(cors());
app.use(cookieParser());
app.use("/test", testRouter);

app.get("/videoplayer", (req, res) => {
    const file = req.query.file;
    if (!readdirSync("./videos").includes(file))
        res.json({
            isSuccess: true,
            message: `${file} is not allowed`,
        });

    const range = req.headers.range || "0-";
    const videoPath = `./videos/${file}`;
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

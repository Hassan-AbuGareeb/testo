const express = require("express");
const app = express();
const PORT = process.env.PORT || 3003;
const cors = require("cors");
app.use(cors());

const ytdl = require("ytdl-core");
const fs = require("fs");

app.get("/", (req, res) => {
  res.status(200).json({ message: "app working perfectly" });
});

app.get("/:id", (req, res) => {
  const videoId = req.params.id;

  ytdl
    .getInfo(videoId)
    .then((info) => {
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
      });
      res.status(200);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${info.videoDetails.title}.mp3`
      );

      ytdl.downloadFromInfo(info, { format: format }).pipe(res);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error converting video" });
    });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

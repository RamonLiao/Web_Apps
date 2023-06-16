const router = require("express").Router();
const File = require("../models").fileModel;

router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
});

// upload file
router.post("/", async (req, res) => {
  let { filename, filesize, created, data } = req.body;
  if (data === {}) {
    return res.status(400).send("No data in file for upload.");
  }

  let newFile = new File({
    filename,
    filesize,
    created,
    data,
  });

  try {
    await newFile.save();
    res.status(200).send("New file has been uploaded.");
  } catch (err) {
    res.status(400).send("Cannot upload files.");
  }
});

module.exports = router;

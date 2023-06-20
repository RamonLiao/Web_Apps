const router = require("express").Router();
const File = require("../models").fileModel;

router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
});

// get all files
router.get("/", (req, res) => {
  File.find({})
    .then((files) => {
      res.status(200).send(files);
    })
    .catch(() => {
      res.status(500).send("Error! Cannot get files!");
    });
});

// upload file
router.post("/", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Origin", "*");

  let { filename, filesize, created, data } = req.body;
  console.log(req.body);
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

// delete file
router.delete("/", async (req, res) => {
  let { _id } = req.query;
  // console.log(_id);

  let file = await File.findOne({ _id });
  if (!file) {
    res.status(404);
    return res.json({
      success: false,
      message: "File not found.",
    });
  }
  //   console.log(course);
  //   console.log(req.user);

  File.deleteOne({ _id })
    .then(() => {
      res.send("File deleted.");
    })
    .catch((e) => {
      res.send({
        success: false,
        message: e,
      });
    });
});

module.exports = router;

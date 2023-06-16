const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  filename: {
    type: String,
  },
  filesize: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: new Date(),
  },
  data: {
    type: {},
    default: {},
  },
});

const File = mongoose.model("File", fileSchema);
module.exports = File;

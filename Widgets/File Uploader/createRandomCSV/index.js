const express = require("express");
const app = express();
const ejs = require("ejs");
const fs = require("fs");

// middleware
app.use(express.static("public"));
// app.set('views', './views');
app.set("view engine", "ejs");

app.get("/write-csv", async (req, res) => {
  let { size, columns, rows, header, fileName } = req.query;
  console.log(req.query);

  const fileWriteStream = fs.createWriteStream(fileName);

  /* Create random text */
  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  // Create header line
  if (header === "true") {
    let header = "";
    for (let i = 1; i <= columns; i++) {
      header += "Col" + i + "\t";
    }
    header += "\n";
    const ableToWrite = fileWriteStream.write(header);
    if (!ableToWrite) {
      await new Promise((resolve) => fileWriteStream.once("drain", resolve));
    }
    rows--;
  }

  // create row data
  for (let i = 1; i <= rows; i++) {
    let rowData = "";
    // let randomText = makeid(20);
    for (let j = 1; j <= columns; j++) {
      // rowData += (Math.floor(Math.random() * columns) + randomText); // !! dynamic content
      rowData +=
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + "\t";
    }
    rowData += "\n";
    const ableToWrite = fileWriteStream.write(rowData);
    if (!ableToWrite) {
      await new Promise((resolve) => fileWriteStream.once("drain", resolve));
    }
  }

  res.send({ success: true, message: "File generated successfully." });
});

app.get("/", (req, res) => {
  // database -> select an array of objects
  let columns, rows, filesize;
  res.render("index.ejs", { columns, rows, filesize }); // ejs has been placed under folder 'views'.
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

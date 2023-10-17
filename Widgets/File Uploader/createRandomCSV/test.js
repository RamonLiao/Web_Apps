let data = [];
let randomCol, randomRow;
let blob,
  csvContent = "";

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

// Define random numbers of columns and rows
// randomCol = Math.floor(Math.random() * 30000); // col < 30000
// randomRow = Math.floor(Math.random() * (1000 - 10) + 10 + 1); // 10 < row < 1000
randomCol = 29999;
randomRow = 500;

// create data
data = [];
csvContent = [];

const withHeader = true;
// create header for data
if (withHeader) {
  let header = [];
  for (let i = 1; i <= randomCol; i++) {
    header.push("Col" + i);
  }
  data.push(header);
  randomRow--;
}
// create row data
for (let i = 1; i <= randomRow; i++) {
  let rowData = [];
  // let randomText = makeid(20);
  for (let j = 1; j <= randomCol; j++) {
    // rowData.push(Math.floor(Math.random() * randomCol) + randomText); // !! dynamic content
    rowData.push(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    );
  }
  data.push(rowData);
}
// console.log(data);

// create a csv file in tabular format
for (let i = 0; i < data.length; i++) {
  let rowArray = data[i];
  let row = "";
  for (let j = 0; j < rowArray.length; j++) {
    row += rowArray[j] + "\t";
  }
  // csvContent += row + "\n";
  csvContent.push(row + "\n");
}

// data.forEach((rowArray) => {
//   csvContent += rowArray.join("\t") + "\n";
// });

// csvContent = data.map((row) => row.join("\t")).join("\n");
console.log(csvContent);
blob = new Blob([csvContent], {
  type: "text/csv;charset=utf-8,",
  // type: "text/csv;charset=ASCII,",
});

// Calculate file size
console.log(blob.size + " Bytes");
let filesize;
if (blob.size < 1000) {
  filesize = blob.size + " Bytes";
} else if (blob.size >= 10 * 3 && blob.size < 10 ** 6) {
  filesize = Math.round((blob.size / 1000) * 100) / 100 + " KB"; // using 1024 as a denominator is more accurate.
} else if (blob.size >= 10 ** 6 && blob.size < 10 ** 9) {
  filesize = Math.round((blob.size / 1000000) * 100) / 100 + " MB";
} else if (blob.size >= 10 ** 9) {
  filesize = Math.round((blob.size / 1000000000) * 100) / 100 + " GB";
}
console.log(filesize);

/* Download file Handler */

// check data has been created.

const filename = "test" + ".csv";
console.log(filename);

// const blob = new Blob([csvContent], {
//   type: "text/csv;charset=utf-8,",
// });
const objUrl = URL.createObjectURL(blob);
const link = document.createElement("a");
link.setAttribute("href", objUrl);
link.setAttribute("download", filename);
link.click();

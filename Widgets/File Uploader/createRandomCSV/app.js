let data = [];
let randomCol, randomRow;
let blob,
  csvContent = "";

/* Create file Handler */
const createBtn = document.querySelector(".create");

createBtn.addEventListener("click", () => {
  const columns = document.querySelector(".columns");
  const rows = document.querySelector(".rows");
  const size = document.querySelector(".size");

  // Define random numbers of columns and rows
  randomCol = Math.floor(Math.random() * 30000); // col < 30000
  randomRow = Math.floor(Math.random() * (1000 - 10) + 10 + 1); // 10 < row < 1000

  // Display columns and rows
  columns.innerText = "Columns: " + randomCol;
  rows.innerText = "Rows: " + randomRow;

  // create data
  data = [];
  const withHeader = document.querySelector("#header");
  // create header for data
  if (withHeader.checked) {
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
    for (let j = 1; j <= randomCol; j++) {
      rowData.push(Math.floor(Math.random() * 10) + "fasdfgasgasdfasdfasdaf5"); // !! dynamic content
    }
    data.push(rowData);
  }
  console.log(data);

  // create a csv file in tabular format
  for (let i = 0; i < data.length; i++) {
    let rowArray = data[i];
    let row = "";
    for (let j = 0; j < rowArray.length; j++) {
      row += rowArray[j] + "\t";
    }
    csvContent += row + "\n";
  }

  // data.forEach((rowArray) => {
  //   csvContent += rowArray.join("\t") + "\n";
  // });

  // csvContent = data.map((row) => row.join("\t")).join("\n");

  blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8,",
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
  size.innerText = "Filesize: " + filesize;
});

/* Download file Handler */
const downloadBtn = document.querySelector(".download");
downloadBtn.addEventListener("click", () => {
  // check data has been created.
  if (data.length <= 0) {
    alert("Please create a CSV file before downloading.");
    return;
  }
  const filename = document.querySelector("#filename").value + ".csv";
  console.log(filename);

  // const blob = new Blob([csvContent], {
  //   type: "text/csv;charset=utf-8,",
  // });
  const objUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", objUrl);
  link.setAttribute("download", filename);
  link.click();
});

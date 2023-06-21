import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FileListComponent() {
  let [searchResult, setSearchResult] = useState(null);

  const API_URL = "http://localhost:8080" + "/api/file";

  const handleDownload = (e) => {
    console.log(e.target.id);
    const selectedItem = searchResult.filter(
      (item) => item._id === e.target.id
    )[0].data;
    console.log(selectedItem);

    let blob,
      csvContent = "";
    const filename = e.target.id + ".csv";
    const columns = Object.keys(selectedItem["0"]).length;
    const rows = selectedItem.length;
    console.log(columns, rows);

    selectedItem.forEach((row, index) => {
      if (index === 0) {
        csvContent += Object.keys(row).join("\t") + "\n";
      }
      csvContent += Object.values(row).join("\t") + "\n";
    });
    console.log(csvContent);

    blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8,",
    });

    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", objUrl);
    link.setAttribute("download", filename);
    link.click();
  };

  const handleDelete = (e) => {
    console.log(e.target.id);
    axios
      .delete(API_URL, { params: { _id: e.target.id } })
      .then((res) => {
        console.log(res.data);

        const newSearchResult = searchResult.filter(
          (item) => item._id !== e.target.id
        );
        setSearchResult(newSearchResult);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(API_URL)
      .then((data) => {
        // console.log(data.data);
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container d-flex flex-wrap align-items-center">
      {searchResult &&
        searchResult.length !== 0 &&
        searchResult.map((file) => (
          <div key={file._id} className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">{file.filename}</h5>
              <p className="card-text">File Size: {file.filesize}</p>
              <p className="card-text">Created Date: {file.created}</p>
              <p className="card-text">ID: {file._id}</p>
              <a
                href="#"
                onClick={handleDownload}
                className="card-text btn btn-primary"
                id={file._id}
              >
                Download
              </a>
              <a
                href="#"
                onClick={handleDelete}
                className="card-text btn btn-primary"
                id={file._id}
              >
                Delete
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}

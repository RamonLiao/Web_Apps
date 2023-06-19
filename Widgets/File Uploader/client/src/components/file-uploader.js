import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Fileuploader() {
  const status = {
    initial: 1,
    analysing: 2,
    analysed: 3,
    formatError: 4,
    uploading: 5,
    uploaded: 6,
    dbDisconnedted: 7,
  };

  const [fileInfo, setFileInfo] = useState(null);
  const [progress, setProgress] = useState(status.initial);
  // const [files, setFiles] = useState(null); // --> [enhancement point]
  const [message, setMessage] = useState("");

  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  const dropHandler = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0].type !== "text/csv") {
      setFileInfo(null);
      setMessage("Please choose a CSV file.");
      return;
    }
    setFileInfo(e.dataTransfer.files[0]);
    setMessage("");
  };

  const chooseHandler = (e) => {
    if (!e.target.files[0]) {
      setFileInfo(null);
      setMessage("");
      return;
    }
    if (e.target.files[0].type !== "text/csv") {
      setFileInfo(null);
      setMessage("Please choose a CSV file.");
      return;
    }
    setFileInfo(e.target.files[0]); // lastModified, lastModifiedDate, name, size, type, webkitRelativePath
    setMessage("");
  };

  const uploadHandler = (e) => {
    // // Check if a file is selected
    if (!fileInfo) {
      setMessage("No file selected.");
      setProgress(status.initial);
      return;
    }

    setProgress(status.analysing);

    // Parse csv data
    console.log(fileInfo);
    try {
      throw new Error("Format error");
      Papa.parse(fileInfo, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log(results.data);
          // const rowsArray = [];
          // const valuesArray = [];

          // // Iterating data to get column name and their values
          // results.data.map((d) => {
          //   rowsArray.push(Object.keys(d));
          //   valuesArray.push(Object.values(d));
          // });
          setProgress(status.analysed);
        },
      });
    } catch (err) {
      console.log(err);
      setMessage(err);
      setProgress(status.formatError);
    }
  };

  return (
    <>
      {/* Upload page */}
      {progress && progress === status.initial && (
        <div className="upload-group">
          <div className="upload-container">
            <div
              className="upload-box"
              onDragOver={dragOverHandler}
              onDrop={dropHandler}
            >
              {/* <div className="upload-file"></div> */}
              <img
                className="upload-icon"
                src="./images/icons-upload-96.png"
                alt="Upload-Icon"
              />
              <div className="upload-choose">
                <input
                  type="file"
                  id="upload-label"
                  name="upload-label"
                  onChange={chooseHandler}
                  accept=".csv"
                />
                <label for="upload-label">
                  <span>Choose a file</span> or drag it here!
                </label>
              </div>
              <div className="upload-info">{fileInfo && fileInfo.name}</div>
            </div>
            <h2 className="upload-desccription">
              Submit a file in tabular format (.CSV)
            </h2>

            <button
              className="upload-btn"
              type="submit"
              onClick={uploadHandler}
            >
              Upload
            </button>
            {message && <div className="alert alert-danger">{message}</div>}
          </div>
        </div>
      )}
      {/* Progress page */}
      {progress && progress !== status.initial && (
        <div className="progress-group">
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-bar-spinner"></div>
            </div>
            <div className="progress-description">
              {(() => {
                switch (progress) {
                  case status.analysing:
                    return <p>Analysing...</p>;
                  case status.analysed:
                    return <p>Analysed!</p>;
                  case status.formatError:
                    return <p>Analysis Failed!</p>;
                  // () => {
                  //   <p>Analysis Failed!</p>;
                  //   {
                  //     message && (
                  //       <div className="alert alert-danger">{message}</div>
                  //     );
                  //   }
                  // };
                  case status.uploading:
                    return (
                      <p>
                        Uploading<span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </p>
                    );
                  case status.uploaded:
                    return <p>Uploaded</p>;
                  case status.dbDisconnedted:
                    return (() => {
                      <p>Upload Failed!</p>;
                      {
                        message && (
                          <div className="alert alert-danger">{message}</div>
                        );
                      }
                    })();
                  default:
                    return;
                }
              })()}
            </div>
            <div className="progress-status">
              {() => {
                switch (progress) {
                  case status.analysing || status.analysed || status.uploading:
                    return (
                      <div className="progress-counter">
                        <p>Estimated Time to complete:</p>
                        <p></p>
                      </div>
                    );
                  case status.formatError || status.dbDisconnedted:
                    return (
                      <div className="progress-error">
                        {/* Error message */}
                        {message && (
                          <div className="alert alert-danger">{message}</div>
                        )}
                      </div>
                    );
                  default:
                    return;
                }
              }}
            </div>
            <div className="progress-link">
              {() => {
                switch (progress) {
                  case status.uploaded:
                    return (
                      <p>
                        Would you like to upload a new file?
                        <span>Back to upload page</span>
                      </p>
                    );
                  case status.formatError || status.dbDisconnedted:
                    return (
                      <p>
                        <span>Back to upload page</span>
                      </p>
                    );
                  default:
                    return;
                }
              }}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

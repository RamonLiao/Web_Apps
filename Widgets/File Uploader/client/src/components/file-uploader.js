import React, { useState, useEffect } from "react";

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
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");

  const dragOverHandler = (e) => {
    e.preventDefault();
  };
  const dropHandler = (e) => {
    e.preventDefault();
    setFileInfo(e.dataTransfer.files[0]);
    setFiles(e.dataTransfer.files);
  };
  const chooseHandler = (e) => {
    setFileInfo(e.target.files[0]); // lastModified, lastModifiedDate, name, size, type, webkitRelativePath
    setFiles(e.target.files);
  };
  const uploadHandler = (e) => {
    setProgress(status.analysing);
    // Check if a file is selected

    if (!files) {
      setMessage("No file selected.");
      setProgress(status.initial);
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    console.log(progress);
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
            {message && <div className="alert alert-danger">{message}</div>}
            <button
              className="upload-btn"
              type="submit"
              onClick={uploadHandler}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      {/* Progress page */}
      {progress && progress !== status.initial && (
        <div className="progress-group">
          <div className="progress-container">
            <div className="progress-bar"></div>
            <div className="progress-description">
              {(() => {
                switch (progress) {
                  case status.analysing:
                    return <p>Analysing...</p>;
                  case status.analysed:
                    return <p>Analysed!</p>;
                  case status.formatError:
                    return (() => {
                      <p>Analysis Failed!</p>;
                      {
                        message && (
                          <div className="alert alert-danger">{message}</div>
                        );
                      }
                    })();
                  case status.uploading:
                    return <p>Uploading...</p>;
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

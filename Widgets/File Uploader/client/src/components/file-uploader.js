import React, { useState, useEffect } from "react";

export default function Fileuploader() {
  const status = {
    initial: 0,
    analysing: 1,
    analysed: 2,
    formatError: 3,
    uploading: 4,
    uploaded: 5,
    dbDisconnedted: 6,
  };

  let progress = status.analysing;
  console.log(progress);

  return (
    <>
      {/* Upload page */}
      {progress && progress === status.initial && (
        <div className="upload-group">
          <div className="upload-container">
            <div className="upload-box">
              <div className="upload-file"></div>
              <img
                className="upload-icon"
                src="./images/icons-upload-96.png"
                alt="Upload-Icon"
              />
              <p>
                <span>Choose a file</span> or drag it here!
              </p>
            </div>
            <h2 className="upload-desccription">
              Submit a file in tabular format (.CSV)
            </h2>
            <button className="upload-btn" type="submit">
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
              {() => {
                switch (progress) {
                  case status.analysing:
                    return <p>Analysing...</p>;
                  case status.analysed:
                    return <p>Analysed!</p>;
                  case status.formatError:
                    return <p>Analysis Failed!</p>;
                  case status.uploading:
                    return <p>Uploading...</p>;
                  case status.uploaded:
                    return <p>Uploaded</p>;
                  case status.dbDisconnedted:
                    return <p>Upload Failed!</p>;
                  default:
                    return;
                }
              }}
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
                      </div>
                    );
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
                }
              }}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BsArrowRightShort, BsCloudUploadFill } from "react-icons/bs";

export default function Fileuploader() {
  let uploadProgress = 0;
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
  const [timeLeft, setTimeLeft] = useState(0);

  const timeConverter = (difference) => {
    let timeObj = {};

    if (difference > 0) {
      timeObj = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else if (difference <= 0) {
      timeObj = {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    return timeObj;
  };
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
      // throw new Error("File format is incorrect!");
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
          // setProgress(status.analysed);

          // axios api

          // Calculate Time Left: (file size / internet upload speed)
          setTimeLeft(new Date("2023-06-19T23:09:00") - new Date());

          // Render Uploading Page
          setProgress(status.uploading);
        },
      });
    } catch (err) {
      console.log(err.message);
      setMessage(err.message);
      setProgress(status.formatError);
    }
  };

  const renderProgressBar = () => {
    console.log(progress);
    if (progress === status.analysing) {
      return <div className="progress-bar-spinner"></div>;
    } else {
      return (
        <div className="progress-bar-indicator">
          <div
            className="progress-bar-indicator-content"
            style={{ width: uploadProgress + "%" }}
          >
            {uploadProgress}%
          </div>
        </div>
      );
    }
  };

  const renderProgressDescription = () => {
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
        return <p>Uploaded!</p>;
      case status.dbDisconnedted:
        return <p>Upload Failed!</p>;
      default:
        return;
    }
  };

  const renderProgressStatus = () => {
    let timeObj = timeConverter(timeLeft);
    // console.log(timeLeft);
    // console.log(timeObj);
    if (
      [status.analysing, status.analysed, status.uploading].includes(progress)
    ) {
      return (
        <div className="progress-counter">
          <p>Estimated Time to complete:</p>
          <div className="progress-counter-timer">
            {timeObj.minutes} : {timeObj.seconds}
          </div>
        </div>
      );
    } else if ([status.formatError, status.dbDisconnedted].includes(progress)) {
      return (
        <div className="progress-error">
          {/* Error message  */}
          <div className="alert alert-danger text-center">{message}</div>
          {progress === status.formatError && (
            <div className="progress-error-descript">
              Please submit a new file in tabular format (.CSV)
            </div>
          )}
        </div>
      );
    }
  };

  const renderProgressLink = () => {
    switch (progress) {
      case status.uploaded:
        return (
          <p>
            Would you like to upload a new file?
            <br />
            <span onClick={renderUploadPage}>
              <BsArrowRightShort /> Back to upload page
            </span>
          </p>
        );
      case status.formatError:
      case status.dbDisconnedted:
        return (
          <p>
            <span onClick={renderUploadPage}>
              <BsArrowRightShort /> Back to upload page
            </span>
          </p>
        );
      default:
        return;
    }
  };

  const renderUploadPage = () => {
    setMessage("");
    setFileInfo(null);
    setProgress(status.initial);
    return;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1000);
    }, 1000);

    if (timeLeft <= 0) {
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [timeLeft]);

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
              {/* <img
                className="upload-icon"
                src="./images/icons-upload-96.png"
                alt="Upload-Icon"
              /> */}
              <BsCloudUploadFill
                className="upload-icon"
                style={{ width: "80px", height: "80px" }}
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
            <div className="progress-bar">{renderProgressBar()}</div>
            <div className="progress-description">
              {renderProgressDescription()}
            </div>
            <div className="progress-status">{renderProgressStatus()}</div>
            <div className="progress-link">{renderProgressLink()}</div>
          </div>
        </div>
      )}
    </>
  );
}

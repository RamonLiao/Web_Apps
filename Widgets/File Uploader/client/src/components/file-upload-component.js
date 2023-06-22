import React, { useState, useEffect } from "react";
import { BsArrowRightShort, BsCloudUploadFill } from "react-icons/bs";
import { measureUploadSpeed } from "./testSpeed-component";
import Papa from "papaparse";
import axios from "axios";

export default function Fileuploader() {
  const status = {
    initial: 1,
    analysing: 2,
    analysed: 3,
    formatError: 4,
    uploading: 5,
    uploaded: 6,
    uploadError: 7,
  };

  const [progress, setProgress] = useState(status.initial);
  const [fileInfo, setFileInfo] = useState(null);
  // const [files, setFiles] = useState(null); // --> [enhancement point]
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    // console.log("dropHandler");
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
    // console.log("chooseHandler");
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
    // console.log("uploadHandler");

    // Check if a file is selected
    if (!fileInfo) {
      setMessage("No file selected.");
      setProgress(status.initial);
      return;
    }

    setProgress(status.analysing);

    console.log(fileInfo);
  };

  const renderUploadPage = () => {
    // console.log("renderUploadPage");
    setMessage("");
    setFileInfo(null);
    setProgress(status.initial);
    // setTimeLeft(0);
    setParsedData(null);
    // setUploadProgress(0);
    return;
  };

  const renderProgressBar = () => {
    // console.log("renderProgressBar");

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
    // console.log("renderProgressDescription");
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
      case status.uploadError:
        return <p>Upload Failed!</p>;
      default:
        return;
    }
  };

  const renderProgressStatus = () => {
    // console.log("renderProgressStatus");
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
    } else if ([status.formatError, status.uploadError].includes(progress)) {
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
    // console.log("renderProgressLink");
    switch (progress) {
      case status.uploaded:
        return (
          <>
            <p>
              Would you like to upload a new file?{" "}
              <span onClick={renderUploadPage}>Back to upload page</span>
            </p>
            <div className="progress-link-fireworks">
              <img src="./images/fireworks.png" alt="" id="fireworks1" />
              <img src="./images/fireworks1.png" alt="" id="fireworks2" />
              <img src="./images/fireworks2.png" alt="" id="fireworks3" />
            </div>
          </>
        );
      case status.formatError:
      case status.uploadError:
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

  useEffect(() => {
    if (progress === status.analysing) {
      // Test Upload Speed
      let uploadSpeed = 0;
      const uploadSizeInBytes = 10 * 1024 * 1024; // Example upload size: 10 MB

      const testSpeed = measureUploadSpeed(
        uploadSizeInBytes,
        function (uploadSpeedInMbps, uploadSpeedInBytes, response) {
          console.log("Upload Speed:", uploadSpeedInMbps.toFixed(2), "Mbps");
          console.log("Upload Speed:", uploadSpeedInBytes.toFixed(2), "bps");
          uploadSpeed = uploadSpeedInBytes;

          const API_URL = "http://localhost:8080/api/file";
          axios
            .delete(API_URL, { params: { _id: response._id } })
            .then((res) => {
              console.log("Test file deleted: ");
            })
            .catch((err) => {
              console.log(err.response.data); // message from back-end server
            });

          setTimeLeft(fileInfo.size / uploadSpeed);
        }
      );
    }

    // Set up countdown timer
    if (progress === status.uploading) {
      const timer = setTimeout(() => {
        setTimeLeft((time) => time - 1000);
      }, 1000);

      if (timeLeft <= 0) {
        return clearTimeout(timer);
      }

      return () => {
        clearTimeout(timer);
      };
    }
  }, [progress, timeLeft]);

  useEffect(() => {
    // let startToUpload = false;

    if (progress === status.analysing) {
      // -------- Papa.parse(): upload and parse data ---------
      try {
        // throw new Error("File format is incorrect!"); //for testing
        Papa.parse(fileInfo, {
          header: true,
          skipEmptyLines: true,
          // delimiter: "\t",
          complete: function (results) {
            console.log("This is parsed data: ", results.data);

            // Prepare parsed data for later upload
            setParsedData(results.data);

            // Calculate Time Left: (file size / internet upload speed)
            // console.log("--> Execute setTimeLeft");
            // setTimeLeft(fileInfo.size / uploadSpeed);
            // console.log("===> ", timeLeft);

            // Render Uploading Page
            setProgress(status.uploading);
          },
        });
      } catch (err) {
        console.log(err.message);
        setMessage(err.message);
        setProgress(status.formatError);
      }
    }

    if (progress === status.uploading) {
      // upload to db server
      const API_URL = "http://localhost:8080/api/file";
      const config = {
        headers: {
          // "Access-Control-Allow-Origin": "*",
          // "Content-Type": "application/json",
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          console.log(
            `${progressEvent.loaded} KB of total ${progressEvent.total} | ${percentCompleted}%`
          );
        },
      };
      const body = {
        filename: fileInfo.name,
        filesize: fileInfo.size, // chunked size
        created: new Date(),
        data: parsedData,
      };
      console.log(">>> This is API body: ", body);

      axios
        .post(API_URL, body, config)
        .then((res) => {
          console.log("Uploaded: ", res);
          setProgress(status.uploaded);
        })
        .catch((err) => {
          console.log(err.response.data); // message from back-end server
          setMessage(err.message); // Axios message
          setProgress(status.uploadError);
        });
    }
  }, [progress]);

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
                  // accept=".csv"
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
      {console.log("Current phase: ", progress)}
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

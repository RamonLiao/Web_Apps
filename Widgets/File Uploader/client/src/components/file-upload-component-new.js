import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BsArrowRightShort, BsCloudUploadFill } from "react-icons/bs";
import axios from "axios";
import { measureUploadSpeed } from "./testSpeed-component";

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

  const [state, setState] = useState({
    currentState: status.initial,
    fileInfo: null,
    message: "",
    timeLeft: 0,
    parsedData: null,
    percentCompleted: 0,
  });
  // const [progress, setProgress] = useState(status.initial);
  // const [fileInfo, setFileInfo] = useState(null);
  // // const [files, setFiles] = useState(null); // --> [enhancement point]
  // const [message, setMessage] = useState("");
  // const [timeLeft, setTimeLeft] = useState(0);
  // const [parsedData, setParsedData] = useState(null);
  // const [uploadProgress, setUploadProgress] = useState(0);

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
      // setFileInfo(null);
      // setMessage("Please choose a CSV file.");
      setState({
        ...state,
        fileInfo: null,
        message: "Please choose a CSV file.",
      });
      return;
    }
    setState({
      ...state,
      fileInfo: e.dataTransfer.files[0],
      message: "",
    });
    // setFileInfo(e.dataTransfer.files[0]);
    // setMessage("");
  };

  const chooseHandler = (e) => {
    if (!e.target.files[0]) {
      // setFileInfo(null);
      // setMessage("");
      setState({
        ...state,
        fileInfo: null,
        message: "",
      });
      return;
    }
    if (e.target.files[0].type !== "text/csv") {
      // setFileInfo(null);
      // setMessage("Please choose a CSV file.");
      setState({
        ...state,
        fileInfo: null,
        message: "Please choose a CSV file.",
      });
      return;
    }
    // setFileInfo(e.target.files[0]); // lastModified, lastModifiedDate, name, size, type, webkitRelativePath
    // setMessage("");
    setState({
      ...state,
      fileInfo: e.target.files[0],
      message: "",
    });
  };

  const uploadHandler = (e) => {
    console.log("uploadHandler");
    // Check if a file is selected
    if (!state["fileInfo"]) {
      // setMessage("No file selected.");
      // setProgress(status.initial);
      setState({
        ...state,
        currentState: status.initial,
        message: "No file selected.",
      });
      return;
    }

    // setProgress(status.analysing);
    setState({
      ...state,
      currentState: status.analysing,
    });

    console.log(state["fileInfo"]);

    // Test Upload Speed
    let uploadSpeed = 0;
    const uploadSizeInBytes = 10 * 1024 * 1024; // Example upload size: 10 MB

    measureUploadSpeed(
      uploadSizeInBytes,
      function (uploadSpeedInMbps, uploadSpeedInBytes) {
        console.log("Upload Speed:", uploadSpeedInMbps.toFixed(2), "Mbps");
        console.log("Upload Speed:", uploadSpeedInBytes.toFixed(2), "bps");
        uploadSpeed = uploadSpeedInBytes;
      }
    );

    // -------- Method 1: upload csv file & parse data ---------
    // throw new Error("File format is incorrect!"); //for testing
    // function uploadCSVFile(file) {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();

    //     reader.onload = function (event) {
    //       const fileContent = event.target.result;
    //       console.log("complete reading");
    //       resolve(fileContent);
    //     };

    //     reader.onerror = function (event) {
    //       reject(event.target.error);
    //     };

    //     reader.readAsBinaryString(file);
    //   });
    // }

    // async function parseCSVData() {
    //   try {
    //     const csvContent = await uploadCSVFile(fileInfo);
    //     console.log(csvContent);

    //     const rows = csvContent.split("\n");
    //     const dataArray = [];

    //     rows.forEach((row) => {
    //       const columns = row.split("\t");
    //       dataArray.push(columns);
    //     });

    //     console.log(dataArray);
    //     // Prepare parsed data for later upload
    //     setParsedData(dataArray);

    //     // Calculate Time Left: (file size / internet upload speed)
    //     setTimeLeft(new Date("2023-06-19T23:09:00") - new Date());

    //     // Render Uploading Page
    //     setProgress(status.uploading);
    //   } catch (err) {
    //     console.log(err.message);
    //     setMessage(err.message);
    //     setProgress(status.formatError);
    //   }
    // }
    // parseCSVData();

    // -------- Method 2: Papa.parse(): upload and parse data ---------
    try {
      // throw new Error("File format is incorrect!"); //for testing
      Papa.parse(state["fileInfo"], {
        header: true,
        skipEmptyLines: true,
        // delimiter: "\t",
        complete: function (results) {
          console.log(results.data);

          // // Prepare parsed data for later upload
          // setParsedData(results.data);

          // // Calculate Time Left: (file size / internet upload speed)
          // // console.log(fileInfo.size, fileInfo.size / uploadSpeed);
          // setTimeLeft(fileInfo.size / uploadSpeed);

          // // Render Uploading Page
          // setProgress(status.uploading);
          setState({
            ...state,
            parsedData: results.data,
            timeLeft: state["fileInfo"].size / uploadSpeed,
            currentState: status.uploading,
          });
        },
      });
    } catch (err) {
      console.log(err.message);
      // setMessage(err.message);
      // setProgress(status.formatError);
      setState({
        ...state,
        message: err.message,
        currentState: status.formatError,
      });
    }
  };

  const renderUploadPage = () => {
    console.log("renderUploadPage");
    setState({
      ...state,
      message: "",
      fileInfo: null,
      currentState: status.initial,
      parsedData: null,
    });
    // setMessage("");
    // setFileInfo(null);
    // setProgress(status.initial);
    // // setTimeLeft(0);
    // setParsedData(null);
    // // setUploadProgress(0);
    return;
  };

  const renderProgressBar = () => {
    console.log("renderProgressBar");
    if (state["currentState"] === status.uploading) {
      // upload to db server
      const API_URL = "http://localhost:8080" + "/api/file";
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // setUploadProgress(percentCompleted);
          setState({
            ...state,
            percentCompleted: percentCompleted,
          });
          console.log(
            `${progressEvent.loaded} KB of total ${progressEvent.total} | ${percentCompleted}%`
          );
        },
      };
      const body = {
        filename: state["fileInfo"].name,
        filesize: state["fileInfo"].size, // chunked size
        created: new Date(),
        data: state["parsedData"],
      };
      console.log(body);

      axios
        .post(API_URL, body, config)
        // .get(API_URL)
        .then((res) => {
          console.log(res);
          // setProgress(status.uploaded);
          setState({
            ...state,
            currentState: status.uploaded,
          });
        })
        .catch((err) => {
          console.log(err);
          // setMessage(err.message);
          // setProgress(status.uploadError);
          setState({
            ...state,
            message: err.message,
            currentState: status.uploadError,
          });
        });
    }

    if (state["currentState"] === status.analysing) {
      return <div className="progress-bar-spinner"></div>;
    } else {
      return (
        <div className="progress-bar-indicator">
          <div
            className="progress-bar-indicator-content"
            style={{ width: state["percentCompleted"] + "%" }}
          >
            {state["percentCompleted"]}%
          </div>
        </div>
      );
    }
  };

  const renderProgressDescription = () => {
    console.log("renderProgressBar");
    switch (state["currentState"]) {
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
    console.log("renderProgressBar");
    let timeObj = timeConverter(state["timeLeft"]);
    // console.log(timeLeft);
    // console.log(timeObj);
    if (
      [status.analysing, status.analysed, status.uploading].includes(
        state["currentState"]
      )
    ) {
      return (
        <div className="progress-counter">
          <p>Estimated Time to complete:</p>
          <div className="progress-counter-timer">
            {timeObj.minutes} : {timeObj.seconds}
          </div>
        </div>
      );
    } else if (
      [status.formatError, status.uploadError].includes(state["currentState"])
    ) {
      return (
        <div className="progress-error">
          {/* Error message  */}
          <div className="alert alert-danger text-center">
            {state["message"]}
          </div>
          {state["currentState"] === status.formatError && (
            <div className="progress-error-descript">
              Please submit a new file in tabular format (.CSV)
            </div>
          )}
        </div>
      );
    }
  };

  const renderProgressLink = () => {
    console.log("renderProgressBar");
    switch (state["currentState"]) {
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
    console.log("time left counter");
    const timer = setTimeout(() => {
      // setTimeLeft(timeLeft - 1000);
      setState({ ...state, timeLeft: (time) => time - 1000 });
    }, 1000);

    if (state["timeLeft"] <= 0) {
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [state["timeLeft"]]);

  return (
    <>
      {/* Upload page */}
      {state["currentState"] && state["currentState"] === status.initial && (
        <div className="upload-group">
          <div className="upload-container">
            <div
              className="upload-box"
              onDragOver={dragOverHandler}
              onDrop={dropHandler}
            >
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
                  // accept=".csv"
                />
                <label for="upload-label">
                  <span>Choose a file</span> or drag it here!
                </label>
              </div>
              <div className="upload-info">
                {state["fileInfo"] && state["fileInfo"].name}
              </div>
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
            {state["message"] && (
              <div className="alert alert-danger">{state["message"]}</div>
            )}
          </div>
        </div>
      )}
      {/* Progress page */}
      {state["currentState"] && state["currentState"] !== status.initial && (
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

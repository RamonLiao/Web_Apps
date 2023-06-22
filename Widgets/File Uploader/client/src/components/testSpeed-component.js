export function measureUploadSpeed(uploadSizeInBytes, callback) {
  const xhr = new XMLHttpRequest();
  const uploadUrl = "http://localhost:8080/api/file"; // Replace with your actual upload URL
  const testData = new Uint8Array(uploadSizeInBytes);

  // Generate test data with random values
  for (let i = 0; i < uploadSizeInBytes; i++) {
    testData[i] = Math.floor(Math.random() * 256);
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const uploadSpeedInMbps =
        (uploadSizeInBytes * 8) / (durationInSeconds * 1024 * 1024);
      const uploadSpeedInBytes = (uploadSizeInBytes * 8) / durationInSeconds;

      callback(uploadSpeedInMbps, uploadSpeedInBytes, JSON.parse(xhr.response));
    }
  };

  xhr.open("POST", uploadUrl, true);
  const startTime = performance.now();
  xhr.send(testData);
}

// const uploadSizeInBytes = 10 * 1024 * 1024; // Example upload size: 10 MB

// measureUploadSpeed(uploadSizeInBytes, function (uploadSpeedInMbps) {
//   console.log("Upload Speed:", uploadSpeedInMbps.toFixed(2), "Mbps");
// });

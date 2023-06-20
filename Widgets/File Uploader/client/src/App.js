import "./styles/index.css";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FileListComponent from "./components/file-list-component";
import FileUploadComponent from "./components/file-upload-component";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<FileUploadComponent />}></Route>
        <Route path="/list" element={<FileListComponent />} />
        <Route path="/*" element={<Navigate to="/" />}></Route>
      </Routes>
    </div>
  );
}

export default App;

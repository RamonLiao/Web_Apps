import "./styles/index.css";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FileUploadComponent from "./components/file-upload-component";
import FileListComponent from "./components/file-list-component";

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

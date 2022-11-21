import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const [loader, setLoader] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.readAsText(acceptedFiles[0]);
    reader.onload = (event) => {
      setLoader(true);
      const formData = new FormData();
      formData.append("data", event.target.result);

      axios
        .post("http://localhost:5000/home", formData)
        .then((res) => {
          const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(res.data)
          )}`;
          const link = document.createElement("a");
          link.href = jsonString;
          link.download = "log.json";

          link.click();
          setLoader(false);
        })
        .catch((err) => {
          alert(err);
          setLoader(false);
        });
      console.log(formData.get("data"));
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="main">
      <div className="content">
        Select log files of valid formats to convert into readable JSON format.
        {loader && (
          <span style={{ marginLeft: "10px", color: "red" }}>
            Loading...
            <i class="fa fa-spinner fa-spin" style={{ marginLeft: "10px" }}></i>
          </span>
        )}
      </div>
      <div {...getRootProps()} className="block">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="interact">Drop the log file here ...</p>
        ) : (
          <p className="interact">
            Drag 'n' drop log files here, or click to select a file
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

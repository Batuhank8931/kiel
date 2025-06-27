import React, { useState } from 'react';
import rapor from "../assets/rapor.png";
import print from "../assets/print.png";
import save from "../assets/save.png";
import API from "../utils/utilRequest";

const UploadImages = () => {
  const [file, setFile] = useState(null);

  const sendoutput = async () => {
    try {
      const response = await API.ResetInputTable();
      alert(response.data.message);
    } catch (error) {
      console.error("Error fetching warrant:", error);
    }
  };

  const resetinput = async () => {
    try {
      const response = await API.InsertOutputTable();
      alert(response.data.message);
    } catch (error) {
      console.error("Error fetching warrant:", error);
    }
  };

  // New function: handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // New function: upload selected file
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Adjust API.uploadFile to your actual upload function
      const response = await API.uploadFile(formData);
      alert(response.data.message || "File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed.");
    }
  };

  return (
    <div className="">
      <div className="d-flex text-white fs-3 align-items-center justify-content-center" style={{ backgroundColor: '#004081' }}>
        ADD IMAGE
      </div>

      <div className="d-flex flex-grow-1">
        <div className="col-12 border">
          <div className="d-flex justify-content-between p-1">
            <div className="px-4 d-flex justify-content-center align-items-center">
              <button className="btn hover-effect ms-4" onClick={sendoutput}>
                <img src={rapor} alt="rapor" className="img-fluid" style={{ height: '4rem' }} />
              </button>
            </div>

            <div className="fs-4 d-flex justify-content-center align-items-center"> Daily Report </div>

            <div className="d-flex columns">
              <button className="btn hover-effect me-4" onClick={resetinput}>
                <img src={save} alt="save" className="img-fluid" style={{ height: '4rem' }} />
              </button>
            </div>
          </div>

          {/* New file input section */}
          <div className="p-3">
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .mp4, .pdf"
              onChange={handleFileChange}
            />
            <button className="btn btn-primary ms-2" onClick={uploadFile}>
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImages;

import React, { useState, useEffect, useRef } from "react";
import API from "../utils/utilRequest";

const StationMedia = ({ id }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileUrlRef = useRef(null);

  const fetchStationMedia = async () => {
    try {
      const response = await API.GetstationPicture(id); // API'den blob al
      if (response && response.data) {
        const blob = response.data;
        const url = URL.createObjectURL(blob);

        // Blob tipinden dosya uzantısını tahmin et
        let type = null;
        if (blob.type.includes("image/")) type = blob.type.split("/")[1]; // png, jpg, jpeg
        else if (blob.type === "video/mp4") type = "mp4";
        else if (blob.type === "application/pdf") type = "pdf";

        // Sadece değişirse state güncelle
        if (url !== fileUrlRef.current) {
          setFileUrl(url);
          setFileType(type);
          setLoading(false);
          fileUrlRef.current = url;
        }
      } else {
        setFileUrl(null);
        setFileType(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching station media:", error);
      setFileUrl(null);
      setFileType(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStationMedia();
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStationMedia();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) return <div>Loading media...</div>;
  if (!fileUrl) return <div>No media found for ID {id}</div>;

  // Render based on file type
  if (["png", "jpg", "jpeg"].includes(fileType)) {
    return (
      <img
        src={fileUrl}
        alt={`Station media ${id}`}
        style={{ width: "80%", height: "80%", objectFit: "fill" }}
      />
    );
  } else if (fileType === "mp4") {
    return (
      <video
        controls
        autoPlay
        muted
        loop
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      >
        <source src={fileUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (fileType === "pdf") {
    return <embed src={fileUrl} type="application/pdf" width="80%" height="80%" />;
  } else {
    return <div>Unsupported media type</div>;
  }
};

export default StationMedia;

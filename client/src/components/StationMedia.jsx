import React, { useState, useEffect, useRef } from 'react';

const supportedExtensions = ['png', 'jpg', 'jpeg', 'mp4', 'pdf'];

const StationMedia = ({ id }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep track of current base filename (without cache busting)
  const currentBaseFileNameRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const checkFileExists = async (url, ext) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });

        const contentType = res.headers.get("Content-Type");

        if (res.ok && contentType && !contentType.includes("text/html")) {
          return true;
        }
        return false;
      } catch (err) {
        console.error(`Fetch failed for .${ext}: ${url}`, err);
        return false;
      }
    };

    const findFile = async () => {
      for (const ext of supportedExtensions) {
        const baseUrl = `/assets/stationpictures/${id}.${ext}`;
        const testUrl = `${baseUrl}?t=${Date.now()}`;
        const exists = await checkFileExists(testUrl, ext);
        if (exists) {
          if (isMounted) {
            setFileUrl(testUrl);
            setFileType(ext);
            setLoading(false);
            currentBaseFileNameRef.current = baseUrl;  // save base filename here
          }
          return;
        }
      }
      if (isMounted) {
        console.warn(`No media found for ID ${id}`);
        setFileUrl(null);
        setFileType(null);
        setLoading(false);
        currentBaseFileNameRef.current = null;
      }
    };

    setLoading(true);
    findFile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // New useEffect with setInterval to check every 5 seconds if file changed
  useEffect(() => {
    const intervalId = setInterval(() => {
      (async () => {
        for (const ext of supportedExtensions) {
          const baseUrl = `/assets/stationpictures/${id}.${ext}`;

          if (baseUrl !== currentBaseFileNameRef.current) {
            // Different filename: check normally
            const testUrl = `${baseUrl}?t=${Date.now()}`;
            try {
              const res = await fetch(testUrl, { method: 'HEAD' });
              const contentType = res.headers.get("Content-Type");
              const lastModified = res.headers.get("Last-Modified");
              if (res.ok && contentType && !contentType.includes("text/html")) {
                setFileUrl(testUrl);
                setFileType(ext);
                setLoading(false);
                currentBaseFileNameRef.current = baseUrl;
                lastModifiedRef.current = lastModified;
                return; // exit loop early if found
              }
            } catch {
              // ignore fetch errors
            }
          } else {
            // Same baseUrl - check if the file's lastModified changed
            try {
              const res = await fetch(baseUrl, { method: 'HEAD' });
              if (res.ok) {
                const lastModified = res.headers.get("Last-Modified");
                if (lastModified !== lastModifiedRef.current) {
                  // File has changed, reload with new timestamp query param
                  const testUrl = `${baseUrl}?t=${Date.now()}`;
                  setFileUrl(testUrl);
                  setFileType(ext);
                  setLoading(false);
                  lastModifiedRef.current = lastModified;
                  return;
                }
              }
            } catch {
              // ignore errors
            }
          }
        }
      })();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id]);


  if (loading) return <div>Loading media...</div>;
  if (!fileUrl) return <div>No media found for ID {id}</div>;

  if (['png', 'jpg', 'jpeg'].includes(fileType)) {
    return (
      <img
        src={fileUrl}
        alt={`Station media ${id}`}
        style={{
          width: '80%',
          height: '80%',
          objectFit: 'fill',
        }}
      />
    );
  } else if (fileType === 'mp4') {
    return (
      <video
        controls
        autoPlay
        muted
        loop
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      >
        <source src={fileUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (fileType === 'pdf') {
    return (
      <embed
        src={fileUrl}
        type="application/pdf"
        width="80%"
        height="80%"
      />
    );
  } else {
    return <div>Unsupported media type</div>;
  }
};

export default StationMedia;

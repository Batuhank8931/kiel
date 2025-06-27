const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Destination path (adjust as needed)
const uploadDir = path.join(__dirname, "../../client/public/assets/stationpictures");

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types for the files
const allowedMimeTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "video/mp4",
  "application/pdf",
];

// Helper to get extension from mimetype
const getExtension = (mimetype) => {
  switch (mimetype) {
    case "image/png":
      return "png";
    case "image/jpg":
    case "image/jpeg":
      return "jpg";
    case "video/mp4":
      return "mp4";
    case "application/pdf":
      return "pdf";
    default:
      return "";
  }
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const id = req.params.id;
    const newExt = getExtension(file.mimetype);
    if (!newExt) {
      return cb(new Error("Unsupported file type"));
    }

    // Before saving, delete any existing file with the same base name but different extension
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        // Ignore error but log it
        console.error("Error reading upload directory:", err);
        return cb(null, `${id}.${newExt}`);
      }

      // Find files that start with the id but are NOT the new extension
      const filesToDelete = files.filter((filename) => {
        const parsed = path.parse(filename);
        return parsed.name === id && parsed.ext !== `.${newExt}`;
      });

      // Delete them asynchronously, but don't wait for completion (optional: can wait if you want)
      filesToDelete.forEach((filename) => {
        fs.unlink(path.join(uploadDir, filename), (err) => {
          if (err) {
            console.error(`Failed to delete old file ${filename}:`, err);
          } else {

          }
        });
      });

      // Proceed with saving the new file
      cb(null, `${id}.${newExt}`);
    });
  },
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, JPEG, MP4, and PDF files are allowed"));
    }
  },
}).single("image"); // 'image' matches your FormData key

const GetStationObject = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Return the saved filename with the correct extension
    const ext = getExtension(req.file.mimetype);
    const filename = `${req.params.id}.${ext}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      filename,
    });
  });
};

module.exports = GetStationObject;

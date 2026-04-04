import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

function checkFileType(file, cb) {
  const extname = /jpg|jpeg|png/.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = /image\/(jpeg|jpg|png)/.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpg, jpeg, png)!"));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 🔥 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
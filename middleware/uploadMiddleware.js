import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// 🔐 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ☁️ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "school_posts", // folder in cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // resize
        { quality: "auto" }, // optimize quality
      ],
    };
  },
});

// 📤 Upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
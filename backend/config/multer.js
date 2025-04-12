import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images",
    format: async (req, file) => "png",
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const upload = multer({ storage: storage });

export default upload;

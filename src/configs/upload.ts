import multer from "multer";
import path from "path";
import crypto from "crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MAX_SIZE = 3;
const MAX_FILE_SIZE = MAX_SIZE * 1024 * 1024; // 3MB
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename: (req, file, cb) => {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MAX_FILE_SIZE,
  ACCEPTED_MIME_TYPES,
  MULTER,
  MAX_SIZE,
};

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorageEngine });

export default upload;

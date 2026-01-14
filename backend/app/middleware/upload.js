import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.uploadType === 'image') {
            cb(null, './uploads/images'); //forse da cambiare
        } else {
            cb(null, './uploads/attachments');
        }
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + ext);
    }
});

const upload = multer({ storage });

export default upload;

export const uploadSingleImage = (req, res, next) => {
    req.uploadType = 'image';
    upload.single('img')(req, res, next);
};

export const uploadAttachments = (req, res, next) => {
    req.uploadType = 'attachments';
    upload.array('attachments', 10)(req, res, next);
};
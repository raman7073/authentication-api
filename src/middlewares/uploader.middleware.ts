import multer, { memoryStorage } from 'multer';

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];

//         cb(null, `user-${(req.user as { id: string }).id}-${Date.now()}.${ext}`);
//     }
// });
const multerStorage = memoryStorage();

const multerFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
export default upload;

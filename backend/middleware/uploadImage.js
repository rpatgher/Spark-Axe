//this code is for file storage it uses multer for uploads with node js remy eres un egnio
import multer from "multer";
import shortid from "shortid";
import slug from "slug";

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/uploads/elements');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            const name = slug(`${req.body.name} ${shortid.generate()}`);
            cb(null, `${name}.${extension}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }else{
            cb(new Error('Invalid Format'), false);
        }
    }
}).single('image');

// Upload Imagen with multer
const uploadImage = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            res.status(401).json({ msg: error.message });
        }else{
            next();
        }
    });
}

export default uploadImage;
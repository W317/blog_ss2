import multer from "multer"

const Storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, 'public/img')
  },
  filename : (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: Storage
}).single('image')

export default upload;

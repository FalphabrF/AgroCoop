import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/veiculos')
  },

  filename: (req, file, cb) => {
    const id = crypto.randomBytes(6).toString('hex')
    const ext = path.extname(file.originalname)
    cb(null, `${id}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

export default upload

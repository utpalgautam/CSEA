const express = require('express');
const multer = require('multer');
const { uploadFile, verifyFile, downloadFile } = require('../controllers/fileController');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), uploadFile);
router.post('/verify/:fileId', verifyFile);
router.get('/download/:fileId', downloadFile);

module.exports = router;
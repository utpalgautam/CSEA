const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const File = require('../models/file');
const config = require('../config');

const upload = multer();

function encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.encryptionKey), Buffer.alloc(16, 0));
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
}

function decryptData(data) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.encryptionKey), Buffer.alloc(16, 0));
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

function generateIntegrityHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const uploadFile = async (req, res) => {
    try {
        const { filename, expiry, maxDownloads, password } = req.body.metadata;
        const fileBuffer = req.file.buffer;
        const encryptedData = encryptData(fileBuffer);
        const integrityHash = generateIntegrityHash(fileBuffer);
        const passwordHash = password ? await bcrypt.hash(password, 10) : null;

        const file = new File({
            filename,
            encryptedData,
            expiry: new Date(Date.now() + parseExpiry(expiry)),
            maxDownloads,
            passwordHash,
            integrityHash
        });

        await file.save();
        res.status(201).json({
            success: true,
            message: 'FILE UPLOADED SUCCESSFULLY!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG PLEASE TRY AGAIN!'
        });
    }
};

const verifyFile = async (req, res) => {
    try {
        const { password, fileId } = req.body;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'FILE NOT FOUND!'
            });
        }

        if (file.passwordHash && !(await bcrypt.compare(password, file.passwordHash))) {
            return res.status(401).json({
                success: false,
                message: 'INVALID PASSWORD!'
            });
        }

        if (file.downloads >= file.maxDownloads) {
            return res.status(403).json({
                success: false,
                message: 'MAXIMUM DOWNLOAD LIMIT REACHED!'
            });
        }

        if (new Date() > file.expiry) {
            return res.status(403).json({
                success: false,
                message: 'FILE HAS EXPIRED!'
            });
        }

        const token = jwt.sign({ fileId: file._id, requestedId: req.body.requesterId }, config.jwtSecret, { expiresIn: '1h' });
        file.accessLog.push({ requestedId: req.body.requesterId, timestamp: Date.now() });
        await file.save();

        res.status(200).json({
            success: true,
            accessToken: token
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG PLEASE TRY AGAIN!'
        });
    }
};

const downloadFile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { fileId, requestedId } = jwt.verify(token, config.jwtSecret);
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'FILE NOT FOUND!'
            });
        }

        if (file.downloads >= file.maxDownloads) {
            return res.status(403).json({
                success: false,
                message: 'MAXIMUM DOWNLOAD LIMIT REACHED!'
            });
        }

        if (new Date() > file.expiry) {
            return res.status(403).json({
                success: false,
                message: 'FILE HAS EXPIRED!'
            });
        }

        const decryptedData = decryptData(file.encryptedData);

        if (generateIntegrityHash(decryptedData) !== file.integrityHash) {
            return res.status(500).json({
                success: false,
                message: 'INTEGRITY CHECK FAILED!'
            });
        }

        file.downloads++;
        await file.save();

        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.status(200).send(decryptedData);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG PLEASE TRY AGAIN!'
        });
    }
};

function parseExpiry(expiry) {
    const time = parseInt(expiry.slice(0, -1));
    const unit = expiry.slice(-1);
    switch (unit) {
        case 'h':
            return time * 60 * 60 * 1000;
        case 'd':
            return time * 24 * 60 * 60 * 1000;
        default:
            throw new Error('Invalid expiry format');
    }
}

module.exports = { uploadFile: [upload.single('file'), uploadFile], verifyFile, downloadFile };
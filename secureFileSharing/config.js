require('dotenv').config();

const crypto = require('crypto');

module.exports = {
    dbUri: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey:crypto.randomBytes(32).toString('hex')
};
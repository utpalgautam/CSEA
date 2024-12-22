require('dotenv').config();

const crypto = require('crypto');

module.exports = {
    dbUri: process.env.DB_URI,
    jwtSecret:crypto.randomBytes(32).toString('hex')
    encryptionKey:crypto.randomBytes(32).toString('hex')
};

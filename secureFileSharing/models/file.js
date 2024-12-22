const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    encryptedData:{
        type:Buffer,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    maxDownloads:{
        type:Number,
        required:true
    },
    downloads:{
        type:Number,
        default:0
    },
    passwordHash:{
        type:String,
    },
    accessLog:[
        {
            requestedId:String,
            timestamp:{
                type:Date,
                default:Date.now
            }
        }
    ],
    integrityHash:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('File',fileSchema)
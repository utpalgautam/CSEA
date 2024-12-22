const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    venue:{
        type:String,
        required:true,
    },
    capacity:{
        type:Number,
        required:true,
    },
    organiser:{
        type:String,
        required:true,
    },
    tags:{
        type:[String]
    },
    registration:[
        {studentId:String, name:String, email:String, department:String, year:Number}
    ]
})

module.exports = mongoose.model('Event', eventSchema)
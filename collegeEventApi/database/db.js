require('dotenv').config()
const mongoose = require('mongoose')

const connectToDb = async () => {
    try {
        await mongoose.connect(
            `${process.env.DBURL}`
        )
        console.log('MONGODB IS CONNECTED SUCCESSFULLY')
    } catch(e) {
        console.log('MONGODB CONNECTION FAILED : ',e)
        process.exit(1)
    }
}

module.exports = connectToDb
require('dotenv').config()
const express = require('express')
const connectToDb = require('./database/db')
const eventRoutes = require('./routes/eventRoutes')

const app = express()
PORT = process.env.PORT

connectToDb()
app.use(express.json())

app.use('/api/events',eventRoutes)

app.listen(PORT, () => {
    console.log(`THE SERVER IS RUNNIG AT PORT ${PORT}`)
})
const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/files', fileRoutes);

mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('CONNECTED TO MONGODB...'))
    .catch(e => console.error('COULD NOT CONNECT TO MONGODB...', e));

app.listen(PORT, () => {
    console.log(`THE SERVER IS RUNNING AT PORT ${PORT}...`);
});
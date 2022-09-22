const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function run() {
    try {

    }
    finally {

    }
}


// Root API
app.get('/', (req, res) => {
    res.send('Rahib Contacts server is running');
});

app.listen(port, () => {
    console.log('Listening to ', port);
});
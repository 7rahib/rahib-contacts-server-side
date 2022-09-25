const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tu4gevq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const contactsCollection = client.db('rahib_contacts').collection('contacts');

        app.get('/contacts', async (req, res) => {
            const allContacts = await contactsCollection.find().toArray();
            res.send(allContacts);
        })

        app.put('/contacts/:email', async (req, res) => {
            const email = req.params.email;
            const newContact = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: newContact,
            };
            const result = await contactsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.put('/updateContacts/:_id', async (req, res) => {
            const _id = req.params._id;
            const updateContact = req.body;
            const filter = { _id: ObjectId(_id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: updateContact,
            };
            const result = await contactsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/contactDetails/:_id', async (req, res) => {
            const _id = req.params._id
            const query = { _id: ObjectId(_id) }
            const tool = await contactsCollection.findOne(query)
            res.send(tool)
        })

        app.delete('/contacts/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: ObjectId(_id) };
            const result = await contactsCollection.deleteOne(filter);
            res.send(result);
        })

        app.put('/contacts/fav/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: ObjectId(_id) };
            const updateDoc = {
                $set: { role: 'fav' },
            };
            const result = await contactsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.put('/contacts/count/:_id', async (req, res) => {
            const _id = req.params._id;
            let count = 0;
            let frequent = count++;
            const filter = { _id: ObjectId(_id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: { frequent: frequent },
            };
            const result = await contactsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

// Root API
app.get('/', (req, res) => {
    res.send('Rahib Contacts server is running');
});

app.listen(port, () => {
    console.log('Listening to ', port);
});
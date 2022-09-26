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

        // All Collections
        const contactsCollection = client.db('rahib_contacts').collection('contacts');
        const usersCollection = client.db('rahib_contacts').collection('users');
        const trashCollection = client.db('rahib_contacts').collection('trash_contacts');


        // Contact Starts

        // All contact information
        app.get('/contacts', async (req, res) => {
            const allContacts = await contactsCollection.find().toArray();
            res.send(allContacts);
        })

        // Adding new contact if there is no similar
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

        // Updating contact based on id
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

        // Delete single contact based on id
        app.delete('/contacts/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: ObjectId(_id) };
            const result = await contactsCollection.deleteOne(filter);
            res.send(result);
        })


        // Contact Ends


        // Trash Starts

        // Storing deleted contacts to trash
        app.put('/contact/:_id', async (req, res) => {
            const _id = req.params._id;
            const newTrash = req.body;
            const filter = { _id: ObjectId(_id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: newTrash,
            };
            const result = await trashCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // All Trash information
        app.get('/contact', async (req, res) => {
            const allTrash = await trashCollection.find().toArray();
            res.send(allTrash);
        })

        // Permanet Deleting trashed single contact based on id
        app.delete('/contact/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: ObjectId(_id) };
            const result = await trashCollection.deleteOne(filter);
            res.send(result);
        })

        // Trash Ends


        // User Starts

        // Creating new user if there is no similar
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const newUser = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: newUser,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // Getting all user data
        app.get('/users', async (req, res) => {
            const allUsers = await usersCollection.find().toArray();
            res.send(allUsers);
        })

        // Getting individual user information
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email };
            const users = await usersCollection.findOne(query)
            res.send(users)
        })

        // Updating contact based on id
        app.put('/users/:_id', async (req, res) => {
            const _id = req.params._id;
            const newUserUpdate = req.body;
            const filter = { _id: ObjectId(_id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: newUserUpdate,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // User Ends

        // Getting individual contact information
        app.get('/contactDetails/:_id', async (req, res) => {
            const _id = req.params._id
            const query = { _id: ObjectId(_id) }
            const contacts = await contactsCollection.findOne(query)
            res.send(contacts)
        })


        // Starred Contact Start

        // Getting starred contact information
        app.get('/starContact', async (req, res) => {
            const contacts = await contactsCollection.find({ role: 'fav' }).toArray();
            res.send(contacts)
        })

        // Adding fav role to a contact
        app.put('/contacts/fav/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: ObjectId(_id) };
            const updateDoc = {
                $set: { role: 'fav' },
            };
            const result = await contactsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Removing fav role from a contact
        app.put('/contacts/removeFav/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: ObjectId(_id) };
            const updateDoc = {
                $set: { role: '' },
            };
            const result = await contactsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Starred Contact End

        // Frequent Starts

        // Adding count to a contact to check frequent
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


        // Frequent Ends
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
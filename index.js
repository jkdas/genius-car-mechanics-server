// Task-1 import express
const express = require('express');
// Task-6 import mongoClinet
const { MongoClient, Collection, ObjectId } = require('mongodb');
// Task-10 import cors for middleware
const cors = require('cors');
// Task-12 import dotenv for DB user and pass dynamic use
require('dotenv').config();
// Task-2 create express app
const app = express();
// Task-3 set port
const port = process.env.PORT || 5000;

// Task-11 add middleware
app.use(cors());
app.use(express.json());
// Task-7 create connection uri with dynamic user and password set
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzham.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Task-8 create client for database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Task-9 Connection async function for MongoDb 
async function run() {
    try {
        // conneect to db
        await client.connect();
        // Create Database
        const database = client.db('carMechanic');
        // Create a Collection
        const servicesCollection = database.collection('carServices');
        // GET API 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post API', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// Task-4 for sending response to server
app.get('/', (req, res) => {
    res.send('running genius server');
});

// Task-5 Listening to server port
app.listen(port, () => {
    console.log('Running Genius Server on Port', port);
})
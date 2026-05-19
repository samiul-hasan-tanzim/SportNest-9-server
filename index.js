require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {
        const database = client.db(process.env.DB_NAME);
        const facilitiesCollection = database.collection(process.env.ALL_COLLECTION);
        const bookingCollection = database.collection(process.env.ALL_BOOKING)

        app.get('/facilities', async (req, res) => {
            const cursor = facilitiesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/facilities/:id', async (req, res) => {
            const id = req.params.id
            const user = await facilitiesCollection.findOne({ _id: new ObjectId(id) })
            res.send(user)
        })

        app.post('/bookings', async (req, res) => {
            const bookingData = req.body
            const result = await bookingCollection.insertOne(bookingData)
            res.json(result)
        })


        console.log("MongoDB connected 🚀");
    } finally {
        // await client.close();
    }
};

run().catch(console.dir);

app.listen(port, () => {
    console.log("Server running on port", port);
});
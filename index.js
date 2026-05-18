require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        // await client.connect();
        const database = client.db(process.env.DB_NAME);
        const facilitiesCollection = database.collection(process.env.ALL_COLLECTION);

        app.get('/facilities', async (req, res) => {
            const cursor = facilitiesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connected 🚀");
    } finally {
        // await client.close();
    }
};

run().catch(console.dir);

app.listen(port, () => {
    console.log("Server running on port", port);
});
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
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


const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

const verifyToken = async (req, res, next) => {
    const header = req?.headers.authorization
    if (!header) {
        res.status(401).json({ message: "Unauthorized" })
    }
    const token = header.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const { payload } = await jwtVerify(token, JWKS)
        console.log(payload)
        next()
    } catch (error) {
        res.status(401).json({ message: "Forbidden" })
    }
}


const run = async () => {
    try {
        const database = client.db(process.env.DB_NAME);
        const facilitiesCollection = database.collection(process.env.ALL_COLLECTION);
        const bookingCollection = database.collection(process.env.ALL_BOOKING)

        app.get('/facilities', verifyToken, async (req, res) => {
            const { search } = req.query
            let cursor

            if (search) {
                cursor = facilitiesCollection.find({
                    $or: [
                        {
                            name: {
                                $regex: search,
                                $options: 'i'
                            }
                        },
                        {
                            facility_type: {
                                $regex: search,
                                $options: 'i'
                            }
                        }
                    ]
                })
            }
            else {
                cursor = facilitiesCollection.find()
            }

            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/facilities/:id', verifyToken, async (req, res) => {
            const id = req.params.id
            const user = await facilitiesCollection.findOne({ _id: new ObjectId(id) })
            res.send(user)
        })

        app.post('/facilities', verifyToken, async (req, res) => {
            const facilitiesData = req.body
            const result = await facilitiesCollection.insertOne(facilitiesData)
            res.json(result)
        })


        app.get('/facilities/user/:userId', verifyToken, async (req, res) => {
            const id = req.params.userId
            const user = await facilitiesCollection.find({ userId: id }).toArray()
            res.send(user)
        })

        app.patch('/facilities/user/:userId', verifyToken, async (req, res) => {
            const { userId } = req.params
            const updatedData = req.body
            const result = await facilitiesCollection.updateOne(
                { userId },
                { $set: updatedData }
            )
            res.json(result)
        })

        app.delete('/facilities/:userId', verifyToken, async (req, res) => {
            const { userId } = req.params
            const result = await facilitiesCollection.deleteOne({ userId })
            res.json(result)
        })

        app.get('/bookings/:userEmail', verifyToken, async (req, res) => {
            const { userEmail } = req.params
            const result = await bookingCollection.find({ user_email: userEmail }).toArray()
            res.json(result)
        })

        app.post('/bookings', verifyToken, async (req, res) => {
            const bookingData = req.body
            const result = await bookingCollection.insertOne(bookingData)
            res.json(result)
        })

        app.delete('/bookings/:bookingId', verifyToken, async (req, res) => {
            const bookingId = req.params.bookingId
            const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) })
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
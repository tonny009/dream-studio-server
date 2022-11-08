const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-1bjla5v-shard-00-00.dieisxt.mongodb.net:27017,ac-1bjla5v-shard-00-01.dieisxt.mongodb.net:27017,ac-1bjla5v-shard-00-02.dieisxt.mongodb.net:27017/?ssl=true&replicaSet=atlas-n02o7o-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' })
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(401).send({ message: 'unauthorized access' })
//         }
//         req.decoded = decoded
//         next()
//     })
// }


async function run() {
    try {
        const Service = client.db('photography').collection('services')

        app.post('/jwt', (req, res) => {
            console.log('enterd')
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            // console.log({ token })
            res.send({ token })
        })

        app.get('/services', async (req, res) => {

            const query = {}
            const cursor = Service.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

    }
    finally {

    }

}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Photograhy service server is running on')

})
app.listen(port, () => {
    console.log("Photograhy service is running on")
})
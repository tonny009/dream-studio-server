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
        const Reviews = client.db('photography').collection('serviceReviews')

        app.post('/jwt', (req, res) => {
            console.log('enterd')
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            // console.log({ token })
            res.send({ token })
        })

        app.get('/serviceshome', async (req, res) => {

            const query = {}
            const cursor = Service.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {

            const query = {}
            const cursor = Service.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await Service.insertOne(service);
            res.send(result);
        });

        app.get('/service-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await Service.findOne(query);
            res.send(service);
        });

        //insert your review from review form page
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await Reviews.insertOne(review);
            res.send(result);
        });



        //get all reviews in service details page--------
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email }

            }
            if (req.query.serviceId) {
                query = { serviceId: req.query.serviceId };
            }

            const cursor = Reviews.find(query);
            const reviews = await cursor.toArray();
            console.log(req.query.email);
            // console.log(req.query.serviceId)
            res.send(reviews);
        })

        //detele review--------
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await Reviews.deleteOne(query)
            res.send(result)

        })
        //update-----

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await Reviews.findOne(query);
            res.send(review);
        })


        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const updatedRvw = req.body.review
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    review: updatedRvw
                }
            }
            const result = await Reviews.updateOne(query, updatedDoc);
            res.send(result);
        })
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
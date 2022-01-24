const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

//midleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){

    try{
        await client.connect();
        const database = client.db("cameraShop");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("review");
        const usersCollection = database.collection("users");

        app.get('/products', async(req, res)=>{
            const product = productsCollection.find({})
            const result = await product.toArray(product);
            res.json(result)
        })

        //data load by id on db
        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await productsCollection.findOne(query)
            res.json(result);
        })
        
        //all order get from db
        app.get('/allorders', async(req, res)=>{
            const order = ordersCollection.find({})
            const result = await order.toArray()
            res.json(result)
        })

        //detele from db in all order api
        app.delete('/allorders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })

        ///order get from db by particular gmail id
        app.get('/orders', async(req, res)=>{
            const email = req.query.email;
            const query = {email:email}
            const order = ordersCollection.find(query)
            const result = await order.toArray(order)
            res.json(result)

        })
        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })     

        // get review data from db
        app.get('/reviews', async(req, res)=>{
            const review = reviewsCollection.find({})
            const result = await review.toArray(review)
            res.json(result)
        })

        // check admin 

        app.get('/users/:email', async(req, res)=>{
            const email = req.params.email;
            const filter = {email:email};
            const user = await usersCollection.findOne(filter);
            let isAdmin = false;
            if(user?.role ==='admin'){
                isAdmin = true;
            }
            res.json({admin:isAdmin})
        })

        //order post to db
            app.post('/orders', async(req, res)=>{
                const order = req.body;
                const result = await ordersCollection.insertOne(order)
                res.json(result)
            })
            
            //review post to db

            app.post('/reviews', async(req, res)=>{
                const review = req.body;
                const result = await reviewsCollection.insertOne(review);
                res.json(result)
            })

            //add products to db
            app.post('/addproducts', async(req, res)=>{
                const product = req.body;
                const result = await productsCollection.insertOne(product)
                res.json(result)
            })

            //user post to db
            app.post('/users', async(req, res) =>{
                const user = req.body;
                const result = await usersCollection.insertOne(user)
                res.json(result)
            })

            //usert implement for google login button

            app.put('/users', async(req, res) =>{
                const user = req.body;
                const filter = {email:user.email}
                const options = { upsert: true };
                const updateDoc = {$set:user}
                const result = await usersCollection.updateOne(filter, updateDoc, options)
                res.json(result)
            })

            //make admin
            app.put('/users/admin', async(req, res) =>{
                const user = req. body
                const filter = {email:user.email}
                const updateDoc = {$set:{role:'admin'}}
                const result = await usersCollection.updateOne(filter, updateDoc)
                res.json(result)
            })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Best Camera Shop server ')
})

app.listen(port, () => {
  console.log(`port start on:${port}`)
})
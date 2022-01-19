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
        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello Home Fashion Zone')
})

app.listen(port, () => {
  console.log(`port start on:${port}`)
})
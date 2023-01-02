const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://job-portal-db:oUQjxswwOcDyQl8U@cluster0.jh5ecod.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const categoriesCollection = client.db('jobPortalDB').collection('categories')
        const jobsCollection = client.db('jobPortalDB').collection('jobs')

        app.get('/categories', async(req, res) => {
            const query = {}
            const category = await categoriesCollection.find(query).toArray();
            res.send(category)
        })
        app.get('/categories/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await categoriesCollection.findOne(query);
            res.send(result)
        })
        app.get('/jobs', async(req, res) => {
            const query = {}
            const category = await jobsCollection.find(query).toArray();
            res.send(category)
        })
        app.get('/categoryjobs', async(req, res) => {
            let query = {}
            if(req.query.categoryName){
                query = {
                    categoryName: req.query.categoryName,
                }
            }
            const jobs = await jobsCollection.find(query).toArray();
            res.send(jobs)
        })
        app.post('/jobs', async(req, res) => {
            const job = req.body;
            const result = await jobsCollection.insertOne(job);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.log)

app.get('/', (req, res) => {
    res.send('job-portal server running')
})

app.listen(port, () => {
    console.log(`job-portal on the port ${port}`)
})
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//db_user:user
//db_pass: XiGvR3EC2deibGYS

// middleware here 
app.use(cors())
app.use(express.json())


//initial api
app.get('/', (req, res) => {
    res.send('Node js is ready to work')
})

//db connection code here 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sow4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Database connected........');
// });

// REST_api formate code here

async function run() {
    try {
        await client.connect(); 
        const userCollection = client.db('userInfo').collection('user')

        // const user = { name: 'omar', email: 'omar@gmail.com', job: 'coder', duration: '5 hours' }
        // const result = await userCollection.insertOne(user)
        // console.log(result)

        //get user data from mongodb and show it browser
        app.get('/user', async(req, res)=>{
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        //to get user id from url ................
        app.get('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.findOne(query)
            res.send(result)
          })


        //get data from client side and send it to mongodb
        app.post('/user', async(req, res)=>{
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })


        //user update api code here 
        app.put('/user/:id', async(req, res)=>{
            const id = req.params.id
            const updateUser = req.body;
            const filter = {_id:ObjectId(id)}
            const options = {upsert:true}
            const upDateDoc = {
                $set:{
                    name:updateUser.name,
                    email:updateUser.email,
                    job:updateUser.job,
                    duration:updateUser.duration,
                }
            }

            const result = await userCollection.updateOne(filter,upDateDoc,options)
            res.send(result)
        })

        //delete from database and client side 
        app.delete('/user/:id', async(req, res)=>{
            var id = req.params.id;
            const query = {_id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally { }
}

run().catch(console.dir)


//port listen to server
app.listen(port, () => {
    console.log('CURD operation is running on the PORT::', port)
})
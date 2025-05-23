const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000

  // MiddleWare
  app.use(cors())
  app.use(express.json())


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkye2zi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //... 
    const coffeeSCollection = client.db("coffeeDB").collection('coffees')
    const usersCollection = client.db("coffeeDB").collection("users")


    // Get method
    app.get('/coffees' , async(req,res) =>{
      const result = await coffeeSCollection.find().toArray()
      res.send(result)
    })
    app.get("/coffees/:id" , async(req , res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeSCollection.findOne(query)
        res.send(result)
    })


    //post method 
    app.post("/coffees" , async(req,res) =>{
      const newCoffee = req.body;
      console.log(newCoffee)
      // Create result
      const result = await coffeeSCollection.insertOne(newCoffee)
      res.send(result);
    })

    //Update put method
     app.put("/coffees/:id" , async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateCoffee = req.body;
      const updateDoc = {
            $set:updateCoffee
      }
      const result = await coffeeSCollection.updateOne(filter,updateDoc,options)

      res.send(result)
     })


    //Delete Method 
    app.delete("/coffees/:id" , async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeSCollection.deleteOne(query)
      res.send(result)
    })

   // user related data
                  app.get("/users" , async(req,res) =>{
                     const result = await usersCollection.find().toArray()
                     res.send(result)
                  })


                 app.post("/users" ,async(req,res) =>{
                     const userProfile = req.body;
                     console.log(userProfile)
                     const result = await usersCollection.insertOne(userProfile)
                     res.send(result)
                 })
         // single input update        
                 app.patch("/users",async(req,res) =>{
                  const {email,lastSignInTime}= req.body
                  const filter = {email:email}
                  const updateDoc = {
                    $set :{
                      lastSignInTime:lastSignInTime
                    }
                  }
                  const result = await usersCollection.updateOne(filter,updateDoc)
                  res.send(result)
                 })


                 app.delete("/users/:id" , async(req,res) =>{
                  const id = req.params.id
                  const query = {_id: new ObjectId(id)}
                  const result = await usersCollection.deleteOne(query)
                  res.send(result)
                 })

              


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




  // Get method
app.get("/" , (req,res) =>{
    res.send("coffee server is running getting hotter")
})


//reade  method
app.listen(port , ()=>{
    console.log(`Coffee server is running on port ${port}`)
})
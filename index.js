const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// connect to the mongoDB database
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ctz3uz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client
      .db("CraftSpectrumDB")
      .collection("CraftItems");

    // getting all the craft items
    app.get("/crafts", async (req, res) => {
      const result = await craftCollection.find().toArray();
      res.send(result);
    });

    // getting my craft items by email
    app.get("/myCrafts/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: userEmail };
      const result = await craftCollection.find(query).toArray();
      res.send(result);
    });

    //getting the recent craft items
    app.get("/recentCrafts", async (req, res) => {
      const result = await craftCollection.find().limit(6).toArray();
      res.send(result);
    });

    // getting single craft item
    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    //post a craft item
    app.post("/crafts", async (req, res) => {
      const craft = req.body;
      const result = await craftCollection.insertOne(craft);
      res.send(result);
    });

    // updating a data by id
    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = req.body;

      const newUpdatedCraft = {
        $set: {
          image: updateCraft.image,
          item_name: updateCraft.item_name,
          subcategory_Name: updateCraft.subcategory_name,
          short_description: updateCraft.short_description,
          price: updateCraft.price,
          rating: updateCraft.rating,
          customization: updateCraft.customization,
          processing_time: updateCraft.processing_time,
          stock_status: updateCraft.stock_status,
        },
      };
      const result = await craftCollection.updateOne(
        filter,
        newUpdatedCraft,
        options
      );
      res.send(result);
    });

    // delete a data from the database
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//monitoring the server
app.get("/", (req, res) => {
  res.send("deepseffect-craft-spectrum is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

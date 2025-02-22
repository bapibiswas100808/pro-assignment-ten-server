const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5e8b5ac.mongodb.net/?retryWrites=true&w=majority`;

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

    const allCraftCollection = client.db("allCraftDB").collection("allCraft");
    const allCategoryCollection = client
      .db("allCraftDB")
      .collection("allCategories");

    // Get
    app.get("/allCraft", async (req, res) => {
      const cursor = allCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Get category
    app.get("/allCategories", async (req, res) => {
      const cursor = allCategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get with subcategory
    app.get("/myCategory/:subCategory", async (req, res) => {
      const subCategory = req.params.subCategory;
      const query = { subCategory: req.params.subCategory };
      const result = await allCraftCollection.find(query).toArray();
      res.send(result);
    });
    // get with id
    app.get("/allCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCraftCollection.findOne(query);
      res.send(result);
    });
    // get with email
    app.get("/myCraft/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: req.params.email };
      const result = await allCraftCollection.find(query).toArray();
      res.send(result);
    });
    // post
    app.post("/allCraft", async (req, res) => {
      const newData = req.body;
      console.log(newData);
      const result = await allCraftCollection.insertOne(newData);
      res.send(result);
    });
    // UPdate
    app.put("/allCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const updateCraft = {
        $set: {
          image: updatedCraft.image,
          itemName: updatedCraft.itemName,
          subCategory: updatedCraft.subCategory,
          processingTime: updatedCraft.processingTime,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          shortDescription: updatedCraft.shortDescription,
          customization: updatedCraft.customization,
          stock: updatedCraft.stock,
        },
      };
      const result = await allCraftCollection.updateOne(
        filter,
        updateCraft,
        options
      );
      res.send(result);
    });
    // Delete
    app.delete("/allCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCraftCollection.deleteOne(query);
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

app.get("/", (req, res) => {
  res.send("assignment ten server is running");
});
app.listen(port, () => {
  console.log(`assignment ten server is running at : ${port}`);
});

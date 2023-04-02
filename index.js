const express = require("express");
const app = express();
const port = 3000;

const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
let db;

app.use(express.json());

// Connect Database
connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    db = getDb();
  }
});

//routes
app.get("/books", (req, res) => {
  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: "Error" });
      });
  } else {
    res.status(500).json({ error: "not found" });
  }
});

app.post("/books", (req, res, next) => {
  const book = req.body;

  db.collection("books")
    .insertOne1(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "loi" });
    });
});

app.delete("/books/:id", (req, res, next) => {
  const id = req.params.id;

  if (ObjectId.isValid(id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "loi" });
      });
  } else {
    res.status(500).json({ error: "Could not delete document" });
  }
});

app.patch("/books/:id", (req, res, next) => {
  const updates = req.body;
  const id = req.params.id;

  if (ObjectId.isValid(id)) {
    db.collection("books").updateOne({ _id: new ObjectId(id) }, { $set: updates });
    // .then((result) => {
    //   res.status(201).json(result);
    // })
    // .catch((err) => {
    //   res.status(500).json({ err: "loi" });
    // });
    db.collection("books")
      .findOne({ _id: new ObjectId(id) })
      .then((data) => {
        res.status(200).json(data);
      });
  } else {
    res.status(500).json({ error: "Could not delete document" });
  }
});

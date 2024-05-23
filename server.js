const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const uri = "mongodb://localhost:27017/";
const port = process.env.PORT || 3000;
let collection;

app.use(express.static(__dirname)); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runDBConnection() {
  try {
    await client.connect();
    collection = client.db('YourDatabaseName').collection('Cat'); // Ensure 'YourDatabaseName' is correct
    console.log('Connected to MongoDB and collection retrieved.');
  } catch (ex) {
    console.error('Error connecting to MongoDB:', ex);
  }
}

runDBConnection();

function postCat(cat, callback) {
  collection.insertOne(cat, (err, result) => {
    if (err) {
      console.error('Error adding cat:', err);
      callback(err, null);
    } else {
      console.log('Cat added successfully:', result.ops[0]);
      callback(null, result);
    }
  });
}

function getAllCats(callback) {
  collection.find({}).toArray(callback);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/cats', (req, res) => {
  getAllCats((err, result) => {
    if (!err) {
      res.json({ statusCode: 200, data: result, message: 'Get all cats success' });
    } else {
      res.json({ statusCode: 500, message: 'Failed to get cats' });
    }
  });
});

app.post('/api/cats', (req, res) => {
  const newCat = req.body;
  console.log('New cat data:', newCat); 
  postCat(newCat, (err, result) => {
    if (!err) {
      res.json({ statusCode: 201, data: result, message: 'Cat added successfully' });
    } else {
      console.error('Error adding cat:', err);  
      res.json({ statusCode: 500, message: 'Failed to add cat' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



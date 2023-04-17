const express = require('express')
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const app = express();

app.set('view engine', 'ejs');

// set static folder and content type
app.use(express.static(path.join(__dirname, "public"), {
  type: 'text/javascript'
}));

// setting up bodyParser to help read body's of HTTP requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1/app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// connecting to database
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', () => {
  console.log('MongoDB connected');
});

// object representing the schema we will use for holding our movies in MongoDB
const listSchema = new Schema({
  name: String,
  releaseYear: Number,
  seen: Boolean,
  imdbRating: Number
})


app.listen(PORT, () => console.log(`server running on port ${PORT}`));



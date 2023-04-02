const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./routes/auth')
const notes = require('./routes/notes');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const path = require('path');

const app = express()
app.use(express.json())
app.use(cors({origin:"*"}))

app.use('/api/auth', auth)
app.use('/api/notes', notes)

dotenv.config().parsed;

app.get('/', (req, res) => {
    res.json("note app")
})
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

//listen app
app.listen(PORT, () => {
    console.log("App is Running on port:", PORT);
    
})

//connect to mongoDb

const URI = process.env.MONGODB_URL;
mongoose.connect(URI, err => {
    if (err) throw err
    console.log("connected to mongodb");
})

var express = require('express'),
    app = express(),
    port = 3001,
    cors = require('cors'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    config = require('config')

var userRoutes = require('./routes/user')

app.use(cors())

// Body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const db = config.get('mongoURI')

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

app.use('/api/users', userRoutes)



app.listen(port, () => {
  console.log("Started user_auth server")
})
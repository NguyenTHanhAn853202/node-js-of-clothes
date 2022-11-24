const express = require('express')
const morgan = require('morgan')
const db = require('./configs/db')
const route  = require('./routers')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const app = express()
const port = 3100

app.use(morgan('combined'));

app.use(methodOverride('_method'))

app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.json());
db.connect();

route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
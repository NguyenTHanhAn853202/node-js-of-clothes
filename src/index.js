const express = require('express')
const morgan = require('morgan')
const db = require('./configs/db')
const route  = require('./routers')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const port = require('../src/utils/serverPort')
const cors = require('cors')
const cookieParser = require('cookie-parser')


app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(cookieParser())

app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.use(cors({credentials: true,origin:true}))

app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
db.connect();



route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// git push origin HEAD:master --force
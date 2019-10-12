var express = require('express')
var app = express()
var bodyparser = require('body-parser')
var async = require('async')
var mysql = require('mysql')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))

// Configure and create new connection
var dbConn = mysql.createConnection({
  host: 'localhost'
  , user: 'root'
  , password: ''
  , database: 'reg_v1'
})

//Connect to database
dbConn.connect()

// Set Port 
app.listen(3000, function () {
  console.log('App is connected')
})

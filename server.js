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

app.post('/student/login', function (req, res) {

  var error = []
  let id = req.body.id
  let ic = req.body.ic

  var query1 = "SELECT * FROM students WHERE id = ? AND ic = ?"
  var query2 = "SELECT * FROM debtor WHERE studentid = ?"
  var query3 = "SELECT * FROM status WHERE studentid = ?"
  var query4 = "SELECT * FROM users WHERE id = ?"

  if (id && ic) {
    async.parallel([
      function () {
        dbConn.query(`${query1}`, [id, ic], function (err, results) {
          if (err) {
            return res.send({ error: true, message: 'Something bad happened' })
          } else if (!results.length > 0) {
            return res.send({ error: true, message: 'Your student ID and Password did not match' })
          }
        })
      },
      function () {
        dbConn.query(`${query2}`, [id], function (err, results) {
          if (err) {
            return res.send({ error: true, message: 'Something bad happened' })
          }
          if (results.length > 0) {
            error.push('You have a debt in your account')
          }
        })
      },
      function () {
        dbConn.query(`${query3}`, [id], function (err, results) {
          if (err) {
            return res.send({ error: true, message: 'Something bad happened' })
          }
          if (results.length > 0) {
            if (results[0].preregstatus == 1) {
              error.push('You did not complete your pre-registration')
            }
            if (typeof results[0].resultstat === 'string') {
              if (results[0].resultstat === 'DIS1') {
                error.push('You did not passed on your previous exam')
              } else if (results[0].resultstat === 'DIS2') {
                error.push('You did not passed on your previous exam')
              } else if (results[0].resultstat === 'DIS3') {
                error.push('You did not passed on your previous exam')
              }
            }
            if (results[0].setA == 1) {
              error.push('You did not submit you set A')
            }
          }
        })
      },
      function () {
        dbConn.query(`${query4}`, [id], function (err, results) {
          if (err) {
            return res.send({ error: true, message: 'Something bad happened' })
          }
          if (results.length > 0) {
            if (results[0].active == 0) error.push('Your account is not active')
          }
          if (error.length > 0) return res.send({ error: true, message: error })
          else return res.send({ error: false, message: 'Success Login for testing' })
        })
      }
    ])
  }
})

module.exports = app
const express = require('express')
const app = express()
const fs = require('fs')

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/city', function(req, res) {
  var cityJson = JSON.parse(fs.readFileSync('city-data.json', 'utf8'))

  res.send(cityJson)
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

const express = require('express')
const app = express()
const fs = require('fs')

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/city', function(req, res) {
  var cityJson = fs.readFileSync('city-data.json', 'utf8')

  res.send(cityJson)
})

app.get("/findCity", function(req, res) {

  var param = '北京'
  var result = []
  var cityJson = JSON.parse(fs.readFileSync('city-data.json', 'utf8'))
  cityJson.forEach(function(entry){
    proviceList = entry.list
    proviceList.forEach(function(provice){
      if(provice.name == param) {
        var r = provice.name
        var cityList = provice.children[0].list
        cityList.forEach(function(city){
          r = r.concat(',', city.name)
          var areaList = city.children[0].list
          areaList.forEach(function(area) {
            var v = r.concat(',', area.name)
            result.push(v)
          })
        })
        res.send(result)
      }
    })
  })
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

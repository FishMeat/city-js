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

  var param = '浙江'

  var cityJson = JSON.parse(fs.readFileSync('city-data.json', 'utf8'))
  cityJson.forEach(function(entry){
    proviceList = entry.list
    proviceList.forEach(function(provice){
      var pName = provice.name
      if(pName == param) {
        var result = []
        provice.children.forEach(function(pc){
          var cityList = pc.list
          cityList.forEach(function(city){
            var cName = city.name
            city.children.forEach(function(cc){
              var areaList = cc.list
              areaList.forEach(function(area){
                var aName = area.name
                var r = pName.concat(',', cName, ',', aName)
                result.push(r)
              })
            })

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

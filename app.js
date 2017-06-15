const express = require('express')
const app = express()
const fs = require('fs')
const pinyin = require('pinyin')

app.get('/', function(req, res) {
  res.send('Hello World!')
})

app.get('/city', function(req, res) {
  var cityJson = fs.readFileSync('city-data.json', 'utf8')

  res.send(cityJson)
})

app.get("/findCity/:n", function(req, res) {

  var param = req.params.n

  var cityJson = JSON.parse(fs.readFileSync('city-pinyin.json', 'utf8'))
  cityJson.forEach(function(entry) {
    proviceList = entry.list
    proviceList.forEach(function(provice) {
      var pName = provice.name
      if (pName == param) {
        var result = []
        provice.children.forEach(function(pc) {
          var cityList = pc.list
          cityList.forEach(function(city) {
            var cName = city.name
            city.children.forEach(function(cc) {
              var areaList = cc.list
              areaList.forEach(function(area) {
                var aName = area.name
                console.log(pinyin(pName, {
                  style: pinyin.STYLE_NORMAL
                }))
                var r = pName.concat(',', cName, ',', aName)
                result.push(r)
              })
            })

          })
        })
        res.send(result)
      } else {
        provice.children.forEach(function(pc) {
          var cityList = pc.list
          cityList.forEach(function(city) {
            var cName = city.name
            if (cName == param) {
              var result = []
              city.children.forEach(function(cc) {
                var areaList = cc.list
                areaList.forEach(function(area) {
                  var aName = area.name
                  var r = pName.concat(',', cName, ',', aName)
                  result.push(r)
                })
              })

              res.send(result)
            } else {
              var result = []
              city.children.forEach(function(cc) {
                var areaList = cc.list
                areaList.forEach(function(area) {
                  var aName = area.name
                  if (aName == param) {
                    var r = pName.concat(',', cName, ',', aName)
                    result.push(r)
                    res.send(result)
                  }
                })
              })
            }
          })
        })
      }
    })

  })

  res.end(result)
})

app.get('/generatePinyin', function(req, res) {
  var cityJson = JSON.parse(fs.readFileSync('city-data.json', 'utf8'))
  cityJson.forEach(function(entry) {
    proviceList = entry.list
    proviceList.forEach(function(provice) {
      var pName = provice.name
      provice.pinyin = pinyin(pName, {
        style: pinyin.STYLE_NORMAL
      })
      provice.children.forEach(function(pc) {
        var cityList = pc.list
        cityList.forEach(function(city) {
          var cName = city.name
          city.pinyin = pinyin(cName, {
            style: pinyin.STYLE_NORMAL
          })
          city.children.forEach(function(cc) {
            var areaList = cc.list
            areaList.forEach(function(area) {
              var aName = area.name
              area.pinyin = pinyin(aName, {
                style: pinyin.STYLE_NORMAL
              })
            })
          })
        })
      })
    })
  })

  fs.writeFileSync('city-pinyin.json', JSON.stringify(cityJson), 'utf8')
  res.end()
})

app.get('/formatData', function(req, res) {
  var cityJson = JSON.parse(fs.readFileSync('city-pinyin.json', 'utf8'))
  cityJson.forEach(function(entry) {
    proviceList = entry.list
    proviceList.forEach(function(provice) {
      provice.py = generatePY(provice.pinyin)
      provice.pinyin = provice.pinyin.join('')
      provice.children.forEach(function(pc) {
        var cityList = pc.list
        cityList.forEach(function(city) {
          city.py = generatePY(city.pinyin)
          city.pinyin = city.pinyin.join('')
          city.children.forEach(function(cc) {
            var areaList = cc.list
            areaList.forEach(function(area) {
              area.py = generatePY(area.pinyin)
              area.pinyin = area.pinyin.join('')
            })
          })
        })
      })
    })
  })

  fs.writeFileSync('city-pinyin.json', JSON.stringify(cityJson), 'utf8')
  res.end()
})

function generatePY(pinyin) {
  var arr = []
  pinyin.forEach(function(p) {
    arr.push(p.join().charAt(0))
  })

  return arr.join('').toUpperCase()
}

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

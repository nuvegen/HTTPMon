const path = require('path')
const express = require('express')
var ejs = require('ejs');

const app = express()
var serverPort = 8080
var serverHost = '::'

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/views/monitor')
})

app.set('views', path.join(__dirname, 'views'));
app.get(['/views/monitor','/views/monitor/:monitorID'], (req, res) => {
    //var viewPath = req.params['0'];
    var viewData = {
        "currentMonitor": req.params.monitorID,
        "monitors": [
            {
              "id": "1",
              "name": "googlecom",
              "type": "tcp",
              "active": true,
              "localPort": 9090,
              "remoteHost": "127.0.0.1",
              "remotePort": "3000",
              "destinationURL": ""
            },
            {
              "id": "2",
              "name": "googlecom",
              "type": "tcp",
              "active": true,
              "localPort": 9090,
              "remoteHost": "127.0.0.1",
              "remotePort": "3000",
              "destinationURL": ""
            }
          ]
    }
    return res.render("monitor", viewData);
})



app.use(express.static(path.join(__dirname, 'contents')))


  
app.listen(serverPort, serverHost, () => {
    console.log(`Example app listening at http://${serverHost}:${serverPort}`)
})
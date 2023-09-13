const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path');
// const url = require('url');
const http = require('http');
const https = require('https');
const fs = require('fs')

const app = express();
const apiPort = 8443

const Routes = require('./routes');
var key = fs.readFileSync(path.join(__dirname, 'cert', 'key.key'));
var cert = fs.readFileSync(path.join(__dirname, 'cert', 'cert.key'));
var options = {
  key: key,
  cert: cert
};

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({
    name: 'test',
    msg: 'Halo'
  })
})

app.use('/api', Routes);
app.use(express.static('public'))

var server = https.createServer(options, app)
server.listen(apiPort, () => {
  console.log("server starting on port : " + apiPort)
});
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path')

const app = express();
const apiPort = 5000

const Routes = require('./routes');
var key = fs.readFileSync(path.join(__dirname, 'cert', 'key.pem'));
var cert = fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'));
var options = {
  key: key,
  cert: cert
};

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log('run')
  res.send({
    name: 'test',
    msg: 'Halo'
  })
})

app.use('/api', Routes)

var server = https.createServer(options, app);
server.listen(apiPort, () => {
  console.log("server starting on port : " + apiPort)
});
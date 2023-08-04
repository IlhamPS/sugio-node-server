const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const app = express();
const apiPort = 5000

const Routes = require('./routes');
// var key = fs.readFileSync(path.join(__dirname, 'cert', 'key.key'));
// var cert = fs.readFileSync(path.join(__dirname, 'cert', 'cert.key'));
// var options = {
//   key: key,
//   cert: cert
// };

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const pathFile = path.join(__dirname, 'api/file/files/file_1691162681443_LOGOSMK.png' )
  const testUrl = url.pathToFileURL(pathFile)
  res.send({
    name: 'test',
    msg: 'Halo',
    file: testUrl
  })
})

app.use('/api', Routes)

// var server = https.createServer(options, app);
app.listen(apiPort, () => {
  console.log("server starting on port : " + apiPort)
});
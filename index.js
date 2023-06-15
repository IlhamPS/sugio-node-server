const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 5000

const Routes = require('./routes');

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

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
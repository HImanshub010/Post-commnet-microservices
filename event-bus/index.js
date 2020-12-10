const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.post('/event', (req, res) => {
  const event = req.body
  console.log(
    `Received Event of type ${req.body.type}  with body ${JSON.stringify(
      req.body.data
    )}`
  )
  axios.post('http://localhost:4000/event', event)
  axios.post('http://localhost:4001/event', event)
  axios.post('http://localhost:4002/event', event)
  axios.post('http://localhost:4003/event', event)
  res.send('Successfully emittd events to all services')
  console.log('Successfully emittd events to all services', event.type)
})

app.listen(4005, () => {
  console.log('event bus started listening on port 4005')
})

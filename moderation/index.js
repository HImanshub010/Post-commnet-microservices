const bodyParser = require('body-parser')
const express = require('express')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())

app.post('/event', async (req, res) => {
  const event = req.body
  console.log(
    `Received Event of type ${req.body.type}  with body ${JSON.stringify(
      req.body.data
    )}`
  )
  if (event.type === 'commentCreated') {
    const status = event.data.content.includes('orange')
      ? 'rejected'
      : 'approved'
    await axios.post('http://event-bus-srv:4005/event', {
      type: 'commentModerated',
      data: { ...event.data, status },
    })
  }
  console.log('REceived event of type', event.type)
  res.send('sucess')
})

app.listen(4003, () => {
  console.log('started moderation on hte port 4003')
})

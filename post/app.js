const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
  return res.send(posts)
})

app.post('/post', async (req, res) => {
  const title = req.body.title
  const id = new Date().getTime().toString()
  console.log(typeof id)
  posts[id] = { id, title }
  await axios.post('http://localhost:4005/event', {
    type: 'postCreated',
    data: {
      id,
      title,
    },
  })
  console.log(posts[id])
  res.send(posts[id])
})

app.post('/event', (req, res) => {
  console.log(
    `Received Event of type ${req.body.type}  with body ${JSON.stringify(
      req.body.data
    )}`
  )
  console.log(`Received Event of type ${req.body.type}`)
  res.send(`Received Event of type ${req.body.type}`)
})

app.listen(4000, () => {
  console.log('started Post service on port 4000')
})

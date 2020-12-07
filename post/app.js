const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
  return res.send(posts)
})

app.post('/post', (req, res) => {
  const title = req.body.title
  const id = new Date().getTime().toString()
  console.log(typeof id)
  posts[id] = { id, name: title }
  console.log(posts[id])
  res.send(posts[id])
})

app.listen(4000, () => {
  console.log('started listening on port 4000')
})

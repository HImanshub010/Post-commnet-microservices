const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const posts = {}

app.post('/event', (req, res) => {
  const event = req.body
  if (event.type === 'postCreated') {
    console.log('processing event', event.type)
    posts[event.data.id] = { ...event.data, comments: [] }
  }
  if (event.type === 'commentCreated') {
    console.log('processing event', event.type)
    const post = posts[req.body.data.postId]
    post.comments.push({ id: event.data.id, content: event.data.content })
    // posts[req.body.data.postId]['comments'] = comments
  }
  console.log(posts)
})

app.get('/post', (req, res) => {
  res.send(posts)
})

app.listen(4002, () => {
  console.log('event bus started listening on port 4002')
})

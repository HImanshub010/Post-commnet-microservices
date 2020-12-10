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
  console.log(
    `Received Event of type ${req.body.type}  with body ${JSON.stringify(
      req.body.data
    )}`
  )
  if (event.type === 'postCreated') {
    console.log('processing event', event.type)
    posts[event.data.id] = { ...event.data, comments: [] }
  }
  if (event.type === 'commentCreated') {
    console.log('processing event', event.type)
    const post = posts[req.body.data.postId]
    post.comments.push({
      id: event.data.id,
      content: event.data.content,
      status: event.data.status,
    })
  }
  if (event.type === 'commentUpdated') {
    console.log('processing event', event.type)
    const { postId, id, content, status } = event.data
    const comments = posts[postId].comments
    const comment = comments.find((commt) => {
      if (commt.id === id) {
        console.log('updating comment')
        return true
      }
    })
    comment.status = status
    comment.content = content
  }
  // posts[req.body.data.postId]['comments'] = comments

  console.log(posts)
  res.send('success')
})

app.get('/post', (req, res) => {
  res.send(posts)
})

app.listen(4002, () => {
  console.log('query-service started listening on port 4002')
})

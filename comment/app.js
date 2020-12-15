const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const commentByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
  return res.status(200).send(commentByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
  const { content } = req.body
  const id = req.params.id
  const commentId = new Date().getTime().toString()

  const comments = commentByPostId[id] || []
  comments.push({ id: commentId, content, status: 'pending' })
  commentByPostId[id] = comments
  await axios.post('http://event-bus-srv:4005/event', {
    type: 'commentCreated',
    data: {
      id: commentId,
      content,
      postId: id,
      status: 'pending',
    },
  })

  return res.status(201).send(comments)
})

app.post('/event', (req, res) => {
  console.log(
    `Received Event of type ${req.body.type}  with body ${JSON.stringify(
      req.body.data
    )}`
  )
  const event = req.body
  if (event.type === 'commentModerated') {
    const postId = event.data.postId
    const comments = commentByPostId[postId]
    const newComments = comments.map((comment) => {
      if (comment.id === event.data.id) {
        // commnet.status = event.data.status
        axios.post('http://event-bus-srv:4005/event', {
          type: 'commentUpdated',
          data: { ...comment, status: event.data.status, postId },
        })

        return { ...comment, status: event.data.status }
      }
      return comments
    })
    commentByPostId[postId] = newComments
  }
  res.send(`Received Event of type ${req.body.type}`)
})

app.listen(4001, () => {
  console.log('comment service started  on port 4001')
})

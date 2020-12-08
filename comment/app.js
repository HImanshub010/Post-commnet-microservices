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
  comments.push({ id: commentId, content })
  commentByPostId[id] = comments
  await axios.post('http://localhost:4005/event', {
    type: 'commentCreated',
    data: {
      id: commentId,
      content,
      postId: id,
    },
  })

  return res.status(201).send(comments)
})

app.post('/event', (req, res) => {
  console.log(`Received Event of type ${req.body.type}`)
  res.send(`Received Event of type ${req.body.type}`)
})

app.listen(4001, () => {
  console.log('started listening on port 4001')
})

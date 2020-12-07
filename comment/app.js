const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const commentByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
  return res.status(200).send(commentByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', (req, res) => {
  const { content: title } = req.body
  const id = req.params.id
  const commentId = new Date().getTime().toString()

  const comments = commentByPostId[id] || []
  comments.push({ id: commentId, name: title })
  commentByPostId[id] = comments
  return res.status(201).send(comments)
})

app.listen(4001, () => {
  console.log('started listening on port 4001')
})

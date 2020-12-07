import React, { useState } from 'react'
import axios from 'axios'

const PostCreate = () => {
  const [title, setTitle] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:4000/post', { title })
    setTitle('')
  }
  return (
    <div className='container'>
      <h2>Create A Post</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default PostCreate

// const http = require('http');
require('dotenv').config()
require('./database/connection.js')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const Note = require('./database/models/Note.js')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')
// app.use((req, res, next) => {
//   console.log('middleware')
//   // ENtra aqui y hacemos la logica luego damos a next
//   next()
// })

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hola mundo</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  // const note = notes.find((note) => note.id === Number(id))
  Note.findById(id).then(note => {
    if (note) {
      res.json(note)
    } else { res.status(404).end() }
  }).catch(err => {
    next(err)
  })
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNote = {
    body: note.body,
    title: note.title,
    userId: note.userId
  }

  Note.findByIdAndUpdate(id, newNote, { new: true })
    .then(result => {
      res.json(result)
    }).catch(error => {
      next(error)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(error => {
    next(error)
  })
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  if (!note.body || !note.title) {
    return res.status(400).json({
      error: 'required "body or title" field is missing'
    })
  }

  const newNote = new Note({
    body: note.body,
    title: note.title,
    userId: note.userId
  })

  newNote.save().then(savedNote => {
    res.json(savedNote)
  })
})
// manejo de errores
app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

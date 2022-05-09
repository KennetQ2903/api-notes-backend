// const http = require('http');
require('dotenv').config()
require('./database/connection.js')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const Note = require('./database/models/Note.js')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')

app.use(cors())

Sentry.init({
  dsn: 'https://717caa52e24f45f18f7499d75636f6a0@o1239500.ingest.sentry.io/6390860',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

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
    return note
      ? res.json(note)
      : res.status(404).end()
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

app.post('/api/notes', (req, res, next) => {
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
  }).catch(error => {
    next(error)
  })
})

// manejo de errores
app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

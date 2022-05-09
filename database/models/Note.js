const { Schema, model } = require('mongoose')
const noteSchema = new Schema({
  userId: Number,
  title: String,
  body: String
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

// const noteSchema = new mongoose.Schema({
//   userId: Number,
//   title: String,
//   body: String
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   userId: 1,
//   title: 'Nota creada desde backend mongo',
//   body: 'MongoDB es increible, nami'
// })

// note.save().then(result => {
//   console.log(`Nota creada, ${result}`)
//   mongoose.connection.close()
// }).catch(err => {
//   console.log(`Error creando la nota, error: ${err}`)
// })

// Note.find({}).then(res => {
//   console.log(res)
// })

module.exports = Note

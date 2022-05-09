const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

mongoose.connect(connectionString).then(() => {
  console.log('Database MongoDB Connected')
}).catch(err => {
  console.log(`Database connection error: ${err}`)
})

process.on('uncaughtException', () => {
  console.log('Error en el proceso, cerrando conexion')
  mongoose.connection.close()
})

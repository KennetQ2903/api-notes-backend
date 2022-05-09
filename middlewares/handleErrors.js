module.exports = (error, req, res, next) => {
  console.log(error.message)
  // ruta final significa que ninguna de las anteriores coincidio es un 404 not found
  res.send('<h1 style="margin: auto;" >ups... Parece que algo ha salido mal con tu peticion</h1>')
  // res.status(400).end()
  if (error.name === 'CastError') {
    res.status(400).end()
  } else {
    res.status(500).end()
  }
}

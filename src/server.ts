import app from './app'

const port = '3333'
try {
  app.listen(port)
  console.log('Server is running ⚡ on localhost:' + port)
} catch (err) {
  console.log('Connection failed: ' + err)
}

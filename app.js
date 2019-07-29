const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const chance = require('chance')()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
  const name = chance.name()
  socket.broadcast.emit('chat message', { user: name, msg: `I joined the chat`, style: 'color: red;' })
  socket.on('disconnect', () => {
    socket.broadcast.emit('chat message', { user: name, msg: `I left the chat`, style: 'color: red;' })
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: name, msg: msg, style: 'none' })
  })
})

const port = 3000

http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

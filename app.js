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
  socket.broadcast.emit('chat message', name + 'has joined the chat')
  socket.on('disconnect', () => {
    socket.broadcast.emit('chat message', name + ' has left the chat')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', name + ' >> ' + msg)
  })
})

http.listen(3000, () => {
  console.log('now listening')
})

import { Server} from "socket.io"
import { Chance} from "chance"
const chance = new Chance()

const injectSocketIO = (server) => {
    const io = new Server(server)

    io.on('connection', (socket) => {
        const name = chance.name()
        io.emit('join',  { type: "join", user: name, msg: " joined the chat" })
        socket.on('disconnect', () => {
          socket.broadcast.emit('leave',  { type: "leave", user: name, msg: " left the chat" })
        })
      
        socket.on('message', (msg) => {
          io.emit('message', { type: "message", user: name, msg: msg })
        })

        socket.on('typing', (typing) => {
          socket.broadcast.emit('typing', {user: name, typing: typing.typing })
        })
    })

    console.log("Socket.IO server running")
}

export default injectSocketIO
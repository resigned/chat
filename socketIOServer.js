import { Server} from "socket.io"
import { Chance} from "chance"
const chance = new Chance()

const injectSocketIO = (server) => {
    const io = new Server(server)

    io.on('connection', (socket) => {
        const name = chance.name()
        socket.broadcast.emit('message', { user: name, msg: `>> joined the chat` })
        socket.on('disconnect', () => {
          socket.broadcast.emit('message', { user: name, msg: `>> left the chat` })
        })
      
        socket.on('message', (msg) => {
          io.emit('message', { user: name, msg: msg })
        })
    })

    console.log("Socket.IO server running")
}

export default injectSocketIO
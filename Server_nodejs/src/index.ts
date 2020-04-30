import * as express from 'express'
import * as socketio from 'socket.io'
import * as Http from 'http'

//////////////////////////////////////////////////////////

const app = express()
const server = new Http.Server(app)
const io = socketio(server)
server.listen(80)
const downlinkNsp = io.of('/downlink')

//////////////////////////////////////////////////////////

app.use(express.static('public'))

//////////////////////////////////////////////////////////

setInterval(() => {
  let rooms = io.of('/downlink').adapter.rooms
  for (const room in rooms) {
    if (rooms.hasOwnProperty(room)) {
      if (!room.includes('downlink')) {
        io.of('/downlink').in(room).emit('update', [room, 'salut'])
      }
    }
  }
}, 5000)

//////////////////////////////////////////////////////////

function isSocketInRoom(socket: string, room: string) {
  let rooms = io.of('/downlink').adapter.rooms
  if (rooms.hasOwnProperty(room)) {
    if (rooms[room].sockets.hasOwnProperty(socket)) {
      return true
    }
  }
  return false
}

//////////////////////////////////////////////////////////

function joinRoom(socket: socketio.Socket, appId: string) {
  if (!isSocketInRoom(socket.id, appId)) {
     console.log(`added socket ${socket.id} to room ${appId}`)
    socket.join(appId)
  } else {
     console.log(`socket ${socket.id} already in room ${appId}`)
  }
  socket.emit('roomJoined', appId)
}

//////////////////////////////////////////////////////////

downlinkNsp.on('connection', (socket: socketio.Socket) => {
  socket.on('joinRoom', (appId: string) => {
    joinRoom(socket, appId)
  })
})

//////////////////////////////////////////////////////////
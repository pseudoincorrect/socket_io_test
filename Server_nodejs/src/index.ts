import * as express from 'express'
import * as socketio from 'socket.io'
import * as Http from 'http'

//////////////////////////////////////////////////////////

const app = express()
const server = new Http.Server(app)
const io = socketio.listen(server)
server.listen(3000)
const downlinkNsp = io.of('/downlink')

//////////////////////////////////////////////////////////

app.use(express.static('public'))

//////////////////////////////////////////////////////////

setInterval(() => {
  let rooms = io.of('/downlink').adapter.rooms
  for (const room in rooms) {
    if (rooms.hasOwnProperty(room)) {
      if (!room.includes('downlink')) {
        io.of('/downlink').in(room).emit('update', `room: ${room}: salut`)
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
  console.log('in connection callback');
  
  socket.emit('connected', `socket connected to "/downlink", id: ${socket.id}`)
  socket.on('joinRoom', (appId: string) => {
    joinRoom(socket, appId)
  })
  socket.on('flutterButton', (event) => console.log(event));
})

//////////////////////////////////////////////////////////

io.on('connection', (socket: socketio.Socket) => {
  socket.emit('connected', `socket connected to "/", id: ${socket.id}`)
  socket.on('button',(data) => { console.log('button has been pushed in flutter app');
  })
})
const socket = io.connect('http://localhost')
const socketDownlink = io.connect('http://localhost/downlink')

let appId
let isUpdating

function button1() {
  appId = $.trim($('#appId').val())
  console.log(`app id ${appId}`)

  if (!isUpdating) {
    socketDownlink.emit('joinRoom', appId.toString())
    socketDownlink.on('roomJoined', (roomId) =>
      console.log(`room joined, id: ${roomId}`)
    )
    console.log('listening to update')
    socketDownlink.on('update', (msg) =>
      console.log(`room ${msg[0]} update: ${msg[1]}`)
    )
    isUpdating = true
  } else {
    console.log('already updating')
  }
}

function button2() {
  socket.emit('test', 'button2 /')
}

function button3() {
  socket.emit('test', 'button3')
}

$(document).ready(function () {
  $('#button1').click(button1)
  $('#button2').click(button2)
  $('#button3').click(button3)
  isUpdating = false
})

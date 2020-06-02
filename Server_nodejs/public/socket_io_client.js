const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGlycHN0YWNrLWFwcGxpY2F0aW9uLXNlcnZlciIsImV4cCI6MTU4ODYwMTA5NiwiaXNzIjoiY2hpcnBzdGFjay1hcHBsaWNhdGlvbi1zZXJ2ZXIiLCJuYmYiOjE1ODg1MTQ2OTYsInN1YiI6InVzZXIiLCJ1c2VybmFtZSI6Im9yZzF1c3IxIiwib3JnYW5pemF0aW9uSUQiOiIyIiwiYXBwbGljYXRpb25JRHMiOlsiMSJdLCJpYXQiOjE1ODg1MTQ2OTZ9.vnxDe27p_lcEpRNwVSjeP1nPj1lu3NzaYUcmgTDyPFI'
const host = '192.168.136.129:3000'
// const host = 'localhost:3000'
const socket = io.connect(`http://${host}`)
const socketNotification = io.connect(`http://${host}/notification`)

let appId
let isUpdating

socketNotification.on('disconnect', (_) => {
  console.log('socket disconnected')
  isUpdating = false
})

function button1() {
  appId = $.trim($('#appId').val())
  console.log(`app id ${appId}`)

  if (!isUpdating) {
    socketNotification.emit('join_room', jwtToken)

    socketNotification.on('room_joined', (msg) => console.log(msg))

    socketNotification.on('join_failed', (error_msg) =>
      console.log(`join failed, error: ${error_msg}`)
    )

    console.log('listening to update')
    socketNotification.on('notification', (msg) => console.log(msg))
    isUpdating = true
  } else {
    console.log('already updating')
  }
}

// function button1() {
//   appId = $.trim($('#appId').val())
//   console.log(`app id ${appId}`)

//   if (!isUpdating) {
//     socketNotification.emit('joinRoom', appId.toString())
//     socketNotification.on('roomJoined', (roomId) =>
//       console.log(`room joined, id: ${roomId}`)
//     )
//     console.log('listening to update')
//     socketNotification.on('update', (msg) =>
//       console.log(`room ${msg[0]} update: ${msg[1]}`)
//     )
//     isUpdating = true
//   } else {
//     console.log('already updating')
//   }
// }

function button2() {
  socketNotification.emit('test_event')
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

const express = require('express')
const http = require('http')
const app = express()

const { Server } = require('socket.io')
var cors = require('cors')
// const corsOptions = {
//   origin: 'https://gregarious-selkie-805aae.netlify.app/',
//   credentials: true, //access-control-allow-credentials:true
// }

// const corsOptions = {
//   origin: '*',
//   credentials: true,
// }

app.use(express.json())
app.use('/', (req, res) => {
  res.send('Its webrtc server for you')
})

const port = process.env.PORT || 5000

// const io = new Server(app, {
//   cors: { origin: '*', methods: '*' },
//   maxHttpBufferSize: 1e8,
// })

const server = http.createServer(app) // Create an HTTP server instance

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const emailToSocketIdMap = new Map()
const socketidToEmailMap = new Map()

io.on('connection', (socket) => {
  console.log(`Socket Connected`, socket.id)
  socket.on('room:join', (data) => {
    const { email, room } = data
    emailToSocketIdMap.set(email, socket.id)
    socketidToEmailMap.set(socket.id, email)
    io.to(room).emit('user:joined', { email, id: socket.id })
    socket.join(room)
    io.to(socket.id).emit('room:join', data)
  })

  socket.on('user:call', ({ to, offer }) => {
    io.to(to).emit('incomming:call', { from: socket.id, offer })
  })

  socket.on('call:accepted', ({ to, ans }) => {
    io.to(to).emit('call:accepted', { from: socket.id, ans })
  })

  socket.on('peer:nego:needed', ({ to, offer }) => {
    console.log('peer:nego:needed', offer)
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
  })

  socket.on('peer:nego:done', ({ to, ans }) => {
    console.log('peer:nego:done', ans)
    io.to(to).emit('peer:nego:final', { from: socket.id, ans })
  })
})

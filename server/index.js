const express = require('express')
const app = express()

const { Server } = require('socket.io')
var cors = require('cors')
const corsOptions = {
  origin: 'https://neon-jalebi-febd55.netlify.app',
  credentials: true, //access-control-allow-credentials:true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/', (req, res) => {
  res.send('Its webrtc server for you')
})
const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log('Backend server is running')
})
const io = new Server(8000, {
  cors: true,
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

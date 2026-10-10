const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

io.on('connection', (socket) => {
  console.log('Browser connected:', socket.id)

  socket.on('submit-drawing', (image) => {
    console.log('Drawing received!')
    io.emit('new-drawing', image)
  })

  socket.on('disconnect', () => {
    console.log('Browser disconnected:', socket.id)
  })
})

server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001')
})
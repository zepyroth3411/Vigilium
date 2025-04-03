const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const passwordRoutes = require('./routes/password')
const deviceRoutes = require('./routes/device')
const clienteRoutes = require('./routes/client');


const app = express()
const server = http.createServer(app) // Creamos servidor HTTP para usar con Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT']
  }
})

const PORT = process.env.PORT || 4000

// Middlewares
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', passwordRoutes)
app.use('/api', deviceRoutes)
app.use('/api', clienteRoutes)

// Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id)

  socket.on('marcarAtendido', (data) => {
    console.log('📡 Evento atendido:', data)
    // Emitir a todos menos al que marcó como atendido
    socket.broadcast.emit('eventoAtendido', data)
  })

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id)
  })
})

// Servidor corriendo
server.listen(PORT, () => {
  console.log(`🚀 Backend con Socket.IO en http://localhost:${PORT}`)
})

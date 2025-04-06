const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()
const cors = require('cors')

// Rutas
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const passwordRoutes = require('./routes/password')
const deviceRoutes = require('./routes/device')
const clienteRoutes = require('./routes/client')
const eventRoutes = require('./routes/event')
const dashboardRoutes = require('./routes/dashboard')
const bitacoraRoutes = require('./routes/logbook')
const faultReportingRoutes = require('./routes/faultReporting')

// Utilidades
const verificarDispositivosConectados = require('./utils/cronConexiones')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT']
  }
})

app.set('io', io)

const PORT = process.env.PORT || 4000

// 🔁 Verificación de conexiones cada minuto
setInterval(() => {
  console.log('⏱️ Verificando conexiones de dispositivos...')
  verificarDispositivosConectados()
}, 60 * 1000)

// 🌐 Middlewares
app.use(cors())
app.use(express.json())

// 📦 Rutas API
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', passwordRoutes)
app.use('/api', deviceRoutes)
app.use('/api', clienteRoutes)
app.use('/api', eventRoutes)
app.use('/api', dashboardRoutes)
app.use('/api/logbook', bitacoraRoutes)
app.use('/api/fault-reporting', faultReportingRoutes)

// 🔌 Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id)

  socket.on('marcarAtendido', (data) => {
    console.log('📡 Evento atendido:', data)
    socket.broadcast.emit('eventoAtendido', data)
  })

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id)
  })
})

// 🚀 Iniciar servidor
server.listen(PORT, () => {
  console.log(`✅ Backend listo en http://localhost:${PORT}`)
})

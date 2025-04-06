// utils/socket.js
import { io } from 'socket.io-client'
import { API_URL } from './config'

// Inicializa el socket con la URL de la API
const socket = io(API_URL, {
  autoConnect: true,
  transports: ['websocket'],
})

export default socket

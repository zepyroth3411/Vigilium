// utils/socket.js
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000') // Asegúrate que coincida con tu backend

export default socket
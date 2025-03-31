const express = require('express')
require('dotenv').config() // ✅ Esta es la forma correcta
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', userRoutes)

app.listen(PORT, () => {
  console.log(`🔐 Backend corriendo en http://localhost:${PORT}`)
})
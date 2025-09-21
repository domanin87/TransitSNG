require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const http = require('http')
const { initModels, sequelize } = require('./src/models')
const api = require('./src/api')
const { Server } = require('socket.io')

const app = express()
app.use(cors())
app.use(express.json())

// API routes
app.use('/api', api)

// Serve frontend static files (if built into ../frontend/dist)
const distPath = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(distPath))
// SPA fallback
app.get('*', (req,res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return res.status(404).send('Not found')
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) res.status(500).send('index.html not found; build frontend or serve it separately')
  })
})

const port = process.env.PORT || 3000
const server = http.createServer(app)

// Socket.IO
const io = new Server(server, {
  cors: { origin: process.env.SOCKET_ORIGIN || '*', methods: ['GET','POST'] }
})
io.on('connection', socket => {
  console.log('socket connected', socket.id)
  socket.on('join', room => { socket.join(room) })
  socket.on('chat message', async (msg) => {
    // broadcast to room if provided, or to all
    if (msg.room) io.to(msg.room).emit('chat message', msg)
    else io.emit('chat message', msg)
    try {
      const { Message } = require('./src/models')
      await Message.create({ orderId: msg.orderId || null, senderId: msg.senderId || null, text: msg.text })
    } catch(e){ console.error('socket save err', e.message) }
  })
})

async function start(){
  try {
    await sequelize.authenticate()
    console.log('DB connected')
    await initModels()
    await sequelize.sync({ alter: true })
    console.log('DB synced')
    server.listen(port, ()=> console.log('Server listening on', port))
  } catch(err){
    console.error('Failed to start', err)
    process.exit(1)
  }
}
start()


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { init } = require('./src/models');
const logger = require('./src/logger');
const metrics = require('./src/metrics');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

const ALLOW = (process.env.ALLOW_ORIGINS || '*').split(',').map(s=>s.trim()).filter(Boolean);
const corsOptions = ALLOW.length===0 || ALLOW.includes('*') ? {} : { origin: ALLOW };
app.use(cors(corsOptions));

// metrics
app.get('/metrics', async (req,res)=>{
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

app.get('/api/v1/health', (_req,res)=> res.json({ ok:true, now: Date.now() }));

app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/cargos', require('./src/routes/cargos'));
app.use('/api/v1/tariffs', require('./src/routes/tariffs'));
app.use('/api/v1/chat', require('./src/routes/chat'));
app.use('/api/v1/payment', require('./src/routes/payment'));
app.use('/api/v1/admin', require('./src/routes/admin'));
app.use('/api/v1/track', require('./src/routes/track'));

// serve frontend if built
const dist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(dist));
app.get('*', (req,res)=> {
  if(req.path.startsWith('/api')) return res.status(404).json({ error:'not_found' });
  res.sendFile(path.join(dist,'index.html'));
});

// create http server and socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: (process.env.ALLOW_ORIGINS||'*').split(',') } });
app.set('io', io);

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join_cargo', (cargoId) => { socket.join('cargo_'+cargoId); });
  socket.on('join_driver', (driverId) => { socket.join('driver_'+driverId); });
  socket.on('driver_location', (data) => {
    // data: { driverId, lat, lon, speed, cargoId }
    // broadcast to interested rooms
    try{ 
      if(data.cargoId) io.to('cargo_'+data.cargoId).emit('location_update', data);
      io.to('driver_'+data.driverId).emit('location_update', data);
      io.emit('location_update_all', data);
    }catch(e){ console.error('socket emit err', e); }
  });
  socket.on('message', (msg) => {
    if(msg.room) io.to(msg.room).emit('message', msg);
    else io.emit('message', msg);
  });
  socket.on('disconnect', ()=> console.log('socket disconnect', socket.id));
});

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(err.status||500).json({ error: err.message||'internal_error' });
});

const PORT = process.env.PORT || 5000;
init().then(()=> {
  server.listen(PORT, ()=> logger.info('TransitSNG backend listening on '+PORT));
}).catch(e=>{ console.error('DB init failed', e); process.exit(1); });

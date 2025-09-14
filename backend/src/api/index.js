const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Order, Tariff, Message, sequelize } = require('../models')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

// simple auth helpers
function genToken(user){ return jwt.sign({ id:user.id, role:user.role }, JWT_SECRET, { expiresIn:'30d' }) }
async function authMiddleware(req,res,next){
  const h = req.headers.authorization
  if(!h) return res.status(401).json({error:'No token'})
  const token = h.replace('Bearer ','')
  try{ const data = jwt.verify(token, JWT_SECRET); req.userId = data.id; req.userRole = data.role; next() } catch(e){ res.status(401).json({error:'Invalid token'}) }
}

// Auth
router.post('/auth/register', async (req,res)=>{
  const { name, email, password } = req.body
  if(!email||!password) return res.status(400).json({error:'email+password required'})
  const hash = await bcrypt.hash(password, 10)
  try{
    const user = await User.create({ name, email, passwordHash: hash })
    res.json({ user:{ id:user.id, email:user.email }, token: genToken(user) })
  }catch(e){ res.status(400).json({error:e.message}) }
})

router.post('/auth/login', async (req,res)=>{
  const { email, password } = req.body
  const user = await User.findOne({ where:{ email } })
  if(!user) return res.status(401).json({ error:'Invalid' })
  const ok = await bcrypt.compare(password, user.passwordHash||'')
  if(!ok) return res.status(401).json({ error:'Invalid' })
  res.json({ user:{ id:user.id, email:user.email }, token: genToken(user) })
})

// Orders
router.get('/orders', async (req,res)=>{
  const orders = await Order.findAll({ limit: 50, order:[['createdAt','DESC']] })
  res.json(orders)
})
router.post('/orders', authMiddleware, async (req,res)=>{
  const { title, origin, destination, price, currency, weight } = req.body
  const order = await Order.create({ title, origin, destination, price, currency, weight, user_id: req.userId })
  res.json(order)
})

// Tariffs
router.get('/tariffs', async (req,res)=>{
  const t = await Tariff.findAll(); res.json(t)
})

// Messages (history)
router.get('/orders/:id/messages', authMiddleware, async (req,res)=>{
  const msgs = await Message.findAll({ where:{ orderId: req.params.id }, order:[['createdAt','ASC']] })
  res.json(msgs)
})

module.exports = router

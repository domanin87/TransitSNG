require('dotenv').config()
const { sequelize, User, Order, Tariff } = require('../src/models')

async function migrate(){
  try{
    await sequelize.authenticate()
    console.log('DB OK')
    // Sync models: create missing tables (use alter true to update)
    await sequelize.sync({ alter: true })
    console.log('Sync complete')

    // Seed example tariffs and admin user if not exists
    const t = await Tariff.findAll()
    if(t.length===0){
      await Tariff.bulkCreate([ { name:'Basic', price_per_ton:100 }, { name:'Pro', price_per_ton:200 } ])
      console.log('Seeded tariffs')
    }
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@transitsng.local'
    const admin = await User.findOne({ where:{ email: adminEmail } })
    if(!admin){
      const bcrypt = require('bcrypt')
      const pass = process.env.ADMIN_PASS || 'admin123'
      const hash = await bcrypt.hash(pass, 10)
      await User.create({ name:'Admin', email: adminEmail, passwordHash: hash, role:'superadmin' })
      console.log('Created admin user', adminEmail)
    }
    process.exit(0)
  }catch(e){ console.error(e); process.exit(1) }
}
migrate()

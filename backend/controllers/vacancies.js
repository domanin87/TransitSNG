const db = require('../models'); const Vacancy = db.Vacancy;
async function listVacancies(req,res){ const lang = req.lang || req.query.lang || 'ru'; const items = await Vacancy.findAll({ order:[['id','DESC']] }); const mapped = items.map(v=>({ id:v.id, title: v['title_'+lang] || v.title_ru || '', description: v['description_'+lang] || v.description_ru || '', location: v.location, salary: v.salary })); res.json(mapped); }
async function createVacancy(req,res){ const payload = req.body; const v = await Vacancy.create(payload); res.json(v); }
module.exports = { listVacancies, createVacancy };
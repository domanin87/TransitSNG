const db = require('../models'); const News = db.News;
async function listNews(req,res){ const lang = req.lang || req.query.lang || 'ru'; const items = await News.findAll({ order:[['id','DESC']] }); const mapped = items.map(n=>({ id:n.id, title: n['title_'+lang] || n.title_ru || '', content: n['content_'+lang] || n.content_ru || '', is_published: n.is_published })); res.json(mapped); }
async function createNews(req,res){ const payload = req.body; const n = await News.create(payload); res.json(n); }
module.exports = { listNews, createNews };
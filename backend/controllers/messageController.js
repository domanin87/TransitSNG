const db = require('../models');
const Message = db.Message;

async function listForChat(req, res){
  const chatId = req.params.chatId;
  const items = await Message.findAll({ where: { chat_id: chatId }, order: [['createdAt','ASC']] });
  res.json(items);
}

async function sendMessage(req, res){
  const data = req.body; data.from_user = req.user && req.user.sub;
  const m = await Message.create(data);
  // emit via socket.io if available (server attaches io to app.locals)
  if(req.app && req.app.locals && req.app.locals.io){
    req.app.locals.io.to(data.chat_id).emit('message', m);
  }
  res.json(m);
}

module.exports = { listForChat, sendMessage };

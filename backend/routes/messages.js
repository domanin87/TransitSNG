const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');
router.get('/:chatId', ctrl.listForChat);
router.post('/', ctrl.sendMessage);
module.exports = router;

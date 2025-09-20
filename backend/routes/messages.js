const express = require('express');
const { body, validationResult } = require('express-validator');
const Chat = require('../models/Chat');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user chats
router.get('/chats', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.userId
    })
    .populate('participants.user', 'name avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific chat
router.get('/chats/:chatId', authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      'participants.user': req.userId
    })
    .populate('participants.user', 'name avatar')
    .populate('messages.sender', 'name avatar')
    .populate('cargo', 'title from to');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send message
router.post('/chats/:chatId/messages', authMiddleware, [
  body('content').notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type = 'text', attachments = [] } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      'participants.user': req.userId
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const message = {
      sender: req.userId,
      content,
      type,
      attachments
    };

    chat.messages.push(message);
    chat.lastMessage = message._id;
    await chat.save();

    await chat.populate('messages.sender', 'name avatar');
    const newMessage = chat.messages[chat.messages.length - 1];

    // Emit socket event for real-time messaging
    req.app.get('io').to(chat._id.toString()).emit('newMessage', {
      chatId: chat._id,
      message: newMessage
    });

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new chat
router.post('/chats', authMiddleware, [
  body('participants').isArray({ min: 1 }).withMessage('Participants are required'),
  body('type').isIn(['direct', 'group', 'cargo']).withMessage('Invalid chat type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { participants, type, name, cargoId } = req.body;

    // Check if direct chat already exists
    if (type === 'direct' && participants.length === 1) {
      const existingChat = await Chat.findOne({
        type: 'direct',
        'participants.user': { $all: [req.userId, participants[0]] }
      });

      if (existingChat) {
        return res.json({ chat: existingChat });
      }
    }

    const chatData = {
      type,
      participants: [{ user: req.userId }, ...participants.map(p => ({ user: p }))],
      isGroup: type === 'group',
      cargo: cargoId
    };

    if (name) chatData.name = name;

    const chat = new Chat(chatData);
    await chat.save();

    await chat.populate('participants.user', 'name avatar');
    await chat.populate('cargo', 'title from to');

    res.status(201).json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
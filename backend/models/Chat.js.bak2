const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'location'],
    default: 'text'
  },
  attachments: [{
    url: String,
    name: String,
    type: String
  }],
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    lastRead: Date
  }],
  type: {
    type: String,
    enum: ['direct', 'group', 'cargo'],
    default: 'direct'
  },
  name: String,
  avatar: String,
  isGroup: {
    type: Boolean,
    default: false
  },
  cargo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cargo'
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

chatSchema.index({ participants: 1 });
chatSchema.index({ cargo: 1 });
chatSchema.index({ 'lastMessage.createdAt': -1 });

module.exports = mongoose.model('Chat', chatSchema);
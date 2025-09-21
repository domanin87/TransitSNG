const mongoose = require('mongoose');

const tariffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: '$'
  },
  period: {
    type: String,
    enum: ['month', 'year'],
    default: 'month'
  },
  type: {
    type: String,
    enum: ['individual', 'business', 'driver'],
    required: true
  },
  level: {
    type: String,
    enum: ['basic', 'standard', 'pro', 'enterprise'],
    required: true
  },
  features: [{
    name: String,
    included: { type: Boolean, default: true },
    limit: Number
  }],
  trialPeriod: {
    type: Number,
    default: 7
  },
  isActive: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    default: 0
  },
  recommended: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tariff', tariffSchema);
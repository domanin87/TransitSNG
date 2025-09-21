const mongoose = require('mongoose');

const cargoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    city: { type: String, required: true },
    address: String,
    lat: Number,
    lng: Number
  },
  to: {
    city: { type: String, required: true },
    address: String,
    lat: Number,
    lng: Number
  },
  distance: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: '₸'
  },
  weight: {
    type: Number,
    required: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  cargoType: {
    type: String,
    enum: ['general', 'refrigerated', 'dangerous', 'fragile'],
    default: 'general'
  },
  images: [String],
  status: {
    type: String,
    enum: ['draft', 'moderation', 'approved', 'rejected', 'active', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'draft'
  },
  rejectionReason: String,
  assignedTo: {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: {
      type: String,
      licensePlate: String
    },
    assignedAt: Date
  },
  tracking: {
    currentLocation: {
      lat: Number,
      lng: Number,
      timestamp: Date
    },
    route: [{
      lat: Number,
      lng: Number,
      timestamp: Date,
      description: String
    }],
    estimatedArrival: Date,
    actualArrival: Date
  },
  payment: {
    status: { type: String, enum: ['pending', 'partial', 'paid', 'refunded'], default: 'pending' },
    amountPaid: { type: Number, default: 0 },
    method: String,
    transactionId: String
  },
  commission: {
    rate: { type: Number, default: 5 },
    amount: Number
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  insurance: {
    required: { type: Boolean, default: false },
    amount: Number,
    provider: String
  },
  requirements: [String],
  bids: [{
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
}, {
  timestamps: true
});

cargoSchema.index({ 'from.city': 1, 'to.city': 1 });
cargoSchema.index({ status: 1 });
cargoSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Cargo', cargoSchema);
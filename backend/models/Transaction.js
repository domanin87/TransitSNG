
const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['subscription', 'cargo_payment', 'withdrawal', 'refund', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: '₸'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'wallet', 'qr'],
    required: true
  },
  paymentDetails: {
    cardLast4: String,
    bankName: String,
    transactionId: String,
    stripePaymentIntentId: String
  },
  description: String,
  relatedEntity: {
    type: {
      type: String,
      enum: ['tariff', 'cargo']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.type'
    }
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
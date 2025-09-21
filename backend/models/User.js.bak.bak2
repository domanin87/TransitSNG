const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'driver', 'moderator', 'admin', 'superadmin'],
    default: 'user'
  },
  userType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  company: {
    name: String,
    taxId: String,
    address: String
  },
  avatar: {
    type: String,
    default: ''
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  verification: {
    emailToken: String,
    phoneCode: String,
    phoneCodeExpires: Date,
    documents: [{
      type: { type: String, enum: ['license', 'passport', 'vehicle_registration'] },
      url: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
      rejectionReason: String
    }]
  },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'standard', 'pro', 'enterprise'], default: 'free' },
    expiryDate: Date,
    autoRenew: { type: Boolean, default: false },
    trialUsed: { type: Boolean, default: false }
  },
  driverProfile: {
    licenseNumber: String,
    licenseExpiry: Date,
    vehicle: {
      type: { type: String, enum: ['truck', 'van', 'refrigerator', 'other'] },
      capacity: Number,
      licensePlate: String,
      photos: [String]
    },
    rating: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date
    }
  },
  balance: {
    type: Number,
    default: 0
  },
  settings: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'ru' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verification;
  return user;
};

module.exports = mongoose.model('User', userSchema);
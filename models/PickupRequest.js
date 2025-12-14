const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    eWasteItems: [
      {
        type: String,
        required: true
      }
    ],
    description: {
      type: String,
      required: true
    },
    pickupDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      enum: ['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)'],
      required: true
    },
    pickupAddress: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },
    collectorNotes: {
      type: String,
      default: null
    },
    userNotes: {
      type: String,
      default: null
    },
    weight: {
      type: Number,
      default: null // in kg
    },
    images: [
      {
        type: String
      }
    ],
    rating: {
      type: Number,
      default: null,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);

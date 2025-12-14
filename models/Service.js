const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    eWasteTypes: [
      {
        type: String,
        enum: [
          'Mobile Phones',
          'Laptops',
          'Desktop Computers',
          'Tablets',
          'Printers',
          'Monitors',
          'Keyboards',
          'Mice',
          'Chargers',
          'Cables',
          'Headphones',
          'Cameras',
          'Other Electronics'
        ]
      }
    ],
    availableDates: [
      {
        date: {
          type: Date,
          required: true
        },
        timeSlot: {
          type: String,
          enum: ['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)'],
          required: true
        },
        capacity: {
          type: Number,
          default: 10
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
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

module.exports = mongoose.model('Service', serviceSchema);

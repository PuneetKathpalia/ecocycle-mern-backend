const PickupRequest = require('../models/PickupRequest');
const Service = require('../models/Service');

exports.createPickupRequest = async (req, res) => {
  try {
    const { serviceId, eWasteItems, description, pickupDate, timeSlot, pickupAddress, userNotes } = req.body;

    if (!serviceId || !eWasteItems || !description || !pickupDate || !timeSlot || !pickupAddress) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const newPickupRequest = new PickupRequest({
      user: req.user.id,
      service: serviceId,
      collector: service.collector,
      eWasteItems,
      description,
      pickupDate,
      timeSlot,
      pickupAddress,
      userNotes
    });

    await newPickupRequest.save();
    await newPickupRequest.populate('user', 'firstName lastName email phone');
    await newPickupRequest.populate('service', 'serviceName');
    await newPickupRequest.populate('collector', 'firstName lastName email phone');

    res.status(201).json({
      message: 'Pickup request created successfully',
      pickupRequest: newPickupRequest
    });
  } catch (error) {
    console.error('Create pickup request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getUserPickupRequests = async (req, res) => {
  try {
    const pickupRequests = await PickupRequest.find({ user: req.user.id })
      .populate('service', 'serviceName description')
      .populate('collector', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(pickupRequests);
  } catch (error) {
    console.error('Get user pickup requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getCollectorPickupRequests = async (req, res) => {
  try {
    const pickupRequests = await PickupRequest.find({ collector: req.user.id })
      .populate('user', 'firstName lastName email phone address city')
      .populate('service', 'serviceName')
      .sort({ createdAt: -1 });

    res.status(200).json(pickupRequests);
  } catch (error) {
    console.error('Get collector pickup requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPickupRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const pickupRequest = await PickupRequest.findById(requestId)
      .populate('user', 'firstName lastName email phone address city')
      .populate('service', 'serviceName description')
      .populate('collector', 'firstName lastName email phone');

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }
    if (pickupRequest.user._id.toString() !== req.user.id && pickupRequest.collector._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(pickupRequest);
  } catch (error) {
    console.error('Get pickup request by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.approvePickupRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { collectorNotes } = req.body;

    const pickupRequest = await PickupRequest.findOne({ _id: requestId, collector: req.user.id });

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found or unauthorized' });
    }

    pickupRequest.status = 'approved';
    if (collectorNotes) {
      pickupRequest.collectorNotes = collectorNotes;
    }
    pickupRequest.updatedAt = Date.now();

    await pickupRequest.save();

    res.status(200).json({
      message: 'Pickup request approved successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Approve pickup request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.rejectPickupRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { collectorNotes } = req.body;

    const pickupRequest = await PickupRequest.findOne({ _id: requestId, collector: req.user.id });

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found or unauthorized' });
    }

    pickupRequest.status = 'rejected';
    if (collectorNotes) {
      pickupRequest.collectorNotes = collectorNotes;
    }
    pickupRequest.updatedAt = Date.now();

    await pickupRequest.save();

    res.status(200).json({
      message: 'Pickup request rejected successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Reject pickup request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.completePickupRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { weight, images } = req.body;

    const pickupRequest = await PickupRequest.findOne({ _id: requestId, collector: req.user.id });

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found or unauthorized' });
    }

    pickupRequest.status = 'completed';
    if (weight) {
      pickupRequest.weight = weight;
    }
    if (images) {
      pickupRequest.images = images;
    }
    pickupRequest.updatedAt = Date.now();

    await pickupRequest.save();

    res.status(200).json({
      message: 'Pickup request completed successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Complete pickup request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.ratePickupRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const pickupRequest = await PickupRequest.findOne({ _id: requestId, user: req.user.id });

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found or unauthorized' });
    }

    pickupRequest.rating = rating;
    if (feedback) {
      pickupRequest.feedback = feedback;
    }
    pickupRequest.updatedAt = Date.now();

    await pickupRequest.save();
    const allCompletedRequests = await PickupRequest.find({
      collector: pickupRequest.collector,
      status: 'completed',
      rating: { $ne: null }
    });

    const totalRating = allCompletedRequests.reduce((sum, req) => sum + req.rating, 0);
    const averageRating = totalRating / allCompletedRequests.length;

    await Service.updateMany(
      { collector: pickupRequest.collector },
      {
        rating: averageRating,
        totalRatings: allCompletedRequests.length
      }
    );

    res.status(200).json({
      message: 'Rating submitted successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Rate pickup request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelPickupRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const pickupRequest = await PickupRequest.findOne({ _id: requestId, user: req.user.id });

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found or unauthorized' });
    }

    if (pickupRequest.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed request' });
    }

    pickupRequest.status = 'cancelled';
    pickupRequest.updatedAt = Date.now();

    await pickupRequest.save();

    res.status(200).json({
      message: 'Pickup request cancelled successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Cancel pickup request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

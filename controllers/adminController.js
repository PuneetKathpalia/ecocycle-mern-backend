const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');

/**
 * Get all pending verifications (Admin only)
 */
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isVerified: false, role: 'collector' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.verifyCollector = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified, verificationNotes } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isVerified,
        verificationNotes,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: isVerified ? 'Collector verified successfully' : 'Collector rejected',
      user
    });
  } catch (error) {
    console.error('Verify collector error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCollectors = async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector', isVerified: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(collectors);
  } catch (error) {
    console.error('Get all collectors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCollectors = await User.countDocuments({ role: 'collector', isVerified: true });
    const pendingCollectors = await User.countDocuments({ role: 'collector', isVerified: false });
    const totalPickupRequests = await PickupRequest.countDocuments();
    const completedRequests = await PickupRequest.countDocuments({ status: 'completed' });
    const pendingRequests = await PickupRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await PickupRequest.countDocuments({ status: 'approved' });

    res.status(200).json({
      users: {
        total: totalUsers,
        collectors: totalCollectors,
        pendingCollectors
      },
      pickupRequests: {
        total: totalPickupRequests,
        completed: completedRequests,
        pending: pendingRequests,
        approved: approvedRequests
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

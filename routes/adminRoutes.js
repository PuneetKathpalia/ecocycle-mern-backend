const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/pending-verifications', adminController.getPendingVerifications);
router.put('/verify-collector/:userId', adminController.verifyCollector);

router.get('/users', adminController.getAllUsers);
router.get('/collectors', adminController.getAllCollectors);

router.get('/analytics', adminController.getAnalytics);

module.exports = router;

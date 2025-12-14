const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', roleMiddleware(['user']), pickupController.createPickupRequest);
router.get('/my-requests', roleMiddleware(['user']), pickupController.getUserPickupRequests);
router.put('/:requestId/rate', roleMiddleware(['user']), pickupController.ratePickupRequest);
router.put('/:requestId/cancel', roleMiddleware(['user']), pickupController.cancelPickupRequest);

router.get('/collector/requests', roleMiddleware(['collector']), pickupController.getCollectorPickupRequests);
router.put('/:requestId/approve', roleMiddleware(['collector']), pickupController.approvePickupRequest);
router.put('/:requestId/reject', roleMiddleware(['collector']), pickupController.rejectPickupRequest);
router.put('/:requestId/complete', roleMiddleware(['collector']), pickupController.completePickupRequest);

router.get('/:requestId', pickupController.getPickupRequestById);

module.exports = router;

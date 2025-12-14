const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', serviceController.getAllServices);
router.get('/:serviceId', serviceController.getServiceById);

router.post('/', authMiddleware, roleMiddleware(['collector']), serviceController.createService);
router.get('/collector/my-services', authMiddleware, roleMiddleware(['collector']), serviceController.getCollectorServices);
router.put('/:serviceId', authMiddleware, roleMiddleware(['collector']), serviceController.updateService);
router.delete('/:serviceId', authMiddleware, roleMiddleware(['collector']), serviceController.deleteService);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  assignDriver,
  getVehicleHistory
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getVehicles)
  .post(authorize('admin', 'gestionnaire'), createVehicle);

router.route('/:id')
  .get(getVehicle)
  .put(authorize('admin', 'gestionnaire'), updateVehicle)
  .delete(authorize('admin'), deleteVehicle);

router.put('/:id/assign-driver', authorize('admin', 'gestionnaire'), assignDriver);
router.get('/:id/history', getVehicleHistory);

module.exports = router;

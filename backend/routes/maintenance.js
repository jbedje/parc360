const express = require('express');
const router = express.Router();
const {
  getMaintenances,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMaintenances)
  .post(authorize('admin', 'gestionnaire', 'technicien'), createMaintenance);

router.route('/:id')
  .get(getMaintenance)
  .put(authorize('admin', 'gestionnaire', 'technicien'), updateMaintenance)
  .delete(authorize('admin'), deleteMaintenance);

module.exports = router;

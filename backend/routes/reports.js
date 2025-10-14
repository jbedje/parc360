const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getVehicleReport,
  getMaintenanceReport,
  getFuelReport,
  getDriverReport,
  getCostAnalysis
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/vehicles', authorize('admin', 'gestionnaire'), getVehicleReport);
router.get('/maintenance', authorize('admin', 'gestionnaire'), getMaintenanceReport);
router.get('/fuel', authorize('admin', 'gestionnaire'), getFuelReport);
router.get('/drivers', authorize('admin', 'gestionnaire'), getDriverReport);
router.get('/costs', authorize('admin', 'gestionnaire'), getCostAnalysis);

module.exports = router;

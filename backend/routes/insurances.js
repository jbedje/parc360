const express = require('express');
const router = express.Router();
const {
  getInsurances,
  getInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance,
  addSinistre,
  updateSinistre,
  getExpiringInsurances,
  getInsuranceStats,
  refreshAllStatuses,
} = require('../controllers/insuranceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Stats route (before :id route)
router.get('/stats', authorize('admin', 'gestionnaire'), getInsuranceStats);

// Expiring insurances alert
router.get('/alerts/expiring', authorize('admin', 'gestionnaire'), getExpiringInsurances);

// Refresh all statuses
router.put('/refresh-status', authorize('admin'), refreshAllStatuses);

// Main CRUD routes
router
  .route('/')
  .get(authorize('admin', 'gestionnaire'), getInsurances)
  .post(authorize('admin'), createInsurance);

router
  .route('/:id')
  .get(authorize('admin', 'gestionnaire'), getInsurance)
  .put(authorize('admin', 'gestionnaire'), updateInsurance)
  .delete(authorize('admin'), deleteInsurance);

// Sinistres management
router.post('/:id/sinistres', authorize('admin', 'gestionnaire'), addSinistre);
router.put('/:id/sinistres/:sinistreId', authorize('admin', 'gestionnaire'), updateSinistre);

module.exports = router;

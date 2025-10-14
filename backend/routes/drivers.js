const express = require('express');
const router = express.Router();
const {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  addInfraction,
  addFormation
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getDrivers)
  .post(authorize('admin', 'gestionnaire'), createDriver);

router.route('/:id')
  .get(getDriver)
  .put(authorize('admin', 'gestionnaire'), updateDriver)
  .delete(authorize('admin'), deleteDriver);

router.post('/:id/infractions', authorize('admin', 'gestionnaire'), addInfraction);
router.post('/:id/formations', authorize('admin', 'gestionnaire'), addFormation);

module.exports = router;

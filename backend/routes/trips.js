const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  validateTrip
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(authorize('admin'), deleteTrip);

router.put('/:id/validate', authorize('admin', 'gestionnaire'), validateTrip);

module.exports = router;

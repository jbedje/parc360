const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/stats').get(getUserStats);

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

router.route('/:id/role').put(updateUserRole);

router.route('/:id/status').put(toggleUserStatus);

module.exports = router;

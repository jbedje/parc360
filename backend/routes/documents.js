const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getExpiringDocuments,
  refreshDocumentStatus
} = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getDocuments)
  .post(authorize('admin', 'gestionnaire'), createDocument);

router.get('/expiring', getExpiringDocuments);
router.post('/refresh-status', authorize('admin'), refreshDocumentStatus);

router.route('/:id')
  .get(getDocument)
  .put(authorize('admin', 'gestionnaire'), updateDocument)
  .delete(authorize('admin'), deleteDocument);

module.exports = router;

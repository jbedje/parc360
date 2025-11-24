const express = require('express');
const router = express.Router();
const {
  exportVehiclesPDF,
  exportVehiclesExcel,
  exportDriversPDF,
  exportDriversExcel,
  exportMaintenanceExcel,
  exportFuelExcel,
  exportTripsExcel,
} = require('../controllers/exportController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin/gestionnaire role
router.use(protect);
router.use(authorize('admin', 'gestionnaire'));

// Vehicles
router.get('/vehicles/pdf', exportVehiclesPDF);
router.get('/vehicles/excel', exportVehiclesExcel);

// Drivers
router.get('/drivers/pdf', exportDriversPDF);
router.get('/drivers/excel', exportDriversExcel);

// Maintenance
router.get('/maintenance/excel', exportMaintenanceExcel);

// Fuel
router.get('/fuel/excel', exportFuelExcel);

// Trips
router.get('/trips/excel', exportTripsExcel);

module.exports = router;

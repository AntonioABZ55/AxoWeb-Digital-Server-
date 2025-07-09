const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ✅ Rutas públicas (sin autenticación)

// Obtener todos los servicios
router.get('/allServices', serviceController.getServices);

// Obtener un servicio por ID
router.get('/:id', serviceController.getServiceById);

// Obtener servicios por categoría
router.get('/category/:category', serviceController.getServicesByCategory);

// ✅ Rutas protegidas (requieren admin)

// Crear un servicio
router.post('/createService', authMiddleware, isAdmin, serviceController.createService);

// Actualizar servicio
router.put('/updateService/:id', authMiddleware, isAdmin, serviceController.updateService);

// Eliminar servicio
router.delete('/deleteService/:id', authMiddleware, isAdmin, serviceController.deleteService);

module.exports = router;
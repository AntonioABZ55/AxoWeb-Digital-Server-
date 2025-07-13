const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/allPlans', planController.getPlans);
router.get('/popularPlans', planController.getPopularPlans);
router.get('/category/:category', planController.getPlansByCategory);
router.get('/plan/:id', planController.getPlanById);

// Rutas protegidas (admin)
router.post('/createPlan', authMiddleware, isAdmin, planController.createPlan);
router.put('/updatePlan/:id', authMiddleware, isAdmin, planController.updatePlan);
router.delete('/deletePlan/:id', authMiddleware, isAdmin, planController.deletePlan);

module.exports = router;
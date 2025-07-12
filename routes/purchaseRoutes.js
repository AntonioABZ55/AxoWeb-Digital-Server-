const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ✅ Todas las rutas requieren autenticación
router.use(authMiddleware);

// 📦 Crear una nueva compra (admin o cliente)
router.post('/createPurchase', purchaseController.createPurchase);

// 📄 Obtener todas las compras (solo administrador)
router.get('/allPurchases', isAdmin, purchaseController.getAllPurchases);

// 📄 Obtener compras por cliente (admin o cliente dueño)
router.get('/purchaseClient/:clientId', purchaseController.getPurchasesByClient);

// 🔁 Cambiar estado (admin puede todo, cliente solo cancelar)
router.put('/editstatus/:purchaseId', purchaseController.updatePurchaseStatus);

// ❌ Eliminar compra (solo administrador)
router.delete('/deletePurchase/:purchaseId', isAdmin, purchaseController.deletePurchase);

// ⏳ Forzar actualización de vencidos (solo administrador)
router.put('/check-expired', isAdmin, purchaseController.updateExpiredPurchases);

module.exports = router;
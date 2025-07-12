const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Público
router.post('/registerPublic', userController.register);
router.post('/login', userController.login);

// Protegido
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, userController.updateUser);
router.put('/changePassword', authMiddleware, userController.changePassword);
router.delete('/delete', authMiddleware, userController.deleteUser);

// Ejemplo de ruta solo para administradores
router.post('/registerAdmin', authMiddleware, isAdmin, userController.register)
router.get('/allUsers', authMiddleware, isAdmin, userController.getUsers);
router.get('/admin', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Ruta accesible solo para administradores' });
});

module.exports = router;
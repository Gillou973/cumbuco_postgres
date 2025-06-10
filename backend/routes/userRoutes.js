const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

// Auth
router.post('/register', userController.register);
router.post('/login', userController.login);

// Utilisateurs (CRUD simplifié)
router.get('/', authMiddleware, userController.getUsers); // Liste des users protégée
router.get('/me', authMiddleware, userController.getProfile);
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;

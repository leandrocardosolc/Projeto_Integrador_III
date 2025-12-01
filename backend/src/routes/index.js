const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const orderController = require('../controllers/orderController');
const recommendationController = require('../controllers/recommendationController');

const upload = require('../middlewares/uploadMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Controllers existentes (ajuste se nomes diferentes)
const estabelecimentoController = require('../controllers/estabelecimentoController');
const usuarioController = require('../controllers/usuarioController');

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Usuário (exemplo protegido)
router.get('/usuarios/me', authenticate, usuarioController.getMe || ((req, res) => {
  res.status(200).json({ user: req.user });
}));

// Estabelecimentos (exemplos)
router.post('/estabelecimentos', authenticate, authorize(['admin']), estabelecimentoController.create);
router.get('/estabelecimentos', estabelecimentoController.list);
router.get('/estabelecimentos/:id', estabelecimentoController.get);
router.post('/estabelecimentos/:id/cardapio', authenticate, authorize(['admin']), estabelecimentoController.addItemCardapio);

// Upload de imagem (ex: imagem do estabelecimento)
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  res.status(200).json({ message: 'Upload concluído.', file: req.file });
});

// Reviews
router.post('/reviews', authenticate, reviewController.createReview);
router.get('/reviews', reviewController.getReviews);
router.get('/estabelecimentos/:id/reviews', reviewController.getReviewsByEstabelecimento);

// Orders
router.post('/orders', authenticate, orderController.createOrder);
router.get('/orders/me', authenticate, orderController.getMyOrders);
router.get('/estabelecimentos/:id/orders', authenticate, authorize(['admin']), orderController.getOrdersByEstabelecimento);

// Recommendations
router.get('/recommendations', authenticate, recommendationController.getRecommendations);

module.exports = router;
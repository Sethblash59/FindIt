const express = require('express');
const router = express.Router();
const adcontroller = require('../controllers/ads.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', adcontroller.getAllAds); // Récupérer toutes les annonces
router.get('/:id', adcontroller.getAdById); // Récupérer une annonce


router.post('/', authenticateToken, adcontroller.createAd); // Créer une annonce
router.put('/:id', authenticateToken, adcontroller.updateAd); // Mettre à jour une annonce
router.delete('/:id', authenticateToken, adcontroller.deleteAd); // Supprimer une annonce

module.exports = router;

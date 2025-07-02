const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); // Importer le middleware multer pour la gestion des fichiers
const adcontroller = require('../controllers/ads.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', adcontroller.getAllAds); // Récupérer toutes les annonces
router.get('/:id', adcontroller.getAdById); // Récupérer une annonce


router.post('/', authenticateToken,upload.array('images', 1), adcontroller.createAd); // Créer une annonce
router.put('/:id', authenticateToken, adcontroller.updateAd); // Mettre à jour une annonce
router.delete('/:id', authenticateToken, adcontroller.deleteAd); // Supprimer une annonce

module.exports = router;

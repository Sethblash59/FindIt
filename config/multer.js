const multer = require('multer');

// Stocker les fichiers en buffer
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    // Filtrage les fichiers selon leur taille et type
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true); 
        } else {
            cb(new Error('Type de fichier non autorisé. Seules les images (jpeg, png, gif) sont acceptées.'), false); // Rejette le fichier
        }
    }
});

module.exports = upload;
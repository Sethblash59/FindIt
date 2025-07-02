// 1. Charger les variables d'environnement en tout premier
require('dotenv').config();

// 2. Importer les modules et bibliothèques nécessaires
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Importer les modèles (doivent être importés avant d'être utilisés)
const AuthModel = require('./models/Auth.model');
const AdModel = require('./models/Ad.model');

// Importer les routeurs de l'API
const authRoutes = require('./routes/auth.routes');
const adsRoutes = require('./routes/ads.routes');

// 3. Initialiser l'application Express
const app = express();

// 4. Appliquer les middlewares globaux qui traitent le corps des requêtes
app.use(express.json()); // Crucial pour parser le JSON de req.body

// 5. Initialisation de Supabase (l'instance globale)
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseURL || !supabaseKey) {
  console.error('Erreur: Supabase URL ou Supabase Key non définis dans le fichier .env');
  process.exit(1);
}
const supabase = createClient(supabaseURL, supabaseKey);
app.use((req, res, next) => {
  req.supabase = supabase; 
  req.models = { 
    authModel: new AuthModel(supabase),
    adModel: new AdModel(supabase),
     };
  next(); 
});
app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);
app.get('/', (req, res) => {
    res.send('Bienvenue sur FindIt !');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port : http://localhost:${PORT}`);
});
require('dotenv').config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const AuthModel = require('./models/auth.model');
const AdModel = require('./models/ad.model');

const authRoutes = require('./routes/auth.routes');
const adsRoutes = require('./routes/ads.routes');

const app = express();

app.use(express.json());

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
    res.send('Bienvenue sur l\'API Trouv Tout ! Utilisez les endpoints /api/auth et /api/ads.');
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port : http://localhost:${PORT}`);
});

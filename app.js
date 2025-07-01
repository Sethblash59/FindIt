// Initialisation d'express et de dotenv
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const app = express();

app.use(express.json());

// initialisation de supabase et de l'env

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseURL || !supabaseKey) {
  console.error("Supabase URL ou Key non définis dans le fichier .env");
  process.exit(1);
}

const supabase = createClient(supabaseURL, supabaseKey);

app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

//Routes
// Authentification
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
// Annonces
const adsRoutes = require("./routes/ads.routes");
app.use("/api/ads", adsRoutes);

// test de la connexion à l'api
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API FindIt !");
});

// Port d'écoute du serveur (dois ettre à la fin du fichier)

const port = 3000;
app.listen(port, () => {
  console.log(`Serveur up : http://localhost:${port}`);
});

# FindIt-Now

Projet : Find IT - API Back-end
Description
API back-end pour une plateforme de petites annonces. Gère les utilisateurs (inscription, connexion), les annonces (création, lecture, modification, suppression) et l'upload d'images.

Technologies Clés
Node.js & Express.js : Serveur API.

Supabase : Base de données (PostgreSQL), Authentification, Stockage de fichiers.

Multer : Gestion des uploads de fichiers.

Démarrage Rapide
1. Pré-requis
Installe Node.js.

Crée un projet Supabase :

Récupère ton URL de projet et ta clé anon.

Crée les tables (users, ads, categories, images, favorites) selon le schéma que tu as.

Crée un bucket de stockage nommé annonces-images dans Supabase Storage.

Applique les politiques RLS (Row Level Security) nécessaires pour les tables (ads, images) et le bucket (annonces-images) pour permettre les opérations d'insertion, lecture, modification et suppression par les utilisateurs authentifiés.

2. Installation
Dans le dossier de ton projet :

npm install

3. Configuration de l'Environnement
Crée un fichier .env à la racine de ton projet avec :

SUPABASE_URL="TON_URL_SUPABASE"
SUPABASE_KEY="TA_CLE_ANON_SUPABASE"
PORT=3000

4. Lancer l'Application
node app.js

Le serveur démarrera sur http://localhost:3000.

Tester l'API (avec Postman)
1. Inscription
POST /api/auth/register

Body (JSON): {"email": "ton@email.com", "password": "tonmotdepasse", "nickname": "tonpseudo"}

2. Connexion (pour obtenir un access_token)
POST /api/auth/login

Body (JSON): {"email": "ton@email.com", "password": "tonmotdepasse"}

Copie le access_token de la réponse.

3. Création d'une Annonce
POST /api/ads

Headers: Authorization: Bearer TON_ACCESS_TOKEN

Body (form-data):

title: "Mon Produit"

description: "Description"

price: "100"

location: "Ville"

category_id: "1"

images (Type: File): Choisis des images.

4. Consultation des Annonces
Toutes les annonces: GET http://localhost:3000/api/ads

Une annonce spécifique: GET http://localhost:3000/api/ads/ID_DE_L_ANNONCE

5. Modification d'une Annonce
PUT /api/ads/ID_DE_L_ANNONCE

Headers: Authorization: Bearer TON_ACCESS_TOKEN, Content-Type: application/json

Body (JSON): {"price": 150.00}

6. Suppression d'une Annonce
DELETE /api/ads/ID_DE_L_ANNONCE

Headers: Authorization: Bearer TON_ACCESS_TOKEN
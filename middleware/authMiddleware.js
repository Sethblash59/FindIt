const authenticateToken = async (req, res, next) => {
    console.log('--- Début du middleware authenticateToken ---');
    const supabase = req.supabase;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('En-tête Authorization reçu:', authHeader);
    console.log('Jeton extrait (token variable):', token);

    // Tu as ajouté cette ligne, elle est redondante avec le log 'Jeton extrait' au-dessus.
    // console.log('Token reçu:', token); // Peut être supprimée

    if (!token) {
        console.log('ERREUR: Jeton manquant ou malformé dans l\'en-tête.');
        return res.status(401).json({ error: 'Pas de token pas de chocolat' });
    }

    try {
        console.log('Tentative de vérification du jeton avec supabase.auth.getUser()...');
        // Correction ici : déstructure 'data' et 'error' normalement.
        // L'objet 'user' sera accessible via data.user.
        const { data, error } = await supabase.auth.getUser(token);

        // Ces logs sont maintenant corrects car 'data' et 'error' sont définis.
        console.log('Résultat de supabase.auth.getUser() - data:', data);
        console.log('Résultat de supabase.auth.getUser() - error:', error);

        // Vérifie si une erreur est présente ou si 'data.user' est null/undefined.
        if (error || !data.user) {
            console.error('ERREUR DE VALIDATION DU JETON PAR SUPABASE:', error ? error.message : 'Utilisateur non trouvé.');
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }

        // Attache l'objet utilisateur (data.user) à la requête.
        req.user = data.user;
        console.log('Jeton vérifié avec succès. Utilisateur ID:', req.user.id);
        console.log('--- Fin du middleware authenticateToken (succès) ---');
        next();
    } catch (error) {
        // Ce bloc catch attrape les erreurs inattendues (ex: problème de connexion à Supabase).
        console.error('Erreur lors de la vérification du token:', error);
        console.error('ERREUR INATTENDUE DANS AUTHENTICATETOKEN (catch):', error.message || 'Erreur inconnue');
        return res.status(500).json({ error: 'Erreur lors de la vérification du token' });
    }
};

module.exports = authenticateToken;
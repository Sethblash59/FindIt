const authenticateToken = (req, res, next) => {
    const supabase = req.supabase;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Pas de token pas de chocolat' });
    }

    try {
        const { data: { user }, error } = supabase.auth.api.getUser(token);

        if (error || !user) {
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }
        req.user = data.user;
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return res.status(500).json({ error: 'Erreur lors de la vérification du token' });
    }
};

module.exports = authenticateToken;


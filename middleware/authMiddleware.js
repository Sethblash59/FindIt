const authenticateToken = async (req, res, next) => {
    const supabase = req.supabase;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token reçu:', token);
    if (!token) {
        return res.status(401).json({ error: 'Pas de token pas de chocolat' });
    }
    
    try {
        const { data: {user} , error:error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return res.status(500).json({ error: 'Erreur lors de la vérification du token' });
    }
};

module.exports = authenticateToken;


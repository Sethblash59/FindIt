const register = async (req, res) => {
    const { email, password, nickname } = req.body; 
    const authModel = req.models.authModel; 

    if (!email || !password || !nickname) {
        return res.status(400).json({ success: false, message: 'Email, mot de passe et nickname sont requis pour l\'inscription.' });
    }

    try {
        const result = await authModel.register(email, password, nickname);
        return res.status(201).json({
            success: true,
            message: 'Inscription réussie. Un email de confirmation pourrait vous être envoyé si activé dans Supabase.',
            user: result.user,
            profile: result.userProfile
        });

    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return res.status(400).json({ success: false, message: error.message || 'Erreur serveur interne lors de l\'inscription.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const authModel = req.models.authModel;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email et mot de passe sont requis pour la connexion.' });
    }

    try {
        const result = await authModel.login(email, password);
        return res.status(200).json({
            success: true,
            message: 'Connexion réussie.',
            user: result.user,
            session: result.session
        });

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return res.status(401).json({ success: false, message: error.message || 'Erreur serveur interne lors de la connexion.' });
    }
};

module.exports = {
    register,
    login
};
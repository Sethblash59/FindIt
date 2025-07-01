// Inscription et connexion des utilisateurs
// Inscription
const register = async (req, res) => {
    const { email, password, pseudo } = req.body;
    // Vérification des champs requis
    if (!email || !password || !pseudo) {
        return res.status(400).json({ success: false, message: 'Email, mot de passe et pseudo sont requis pour l\'inscription.' });
    }

    const supabase = req.supabase;

    try {
        const { data, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            console.error("Erreur d'authentification Supabase lors de l'inscription:", authError);
            return res.status(400).json({ success: false, message: authError.message });
        }

        // Si c'est bon, on crée le profil utilisateur
 
        const userId = data.user.id; 

        const { data: userProfile, error: profileError } = await supabase
            .from('users') 
            .insert([
            {
            id: userId,
            email: email, 
            pseudo: pseudo, 
            created_at: new Date().toISOString(), 
            }])
            .select();

        if (profileError) {
            console.error("Erreur Supabase lors de la création du profil:", profileError.message);
            return res.status(500).json({ success: false, message: "Erreur lors de la création du profil. Veuillez réessayer." });
        }

        return res.status(201).json({
            success: true,
            message: 'Inscription réussie.',
            user: { id: userId, email: email, pseudo: pseudo }
        });

    } catch (error) {
        console.error("Erreur inattendue lors de l'inscription:", error);
        return res.status(500).json({ success: false, message: 'Erreur serveur interne lors de l\'inscription.' });
    }
};

// Connexion
const login = async (req, res) => {

    const { email, password } = req.body;

    // Vérification des champs requis

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email et mot de passe sont requis pour la connexion.' });
    }

    const supabase = req.supabase;

    try {

        // Authentification avec Supabase

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            console.error("Erreur d'authentification lors de la connexion:", authError);
            return res.status(401).json({ success: false, message: authError.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Connexion réussie.',
            user: data.user, 
            session: data.session 
        });

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return res.status(500).json({ success: false, message: 'Erreur serveur lors de la connexion.' });
    }
};

module.exports = {
    register,
    login
};
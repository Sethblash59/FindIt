class AuthModel {
    constructor(supabase) {
        this.supabase = supabase;
    }

    async register(email, password, nickname) { // Utilise 'nickname' ici
        const { data, error: authError } = await this.supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }

        const userId = data.user.id;

        const { data: userProfile, error: profileError } = await this.supabase
            .from('users')
            .insert([
                {
                    id: userId,
                    nickname: nickname, // Utilise 'nickname' ici
                    created_at: new Date().toISOString(),
                }
            ])
            .select();

        if (profileError) {
            throw new Error("Erreur lors de la création du profil utilisateur: " + profileError.message);
        }

        return { user: data.user, userProfile: userProfile[0] };
    }

    async login(email, password) {
        const { data, error: authError } = await this.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }

        return { user: data.user, session: data.session };
    }
}

module.exports = AuthModel;
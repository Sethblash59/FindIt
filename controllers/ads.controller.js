const createAd = async (req, res) => {
    console.log(req.body,req.files);
    const adModel = req.models.adModel; 
    const userId = req.user.id;
    const { title, description, price, location, category_id } = req.body;
    const images = req.files;

    if (!title || !description || !price || !location || !category_id) {
        return res.status(400).json({ message: 'Tous les champs obligatoires (titre, description, prix, localité, catégorie) doivent être fournis.' });
    }

    try {
        const newAdData = await adModel.createAd({
            title, description, price, location, user_id: userId, category_id
        }, images); 

        res.status(201).json({ message: 'Annonce créée avec succès.', ad: newAdData.ad, imageUrls: newAdData.imageUrls });

    } catch (err) {
        console.error("Erreur serveur lors de la création de l'annonce:", err);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

const getAllAds = async (req, res) => {
    const adModel = req.models.adModel;
    try {
        const ads = await adModel.getAllAds();
        res.status(200).json(ads);
    } catch (err) {
        console.error("Erreur serveur lors de la récupération des annonces:", err);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

const getAdById = async (req, res) => {
    const adModel = req.models.adModel; 
    const { id } = req.params;

    try {
        const ad = await adModel.getAdById(id);

        if (!ad) {
             return res.status(404).json({ message: 'Annonce non trouvée.' });
        }

        res.status(200).json(ad);
    } catch (err) {
        if (err.code === 'PGRST116' || err.message === 'Annonce non trouvée ou non autorisée.') { 
            return res.status(404).json({ message: 'Annonce non trouvée.' });
        }
        console.error("Erreur serveur lors de la récupération de l'annonce par ID:", err);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

const updateAd = async (req, res) => {
    const adModel = req.models.adModel; 
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    try {
  
        const { data: existingAd, error: fetchError } = await req.supabase
            .from('ads')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !existingAd) {
            return res.status(404).json({ message: 'Annonce non trouvée.' });
        }

        if (existingAd.user_id !== userId) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette annonce.' });
        }

        const updatedAd = await adModel.updateAd(id, userId, updateData); 

        res.status(200).json({ message: 'Annonce mise à jour avec succès.', ad: updatedAd });

    } catch (err) {
        console.error("Erreur serveur lors de la mise à jour de l'annonce:", err);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

const deleteAd = async (req, res) => {
    const adModel = req.models.adModel;
    const userId = req.user.id;
    const { id } = req.params;

    try {
        await adModel.deleteAd(id, userId);
        res.status(204).send();

    } catch (err) {
        if (err.message === 'Annonce non trouvée ou non autorisée.') {
            return res.status(404).json({ message: err.message });
        }
        console.error("Erreur serveur lors de la suppression de l'annonce:", err);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

module.exports = {
    createAd,
    getAllAds,
    getAdById,
    updateAd,
    deleteAd
};
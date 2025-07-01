// Fonction pour créer une annonce
const createAd = async (req, res) => {
  const supabase = req.supabase;
  const userId = req.user.id;
  const { title, description, price, location, category_id } = req.body;

  if (!title || !description || !price || !location || !category_id) {
    return res
      .status(400)
      .json({
        message:
          "Tous les champs sont obligatoires (titre, description, prix, localité, catégorie) doivent être fournis",
      });
  }

  try {
    const { data, error } = await supabase
      .from("ads")
      .insert([
        {
          title,
          description,
          price,
          location,
          user_id: userId,
          category_id,
        },
      ])
      .select();

    // erreur création annonce
    if (error) {
      console.error("Erreur supabase lors de la création de l'annonce:", error);
      return res
        .status(500)
        .json({
          message: "Erreur lors de la création de l'annonce",
          details: error.message,
        });
    }
    // message si la création est bonne
    res
      .status(201)
      .json({ message: "Annonce créée avec succès.", ad: data[0] });
  } catch (err) {
    console.error("Erreur lors de la création de l'annonce:", err);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

// Fonction pour consulter toutes les annonces
const getAllAds = async (req,res) => {
  const supabase = req.supabase;
  try {
    const { data, error } = await supabase
      .from("ads")
      .select(`*`)
      if (error) {
        console.error("Erreur supabase lors de la récupération des annonces:", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des annonces", details: error.message });
      }
      res.status(200).json(data);
  } catch (err) {
    console.error("Erreur lors de la récupération des annonces:", err);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

// Fonction pour consulter une annonce par son ID

const getAdById = async (req, res) => {
  const supabase = req.supabase;
  const {id} = req.params;

  try {
    const { data, error } = await supabase
      .from("ads")
      .select(`*`)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      console.error("Erreur supabase lors de la récupération de l'annonce:", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'annonce", details: error.message });
    }
    if (!data) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'annonce:", err);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

// Fonction pour mettre à jour une annonce

const updateAd = async (req, res) => {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    try {

        const { data: existingAd, error: fetchError } = await supabase
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

        const { data, error } = await supabase
            .from('ads')
            .update(updateData)
            .eq('id', id)
            .select(); 

        if (error) {
            console.error("Erreur Supabase lors de la mise à jour de l'annonce:", error);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'annonce.', details: error.message });
        }

        res.status(200).json({ message: 'Annonce mise à jour avec succès.', ad: data[0] });
    } catch (err) {
        console.error("Erreur serveur lors de la mise à jour de l'annonce:", err);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

// Fonction pour supprimer une annonce
const deleteAd = async (req, res) => {
    const supabase = req.supabase;
    const userId = req.user.id; 
    const { id } = req.params; 
    try {
        const { data: existingAd, error: fetchError } = await supabase
            .from('ads')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !existingAd) {
            return res.status(404).json({ message: 'Annonce non trouvée.' });
        }

        if (existingAd.user_id !== userId) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette annonce.' });
        }

        // 2. Supprimer l'annonce
        const { error } = await supabase
            .from('ads')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Erreur Supabase lors de la suppression de l'annonce:", error);
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce.', details: error.message });
        }

        res.status(204).send();
    } catch (err) {
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
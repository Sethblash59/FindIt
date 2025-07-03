const { v4: uuidv4 } = require('uuid');

class AdModel {
    constructor(supabase) {
        this.supabase = supabase;
    }

    async createAd(adDetails, images) {
        const { data: adData, error: adError } = await this.supabase
            .from('ads')
            .insert([adDetails])
            .select();

        if (adError) {
            throw adError;
        }

        const adId = adData[0].id;
        const uploadedImageUrls = [];

        if (images && images.length > 0) {
            for (const image of images) {
                const fileExtension = image.originalname.split('.').pop();
                const fileName = `${uuidv4()}.${fileExtension}`;
                const filePath = `${adId}/${fileName}`;

                const { data: uploadData, error: uploadError } = await this.supabase.storage
                    .from('annonces-images')
                    .upload(filePath, image.buffer, {
                        contentType: image.mimetype,
                    });

                if (uploadError) {
                    console.error("Erreur d'upload d'image vers Supabase Storage:", uploadError);
                    continue;
                }

                const { data: publicUrlData } = this.supabase.storage
                    .from('annonces-images')
                    .getPublicUrl(filePath);

                const publicUrl = publicUrlData.publicUrl;
                uploadedImageUrls.push(publicUrl);

                const { error: imageDbError } = await this.supabase
                    .from('images')
                    .insert([
                        {
                            id: uuidv4(),
                            ad_id: adId,
                            url: publicUrl,
                            uploaded_at: new Date().toISOString()
                        }
                    ]);

                if (imageDbError) {
                    console.error("Erreur lors de l'insertion de l'URL de l'image dans la DB:", imageDbError);
                }
            }
        }
        return { ad: adData[0], imageUrls: uploadedImageUrls };
    }

    async getAllAds() {
        const { data, error } = await this.supabase
            .from('ads')
            .select(`
                *,
                users (id, nickname, location, phone),
                images (id, url)
            `);
        if (error) throw error;
        return data;
    }

    async getAdById(id) {
        const { data, error } = await this.supabase
            .from('ads')
            .select(`
                *,
                users (id, nickname, location, phone),
                images (id, url)
            `)
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async updateAd(adId, userId, updateData) {
        // Vérification de la propriété de l'annonce
        const { data, error } = await this.supabase
            .from('ads')
            .update(updateData)
            .eq('id', adId)
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        return data[0];
    }

     async deleteAd(adId, userId) {
        // 1. Récupérer l'annonce et ses images pour vérifier la propriété et obtenir les URLs des images
        const { data: existingAd, error: fetchError } = await this.supabase
            .from('ads')
            .select(`
                user_id,
                images (url, id)
            `)
            .eq('id', adId)
            .single();

            // L'annonce n'existe pas ou il y a une erreur de récupération
        if (fetchError || !existingAd) {
            throw new Error("Annonce non trouvée.");
        }

        // L'utilisateur n'est pas le propriétaire
        if (existingAd.user_id !== userId) {
            throw new Error("Vous n'êtes pas autorisé à supprimer cette annonce.");
        }

        // 2. Supprimer les images associées de Supabase Storage et de la table 'images'
        if (existingAd.images && existingAd.images.length > 0) {
            const imagePathsToDelete = existingAd.images.map(img => {
                const parts = img.url.split('public/annonces-images/');
                return parts.length > 1 ? parts[1] : null; 
            }).filter(path => path !== null); 

            const imageIdsToDelete = existingAd.images.map(img => img.id);

            // Supprimer des fichiers du Storage
            if (imagePathsToDelete.length > 0) {
                const { error: storageDeleteError } = await this.supabase.storage
                    .from('annonces-images')
                    .remove(imagePathsToDelete);

                if (storageDeleteError) {
                    console.error("Erreur lors de la suppression des images du Storage:", storageDeleteError);

                }
            }

            // Supprimer les entrées des images de la table 'images'
            if (imageIdsToDelete.length > 0) {
                const { error: dbDeleteError } = await this.supabase
                    .from('images')
                    .delete()
                    .in('id', imageIdsToDelete);

                if (dbDeleteError) {
                    console.error("Erreur lors de la suppression des entrées d'images de la DB:", dbDeleteError);

                }
            }
        }

        // 3. Supprimer l'annonce principale de la table 'ads'
        const { error: adDeleteError } = await this.supabase
            .from('ads')
            .delete()
            .eq('id', adId)
            .eq('user_id', userId);

        if (adDeleteError) {
            console.error("Erreur Supabase lors de la suppression de l'annonce:", adDeleteError);
            throw adDeleteError; 
        }
        return true; 
    }
}

module.exports = AdModel;
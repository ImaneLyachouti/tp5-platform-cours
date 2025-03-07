const express = require("express");
const router = express.Router();
const Cours = require("../Model/coursModel");


// 1 - Récupérer tous les cours
router.get("/all", (req, res) => {
    Cours.find()
        .then(courses => res.status(200).json(courses))
        .catch(() => res.status(500).json({ message: "Erreur lors de la récupération des cours" }));
});

// 2 - Ajouter un cours
router.post("/add", (req, res) => {
    const { id, titre, professeur_id, description, prix } = req.body;
    if (!id || !titre || !professeur_id || !prix) {
        return res.status(400).json({ message: "Tous les champs obligatoires" });
    }

    const newCours = new Cours({ id, titre, professeur_id, description, prix });
    newCours.save()
        .then(cours => res.status(201).json(cours))
        .catch(() => res.status(500).json({ message: "Erreur lors de l'ajout du cours" }));
});

// 3 - Mettre à jour un cours
router.put("/update/:id", (req, res) => {
    Cours.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
        .then(cours => cours ? res.status(200).json(cours) : res.status(404).json({ message: "Cours non trouvé" }))
        .catch(() => res.status(500).json({ message: "Erreur lors de la mise à jour du cours" }));
});

// 4 - Supprimer un cours
router.delete("/delete/:id", (req, res) => {
    Cours.findOneAndDelete({ id: req.params.id })
        .then(cours => cours ? res.status(200).json({ message: "Cours supprimé avec succès" }) : res.status(404).json({ message: "Cours non trouvé" }))
        .catch(() => res.status(500).json({ message: "Erreur lors de la suppression du cours" }));
});

// 5 - Rechercher un cours par titre
router.get("/search", (req, res) => {
    Cours.find({ titre: new RegExp(req.query.titre, "i") })
        .then(courses => res.status(200).json(courses))
        .catch(() => res.status(500).json({ message: "Erreur lors de la recherche des cours" }));
});

module.exports = router;

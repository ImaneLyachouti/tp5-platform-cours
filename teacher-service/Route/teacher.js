const express = require("express");
const router = express.Router();
const Teacher = require("../Model/teacherModel");
const Cours = require("../../cours-service/Model/coursModel"); 
const verifyToken = require("../Middleware/verifyToken"); 
// 1 - Récupérer tous les professeurs
router.get("/all", verifyToken, (req, res) => {
    Teacher.find()
        .then(teachers => res.status(200).json(teachers))
        .catch(() => res.status(500).json({ message: "Erreur lors de la récupération des professeurs" }));
});
// 2 - Ajouter un nouveau professeur
router.post("/add", verifyToken, (req, res) => {
    const { id, name, bio } = req.body;
    if (!id || !name || !bio) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    const newTeacher = new Teacher({ id, name, bio });
    newTeacher.save()
        .then(teacher => res.status(201).json(teacher))
        .catch(() => res.status(500).json({ message: "Erreur lors de l'ajout du professeur" }));
});
// 3 - Attribuer un cours à un professeur
router.post("/assign/:professeur_id/:cours_id", verifyToken, (req, res) => {
    const { professeur_id, cours_id } = req.params;
    Cours.findOne({ id: cours_id })
        .then(course => {
            if (!course) {
                return res.status(404).json({ message: "Cours non trouvé" });
            }
            Teacher.findOne({ id: professeur_id })
                .then(teacher => {
                    if (!teacher) {
                        return res.status(404).json({ message: "Professeur non trouvé" });
                    }
                    teacher.courses.push(cours_id);
                    teacher.save()
                        .then(updatedTeacher => res.status(200).json(updatedTeacher))
                        .catch(() => res.status(500).json({ message: "Erreur lors de l'attribution du cours au professeur" }));
                })
                .catch(() => res.status(500).json({ message: "Erreur lors de la recherche du professeur" }));
        })
        .catch(() => res.status(500).json({ message: "Erreur lors de la recherche du cours" }));
});

// 4 - Retourner les étudiants inscrits à un cours
router.get("/enrolledStudents/:cours_id", verifyToken, (req, res) => {
    const { cours_id } = req.params;
    Cours.findOne({ id: cours_id })
        .then(course => {
            if (!course) {
                return res.status(404).json({ message: "Cours non trouvé" });
            }
            const enrolledStudents = course.students;
            res.status(200).json(enrolledStudents);
        })
        .catch(() => res.status(500).json({ message: "Erreur lors de la recherche des étudiants" }));
});
module.exports = router;

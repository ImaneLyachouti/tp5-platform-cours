const express = require("express");
const router = express.Router();
const Student = require("../Model/studentModel");
const Cours = require("../../cours-service/Model/coursModel");
const verifyToken = require("../Middleware/verifyToken");

// 1-Récupérer tous les étudiants
router.get("/all", verifyToken, (req, res) => {
  Student.find()
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json({ message: "Erreur lors de la récupération des étudiants", error: err }));
});

// 2-Ajouter un nouvel étudiant
router.post("/add", verifyToken, (req, res) => {
  const { id, nom, email } = req.body;
  
  if (!id || !nom || !email) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires" });
  }

  const newStudent = new Student({ id, nom, email });
  
  newStudent.save()
    .then(student => res.status(201).json(student))
    .catch(err => res.status(500).json({ message: "Erreur lors de l'ajout de l'étudiant", error: err }));
});

// 3-Inscrire un étudiant à un cours
router.post("/enroll/:etudiant_id/:cours_id", verifyToken, (req, res) => {
  const { etudiant_id, cours_id } = req.params;
  Student.findOne({ id: etudiant_id })
    .then(student => {
      if (!student) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
      Cours.findOne({ id: cours_id })
        .then(course => {
          if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
          }
          if (course.prix === 0) { 
            return res.status(400).json({ message: "Le cours n'est pas disponible" });
          }
          student.cours.push(cours_id);
          student.save()
            .then(updatedStudent => res.status(200).json(updatedStudent))
            .catch(err => res.status(500).json({ message: "Erreur lors de l'inscription de l'étudiant", error: err }));
        })
        .catch(err => res.status(500).json({ message: "Erreur lors de la recherche du cours", error: err }));
    })
    .catch(err => res.status(500).json({ message: "Erreur lors de la recherche de l'étudiant", error: err }));
});
// 4-Retourner les cours auxquels un étudiant est inscrit
router.get("/enrolledCourses/:etudiant_id", verifyToken, (req, res) => {
  const { etudiant_id } = req.params;

  Student.findOne({ id: etudiant_id })
    .then(student => {
      if (!student) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
      Cours.find({ id: { $in: student.cours } })
        .then(courses => res.status(200).json(courses))
        .catch(err => res.status(500).json({ message: "Erreur lors de la récupération des cours", error: err }));
    })
    .catch(err => res.status(500).json({ message: "Erreur lors de la recherche de l'étudiant", error: err }));
});
module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/authModel");
const verifyToken = require("../Middleware/verifyToken");

//  1-Inscription d'un utilisateur
router.post("/register", async (req, res) => {
    const { id, name, email, password } = req.body;
   if (!id || !name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ id, name, email, password: hashedPassword });
try {
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2-Connexion
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });
   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// 3-Récupérer les informations
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;

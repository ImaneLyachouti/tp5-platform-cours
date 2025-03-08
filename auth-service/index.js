const express=require('express');
const app=express();
require("dotenv").config();
const mongoose = require('mongoose');
const port=3003;
app.use(express.json());
const PORT = process.env.PORT || 3003;
const URL_MONGOOSE = process.env.URL_MONGOOSE;
const DBNAME = process.env.DBNAME;
mongoose.connect(`mongodb://localhost:27017/tp6`)
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));
const UserRoute=require('./Route/auth');
app.use('/user',UserRoute);
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});


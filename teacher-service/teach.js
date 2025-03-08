const express=require('express');
const app=express();
const mongoose = require('mongoose');
const port=3002;
app.use(express.json());
const PORT = process.env.PORT || 3002;
const URL_MONGOOSE = process.env.URL_MONGOOSE;
const DBNAME = process.env.DBNAME;
mongoose.connect(`mongodb://localhost:27017/tp6`)
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));
const TeacherRoute=require('./Route/teacher');
app.use('/teacher',TeacherRoute);
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});


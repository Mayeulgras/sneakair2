const fs = require('fs');
const express = require('express');
const cors = require('cors'); // Importez le module cor
const app = express();
const port = 3072;

app.use(cors());

app.get('/recherche', (req, res) => {
    const termeRecherche = req.query.name; // Récupère le terme de recherche de l'URL
    fs.readFile('all_data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier');
            return;
        }

        const utilisateurs = JSON.parse(data);
        const resultat = utilisateurs.filter(u => u.attributes.name.toLowerCase().includes(termeRecherche.toLowerCase()));

        res.json(resultat);
    });
});

app.get('/', (req, res) => {
    // Lire le fichier JSON
    fs.readFile('all_data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parser le contenu JSON
        const jsonData = JSON.parse(data);

        // Envoyer le contenu en réponse
        res.setHeader('Content-Type', 'application/json');
        res.json(jsonData);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});

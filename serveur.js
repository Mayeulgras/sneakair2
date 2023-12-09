const fs = require('fs');
const express = require('express');
const cors = require('cors'); // Importez le module cor
const app = express();
const port = 3072;

app.use(cors());
app.use(express.json());

// app.get('/recherche', (req, res) => {
//     const termeRecherche = req.query.name; // Récupère le terme de recherche de l'URL
//     fs.readFile('all_data.json', 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send('Erreur lors de la lecture du fichier');
//             return;
//         }

//         const utilisateurs = JSON.parse(data);
//         const resultat = utilisateurs.filter(u => u.attributes.name.toLowerCase().includes(termeRecherche.toLowerCase()));

//         res.json(resultat);
//     });
// });

// app.get('/', (req, res) => {
//     // Lire le fichier JSON
//     fs.readFile('all_data.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading JSON file:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Parser le contenu JSON
//         const jsonData = JSON.parse(data);

//         // Envoyer le contenu en réponse
//         res.setHeader('Content-Type', 'application/json');
//         res.json(jsonData);
//     });
// });

app.get('/recherche', (req, res) => {
    const termeRecherche = req.query.silhouette; // Récupère le terme de recherche de l'URL
    fs.readFile('all_data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier');
            return;
        }

        const utilisateurs = JSON.parse(data);

        // Si le terme de recherche est vide, renvoie tous les produits
        if (!termeRecherche) {
            res.json(utilisateurs);
            return;
        }

        // Filtrer les produits en fonction du terme de recherche
        const resultat = utilisateurs.filter(u => u.attributes.silhouette.toLowerCase().includes(termeRecherche.toLowerCase()));

        res.json(resultat);
    });
});


let wishlist = [];

try {
    const wishlistData = fs.readFileSync('wishlist.json', 'utf8');
    wishlist = JSON.parse(wishlistData);
} catch (error) {
    console.error('Error reading wishlist file:', error);
}

// Route pour ajouter une sneaker à la wishlist
app.post('/wishlist', (req, res) => {
    const sneakerToAdd = req.body;

    // Vérifier si la sneaker est déjà dans la wishlist
    const existingSneaker = wishlist.find(s => s.id === sneakerToAdd.id);

    if (!existingSneaker) {
        wishlist.push(sneakerToAdd);

        // Enregistrer la wishlist dans le fichier JSON
        fs.writeFile('wishlist.json', JSON.stringify(wishlist), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to wishlist file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200).send('Sneaker ajoutée à la wishlist avec succès.');
        });
    } else {
        res.status(400).send('La sneaker est déjà dans la wishlist.');
    }
});

app.delete('/wishlist/:accountId/sneakers/:sneakerId', (req, res) => {
    const accountId = req.params.accountId;
    const sneakerId = req.params.sneakerId;

    // Lire le fichier wishlist.json
    try {
        const wishlistData = fs.readFileSync('wishlist.json', 'utf8');
        const wishlistArray = JSON.parse(wishlistData);
        // Trouver l'index de la sneaker dans la wishlist
        const indexToRemove = wishlistArray.findIndex(sneaker => String(sneaker.id) === sneakerId);

        if (indexToRemove !== -1) {
            // Supprimer la sneaker de la wishlist
            wishlistArray.splice(indexToRemove, 1);

            // Réécrire le fichier wishlist.json
            fs.writeFileSync('wishlist.json', JSON.stringify(wishlistArray));

            console.log(`Sneaker with ID ${sneakerId} removed from wishlist for account ${accountId}`);
            res.status(200).json({ message: 'Sneaker removed from wishlist successfully' });
        } else {
            res.status(404).json({ error: 'Sneaker not found in wishlist' });
        }
    } catch (error) {
        console.error('Error removing sneaker from wishlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/wishlist/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    const wishlist = getWishlist(accountId);
    res.json(wishlist);
});


function getWishlist(accountId) {
    try {
        const wishlistData = fs.readFileSync('wishlist.json', 'utf8');
        return JSON.parse(wishlistData);
    } catch (error) {
        console.error('Error reading wishlist file:', error);
        return [];
    }
}

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});

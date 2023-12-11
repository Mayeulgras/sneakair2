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

        const chaussures = JSON.parse(data);

        // Si le terme de recherche est vide, renvoie tous les produits
       

        // Filtrer les produits en fonction du terme de recherche
        const resultat = chaussures.filter(u => u.attributes.silhouette.toLowerCase().includes(termeRecherche.toLowerCase()));
        const itemsPerPage = req.query.itemsPerPage || 77;
        const page = req.query.page || 1;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const sneakersForPage = resultat.slice(startIndex, endIndex);
        res.json(sneakersForPage);
        
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
app.post('/wishlist/:accountId', (req, res) => {
    const sneakerToAdd = req.body;
    const accountId = req.params.accountId

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


// app.post('/wishlist/:accountId', (req, res) => {
//     const accountId = req.params.accountId;

//     // Lire le fichier wishlist.json
//     try {
//         let wishlistData = fs.readFileSync('wishlist.json', 'utf8');
//         let wishlistArray = JSON.parse(wishlistData);

//         // Trouver l'utilisateur dans la wishlist ou créer une nouvelle entrée s'il n'existe pas
//         let userWishlist = wishlistArray.find(entry => entry.accountId === accountId);

//         if (!userWishlist) {
//             userWishlist = { accountId, sneakers: [] };
//             wishlistArray.push(userWishlist);
//         }

//         // Ajouter la sneaker à la wishlist de l'utilisateur
//         const sneakerToAdd = {
//             id: req.body.id,
//             image: req.body.image,
//             silhouette: req.body.silhouette,
//             // ... autres propriétés de la sneaker
//         };

//         userWishlist.sneakers.push(sneakerToAdd);

//         // Réécrire le fichier wishlist.json
//         fs.writeFileSync('wishlist.json', JSON.stringify(wishlistArray));

//         console.log(`Sneaker ajoutée à la wishlist de l'utilisateur ${accountId} avec succès.`);
//         res.status(200).json({ message: 'Sneaker added to wishlist successfully' });
//     } catch (error) {
//         console.error('Error adding sneaker to wishlist:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

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


app.get('/sneakers', (req, res) => {
    try {
        const rawData = fs.readFileSync('all_data.json', 'utf8');
        const allSneakers = JSON.parse(rawData);
        res.json(allSneakers);
    } catch (error) {
        console.error('Error reading all_data.json:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', (req, res) => {
    const username = req.query.username; // Récupère le terme de recherche de l'URL
    const password = req.query.password; // Récupère le terme de recherche de l'URL
    fs.readFile('login.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier');
            return;
        }

        const utilisateurs = JSON.parse(data);

        // Filtrer les produits en fonction du terme de recherche
        const resultat = utilisateurs.filter(u => u.login.toLowerCase() == username.toLowerCase() && u.password.toLowerCase() == password.toLowerCase());
        if (resultat.length == 0) {
            res.status(401).send('Erreur lors de la connexion');
            return;
        }else if (resultat.length == 1) {
            res.status(200).send('Connexion réussi');
            guid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            fs.writeFileSync('guid.json', JSON.stringify(guid));
            return guid;
        }
    });
});

let collection = [];

try {
    const collectionData = fs.readFileSync('collection.json', 'utf8');
    collection = JSON.parse(collectionData);
} catch (error) {
    console.error('Error reading collection file:', error);
}

// Route pour ajouter une sneaker à la wishlist
app.post('/collection/:accountId', (req, res) => {
    const sneakerToAdd = req.body;
    const accountId = req.params.accountId;

    // Vérifier si la sneaker est déjà dans la wishlist
    const existingSneaker = collection.find(s => s.id === sneakerToAdd.id);

    if (!existingSneaker) {
        collection.push(sneakerToAdd);

        // Enregistrer la wishlist dans le fichier JSON
        fs.writeFile('collection.json', JSON.stringify(collection), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to collection file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200).send('Sneaker ajoutée à la collection avec succès.');
        });
    } else {
        res.status(400).send('La sneaker est déjà dans la collection.');
    }
});

app.delete('/collection/:accountId/sneakers/:sneakerId', (req, res) => {
    const accountId = req.params.accountId;
    const sneakerId = req.params.sneakerId;

    // Lire le fichier wishlist.json
    try {
        const collectionData = fs.readFileSync('collection.json', 'utf8');
        const collectionArray = JSON.parse(collectionData);
        // Trouver l'index de la sneaker dans la wishlist
        const indexToRemove = collectionArray.findIndex(sneaker => String(sneaker.id) === sneakerId);

        if (indexToRemove !== -1) {
            // Supprimer la sneaker de la wishlist
            collectionArray.splice(indexToRemove, 1);

            // Réécrire le fichier wishlist.json
            fs.writeFileSync('collection.json', JSON.stringify(collectionArray));

            console.log(`Sneaker with ID ${sneakerId} removed from collection for account ${accountId}`);
            res.status(200).json({ message: 'Sneaker removed from collection successfully' });
        } else {
            res.status(404).json({ error: 'Sneaker not found in collection' });
        }
    } catch (error) {
        console.error('Error removing sneaker from collection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/collection/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    const collection = getCollection(accountId);
    res.json(collection);
});


function getCollection(accountId) {
    try {
        const collectionData = fs.readFileSync('collection.json', 'utf8');
        return JSON.parse(collectionData);
    } catch (error) {
        console.error('Error reading collection file:', error);
        return [];
    }
}


app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});

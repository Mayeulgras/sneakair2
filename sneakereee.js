let filteredData = null;
function rechercheMAJ() {
  var champRecherche = document.getElementById("recherche");
  var recherche = champRecherche.value;
  document.getElementById("PAIRES").innerHTML = "";

  chargerJsonData(recherche);
  printData(filteredData);
}


function chargerJsonData(recherche, idS) {
  $.getJSON(`http://127.0.0.1:3072/recherche?silhouette=${recherche}&page=${currentPage}`, function (jsondata) {
    // filteredData = searchByName(jsondata, recherche);
    printData(jsondata);

    // printS(idS, jsondata);
  });
}


function displayAllSneakers() {
  chargerJsonData("");
}


function searchByName(jsondata, searchTerm) {
  // Convertir le terme de recherche en minuscules pour une recherche insensible à la casse
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filtrer les données pour ne garder que les éléments dont le nom contient le terme de recherche
  const filteredData = jsondata.filter((item) =>
    item.attributes.silhouette.toLowerCase().includes(lowerCaseSearchTerm)
  );

  return filteredData;
}

function printData(jsondata) {
  //si il y a des données au format json
  if (jsondata != null) {
    // création de la ligne contenant les films
    var ligneData = document.createElement("tr");
    //création d'une cellule contenant tout les films
    var celluleData = document.createElement("td");
    // const firstTenItems = jsondata.slice(0, 49);
    // fetch("all_data.json")
    //   .then((response) => response.json())
    //   .then((jsondata) => {
    // Trouver l'élément où vous voulez ajouter les images
    const PAIRES = document.getElementById("PAIRES");

    // Parcourir les données
    // console.log(jsondata);
    if (Array.isArray(jsondata)) {
      //   jsondata.forEach((sneakertab) => {
      jsondata.forEach((sneaker) => {
        // const sneaker = sneakertab.data[0];
        // console.log(sneaker);
        var table = document.createElement("table");
        // Créer un nouvel élément img
        const img = document.createElement("img");

        // Définir le src de l'img à l'URL de l'image de la sneaker
        // console.log(sneaker.attributes.image.original);
        img.src = sneaker.attributes.image.small;
        if (sneaker.attributes.image.small == "true" | sneaker.attributes.image.small == "false" | sneaker.attributes.image.small == "[]" | sneaker.attributes.image.small == "" | sneaker.attributes.image.small == "undefined") {
          img.src = "p.jpg";
        }
        img.alt = sneaker.attributes.name;

        // let accountId = "u1";
        let addToWishlistButton = document.createElement("button");
        addToWishlistButton.className = "addToWishlistButton";
        addToWishlistButton.textContent = "Ajouter à wishlist";
        addToWishlistButton.addEventListener("click", function () {
          if (sneaker && sneaker.attributes && sneaker.attributes.image) {
            addToWishlist(accountId, sneaker);
          } else {
            console.error(
              "Les informations de la sneaker sont manquantes ou incorrectes."
            );
          }
        });
        document
          .getElementById("showWishlist")
          .addEventListener("click", function () {
            window.location.href = "wishlist.html";
          });

          let addToCollectionButton = document.createElement("button");
        addToCollectionButton.className = "addToCollectionButton";
        addToCollectionButton.textContent = "Ajouter à collection";
        addToCollectionButton.addEventListener("click", function () {
          if (sneaker && sneaker.attributes && sneaker.attributes.image) {
            addToCollection(accountId, sneaker);
          } else {
            console.error(
              "Les informations de la sneaker sont manquantes ou incorrectes."
            );
          }
        });
        document
          .getElementById("showCollection")
          .addEventListener("click", function () {
            window.location.href = "collection.html";
          });

        // Ajouter l'élément img à l'élément container
        PAIRES.appendChild(img);
        var a = document.createElement("a");
        //definir la propriété href qu est egal à  avec les paramètres idsaga et idfilm
        a.setAttribute("href", "produit.html?idS=" + sneaker.id);
        //ajouter l'image dans a
        a.appendChild(img);

        //création d'une div
        let name = document.createElement("p");
        name.innerHTML = sneaker.attributes.silhouette;

        var div = document.createElement("article");
        //la div a une class css qui s'appelle vignette
        div.className = "vignette";
        //on rajoute dans la div le lien qui est image
        div.appendChild(a);
        div.appendChild(name);
        div.appendChild(addToWishlistButton);
        div.appendChild(addToCollectionButton);
        // dans la cellule film on rajouta la div
        celluleData.appendChild(div);
        //   rajout de la cellule contenant tous les films
        ligneData.appendChild(celluleData);
        //rajout dans la table la ligne contenant tous les films
        table.appendChild(ligneData);
        //dans la div SAGAS on rajoute la table
        document.getElementById("PAIRES").appendChild(table);
      });
      // })
    }
    //   });
  }
}
// let storedUsername = localStorage.getItem("storedUsername");
// let accountId = storedUsername;
const accountId = localStorage.getItem("storedUsername");

function addToWishlist(accountId, sneaker) {
  const sneakerToAdd = {
    id: sneaker.id,
    image: sneaker.attributes.image.small,
    silhouette: sneaker.attributes.silhouette,
    // ... autres propriétés de la sneaker
  };
  const accountId2 = localStorage.getItem("storedUsername");
  fetch(`http://127.0.0.1:3072/wishlist/${accountId2}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sneakerToAdd),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Sneaker ajoutée à la wishlist avec succès.");
      } else {
        console.error(
          "Erreur lors de l'ajout à la wishlist:",
          response.statusText
        );
      }
    })
    .catch((error) => console.error("Error adding to wishlist:", error));
}

function addToCollection(accountId, sneaker) {
  const sneakerToAdd = {
    id: sneaker.id,
    image: sneaker.attributes.image.small,
    silhouette: sneaker.attributes.silhouette,
    // ... autres propriétés de la sneaker
  };
  const accountId2 = localStorage.getItem("storedUsername");

  fetch(`http://127.0.0.1:3072/collection/${accountId2}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sneakerToAdd),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Sneaker ajoutée à la collection avec succès.");
      } else {
        console.error(
          "Erreur lors de l'ajout à la collection:",
          response.statusText
        );
      }
    })
    .catch((error) => console.error("Error adding to collection:", error));
}



function inserInformation(sneaker) {
  // creation de l'image du film
  var img = document.createElement("img");
  img.className = "imageFilm";
  // on met le chemin de l'image
  img.src = sneaker.attributes.image.small;
  if (sneaker.attributes.image.small == "true" | sneaker.attributes.image.small == "false" | sneaker.attributes.image.small == "[]" | sneaker.attributes.image.small == "" | sneaker.attributes.image.small == "undefined") {
    img.src = "p.jpg";
  }
  img.alt = sneaker.attributes.name;
  // si l'image s'affiche pas on met le titre
  // pousse l'image dans la div qui a pour id imageFilm
  document.getElementById("SneakerImg").appendChild(img);

  //crée un element texte qui contient le titre
  var brand = document.createTextNode(sneaker.attributes.brand);
  document.getElementById("brand").appendChild(brand);

  //crée un element texte qui contient l'année
  var name = document.createTextNode("Nom : " + sneaker.attributes.name);
  document.getElementById("name").appendChild(name);

  //crée un element texte qui contient le de
  var gender = document.createTextNode("Genre : " + sneaker.attributes.gender);
  document.getElementById("gender").appendChild(gender);

  //crée un element texte qui contient le par
  var estimatedMarketValue = document.createTextNode(
    "Prix estimé : " + sneaker.attributes.estimatedMarketValue + "€"
  );
  document
    .getElementById("estimatedMarketValue")
    .appendChild(estimatedMarketValue);

  //crée un element texte qui contient le avec
  var retailPrice = document.createTextNode(
    "Prix de vente : " + sneaker.attributes.retailPrice + "€"
  );
  document.getElementById("retailPrice").appendChild(retailPrice);

  //crée un element texte qui contient le synopsis
  var releaseYear = document.createTextNode(
    "Année de sortie : " + sneaker.attributes.releaseYear
  );
  document.getElementById("releaseYear").appendChild(releaseYear);
}

function printS(idS, jsondata) {
  // si les id contiennent random alors on affiche un film au hasard
  if (idS == "random") {
    let randomS = jsondata[Math.floor(Math.random() * jsondata.length)];
    inserInformation(randomS);
  } else {
    // pour chaque sagas
    if (Array.isArray(jsondata)) {
      jsondata.forEach((sneaker) => {
        // si la saga en cour est a le meme id que l'id passé en parametre
        if (sneaker.id == idS) {
          // pour chaque film
          inserInformation(sneaker);
        }
      });
    }
  }
}

async function getSneakerData(sneakerId) {
  // Replace 'url-to-your-api' with the URL of your API
  let response = await fetch("all_data.json");
  let jsondata = await response.json();

  let sneakerData = jsondata.find((sneaker) => sneaker.id === sneakerId);
  return sneakerData;
}



async function login() {
    const username = document.getElementById('username').value;
    localStorage.setItem("storedUsername", username);
    const password = document.getElementById('password').value;
    accountId = username;
    try {
        const response = await fetch('login.json');
        const accounts = await response.json();

        const userAccount = accounts.find(account => account.username === username && account.password === password);

        if (userAccount) {
            document.cookie = `loggedIn=true; path=/`;
            // Rediriger vers la page index.html si la connexion réussit
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching accounts:', error);
        alert('Error fetching accounts. Please try again later.');
    }
}

// document.getElementById('loginForm').addEventListener('submit', function (event) {
//     event.preventDefault(); // Empêche le comportement par défaut du formulaire

//     const formData = new FormData(this);

//     fetch('/login', {
//         method: 'POST',
//         body: formData,
//     })
//     .then(response => {
//         if (response.ok) {
//             // Utilisateur connecté
//             return response.json();
//         } else {
//             // Utilisateur non connecté
//             throw new Error('Unauthorized');
//         }
//     })
//     .then(data => {
//         localStorage.setItem('userGUID', data);
//         // Affichez la réponse dans un élément sur votre page
//     })
//     .catch(error => console.error('Erreur lors de la requête POST:', error));
// });
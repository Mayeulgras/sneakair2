

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
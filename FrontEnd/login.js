document.addEventListener('DOMContentLoaded', () => { // Fonction gérant l'authentification ("DOMContentLoaded" sert à exécuter la fonction une fois que la page est chargée entièrement)
  const loginForm = document.querySelector('#login form'); // Sélectionne le formulaire de connexion

  loginForm.addEventListener('submit', (event) => { // Sélectionne le bouton submit du form
    event.preventDefault(); // Empeche le rechargement de la page

    // Récupère les valeurs des champs du form
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Créé l'objet body contenant les données à envoyer à l'API
    const body = {
      email: email,
      password: password
    };

    // Envoi de la requete POST à l'API pour authentification
    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) { // Vérifie si la réponse contient un token
        localStorage.setItem('token', data.token); // Stock le token dans le local storage
        window.location.href = 'index.html'; // Redirige vers l'URL souhaité
      } else {
        alert('Identifiant ou mot de passe incorrect');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'authentification', error);
      alert('Une erreur est survenue lors de l\'authentification');
    })
  })
})
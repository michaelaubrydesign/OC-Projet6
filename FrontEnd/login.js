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
        window.location.href = 'index.html'; // Redirige vers l'URL souhaité  *** FAIL ***
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



/*Step 2.2

1. Créer un eventlistener sur le bouton connecter (click)
2. Récupérer la valeur du champ email (=> variable)
3. Récupérer valeur mdp (=> variable)
4. let body = {
  email:
  password:
}
5. Interroger l'api en répliquant la page fetch (adapter)
5.5. Gestion des erreurs ( Mdp ou Identifiant invalide)
6. Extraire result.token
7. Stocker le token dans le localstorage
8. Rediriger vers la page d'accueil

9. Quand j'ai un token dans le local storage, je crée les boutons modifier (fonction au chargement de la page)


!!!!! Pas de bandeau noir en haut de la maquette
!!!!! Pas de bouton pour déplacer les projets dans la modale

Step 3.1
1. Créer eventListener sur les boutons modifier 
2. Ouvre la modale qui affiche les projets
3. Bouton supprimer projet + eventListener
4. Récupérer l'attribut Id du projet
5. Fetch method Delete
6. Norme bearer token (autorization bearer token)
7. Supprimer le projet dans la modale ET dans la galerie du site (tout ça sans refresh) (=> Modifier la variable globale)
Rappeler genererProjet avec le nouveau tableau (sans le projet dernièrement supprimé)

*/
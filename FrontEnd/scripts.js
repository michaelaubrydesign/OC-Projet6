function genererProjets(works) {
  const sectionPortfolio = document.querySelector(".gallery"); // Sélectionne la galerie
  const boutonsFiltres = document.querySelectorAll(".btn-filtre");

  const token = localStorage.getItem("token"); // Récupère la valeur associé à la clé "token" du localStorage
  const authenticated = !!token; // La technique "!!" permet de transformer une valeur en booléen
  
  
  sectionPortfolio.innerHTML = "";// Vide le contenu HTML


  for (const projet of works) {

    const sectionPortfolio = document.querySelector(".gallery");
    const projetElement = document.createElement("projet");
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;
    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = projet.title;

    sectionPortfolio.appendChild(projetElement);
    projetElement.appendChild(imageProjet);
    projetElement.appendChild(nomProjet);

  }


  if (authenticated) {
    sectionPortfolio.classList.add("authenticated");
    boutonsFiltres.forEach((bouton) => {
      bouton.style.display = "none";
    });
  } else {
    sectionPortfolio.classList.remove("authenticated");
    boutonsFiltres.forEach((bouton) => {
      bouton.style.display = "block";
    });

    const modifyButtons = document.querySelectorAll(".btn-modify");

    modifyButtons.forEach((button) => {
      button.style.display= "none";
    })
  }
}


const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();
genererProjets(works);

/*fetch('http://localhost:5678/api/works')
  .then(response => {
    response.json()
      .then(works => {
        console.log(works);
        genererProjets(works)
      })
  })*/


const boutonsFiltres = document.querySelectorAll(".btn-filtre");// Je sélectionne tous les éléments ayant la classe ".btn-filtre"

boutonsFiltres.forEach((bouton) => {// Pour chaque bouton de boutonsFiltres
  bouton.addEventListener("click", () => { // Ajoute un événement au click
    const categoryId = bouton.getAttribute("data-category-id"); // Récupère le data-category-id
    filtrerProjetsParCategorie(categoryId, works);

    boutonsFiltres.forEach((btn) => {
      if (btn === bouton) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });
});

function filtrerProjetsParCategorie(categoryId, works) {
  if (categoryId === "0") {
    genererProjets(works); // Affiche tous les projets
    return;
  }

  // Filtre les projets en fonction de la catégorie
  const projetsFiltres = works.filter((projet) => {
    return projet.categoryId === parseInt(categoryId);
  });

  // Appele la fonction pour générer les projets filtrés
  genererProjets(projetsFiltres);
}



let modal = null                                   // Variable init à null -> Stocker référence de la modal ouverte

const openModal = function (e) {                   // Fonction -> Appelée lorsque l'utilisateur clique sur un élément déclencheur de la modale (param 'e')
  e.preventDefault()                               // Annule le comportement par défault -> Empêche refresh ou redirect
  const target = document.querySelector(e.target.getAttribute('href')) // Variable -> Récupère l'élément cible de la modal
  target.style.display = null                      // Réinitialise la valeur display -> Affiche la modal
  modal = target
  modal.addEventListener('click', closeModal)     // Listener click -> appeler fonction closeModal
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal) // Listener click -> bouton 
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation) // Listener click -> wrapper (stopPropagation)
}

const closeModal = function (e) {                 // Fonction pour fermer la modal
  if (modal === null) return                      // Vérifie sur modal est null -> Sinon stop la fonction ici
  e.preventDefault()
  modal.style.display = "none"                    // Remet la valeur display: none pour cacher la modal
  modal.removeEventListener('click', closeModal)  
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal = null                                    // Variable modal -> null : pas de modal ouverte
}

const stopPropagation = function (e) {
  e.stopPropagation()                             // Empêche la propagation de l'événement
}

document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', openModal)
})
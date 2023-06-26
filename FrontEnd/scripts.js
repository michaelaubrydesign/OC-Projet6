function genererProjets(works) {
  // Sélectionne les éléments du DOM
  const sectionPortfolio = document.querySelector(".gallery");
  const sectionModal = document.querySelector(".modal-gallery");
  const boutonsFiltres = document.querySelectorAll(".btn-filtre");

  // Vérifie l'authentification
  const token = localStorage.getItem("token");
  const authenticated = !!token;

  // Efface le contenu des 'gallery' et 'modal-gallery'
  sectionPortfolio.innerHTML = "";
  sectionModal.innerHTML = "";

  // Génère les projets dans la 'gallery'
  for (const projet of works) {

    // Crée les éléments et définit l'URL de l'image du projet
    const projetElement = document.createElement("figure");
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;

    // Ajoute l'attribut "data-project-id" pour identifier chaque projet
    projetElement.setAttribute("data-project-id", projet.id);

    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = projet.title;

    // Ajoute les éléments à leurs parents respectifs
    sectionPortfolio.appendChild(projetElement);
    projetElement.appendChild(imageProjet);
    projetElement.appendChild(nomProjet);
  }

  // Génère les projets dans la "modal-gallery"
  for (const projet of works) {

    const projetElement = document.createElement("figure");
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;

    const supprimerProjet = document.createElement("div"); // Crée une <div> pour le bouton de suppression
    supprimerProjet.className = "delete-photo"; // Ajoute la classe 'delete-photo'
    supprimerProjet.setAttribute("data-project-id", projet.id); // Définit un attribut 'data-project-id' sur supprimerProjet pour stocker l'ID du projet

    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = "éditer";

    sectionModal.appendChild(projetElement);
    projetElement.appendChild(imageProjet);
    projetElement.appendChild(nomProjet);
    projetElement.appendChild(supprimerProjet);
  }

  // Suppression projet
  const deleteButtons = document.querySelectorAll('.delete-photo'); // Sélectionne tous les boutons de suppression

  deleteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      // Récupère l'ID du projet à partir de l'attribut 'data-project-id' du bouton
      const projectId = button.getAttribute('data-project-id'); 
      // Récupère le token d'authentification depuis le localStorage
      const token = localStorage.getItem('token'); 

      if (token) {
        fetch(`http://localhost:5678/api/works/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // Inclut le token d'authentification dans les en-têtes de la requête
          }
        })
          .then(response => {
            if (response.ok) {
              // Supprime le projet dans la 'modal-gallery'
              const projetElement = button.closest('figure'); // Recherche l'élément HTML parent le plus proche du bouton
              projetElement.remove();

              // Filtre le tableau 'works' en ne conservant que les projets dont l'ID est différent de celui supprimé
              works = works.filter((project) => project.id !== projectId);

              // Supprime le projet dans la 'gallery' si l'utilisateur est authentifié
              const projetGalleryElement = document.querySelector(`.gallery.authenticated figure[data-project-id="${projectId}"]`);
              if (projetGalleryElement) {
                projetGalleryElement.remove();
              }
            } else {
              console.error('Erreur lors de la suppression du projet');
            }
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du projet', error);
          });
      } else {
        console.error('Token non trouvé');
      }
    });
  });


  // Gère l'affichage des boutons filtres et modifier en fonction de authenticated
  if (authenticated) {
    sectionPortfolio.classList.add("authenticated"); // Ajoute la classe 'authenticated' à la section 'gallery'
    boutonsFiltres.forEach((bouton) => {
      bouton.style.display = "none"; // Masque tous les boutons filtres
    });
  } else {
    sectionPortfolio.classList.remove("authenticated"); // Supprime la classe 'authenticated' de la section 'gallery'
    boutonsFiltres.forEach((bouton) => {
      bouton.style.display = "block"; // Affiche tous les boutons filtres
    });

    const modifyButtons = document.querySelectorAll(".btn-modify"); // Sélectionne tous les boutons 'modifier'

    modifyButtons.forEach((button) => {
      button.style.display = "none"; // Masque tous les boutons 'modifier'
    });
  }
}

// Requête GET pour récupérer les projets
const response = await fetch('http://localhost:5678/api/works');
// Convertis la réponse en JSON et stock le résultat dans 'works'
const works = await response.json();
// Génère les projets avec les données récupérées
genererProjets(works);


const boutonsFiltres = document.querySelectorAll(".btn-filtre");

// Ajoute un écouteur d'événement 'click' à chaque bouton de filtre
boutonsFiltres.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const categoryId = bouton.getAttribute("data-category-id"); // Récupère l'ID de catégorie à partir de l'attribut 'data-category-id' du bouton
    filtrerProjetsParCategorie(categoryId, works); // Appelle la fonction filtrerProjetsParCategorie pour filtrer les projets en fonction de la catégorie sélectionnée

    // Itère sur tous les boutons de filtre
    boutonsFiltres.forEach((btn) => {
      if (btn === bouton) {
        btn.classList.add("active"); // Ajoute la classe 'active' au bouton cliqué
      } else {
        btn.classList.remove("active"); // Supprime la classe 'active' des autres boutons pour les désactiver visuellement
      }
    });
  });
});

function filtrerProjetsParCategorie(categoryId, works) {
  if (categoryId === "0") {
    genererProjets(works);
    return;
  }

  // Filtre les projets en ne conservant que ceux ayant un categoryId correspondant à l'ID de catégorie spécifié
  const projetsFiltres = works.filter((projet) => {
    return projet.categoryId === parseInt(categoryId);
  });

  genererProjets(projetsFiltres); // Génère les projets filtrés
}


let modal = null;
let previousModal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href')); // Récupère la cible de la modale à partir de l'attribut 'href' du lien cliqué
  target.style.display = 'block'; // Affiche la modale
  previousModal = modal; // Stocke la modale précédent dans 'previousModal'
  modal = target; // Stocke la nouvelle modale  dans 'modal'

  // Ajoute des écouteurs d'événements pour gérer la fermeture de la modale et empêcher la propagation de l'événement
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return; // Si aucune modale n'est ouverte, arrête la fonction
  e.preventDefault();
  modal.style.display = 'none'; // Masque la modale

  // Supprime les écouteurs d'événement
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null; // Réinitialise la variable 'modal' à null pour indiquer qu'aucun modal n'est ouvert

  // Réinitialise les champs du formulaire de la modale
  const inputPhoto = document.getElementById('inputPhoto');
  const inputTitre = document.getElementById('inputTitre');
  const selectCategorie = document.getElementById('selectCategorie');
  inputPhoto.value = '';
  inputTitre.value = '';
  selectCategorie.value = '0';

  // Supprime l'aperçu de l'image s'il existe
  const areaInputPhoto = document.querySelector('.areaInputPhoto');
  const existingPreview = areaInputPhoto.querySelector('.preview-image');
  if (existingPreview) {
    areaInputPhoto.removeChild(existingPreview);
  }

  // Vérifie à nouveau les champs du formulaire
  checkInputs(); 
};

const stopPropagation = function (e) {
  e.stopPropagation(); // Arrête la propagation de l'événement pour éviter les interactions indésirables avec d'autres éléments
};

// Ajoute un écouteur d'événement 'click' à tous les boutons qui ouvrent un modal
document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', openModal);
});

const backToPreviousModal = function (e) {
  e.preventDefault();
  const previousModalId = e.currentTarget.getAttribute('href'); // Récupère l'ID du modal précédent à partir de l'attribut 'href' du lien cliqué
  const previousModal = document.querySelector(previousModalId);

  if (previousModal && modal) {
    modal.style.display = 'none'; // Masque la modale actuelle
    previousModal.style.display = 'block'; // Affiche la modale précédente

    // Supprime les écouteurs d'événements pour gérer la fermeture de la modale et empêcher la propagation de l'événement
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // Met à jour la variable 'modal' avec le modal précédent
    modal = previousModal;

    // Rajoute les écouteurs d'événments
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
  }
};

// Ajoute un écouteur d'événement 'click' au bouton de retour de la modale
const backButton = document.querySelector('.modal-wrapper-back');
backButton.addEventListener('click', backToPreviousModal);



// Vérifie le contenu des champs inputs pour activer le bouton 'Valider'
const checkInputs = function () {
  const inputPhoto = document.getElementById('inputPhoto');
  const inputTitre = document.getElementById('inputTitre').value.trim();
  const selectCategorie = document.getElementById('selectCategorie').value;

  const btnValider = document.getElementById('btnValider');

  // Vérifie si les inputs sont vides et une catégorie sélectionnée
  const isInputPhotoValid = inputPhoto.files.length > 0;
  const isInputTitreValid = inputTitre !== '';
  const isSelectCategorieValid = selectCategorie !== '0';

  // Vérifie si tous les champs du formulaire sont valides
  const isFormValid = isInputPhotoValid && isInputTitreValid && isSelectCategorieValid;

  // Désactive le bouton "Valider" si le formulaire n'est pas valide
  btnValider.disabled = !isFormValid;
  if (isFormValid) {
    // Active le bouton "Valider" et supprime la classe 'disabled' s'il est valide
    btnValider.disabled = false;
    btnValider.classList.remove('disabled');
  } else {
    // Désactive le bouton "Valider" et ajoute la classe 'disabled' s'il n'est pas valide
    btnValider.disabled = true;
    btnValider.classList.add('disabled');
  }
};

// Ajoute des écouteurs d'événement 'input' aux champs du formulaire pour vérifier les entrées à chaque modification
document.getElementById('inputPhoto').addEventListener('input', checkInputs);
document.getElementById('inputTitre').addEventListener('input', checkInputs);
document.getElementById('selectCategorie').addEventListener('input', checkInputs);


// Empêche l'action par défault sur les boutons contenant la classe disabled
const handleBtnValiderClick = function (e) {
  if (e.target.classList.contains('disabled')) {
    e.preventDefault();
  }
};


// Ouvre la modale d'ajout de projet
const openModalAjouterPhoto = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  modal.style.display = 'none'; // Masque le modal actuel
  target.style.display = null; // Affiche la modale d'ajout de projet
  modal = target; // Met à jour la référence du modal actuel avec la nouvelle modale ouverte
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

  checkInputs();

  const inputTitre = modal.querySelector('#inputTitre');
  const selectCategorie = modal.querySelector('#selectCategorie');
  inputTitre.addEventListener('input', checkInputs);
  selectCategorie.addEventListener('change', checkInputs);
};

document.querySelector('.js-modal2').addEventListener('click', openModalAjouterPhoto);
document.getElementById('inputTitre').addEventListener('input', checkInputs);
document.getElementById('selectCategorie').addEventListener('change', checkInputs);
document.getElementById('btnValider').addEventListener('click', handleBtnValiderClick);


// Preview photo ajoutée
const inputPhoto = document.getElementById('inputPhoto');
const areaInputPhoto = document.querySelector('.areaInputPhoto');

// Écouteur d'événement pour détecter le changement de valeur dans le champ de saisie 'inputPhoto'
inputPhoto.addEventListener('change', function () {
  // Récupère le fichier sélectionné dans le champ 'inputPhoto'
  const file = inputPhoto.files[0];

  // Vérifie si un fichier a été sélectionné et s'il s'agit d'une image
  if (file && file.type.startsWith('image/')) {
    // Crée un objet FileReader pour lire le contenu du fichier
    const reader = new FileReader();

    // Définit l'action à effectuer lorsque la lecture du fichier est terminée
    reader.onload = function (e) {
      const imgPreview = document.createElement('img');
      imgPreview.src = e.target.result;
      imgPreview.classList.add('preview-image');

      // Supprime la prévisualisation existante s'il y en a une
      const existingPreview = areaInputPhoto.querySelector('.preview-image');
      if (existingPreview) {
        areaInputPhoto.removeChild(existingPreview);
        areaInputPhoto.innerHTML = '';
      }

      // Ajoute la nouvelle prévisualisation de l'image
      areaInputPhoto.appendChild(imgPreview);
    }

    reader.readAsDataURL(file);
  }
})


// Ajout projet 
const formAjout = document.getElementById('formAjout');
const sectionPortfolio = document.querySelector('.gallery');
const sectionModal = document.querySelector('.modal-gallery');

// Écouteur d'événement pour la soumission du formulaire 'formAjout'
formAjout.addEventListener('submit', (e) => {
  e.preventDefault();

  // Récupère les valeurs des champs du formulaire
  const inputPhoto = document.getElementById('inputPhoto');
  const inputTitre = document.getElementById('inputTitre');
  const selectCategorie = document.getElementById('selectCategorie');

  // Crée un objet contenant les données du formulaires en utilisant les clés correspondantes au backend
  const formData = new FormData();
  formData.append('title', inputTitre.value);
  formData.append('image', inputPhoto.files[0]);
  formData.append('category', selectCategorie.value);

  const token = localStorage.getItem('token');

  if (token) {
    // Envoie une requête POST pour ajouter un projet avec les données du formulaire
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erreur lors de la création du projet');
        }
      })
      .then(data => {
        // Ajoute le nouveau projet à la liste 'works'
        works.push(data);
        // Génère à nouveau les projets pour mettre à jour l'affichage
        genererProjets(works);
        closeModal(e);
      })
      .catch(error => {
        console.error('Erreur lors de la création du projet', error);
      });
  } else {
    console.error('Token non trouvé');
  }
});


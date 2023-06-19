function genererProjets(works) {
  const sectionPortfolio = document.querySelector(".gallery");
  const sectionModal = document.querySelector(".modal-gallery");
  const boutonsFiltres = document.querySelectorAll(".btn-filtre");

  const token = localStorage.getItem("token");
  const authenticated = !!token;

  sectionPortfolio.innerHTML = "";
  sectionModal.innerHTML = "";

  // Génère les projets dans la gallery
  for (const projet of works) {

    const projetElement = document.createElement("figure");
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;

    projetElement.setAttribute("data-project-id", projet.id);

    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = projet.title;

    sectionPortfolio.appendChild(projetElement);
    projetElement.appendChild(imageProjet);
    projetElement.appendChild(nomProjet);
  }

  // Génère les projets dans la modal
  for (const projet of works) {

    const projetElement = document.createElement("figure");
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;

    const supprimerProjet = document.createElement("div");
    supprimerProjet.className = "delete-photo";
    supprimerProjet.setAttribute("data-project-id", projet.id);

    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = "éditer";

    sectionModal.appendChild(projetElement);
    projetElement.appendChild(imageProjet);
    projetElement.appendChild(nomProjet);
    projetElement.appendChild(supprimerProjet);
  }

  // Suppression projet
  const deleteButtons = document.querySelectorAll('.delete-photo');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const projectId = button.getAttribute('data-project-id');
      const token = localStorage.getItem('token');

      if (token) {
        fetch(`http://localhost:5678/api/works/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.ok) {
              // Supprime le projet dans la modal
              const projetElement = button.closest('figure');// Recherche l'élément HTML parent le plus proche du bouton
              projetElement.remove();
              works = works.filter((project) => project.id !== projectId);// Filtre works en ne gardant que les projets ne correspondant pas au projectId

              // Supprime le projet dans la galerie
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
      button.style.display = "none";
    });
  }
}


const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();
genererProjets(works);


const boutonsFiltres = document.querySelectorAll(".btn-filtre");

boutonsFiltres.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const categoryId = bouton.getAttribute("data-category-id");
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
    genererProjets(works);
    return;
  }

  const projetsFiltres = works.filter((projet) => {
    return projet.categoryId === parseInt(categoryId);
  });

  genererProjets(projetsFiltres);
}


let modal = null;
let previousModal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = 'block';
  previousModal = modal;
  modal = target;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = 'none';
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null;

  const inputPhoto = document.getElementById('inputPhoto');
  const inputTitre = document.getElementById('inputTitre');
  const selectCategorie = document.getElementById('selectCategorie');

  inputPhoto.value = '';
  inputTitre.value = '';
  selectCategorie.value = '0';

  const areaInputPhoto = document.querySelector('.areaInputPhoto');
  const existingPreview = areaInputPhoto.querySelector('.preview-image');
  if (existingPreview) {
    areaInputPhoto.removeChild(existingPreview);
  }

  checkInputs();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', openModal);
});

const backToPreviousModal = function (e) {
  e.preventDefault();
  const previousModalId = e.currentTarget.getAttribute('href');
  const previousModal = document.querySelector(previousModalId);

  if (previousModal && modal) {
    modal.style.display = 'none';
    previousModal.style.display = 'block';
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = previousModal;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
  }
};

const backButton = document.querySelector('.modal-wrapper-back');
backButton.addEventListener('click', backToPreviousModal);



// Vérifie le contenu des champs inputs pour activer le bouton Valider
const checkInputs = function () {
  const inputPhoto = document.getElementById('inputPhoto');
  const inputTitre = document.getElementById('inputTitre').value.trim();
  const selectCategorie = document.getElementById('selectCategorie').value;

  const btnValider = document.getElementById('btnValider');

  const isInputPhotoValid = inputPhoto.files.length > 0;
  const isInputTitreValid = inputTitre !== '';
  const isSelectCategorieValid = selectCategorie !== '0';

  const isFormValid = isInputPhotoValid && isInputTitreValid && isSelectCategorieValid;

  btnValider.disabled = !isFormValid;
  if (isFormValid) {
    btnValider.disabled = false;
    btnValider.classList.remove('disabled');
  } else {
    btnValider.disabled = true;
    btnValider.classList.add('disabled');
  }
};

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
  modal.style.display = 'none';
  target.style.display = null;
  modal = target;
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

inputPhoto.addEventListener('change', function () {
  const file = inputPhoto.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imgPreview = document.createElement('img');
      imgPreview.src = e.target.result;
      imgPreview.classList.add('preview-image');

      const existingPreview = areaInputPhoto.querySelector('.preview-image');
      if (existingPreview) {
        areaInputPhoto.removeChild(existingPreview);
        areaInputPhoto.innerHTML = '';
      }

      areaInputPhoto.appendChild(imgPreview);
    }

    reader.readAsDataURL(file);
  }
})


// Ajout projet 
const formAjout = document.getElementById('formAjout');
const sectionPortfolio = document.querySelector('.gallery');
const sectionModal = document.querySelector('.modal-gallery');

formAjout.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputPhoto = document.getElementById('inputPhoto');
  const inputTitre = document.getElementById('inputTitre');
  const selectCategorie = document.getElementById('selectCategorie');

  const formData = new FormData();
  formData.append('title', inputTitre.value);
  formData.append('image', inputPhoto.files[0]);
  formData.append('category', selectCategorie.value);

  const token = localStorage.getItem('token');

  if (token) {
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
        works.push(data);
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


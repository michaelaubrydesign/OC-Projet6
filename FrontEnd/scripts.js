function genererProjets(works) {
  const sectionPortfolio = document.querySelector(".gallery");
  const sectionModal = document.querySelector(".modal-gallery");
  const boutonsFiltres = document.querySelectorAll(".btn-filtre");

  const token = localStorage.getItem("token");
  const authenticated = !!token;

  sectionPortfolio.innerHTML = "";

// Génère les projets dans la gallery
  for (const projet of works) {

    const projetElement = document.createElement("figure");
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;
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

    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = "éditer";

    sectionModal.appendChild(projetElement);
    projetElement.appendChild(imageProjet);
    projetElement.appendChild(nomProjet);
    projetElement.appendChild(supprimerProjet);
  }

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

// 
/*const fetchWorks = async () => {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();
  genererProjets(works);
}

fetchWorks();*/


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

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = null;
  modal = target;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null;

  checkInputs();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', openModal);
});

const checkInputs = function () {
  const inputTitre = document.getElementById('inputTitre').value.trim();
  const selectCategorie = document.getElementById('selectCategorie').value;

  const btnValider = document.getElementById('btnValider');

  if (inputTitre === '' || selectCategorie === '0') {
    btnValider.disabled = true;
    btnValider.classList.add('disabled');
  } else {
    btnValider.disabled = false;
    btnValider.classList.remove('disabled');
  }
};

const handleBtnValiderClick = function (e) {
  if (e.target.classList.contains('disabled')) {
    e.preventDefault();
  }
};

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

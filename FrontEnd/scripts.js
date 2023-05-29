function genererProjets(works) {
  const sectionPortfolio = document.querySelector(".gallery"); // Sélectionne la galerie
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

const tableauBoutonsFiltres = Array.from(boutonsFiltres);// Je convertis la NodeList en tableau

const categoriesIds = tableauBoutonsFiltres.map((bouton) => {// Grace à .map je parcours le tableau et pour chaque élément nommé ici "bouton"...
  return bouton.getAttribute("data-category-id");// ... je récupère le "data-category-id" grace à .getAttribute
});

boutonsFiltres.forEach((bouton) => {// Pour chaque bouton de boutonsFiltres
  bouton.addEventListener("click", () => { // Ajoute un événement au click
    const categoryId = bouton.getAttribute("data-category-id"); // Récupère le data-category-id
    filtrerProjetsParCategorie(categoryId, works);
    console.log(filtrerProjetsParCategorie);

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

  // Filtrer les projets en fonction de la catégorie
  const projetsFiltres = works.filter((projet) => {
    return projet.categoryId === parseInt(categoryId);
  });

  const sectionPortfolio = document.querySelector(".gallery");
  sectionPortfolio.innerHTML = ""; // Vide la galerie

  // Appeler la fonction pour générer les projets filtrés
  genererProjets(projetsFiltres);
}



/* Step 1.2 - Filtres des travaux :



Mentorat :
1. Récupérer les boutons de filtre (dans un tableau) - OK
2. Sur chaque bouton rattacher à un eventListener - OK
3. Récupérer le data-category-id associé au bouton - OK
4. Filtrer/Créer un nouveau tableau contenant que les projets correspondants (méthode filter)
5. Rappeler genererProjet avec le tableau filtré

Penser à modifier la méthode genererProjet pour supprimer le contenu de gallery avant de régénérer le contenu*/
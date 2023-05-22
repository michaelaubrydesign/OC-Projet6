const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();
  console.log(works);


function genererProjets(works){
    for (let i = 0; i < works.length; i++) {
        
        const projet = works[i];
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


genererProjets(works);




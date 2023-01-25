const timeStamp = "1674644661201";
const apiKey = "bdf62e3aeda733362c60b0533c4e934f";
const md5 = "87b23df46123ab2e420d98d70c633a7b";
const input = document.querySelector("#searchBox");
const searchButton = document.querySelector("#searchButton");
const mainContainer = document.querySelector("#comicsGrid");
const detailsModal = document.querySelector(".comicModal")

function searchComics(title) {
  fetch(
    `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${title}&ts=${timeStamp}&apikey=${apiKey}&hash=${md5}`
  )
    .then((response) => response.json())
    .then((parsedResponse) => {
      console.log(parsedResponse);
      parsedResponse.data.results.forEach((element) => {
        const hqId = element.id;
        const srcImage =
          element.thumbnail.path + "." + element.thumbnail.extension;
        const hqName = element.title;

        createDivComic(srcImage, hqName, hqId ,mainContainer);
      });
    });
}

function createDivComic(srcImage, name, id, destiny) {
  const divFather = document.createElement("div");
  const divChild = document.createElement("div");
  const hqName = document.createElement("text");
  const hqImg = document.createElement("img");
  const detailsButton = document.createElement("button");
  const cardButton = document.createElement("button");
  const cartIcon = document.createElement("img");
  const buttonsWrapper = document.createElement("div");
  
  buttonsWrapper.classList.add("buttonsWrapper")
  cardButton.classList.add("cardButton");
  detailsButton.classList.add("cardButton");
  divFather.classList.add("card");
  hqImg.classList.add("hqCover");

  cartIcon.src = "./assets/cart-icon.svg";
  cardButton.innerText = "Add to Cart";
  detailsButton.innerText = "Details";
  hqName.textContent = name;
  hqImg.src = srcImage;

  detailsButton.addEventListener("click", () => {
    detailsModal.innerHTML = ""
    createModal(id);
    detailsModal.style.display = "block"
  });

  divChild.appendChild(hqImg);
  divChild.appendChild(hqName);
  buttonsWrapper.appendChild(cardButton);
  buttonsWrapper.appendChild(detailsButton);
  divChild.appendChild(buttonsWrapper);
  cardButton.appendChild(cartIcon);
  divFather.appendChild(divChild);
  destiny.appendChild(divFather);
}

function createModal(id) {
  console.log(id);
  fetch(
    `https://gateway.marvel.com:443/v1/public/comics/${id}?&ts=${timeStamp}&apikey=${apiKey}&hash=${md5}`
  )
    .then((response) => response.json())
    .then((parsedResponse) => {
      console.log(parsedResponse)
      const creators = parsedResponse.data.results[0].creators.items
      
      const modalContent = document.createElement("div")
      const modalTitle = document.createElement("h1")
      const modalSeries = document.createElement("h2")
      const modalDescription = document.createElement("p")
      
      modalContent.classList.add("modalContent")
      modalTitle.innerText = parsedResponse.data.results[0].title
      modalSeries.innerText = parsedResponse.data.results[0].series.name
      modalDescription.innerHTML = parsedResponse.data.results[0].description
      
      modalContent.appendChild(modalTitle)
      modalContent.appendChild(modalSeries)
      modalContent.appendChild(modalDescription)
      detailsModal.appendChild(modalContent)
      
      if(creators.length) {
        const creatorsList = document.createElement("ul")
        const creatorsTitle = document.createElement("h3")
        creatorsTitle.innerText = "Creators"
        
        creators.forEach(creator => {
          const creatorItem = document.createElement("li")
          creatorItem.innerText = `${creator.name}, ${creator.role}`
          creatorsList.appendChild(creatorItem)
        })

        modalContent.appendChild(creatorsTitle)
        modalContent.appendChild(creatorsList)
      }
    })
}

searchButton.addEventListener("click", () => {
  mainContainer.innerHTML = "";
  let inputContent = input.value;
  searchComics(inputContent);
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    mainContainer.innerHTML = "";
    let inputContent = input.value;
    searchComics(inputContent);
  }
});

window.onclick = function(event) {
  if (event.target == detailsModal) {
    detailsModal.style.display = "none";
  }
}
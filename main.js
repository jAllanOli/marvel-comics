const timeStamp = "1674644661201";
const apiKey = "bdf62e3aeda733362c60b0533c4e934f";
const md5 = "87b23df46123ab2e420d98d70c633a7b";

const input = document.querySelector("#searchBox");
const searchButton = document.querySelector("#searchButton");
const nextButton = document.querySelector("#next");
const previousButton = document.querySelector("#previous");
const mainContainer = document.querySelector(".comicsGrid");
const detailsModal = document.querySelector(".comicModal");
const openCart = document.querySelector("#openCart");
const cartModal = document.querySelector(".cartModal");
const minimizeButton = document.querySelector("#minimizeButton");
const cartItemsContainer = document.querySelector(".cartItems");
const counterContainer = document.querySelector(".itemsCounter");
const ordersStage = document.querySelector(".cartOrders");
const deliveryStage = document.querySelector(".addressPicking");
const finalStage = document.querySelector(".finalArea");
const openDeliveryButton = document.querySelector("#toDelivery");
const returnButton = document.querySelector("#returnButton");
const finishButton = document.querySelector("#finishButton");
const homeButton = document.querySelector("#home-btn")

let offsetCounter = 0;
let cartItemsKeeper = [];

function fetchComics(offset, title) {

  if(title) {
    fetch(
      `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${title}&offset=${offset}&ts=${timeStamp}&apikey=${apiKey}&hash=${md5}`
    )
      .then((response) => response.json())
      .then((parsedResponse) => {
        
        if(parsedResponse.data.total && offsetCounter >= parsedResponse.data.total) {
          alert('Already on the last page')
          offsetCounter-=20
          return
        }

        mainContainer.innerHTML = "";
        parsedResponse.data.results.forEach((element) => {
          const hqId = element.id;
          const srcImage =
            element.thumbnail.path + "." + element.thumbnail.extension;
          const hqTitle = element.title;
  
          createDivComic(srcImage, hqTitle, hqId, mainContainer);
          return
        });

        if(!parsedResponse.data.results.length) {
          alert('No comic found')
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    fetch(
      `https://gateway.marvel.com:443/v1/public/comics?offset=${offset}&ts=${timeStamp}&apikey=${apiKey}&hash=${md5}`
    )
      .then((response) => response.json())
      .then((parsedResponse) => {
        if(!parsedResponse.data.results.length) {
          alert('No more comics to show.')
          return
        }

        mainContainer.innerHTML = "";
        parsedResponse.data.results.forEach((element) => {
          const hqId = element.id;
          const srcImage =
            element.thumbnail.path + "." + element.thumbnail.extension;
          const hqTitle = element.title;
  
          createDivComic(srcImage, hqTitle, hqId, mainContainer);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } 
}

function createDivComic(srcImage, title, id, destiny) {
  const divFather = document.createElement("div");
  const divChild = document.createElement("div");
  const hqTitle = document.createElement("text");
  const hqImg = document.createElement("img");
  const detailsButton = document.createElement("button");
  const cartButton = document.createElement("button");
  const cartIcon = document.createElement("img");
  const buttonsWrapper = document.createElement("div");

  buttonsWrapper.classList.add("buttonsWrapper");
  cartButton.classList.add("cardButton");
  cartButton.classList.add("btn");
  detailsButton.classList.add("cardButton");
  detailsButton.classList.add("btn");
  divFather.classList.add("card");
  hqImg.classList.add("hqCover");

  cartIcon.src = "./assets/cart-icon.svg";
  cartButton.innerText = "Add to Cart";
  detailsButton.innerText = "Details";
  hqTitle.textContent = title;
  hqImg.src = srcImage;

  detailsButton.addEventListener("click", () => {
    detailsModal.innerHTML = "";
    createModal(id);
    detailsModal.style.display = "block";
  });

  cartButton.addEventListener("click", () => {
    createCartItem(srcImage, title, id);
    updateCounter();
  });

  divChild.appendChild(hqImg);
  divChild.appendChild(hqTitle);
  buttonsWrapper.appendChild(cartButton);
  buttonsWrapper.appendChild(detailsButton);
  divChild.appendChild(buttonsWrapper);
  cartButton.appendChild(cartIcon);
  divFather.appendChild(divChild);
  destiny.appendChild(divFather);
}

function createModal(id) {
  fetch(
    `https://gateway.marvel.com:443/v1/public/comics/${id}?&ts=${timeStamp}&apikey=${apiKey}&hash=${md5}`
  )
    .then((response) => response.json())
    .then((parsedResponse) => {
      const creators = parsedResponse.data.results[0].creators.items;

      const modalContent = document.createElement("div");
      const modalTitle = document.createElement("h1");
      const modalSeries = document.createElement("h2");
      const modalDescription = document.createElement("p");
      const descriptions = document.createElement("div");
      const modalImg = document.createElement("img");
      const cartButton = document.createElement("button");
      const cartIcon = document.createElement("img");

      cartButton.classList.add("detailsCardButton");
      cartButton.classList.add("btn");
      modalContent.classList.add("modalContent");
      cartIcon.src = "./assets/cart-icon.svg";
      cartButton.innerText = "Add to Cart";
      modalTitle.innerText = parsedResponse.data.results[0].title;
      modalSeries.innerText = parsedResponse.data.results[0].series.name;
      modalDescription.innerHTML = parsedResponse.data.results[0].description;
      modalImg.src =
        parsedResponse.data.results[0].thumbnail.path +
        "." +
        parsedResponse.data.results[0].thumbnail.extension;

      cartButton.appendChild(cartIcon);
      descriptions.appendChild(modalTitle);
      descriptions.appendChild(modalSeries);
      descriptions.appendChild(modalDescription);
      modalContent.appendChild(modalImg);
      modalContent.appendChild(descriptions);
      detailsModal.appendChild(modalContent);

      cartButton.addEventListener("click", () => {
        createCartItem(modalImg.src, modalTitle.innerText, id);
        updateCounter();
        updateProceedButtonStatus();
      });

      descriptions.appendChild(cartButton);

      if (creators.length) {
        const creatorsList = document.createElement("ul");
        const creatorsTitle = document.createElement("h3");
        creatorsTitle.innerText = "Creators";

        creators.forEach((creator) => {
          const creatorItem = document.createElement("li");
          creatorItem.innerText = `${creator.name}, ${creator.role}`;
          creatorsList.appendChild(creatorItem);
        });
        descriptions.appendChild(creatorsTitle);
        descriptions.appendChild(creatorsList);
      }
    })
    .catch((err) => console.error(err));
}

function createCartItem(img, title, id) {
  const itemContainer = document.createElement("div");
  const itemImg = document.createElement("img");
  const itemTitle = document.createElement("p");
  const removeButton = document.createElement("button");
  const removeButtonIcon = document.createElement("img");

  const item = {
    id: id,
    title: title,
  };

  cartItemsKeeper.push(item);

  itemContainer.classList.add("cartItem");
  itemImg.classList.add("itemImg");
  itemImg.src = img;
  itemTitle.innerText = title;
  removeButtonIcon.src = "./assets/remove-icon.svg";

  itemContainer.appendChild(itemImg);
  itemContainer.appendChild(itemTitle);
  removeButton.appendChild(removeButtonIcon);
  itemContainer.appendChild(removeButton);
  cartItemsContainer.appendChild(itemContainer);

  removeButton.addEventListener("click", () => {
    cartItemsKeeper.splice(cartItemsKeeper.indexOf(item), 1);
    removeCartItem(itemContainer);
    updateProceedButtonStatus();
  });
}

function updateCounter() {
  counterContainer.innerText = `${cartItemsKeeper.length}`;
  if (cartItemsKeeper.length) {
    counterContainer.style.display = "flex";
  } else {
    counterContainer.style.display = "none";
  }
}

function removeCartItem(item) {
  cartItemsContainer.removeChild(item);
  updateCounter();
}

function proceedToDelivery() {
  ordersStage.style.display = "none";
  deliveryStage.style.display = "flex";
}

function finishOrder() {
  cartModal.style.display = "none";
  ordersStage.style.display = "flex";
  finalStage.style.display = "none";
  cartItemsContainer.innerHTML = "";
  cartItemsKeeper = [];
  updateCounter();
}

function updateProceedButtonStatus() {
  if (!cartItemsKeeper.length) {
    openDeliveryButton.disabled = true;
  } else {
    openDeliveryButton.disabled = false;
  }
}

function updateFinishButtonStatus() {
  if (!Object.keys(currentLocation).length) {
    finishButton.disabled = true;
  } else {
    finishButton.disabled = false;
  }
}

searchButton.addEventListener("click", () => {
  offsetCounter = 0;
  let inputContent = input.value;
  fetchComics(offsetCounter, inputContent);
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    offsetCounter = 0;
    mainContainer.innerHTML = "";
    let inputContent = input.value;
    fetchComics(offsetCounter, inputContent);
  }
});

window.onclick = function (event) {
  if (event.target == detailsModal) {
    detailsModal.style.display = "none";
    detailsModal.innerHTML = "";
  }
};

openCart.addEventListener("click", () => {
  cartModal.style.display = "block";
  updateProceedButtonStatus();
});

minimizeButton.addEventListener("click", () => {
  cartModal.style.display = "none";
});

openDeliveryButton.addEventListener("click", () => {
  proceedToDelivery();
  updateFinishButtonStatus();
});

returnButton.addEventListener("click", () => {
  ordersStage.style.display = "flex";
  deliveryStage.style.display = "none";
});

finishButton.addEventListener("click", () => {
  deliveryStage.style.display = "none";
  finalStage.style.display = "flex";
  setTimeout(finishOrder, 2000);
});

window.onload = fetchComics;

nextButton.addEventListener("click", () => {
  offsetCounter += 20;
  if(input.value.length) {
    fetchComics(offsetCounter, input.value);
  } else {
    fetchComics(offsetCounter);
  }
});

previousButton.addEventListener("click", () => {
  if(!offsetCounter) {
      alert('Already on the first page')
      return
  }
  offsetCounter -= 20;
  if(input.value.length) {
    fetchComics(offsetCounter, input.value);
  } else {
    fetchComics(offsetCounter);
  }
});

homeButton.onclick = fetchComics

let currentLocation = {};

var map = L.map("map").setView([-7.23718, -39.3222], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You selected: " + e.latlng.toString())
    .openOn(map);
  currentLocation = e.latlng;
  updateFinishButtonStatus();
}

map.on("click", onMapClick);
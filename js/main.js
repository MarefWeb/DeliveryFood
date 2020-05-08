'use strict'

// Assignment
const $ = function(y) { return document.querySelector(y); };
const $$ = function(y) { return document.querySelectorAll(y); };
const cartButton = $("#cart-button");
const modal = $(".modal");
const close = $(".close");
const btnAuth = $(".button-auth");
const modalAuth = $(".modal-auth");
const closeAuth = $(".close-auth");
const loginInput = $("#login");
const logInForm = $("#logInForm");
const userName = $(".user-name");
const btnOut = $(".button-out");
const btnLogin = $(".button-login");
const passwordInput = $("#password");
const alertBlock = $("#alert");
const cardsRestaurants = $(".cards-restaurants");
const logo = $(".logo");
const restaurants = $(".restaurants");
const menu = $(".menu");
const cardsMenu = $(".cards-menu");
const restaurantTitle = $(".restaurant-title");
const restaurantPrice = $(".price");
const restaurantCategory = $(".category");
const rating = $(".rating");
const btnCart = $(".button-cart");
const modalBody = $(".modal-body");
const modalPrice = $(".modal-pricetag");
const counterBtn = $(".counter-button");
const counterMinus = $(".counter-minus");
const counterPlus = $(".counter-plus");
const clearCart = $(".clear-cart");

const cart = JSON.parse(localStorage.getItem('cart')) || [];

localStorage.setItem('cart', JSON.stringify(cart));

let login = localStorage.getItem('Delivery');


// Functions
window.alert = function(title, message){
  var myElToShow = $("#alert");
  myElToShow.innerHTML = title + "</br>" + message + "<br> <a id='alertBtn'>OK</a>"; 
}

function toggleModal() {
  modal.classList.toggle('is-open');
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  console.log("авторизован");
  userName.textContent = login;

  btnCart.style.display = "flex";
  userName.style.display = 'inline';
  btnOut.style.display = 'flex';
  btnAuth.style.display = 'none';

  btnOut.addEventListener('click', logOut);

  function logOut() {
    localStorage.removeItem('Delivery');
    login = localStorage.getItem('Delivery');
    btnOut.removeEventListener('click', logOut);
    authorization();
  }
}

function notAuthorized() {
  console.log("не авторизован");  
    
  btnCart.style.display = '';
  userName.style.display = '';
  btnOut.style.display = '';
  btnAuth.style.display = 'block';

  btnLogin.addEventListener('click', logIn);
  btnAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', () => {
    loginInput.style.border = '';
    passwordInput.style.border = '';
  });

  function logIn(e) {

    e.preventDefault();
    
    if(loginInput.value.length < 1 || passwordInput.value.length < 5) {
      alertBlock.style.display = 'block';
      alert('<span>Проверьте правильность заполнения полей для входа!</span><br>', 'Логин должен содержать минимум 1 символ; <br> Пароль должен состоять минимум с 5 символов;');
      let alertBtn = $("#alertBtn");
      alertBtn.addEventListener('click', function() {
        alertBlock.style.display = '';
      })
      if(loginInput.value.length < 1) {
        loginInput.style.border = '1px solid red';
      }

      if (loginInput.value.length >= 1) {
        loginInput.style.border = '';
      }

      if(passwordInput.value.length < 5) {
        passwordInput.style.border = '1px solid red';
      }

      if(passwordInput.value.length >= 5) {
        passwordInput.style.border = '';
      }
    }

    else {
      login = loginInput.value;
      localStorage.setItem('Delivery', login); 

      loginInput.style.border = '';
      passwordInput.style.border = '';

      toggleModalAuth();
      btnLogin.removeEventListener('click', logIn);
      btnAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.reset();
      authorization();
    }
  }

}

function authorization() {
  if(login) {
    authorized();
  }

  else {
    notAuthorized();
  }
}

function createCardRestaurant({image, kitchen, name, price, stars, time_of_delivery: timeOfDelivery, products}) {
  const cardRestaurant = `
    <a class="card card-restaurant" data-products="${products}" data-components="${[name, price, stars, kitchen]}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', cardRestaurant);

}

function productCard({description, image, name, price, id}) {
  const card = `
    <div class="card"  id="${id}">
      <img src="${image}" alt="image" class="card-image">
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
        ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `;

  cardsMenu.insertAdjacentHTML('beforeend', card);
}

function openMenu(e) {
  const target = e.target;
  const restaurant = target.closest(".card-restaurant");
  
  if(restaurant) {

    if(login) {
      const [ name, price, stars, category ] = restaurant.dataset.components.split(',');
      restaurantTitle.textContent = name;
      restaurantPrice.textContent = `${price} ₽`;
      restaurantCategory.textContent = category;
      rating.textContent = stars;
      cardsMenu.textContent = '';

      menu.classList.remove("hide");
      restaurants.classList.add("hide");
      
      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(productCard);
      })
    }

    else {
      toggleModalAuth();
    }
  }
    
}

async function getData(url) {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Ошибка по адрессу ${url}, статус ошибки: ${response.status}`);
  }

  return await response.json(); 
}

function addToCart(e) {
  const target = e.target.closest('.button-add-cart');
  
  if(target) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-heading').textContent;
    const cost = card.querySelector('.card-price-bold').textContent;
    const id = card.id;

    const food = cart.find(function(item) {
      return item.id === id;
    });

    if(food) {
      food.counter += 1;
    }

    else {
      cart.push({title, cost, id, counter: 1});
    }
    
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartInner() {
  modalBody.textContent = '';

  cart.forEach(function({title, cost, id, counter}) {
    const cartRow = `
      <div class="food-row" id="${id}">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus">-</button>
          <span class="counter">${counter}</span>
          <button class="counter-button counter-plus">+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', cartRow);
  });

  const totalPrice = cart.reduce(function(res, item){
    return res + (parseFloat(item.cost) * item.counter);
  }, 0)

  modalPrice.textContent = totalPrice + ' ₽';
}

function modalCount(e) {
  const target = e.target;
  if(target.classList.contains('counter-button')) {
    const foodRow = target.closest('.food-row');
    const food = cart.find(function(item) {
      return item.id === foodRow.id;
    });
    
    if(target.classList.contains('counter-minus')) {
      food.counter--;
      if (food.counter == 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }

    if(target.classList.contains('counter-plus')) food.counter++;
    renderCartInner();
  }
}

function cancel() {
  cart.length = 0;
  renderCartInner();
}

// Event listeners
getData('./db/partners.json').then(function(data) {
  data.forEach(createCardRestaurant);
});

cartButton.addEventListener('click', function() {
  renderCartInner();
  toggleModal();
});

close.addEventListener('click', toggleModal);

logo.addEventListener('click', () => {
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
});

cardsRestaurants.addEventListener('click', openMenu);

cardsMenu.addEventListener('click', addToCart);

modalBody.addEventListener('click', modalCount);

clearCart.addEventListener('click', cancel);

// Call functions
authorization();

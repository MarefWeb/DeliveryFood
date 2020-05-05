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

  userName.style.display = 'inline';
  btnOut.style.display = 'block';
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

function createCardRestaurant() {
  const cardRestaurant = `
    <a class="card card-restaurant">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', cardRestaurant);

}

function openMenu(e) {
  const target = e.target;
  const restaurant = target.closest(".card-restaurant");
  const card = `
    <div class="card">
      <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Везувий</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
          «Халапенье», соус «Тобаско», томаты.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">545 ₽</strong>
      </div>
    </div>
  `;
  
  if(restaurant) {

    if(login) {
      menu.classList.remove("hide");
      restaurants.classList.add("hide");
  
      cardsMenu.textContent = '';
  
      cardsMenu.insertAdjacentHTML('beforeend', card);
      cardsMenu.insertAdjacentHTML('beforeend', card);
      cardsMenu.insertAdjacentHTML('beforeend', card);
    }

    else {
      toggleModalAuth();
    }
  }
    
}

// Event listeners
cartButton.addEventListener('click', toggleModal);

close.addEventListener('click', toggleModal);

logo.addEventListener('click', () => {
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
});

cardsRestaurants.addEventListener('click', openMenu);

// Call functions
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
authorization();
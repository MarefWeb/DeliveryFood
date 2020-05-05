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

let login = localStorage.getItem('Delivery');
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

cartButton.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);

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

authorization();
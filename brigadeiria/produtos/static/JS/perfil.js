// perfil.js - versão corrigida e segura

console.log('perfil.js: carregado');

/* RECUPERAR SENHA */
function abrirRecuperar(){
  const modal = document.getElementById("recuperarSenha");
  if (!modal) return console.warn('perfil.js: modal recuperarSenha não encontrado');
  modal.style.display = "flex";
}

function fecharRecuperar(){
  const modal = document.getElementById("recuperarSenha");
  if (!modal) return console.warn('perfil.js: modal recuperarSenha não encontrado');
  modal.style.display = "none";
}

/* PÁGINAS PERFIL */
document.addEventListener('DOMContentLoaded', function () {
  console.log('perfil.js: DOM pronto');

  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');

  if (!loginSection) console.error('perfil.js: #login não encontrado no DOM');
  if (!registerSection) console.error('perfil.js: #register não encontrado no DOM');
  if (!loginSection || !registerSection) return;

  // procura os wrappers de conteúdo dentro das sections (aceita .form-content-ativo OU .form-content)
  const loginContent = loginSection.querySelector('.form-content-ativo, .form-content') || loginSection;
  const registerContent = registerSection.querySelector('.form-content-ativo, .form-content') || registerSection;

  // Função genérica que mostra um elemento e esconde outro usando as classes que seu CSS já espera
  function setVisible(elementToShow, elementToHide) {
    if (!elementToShow || !elementToHide) return;

    elementToShow.classList.add('form-content-ativo');
    elementToShow.classList.remove('form-content');

    elementToHide.classList.add('form-content');
    elementToHide.classList.remove('form-content-ativo');
  }

  function showLogin() {
    console.log('perfil.js: mostrar Login');
    setVisible(loginContent, registerContent);
    history.replaceState(null, '', '#loginSection');
  }

  function showRegister() {
    console.log('perfil.js: mostrar Register');
    setVisible(registerContent, loginContent);
    history.replaceState(null, '', '#registerSection');
  }

  // conecta links <a href="#register"> e <a href="#login">
  document.querySelectorAll('a[href="#registerSection"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      showRegister();
    });
  });

  document.querySelectorAll('a[href="#loginSection"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      showLogin();
    });
  });

  // fallback: aceita data-action caso você queira trocar depois
  document.querySelectorAll('[data-action="show-register"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showRegister(); });
  });
  document.querySelectorAll('[data-action="show-login"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showLogin(); });
  });

  // respeita hash inicial
  if (location.hash === '#registerSection') {
    showRegister();
  } else {
    showLogin();
  }

  // tecla Esc volta pro login
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') showLogin();
  });
});
/* perfil.js — versão máxima de tolerância e logs */

console.log('perfil.js: carregado');

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

document.addEventListener('DOMContentLoaded', function () {
  console.log('perfil.js: DOM pronto');

  // tenta identificar as sections por vários caminhos possíveis
  let loginSection = document.getElementById('loginSection') 
      || document.getElementById('login') 
      || document.querySelector('.box-login');

  let registerSection = document.getElementById('registerSection') 
      || document.getElementById('register') 
      || document.querySelector('.box-register');

  console.log('perfil.js: encontrados:', { loginSection, registerSection });

  if (!loginSection || !registerSection) {
    console.warn('perfil.js: Não encontrou ambas as sections. Verifique IDs/classes no HTML.');
    // não encerra completamente: tenta ainda conectar links (útil em outras páginas)
  }

  // helpers seguros (checam existência)
  function addClass(el, cls) { if (el) el.classList.add(cls); }
  function removeClass(el, cls) { if (el) el.classList.remove(cls); }

  // função que mostra a section inteira (controla .ativo na section)
  function setVisibleSection(showSec, hideSec) {
    if (!showSec || !hideSec) {
      console.warn('perfil.js: setVisibleSection chamado com sec inválida', { showSec, hideSec });
      return;
    }
    addClass(showSec, 'ativo');
    removeClass(hideSec, 'ativo');

    // garantir compatibilidade com classes internas
    const showInner = showSec.querySelector('.form-content, .form-content-ativo');
    const hideInner = hideSec.querySelector('.form-content, .form-content-ativo');
    if (showInner) { addClass(showInner, 'form-content-ativo'); removeClass(showInner, 'form-content'); }
    if (hideInner) { addClass(hideInner, 'form-content'); removeClass(hideInner, 'form-content-ativo'); }
  }

  function showLogin() {
    console.log('perfil.js: showLogin() chamado');
    if (loginSection && registerSection) setVisibleSection(loginSection, registerSection);
    history.replaceState(null, '', '#login');
  }
  function showRegister() {
    console.log('perfil.js: showRegister() chamado');
    if (loginSection && registerSection) setVisibleSection(registerSection, loginSection);
    history.replaceState(null, '', '#register');
  }

  // conectar links com várias variações de href
  const registerHrefs = ['#register', '#registerSection', '#registersection'];
  const loginHrefs = ['#login', '#loginSection', '#loginsection'];

  registerHrefs.forEach(href => {
    document.querySelectorAll(`a[href="${href}"]`).forEach(a => {
      a.addEventListener('click', function(e){ e.preventDefault(); showRegister(); });
    });
  });
  loginHrefs.forEach(href => {
    document.querySelectorAll(`a[href="${href}"]`).forEach(a => {
      a.addEventListener('click', function(e){ e.preventDefault(); showLogin(); });
    });
  });

  // também conecta botões com data-action (fallback)
  document.querySelectorAll('[data-action="show-register"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showRegister(); });
  });
  document.querySelectorAll('[data-action="show-login"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showLogin(); });
  });

  // escolhe o que mostrar ao carregar (respeita hash se for register)
  const h = (location.hash || '').toLowerCase();
  if (h === '#register' || h === '#registersection') {
    showRegister();
  } else {
    showLogin();
  }

  // tecla ESC volta para login
  document.addEventListener('keydown', e => { if (e.key === 'Escape') showLogin(); });

  console.log('perfil.js: inicialização finalizada');
});
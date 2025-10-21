// perfil.js - versão final tolerante e com logs
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

  // tenta localizar sections por id; se não, usa classes como fallback
  let loginSection = document.getElementById('loginSection') || document.getElementById('login');
  let registerSection = document.getElementById('registerSection') || document.getElementById('register');

  if (!loginSection) loginSection = document.querySelector('.box-login');
  if (!registerSection) registerSection = document.querySelector('.box-register');

  if (!loginSection || !registerSection) {
    console.warn('perfil.js: Sections de login/register não encontradas. Procurados: #loginSection, #login, .box-login e #registerSection, #register, .box-register');
    return;
  }

  // procura os wrappers internos (se existirem)
  const loginContent = loginSection.querySelector('.form-content-ativo, .form-content') || loginSection;
  const registerContent = registerSection.querySelector('.form-content-ativo, .form-content') || registerSection;

  function setVisible(showEl, hideEl) {
    if (!showEl || !hideEl) return;
    showEl.classList.add('form-content-ativo');
    showEl.classList.remove('form-content');
    hideEl.classList.add('form-content');
    hideEl.classList.remove('form-content-ativo');
  }

  function showLogin() {
    console.log('perfil.js: mostrar Login');
    setVisible(loginContent, registerContent);
    // atualiza hash para refletir estado (mantém compatibilidade)
    history.replaceState(null, '', '#login');
  }

  function showRegister() {
    console.log('perfil.js: mostrar Register');
    setVisible(registerContent, loginContent);
    history.replaceState(null, '', '#register');
  }

  // conecta links que apontem para qualquer variação de hash
  const hrefsForRegister = ['#register', '#registerSection'];
  const hrefsForLogin = ['#login', '#loginSection'];

  hrefsForRegister.forEach(href => {
    document.querySelectorAll(`a[href="${href}"]`).forEach(a => {
      a.addEventListener('click', function(e){
        e.preventDefault();
        showRegister();
      });
    });
  });

  hrefsForLogin.forEach(href => {
    document.querySelectorAll(`a[href="${href}"]`).forEach(a => {
      a.addEventListener('click', function(e){
        e.preventDefault();
        showLogin();
      });
    });
  });

  // suporta também data-action caso queira usar no futuro
  document.querySelectorAll('[data-action="show-register"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showRegister(); });
  });
  document.querySelectorAll('[data-action="show-login"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showLogin(); });
  });

  // se a URL vier com hash já definido, respeita
  const h = location.hash.toLowerCase();
  if (h === '#register' || h === '#registersection') {
    showRegister();
  } else {
    showLogin(); // default
  }

  // tecla Esc volta pra login
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') showLogin();
  });

  console.log('perfil.js: inicializado com sucesso. Elements:', { loginSection, registerSection, loginContent, registerContent });
});
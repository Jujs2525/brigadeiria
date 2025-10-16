/* RECUPERAR SENHA */

function abrirRecuperar(){
    document.getElementById("recuperarSenha").style.display = "flex";
}

function fecharRecuperar(){
    document.getElementById("recuperarSenha").style.display = "none";
}

/* PÁGINAS PERFIL */
// Aguarda DOM pronto
document.addEventListener('DOMContentLoaded', function () {
  const cadastro = document.getElementById('cadastro');
  const login = document.getElementById('login');

  // pega todos os botões/links que alternam tela
  const toggles = document.querySelectorAll('[data-show]');

  toggles.forEach(btn => {
    btn.addEventListener('click', function (ev) {
      // evita comportamento padrão de <a> caso dispare um reload
      ev.preventDefault();

      const target = btn.getAttribute('data-show');

      if (target === 'login') {
        cadastro.classList.remove('ativo');
        login.classList.add('ativo');
      } else if (target === 'cadastro') {
        login.classList.remove('ativo');
        cadastro.classList.add('ativo');
      }
    });
  });

  // --- Optional: keyboard accessibility example (tecla Esc volta pro cadastro) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // volta para cadastro como padrão
      login.classList.remove('ativo');
      cadastro.classList.add('ativo');
    }
  });
});


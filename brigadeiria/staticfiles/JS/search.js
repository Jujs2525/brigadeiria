document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#searchInput");
  const resultsBox = document.querySelector("#resultsBox");

  if (!input || !resultsBox) {
    console.error("❌ Elementos da busca não encontrados.");
    return;
  }

  const url = window.BUSCAR_URL || "/buscar/";

  // Função assíncrona para buscar dados
  async function buscarTermo(term) {
    try {
      const response = await fetch(`${url}?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      const results = data.results || [];

      if (results.length === 0) {
        resultsBox.innerHTML = "<p style='padding:8px;'>Nenhum resultado encontrado.</p>";
      } else {
        resultsBox.innerHTML = results.map(item => `
          <a href="${item.url}" class="result-item" style="display:flex;align-items:center;gap:10px;padding:8px;text-decoration:none;">
            <img src="${item.image}" alt="${item.title}" 
                style="width:60px;height:60px;border-radius:8px;object-fit:cover;">
            <div>
              <h3 style="font-size:14px;margin:0;color:#ffedbd;">${item.title}</h3>
              <p style="margin:2px 0 0;color:#fff5da;">${item.price}</p>
            </div>
          </a>
        `).join("");

      }

      resultsBox.style.display = "block";
    } catch (error) {
      console.error("Erro ao buscar:", error);
      resultsBox.innerHTML = "<p style='padding:8px;'>Erro ao buscar resultados.</p>";
      resultsBox.style.display = "block";
    }
  }

  // Evento de digitação
  input.addEventListener("input", function () {
    const term = input.value.trim();
    console.log("Digitando:", term);
    if (term === "") {
      resultsBox.style.display = "none";
      resultsBox.innerHTML = "";
      return;
    }
    buscarTermo(term);
  });

  // Fechar resultados ao clicar fora
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-wrapper")) {
      resultsBox.style.display = "none";
    }
  });

  ScrollReveal().reveal('#sobrenos_texto',{
    origin: 'right',
    duration: 2000,
    distance: '20%'
  })
});
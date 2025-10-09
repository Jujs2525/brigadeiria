document.addEventListener("DOMContentLoaded", () => {
  const data = [
    { title: "Brigadeiro", description: "Doce de chocolate tradicional" },
    { title: "Beijinho", description: "Doce de coco com leite condensado" },
    { title: "Cajuzinho", description: "Doce de amendoim com chocolate" },
    { title: "Brownie", description: "Sobremesa de chocolate deliciosa" },
  ];

  const input = document.querySelector("#searchInput");
  const resultsBox = document.querySelector("#resultsBox");

  if (!input || !resultsBox) {
    console.error("Elementos da busca não encontrados.");
    return;
  }

  input.addEventListener("input", () => {
    const term = input.value.toLowerCase().trim();

    if (term === "") {
      resultsBox.style.display = "none";
      resultsBox.innerHTML = "";
      return;
    }

    const results = data.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );

    if (results.length === 0) {
      resultsBox.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    } else {
      resultsBox.innerHTML = results.map(item => `
        <div class="result-item">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `).join("");
    }

    resultsBox.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      resultsBox.style.display = "none";
    }
  });
});

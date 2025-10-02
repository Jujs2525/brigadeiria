async function carregarImagens() {
  try {
    // Busca imagens da API Django
    const resposta = await fetch("/api/imagens/");  
    const imagens = await resposta.json();

    const container = document.getElementById("carrossel");

    // Adiciona imagens no carrossel
    imagens.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      if (index === 0) img.classList.add("active");
      container.appendChild(img);
    });

    // Lógica para trocar imagens automaticamente
    let index = 0;
    const imgs = container.querySelectorAll("img");

    setInterval(() => {
      imgs[index].classList.remove("active");
      index = (index + 1) % imgs.length;
      imgs[index].classList.add("active");
    }, 3000); // troca a cada 3s

  } catch (erro) {
    console.error("Erro ao carregar imagens:", erro);
  }
}

document.addEventListener("DOMContentLoaded", carregarImagens);

document.addEventListener("DOMContentLoaded", function () {
  // Garante que o PRODUTO veio do template
  if (!window.PRODUTO) {
    console.error("window.PRODUTO não está definido");
    return;
  }

  const P = window.PRODUTO;

  // Preço em número, mesmo que venha com vírgula
  const precoUnitario = parseFloat(String(P.preco).replace(",", ".")) || 1.50;
  const minimo = 25;
  const passo = 1;
  let quantidade = minimo;

  // Substitui o span por input numérico
  const spanContainer = document.getElementById("quantidade");
  const inputQtd = document.createElement("input");
  inputQtd.type = "number";
  inputQtd.min = minimo;
  inputQtd.step = passo;
  inputQtd.value = quantidade;
  inputQtd.classList.add("input-quantidade");

  spanContainer.parentNode.insertBefore(inputQtd, spanContainer);
  spanContainer.remove();

  const spanTotal = document.getElementById("total");
  const btnMais = document.querySelector(".mais");
  const btnMenos = document.querySelector(".menos");
  const btnAdd = document.getElementById("btnAdicionar");

  // Aviso visual
  const aviso = document.createElement("div");
  aviso.className = "aviso-minimo";
  aviso.style.display = "none";
  aviso.textContent = `O pedido mínimo é de ${minimo} unidades.`;
  inputQtd.parentElement.insertBefore(aviso, inputQtd.nextSibling);

  function mostrarAviso(msg) {
    aviso.textContent = msg;
    aviso.style.display = "block";
    setTimeout(() => (aviso.style.display = "none"), 2500);
  }

  function atualizarTotal() {
    const valor = parseInt(inputQtd.value) || 0;
    const total = valor * precoUnitario;
    spanTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }

  // Atualiza sem travar o campo
  inputQtd.addEventListener("input", () => {
    if (inputQtd.value === "") {
      spanTotal.textContent = "R$ 0,00";
      return;
    }
    atualizarTotal();
  });

  // Corrige se valor menor que o mínimo
  inputQtd.addEventListener("blur", () => {
    let valor = parseInt(inputQtd.value);
    if (isNaN(valor) || valor < minimo) {
      valor = minimo;
      mostrarAviso(`O pedido mínimo é de ${minimo} unidades.`);
    }
    inputQtd.value = valor;
    atualizarTotal();
  });

  inputQtd.addEventListener("keypress", (e) => {
    if (e.key === "Enter") inputQtd.blur();
  });

  btnMais.addEventListener("click", () => {
    const valor = parseInt(inputQtd.value) || minimo;
    inputQtd.value = valor + passo;
    atualizarTotal();
  });

  btnMenos.addEventListener("click", () => {
    const valor = parseInt(inputQtd.value) || minimo;
    if (valor > minimo) {
      inputQtd.value = valor - passo;
      atualizarTotal();
    } else {
      mostrarAviso(`O pedido mínimo é de ${minimo} unidades.`);
    }
  });

  btnAdd.addEventListener("click", () => {
    const valor = parseInt(inputQtd.value) || minimo;
    const subtotal = valor * precoUnitario;

    const produto = {
      name: String(P.nome || "Produto"),
      category: String(P.categoria || ""),
      unit_price: precoUnitario,
      quantity: valor,
      subtotal
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(produto);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Mensagem bonita com nome do produto
    showAlert(
      `${valor} unidades de ${produto.name} adicionadas — R$ ${subtotal
        .toFixed(2)
        .replace(".", ",")}`,
      "success"
    );
  });

  atualizarTotal();
});

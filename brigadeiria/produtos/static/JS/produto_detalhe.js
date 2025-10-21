<script>
document.addEventListener("DOMContentLoaded", function() {
  const precoUnitario = 6.0;
  const minimo = 25;
  let quantidade = minimo;

  const spanQtd = document.getElementById("quantidade");
  const spanTotal = document.getElementById("total");
  const btnMais = document.querySelector(".mais");
  const btnMenos = document.querySelector(".menos");
  const btnAdd = document.getElementById("btnAdicionar");

  function atualizarTotal() {
    const total = quantidade * precoUnitario;
    spanQtd.textContent = quantidade;
    spanTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  btnMais.addEventListener("click", () => {
    quantidade += 5; // incrementa de 5 em 5
    atualizarTotal();
  });

  btnMenos.addEventListener("click", () => {
    if (quantidade > minimo) {
      quantidade -= 5;
      atualizarTotal();
    }
  });

  btnAdd.addEventListener("click", () => {
    const produto = {
      name: "{{ produto.nome }}",
      price: quantidade * precoUnitario,
      quantidade: quantidade
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(produto);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${quantidade} unidades de "${produto.name}" foram adicionadas ao carrinho!`);
  });

  atualizarTotal();
});
</script>

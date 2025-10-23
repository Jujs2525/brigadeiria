document.addEventListener('DOMContentLoaded', () => {
  // Tabela de preços fixos por categoria
  const tabelaPrecos = {
    "brigadeiro gourmet": 1.50,
    "brigadeiro gourmet premium": 1.80,
    "brigadeiro especial": 2.00
  };

  // Função para mostrar a descrição
function mostrarDescricao(nome, descricao) {
  const descricaoDiv = document.getElementById(`${nome}-descricao`);
  
  // Atualiza a descrição do produto diretamente
  if (descricaoDiv) {
    descricaoDiv.querySelector('p').textContent = descricao;  // Atualiza o conteúdo da descrição
    descricaoDiv.style.display = 'flex';  // Exibe a descrição e o overlay
  }
}

// Função para fechar a descrição
function fecharDescricao(nome) {
  const descricaoDiv = document.getElementById(`${nome}-descricao`);

  if (descricaoDiv) {
    descricaoDiv.style.display = 'none';  // Esconde a descrição e o overlay
  }
}

  // Adiciona eventos para cada botão de ver descrição
  document.querySelectorAll('.ver-descricao').forEach(btn => {
    btn.addEventListener('click', () => {
      // Pegando o nome do produto e a descrição diretamente dos dados do produto
      const nomeProduto = btn.parentElement.querySelector('h3').textContent.trim();  // Pega o nome do produto
      const descricaoProduto = btn.parentElement.querySelector('.descricao-produto').textContent.trim();  // Pega a descrição do produto

      mostrarDescricao(nomeProduto, descricaoProduto);  // Chama a função para exibir a descrição
    });
  });

  // Adicionar ao carrinho
  document.querySelectorAll('.adicionar-carrinho').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const category = (btn.dataset.category || '').toLowerCase().trim();
      const precoBase = tabelaPrecos[category] || 1.50;
      const qtd = parseInt(btn.parentElement.querySelector('input').value) || 25;
      const subtotal = precoBase * qtd;

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let item = cart.find(p => p.name === name && p.category === category);

      if (item) {
        item.quantity += qtd;
      } else {
        item = { name, category, priceUnit: precoBase, quantity: qtd };
        cart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${qtd} unidades de ${name} (${category}) adicionadas — Total R$ ${subtotal.toFixed(2)}`);
    });
  });
});

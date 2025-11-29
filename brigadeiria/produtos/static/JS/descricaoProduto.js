function mostrarDescricao(nome, descricao) {
  const safeName = nome
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\-]/g, "");

  const descricaoDiv = document.getElementById(`${safeName}-descricao`);

  if (!descricaoDiv) {
    console.error(`Elemento ${safeName}-descricao não encontrado`);
    return;
  }

  const p = descricaoDiv.querySelector('p');
  if (p) p.textContent = descricao;

  descricaoDiv.classList.add('show');
  descricaoDiv.style.display = 'flex';

  // === MOSTRA O VALOR INICIAL COM 25 UNIDADES ===
  const precoEl = descricaoDiv.querySelector('.produto-preco');
  const categoria = (descricaoDiv.querySelector('.adicionar-carrinho')?.dataset.category || '').toLowerCase().trim();

  const tabelaPrecos = {
    "brigadeiro gourmet": 1.50,
    "brigadeiro gourmet premium": 1.80,
    "brigadeiro especial": 2.00
  };

const precoBase = tabelaPrecos[categoria] || 1.50;
const minimo = 25;
const totalInicial = minimo * precoBase;
precoEl.textContent = `R$ ${totalInicial.toFixed(2).replace('.', ',')}`;

  /// === BLOQUEIA SCROLL DO FUNDO ===
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // === DESATIVA A BARRA DE PESQUISA ===
  const search = document.querySelector('.search-wrapper');
  if (search) search.classList.add('inativo');

  descricaoDiv.addEventListener('click', (e) => {
    const dentroDoCard = e.target.closest('.descricao-content');
    if (!dentroDoCard) fecharDescricao(safeName);
  });
}

function fecharDescricao(nome) {
  const descricaoDiv = document.getElementById(`${nome}-descricao`);
  if (descricaoDiv) {
    descricaoDiv.classList.remove('show');
    setTimeout(() => {
      descricaoDiv.style.display = 'none';
    }, 250);

    // === REATIVA A BARRA DE PESQUISA ===
    const search = document.querySelector('.search-wrapper');
    if (search) search.classList.remove('inativo');

    // === LIBERA SCROLL DO FUNDO ===
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tabelaPrecos = {
    "brigadeiro gourmet": 1.50,
    "brigadeiro gourmet premium": 1.80,
    "brigadeiro especial": 2.00
  };

  // Limpa event listeners antigos
  document.querySelectorAll('.ver-descricao, .adicionar-carrinho').forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });

  const botoesDescricao = document.querySelectorAll('.ver-descricao');
  const botoesCarrinho = document.querySelectorAll('.adicionar-carrinho');

  // === Mostrar descrição ===
  botoesDescricao.forEach(btn => {
    btn.addEventListener('click', () => {
      const nomeProduto = btn.dataset.nome;
      const descricaoProduto = btn.dataset.descricao;
      mostrarDescricao(nomeProduto, descricaoProduto);
    });
  });

  // === Incremento / Decremento ===
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('mais') || e.target.classList.contains('menos')) {
      e.stopPropagation();

      const input = e.target.parentElement.querySelector('input');
      const precoEl = e.target.closest('.descricao-content').querySelector('.produto-preco');
      const categoria = (e.target.closest('.descricao-content').querySelector('.adicionar-carrinho').dataset.category || '').toLowerCase().trim();

      const precoBase = tabelaPrecos[categoria] || 1.50;
      let valorAtual = parseInt(input.value) || 25;

      // === Aviso de pedido mínimo ===
      const avisoExistente = e.target.parentElement.querySelector('.aviso-minimo');
      let aviso = avisoExistente;
      if (!aviso) {
        aviso = document.createElement("div");
        aviso.className = "aviso-minimo";
        aviso.style.display = "none";
        aviso.textContent = `O pedido mínimo é de 25 unidades.`;
        e.target.parentElement.appendChild(aviso);
      }

      function mostrarAviso(msg) {
        aviso.textContent = msg;
        aviso.style.display = "block";
        setTimeout(() => (aviso.style.display = "none"), 2500);
      }

      if (e.target.classList.contains('mais')) {
        valorAtual += 1;
      } else if (e.target.classList.contains('menos')) {
        if (valorAtual > 25) {
          valorAtual -= 1;
        } else {
          mostrarAviso(`O pedido mínimo é de 25 unidades.`);
        }
      }

      input.value = valorAtual;
      const total = valorAtual * precoBase;
      precoEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  });


  // === Atualiza preço quando digita manualmente ===
  document.addEventListener('input', (e) => {
    if (e.target.closest('.contador') && e.target.tagName === 'INPUT') {
      const card = e.target.closest('.descricao-content');
      const precoEl = card.querySelector('.produto-preco');
      const categoria = (card.querySelector('.adicionar-carrinho').dataset.category || '').toLowerCase().trim();
      const precoBase = tabelaPrecos[categoria] || 1.50;

      let qtd = parseInt(e.target.value) || 25;
      if (qtd < 25) qtd = 25;

      const total = qtd * precoBase;
      precoEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  });

  // === Adicionar ao carrinho ===
  botoesCarrinho.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name.trim();
      const category = (btn.dataset.category || '').toLowerCase().trim();
      const precoBase = tabelaPrecos[category] || 1.50;
      const qtdInput = btn.parentElement.querySelector('input');
      const qtd = parseInt(qtdInput.value) || 25;
      const subtotal = precoBase * qtd;

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const normalizedName = name.toLowerCase().trim();
      const normalizedCategory = category.toLowerCase().trim();

      let item = cart.find(
        p =>
          p.name.toLowerCase().trim() === normalizedName &&
          p.category.toLowerCase().trim() === normalizedCategory
      );

      if (item) {
        item.quantity = qtd;
        item.subtotal = subtotal;
        showAlert(`${name} atualizado! Quantidade: ${qtd}`, "success");
      } else {
        item = { name, category, priceUnit: precoBase, quantity: qtd, subtotal };
        cart.push(item);
        showAlert(`${qtd} unidades de ${name} adicionadas — R$ ${subtotal.toFixed(2).replace(".", ",")}`, "success");
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    });
  });
});

console.log('JS descrição com preço dinâmico carregado 🚀');

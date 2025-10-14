document.addEventListener('DOMContentLoaded', () => {
    
    //Lógica para página de produtos
    fetchCardapio();

    //Lógica para página do carrinho
    const cardItensContainer = document.getElementById('card-itens-container');
    const cardTotalValue = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');

    if(cardItensContainer){
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
    
        if(cart.length > 0){
            cardItensContainer.innerHTML = "";

            cart.forEach(product => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <span>${product.name}</span>
                    <span>R$ ${product.price.toFixed(2)}</span>
                `;
                cardItensContainer.appendChild(cartItem);
                total += product.price;
            });
        }

        cardTotalValue.textContent = `R$ ${total.toFixed(2)}`;

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const numeroWhatsApp = '5515981453091';
                let mensagem = 'Olá! Segue meu Pedido:\n\n';
                cart.forEach(product => {
                    mensagem += `- ${product.name}: (R$ ${product.price.toFixed(2)})\n`;
                });
                mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

                const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
                window.open(urlWhatsApp, '_blank');
                localStorage.removeItem('cart');
            });
        }
    }

    const limparTabela = document.getElementById('limpar-pedido');
    if (limparTabela) {
        limparTabela.addEventListener('click', () => {
            localStorage.removeItem('cart');
            location.reload(true);
        });
    }
});

function fetchCardapio(){
    fetch("/api/produtos/")
    .then(res => res.json())
    .then(data => renderCardapio(data))
    .catch(err => console.error("Erro ao buscar o produto", err));
}

function renderCardapio(cardapio) {
    const categoriasMap = {};

    cardapio.forEach(item => {
        const nomeCategoria = item.categoria?.nome || 'Outros';
        if (!categoriasMap[nomeCategoria]) {
            categoriasMap[nomeCategoria] = [];
        }
        categoriasMap[nomeCategoria].push(item);
    });

    const mainSection = document.querySelector('.produto-grid');
    mainSection.innerHTML = '<h2>Cardápio</h2>';

    for (const [nomeCategoria, produtos] of Object.entries(categoriasMap)) {
        const categoriaSection = document.createElement('div');
        categoriaSection.classList.add('categoria-bloco');
        categoriaSection.innerHTML = `
            <h3>${nomeCategoria}</h3>
            <div class="container-grid" id="${nomeCategoria.toLowerCase().replace(/\s+/g, '-')}"></div>
        `;
        mainSection.appendChild(categoriaSection);

        const container = categoriaSection.querySelector('.container-grid');

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.name = produto.nome;
            card.dataset.price = produto.preco;
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h4>${produto.nome}</h4>
                <p class="price">R$${parseFloat(produto.preco).toFixed(2)}</p>
                <button class="adicionar-carrinho">Adicionar no Carrinho</button>
            `;
            container.appendChild(card);
        });
    }

    addCarrinho();
}

function addCarrinho(){
    const addTocartButtons = document.querySelectorAll('.adicionar-carrinho');
    addTocartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const productName = card.dataset.name;
            const productPrice = parseFloat(card.dataset.price);
            const product = { name: productName, price: productPrice };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${productName} foi adicionado ao carrinho!`);
        });
    });
}

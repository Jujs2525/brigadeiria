const data = [
    {
        title: "brigadeiro",
        description: "brigadeiro de chocolate",
    },
    {
        title: "beijinho",
        description: "doce de coco",
    },
    {
        title: "cajuzinho",
        description: "doce de amendoim",
    },
];

const searchInput = document.querySelector("#searchInput");
const cardContainer = document.querySelector(".card-container");

// Função que exibe os cards na tela
const displayData = (data) => {
    cardContainer.innerHTML = "";

    if (data.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    data.forEach(e => {
        cardContainer.innerHTML += `
            <div class="card">
                <h3>${e.title}</h3>
                <p>${e.description}</p>
            </div>
        `;
    });
};

// Evento para buscar enquanto digita
searchInput.addEventListener("keyup", (e) => {
    const pesquisa = e.target.value.trim().toLowerCase();

    if (pesquisa.length > 0) {
        const search = data.filter(i =>
            i.title.toLowerCase().includes(pesquisa)
        );
        displayData(search);
    } else {
        // Campo vazio: limpa tudo
        cardContainer.innerHTML = "";
    }
});

// Quando a página carrega, você pode exibir todos os dados (opcional)
// window.addEventListener("load", () => displayData(data));

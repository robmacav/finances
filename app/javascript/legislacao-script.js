// Funcionalidades interativas para a página de legislação

document.addEventListener("DOMContentLoaded", function() {
    // Elementos do DOM
    const searchInput = document.querySelector(".search-input");
    const checkboxesCategoria = document.querySelectorAll("input[type=\'checkbox\'][data-filter-type='category']");
    
    const yearButtons = document.querySelectorAll(".year-btn");
    const statusLabels = document.querySelectorAll(".status-label");
    const sortSelect = document.querySelector(".sort-select");
    const resultsList = document.querySelector(".results-list");
    const resultsCountSpan = document.querySelector(".results-count");
    const paginationInfoSpan = document.querySelector(".pagination-info");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");


    const accordionHeaders = document.querySelectorAll(".accordion-header");



const yearContainer = document.getElementById("year-filters");
  const currentYear = new Date().getFullYear();
  const yearsToShow = 10; // quantos anos atrás você quer

  for (let year = currentYear; year >= currentYear - yearsToShow; year--) {
    const label = document.createElement("label");
    label.className = "checkbox-label";

    label.innerHTML = `
      <input type="checkbox" data-filter-type="year" value="${year}"> ${year}
    `;

    yearContainer.appendChild(label);
    
  }
  yearContainer.appendChild(document.createElement("br")); // quebra de linha



  const checkboxesAnos = document.querySelectorAll("input[type=\'checkbox\'][data-filter-type='year']");

    accordionHeaders.forEach(header => {
    // Adiciona o span do indicador, caso não exista
    let indicator = header.querySelector(".accordion-indicator");
    if (!indicator) {
        indicator = document.createElement("span");
        indicator.className = "accordion-indicator";
        indicator.style.marginLeft = "0.5rem";
        indicator.textContent = "►"; // fechado por padrão
        header.appendChild(indicator);
    }

    header.addEventListener("click", () => {
        const content = header.nextElementSibling;
        content.classList.toggle("open");

        // Atualiza o indicador
        if (content.classList.contains("open")) {
            indicator.textContent = "▼"; // aberto
        } else {
            indicator.textContent = "►"; // fechado
        }

        // opcional: animação do conteúdo
        if (content.classList.contains("open")) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = null;
        }
    });
});

    let currentPage = 1;
    const API_BASE_URL = "/pesquisar_lei"; // URL da sua API Rails

    // Função para buscar e renderizar os resultados da API
    async function fetchAndRenderResults() {
    const searchTerm = searchInput.value.trim(); // já tira espaços em branco

    // só pesquisa se tiver 3+ caracteres ou se não digitou nada (para listar todos)
    if (searchTerm.length > 0 && searchTerm.length < 3) {
        resultsList.innerHTML = "<p>Digite pelo menos 3 caracteres para pesquisar.</p>";
        resultsCountSpan.textContent = "0 resultados";
        paginationInfoSpan.textContent = "";
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
    }

    const selectedCategories = Array.from(checkboxesCategoria)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    const selectedYear = Array.from(checkboxesAnos)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    const selectedStatus = document.querySelector(".status-label.active")?.value || "";
    const sortBy = sortSelect.value;

    // Construir a URL da API com base nos filtros e paginação
    const params = new URLSearchParams({
        page: currentPage,
        q: searchTerm,
        categories: selectedCategories.join(","),
        year: selectedYear.join(","),
        status: selectedStatus,
        sort_by: sortBy
    });

    const url = `${API_BASE_URL}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        renderResults(data.resultados);
        updatePagination(data.pagina_info);
        updateResultsCount(data.pagina_info.total_count);

    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        resultsList.innerHTML = "<p>Não foi possível carregar os resultados. Tente novamente mais tarde.</p>";
        resultsCountSpan.textContent = "0 resultados";
        paginationInfoSpan.textContent = "";
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
    }
}



checkboxesAnos.forEach(cb => 
  cb.addEventListener("change", () => { 
    currentPage = 1; 
    fetchAndRenderResults(); 
  })
);

    // Função para renderizar os cartões de resultado
    function renderResults(resultados) {
        resultsList.innerHTML = ""; // Limpa os resultados existentes
        if (resultados.length === 0) {
            resultsList.innerHTML = "<p>Nenhum resultado encontrado para os critérios selecionados.</p>";
            return;
        }

        resultados.forEach(item => {
            const card = document.createElement("article");
            card.classList.add("result-card");
            card.innerHTML = `
                <div class="result-header">
                    <span class="result-number">${item.identificador}</span>
                    <span class="result-year">📅 ${item.ano || ""}</span>
                </div>
                <h3 class="result-title">${item.titulo}</h3>
                <br/>
                <div class="result-actions">
                    <button class="action-btn save">📥 Baixar</button>
                    <button class="action-btn details">ℹ️ Detalhes</button>
                </div>
            `;
            resultsList.appendChild(card);
        });
    }

    // Função para atualizar a paginação
    function updatePagination(paginaInfo) {
        paginationInfoSpan.textContent = `Página ${paginaInfo.current_page} de ${paginaInfo.total_pages}`;
        prevPageBtn.disabled = !paginaInfo.has_previous;
        nextPageBtn.disabled = !paginaInfo.has_next;
    }

    // Função para atualizar o contador de resultados
    function updateResultsCount(totalCount) {
        resultsCountSpan.textContent = `${totalCount} resultado${totalCount !== 1 ? "s" : ""}`;
    }

    // Event Listeners para filtros e busca
    searchInput.addEventListener("input", () => { currentPage = 1; fetchAndRenderResults(); });
    checkboxesCategoria.forEach(cb => cb.addEventListener("change", () => { currentPage = 1; fetchAndRenderResults(); }));
    yearButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            yearButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentPage = 1;
            fetchAndRenderResults();
        });
    });
    statusLabels.forEach(label => {
        label.addEventListener("click", function() {
            statusLabels.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
            currentPage = 1;
            fetchAndRenderResults();
        });
    });
    sortSelect.addEventListener("change", () => { currentPage = 1; fetchAndRenderResults(); });

    // Event Listeners para paginação
    prevPageBtn.addEventListener("click", () => {
        if (!prevPageBtn.disabled) {
            currentPage--;
            fetchAndRenderResults();
        }
    });
    nextPageBtn.addEventListener("click", () => {
        if (!nextPageBtn.disabled) {
            currentPage++;
            fetchAndRenderResults();
        }
    });

    // Funcionalidade de atalho de teclado para busca
    document.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Efeito visual para elevar o card quando o curso do mouse sobre o elemento.
    function applyCardEffects() {
        document.querySelectorAll(".result-card, .accordion").forEach(card => {
            card.addEventListener("mouseenter", function() {
                this.style.transform = "translateY(-2px)";
                this.style.transition = "all 0.2s ease";
            });
            card.addEventListener("mouseleave", function() {
                this.style.transform = "translateY(0)";
            });
            // Animação de carregamento inicial para novos cartões
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
                card.style.transition = "all 0.5s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 0); // Aplica imediatamente após a criação
        });
    }

    // Chamar applyCardEffects após cada renderização
    const originalRenderResults = renderResults;
    renderResults = function(resultados) {
        originalRenderResults(resultados);
        applyCardEffects();
    };

    // Chamar a função de busca e renderização ao carregar a página
    fetchAndRenderResults();

    // CSS adicional para animações (inserido via JavaScript)
    const style = document.createElement("style");
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .result-card {
            transition: all 0.2s ease;
        }
        
        .action-btn {
            transition: all 0.2s ease;
        }
        
        .search-input:focus {
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }
    `;
    document.head.appendChild(style);



const listContainer = document.querySelector("#most-accessed-docs .related-list");

  // Função para buscar as leis mais acessadas
  async function carregarLeisMaisAcessadas() {
    try {
      const response = await fetch("/pesquisar_leis_mais"); // rota Rails
      if (!response.ok) throw new Error("Erro ao buscar dados");

      const data = await response.json();
      const leis = data.resultados || [];

      // Limpar lista existente
      listContainer.innerHTML = "";

      // Preencher a lista
      leis.forEach(lei => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `/leis/${lei.lei}`; // ou outra URL de detalhes
        a.className = "related-link";
        a.textContent = `📄 ${lei.identificador}`;
        li.appendChild(a);
        listContainer.appendChild(li);
      });
      listContainer.appendChild(document.createElement("br")); // quebra de linha
    } catch (err) {
      console.error(err);
      listContainer.innerHTML = "<li>Não foi possível carregar os documentos.</li>";
    }
  }

  carregarLeisMaisAcessadas();



});
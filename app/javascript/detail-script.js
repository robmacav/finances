// Funcionalidades interativas para a página de detalhes

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const summaryLinks = document.querySelectorAll('.summary-link');
    const shareBtn = document.querySelector('.share-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const backBtn = document.querySelector('.back-btn');
    const articles = document.querySelectorAll('.article');

    // Funcionalidade de navegação suave no sumário
    summaryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active de todos os links
            summaryLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona active ao link clicado
            this.classList.add('active');
            
            // Scroll suave para o artigo
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Funcionalidade de highlight automático baseado no scroll
    function updateActiveLink() {
        let current = '';
        
        articles.forEach(article => {
            const rect = article.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                current = article.id;
            }
        });
        
        summaryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Listener para scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Ativa o primeiro link por padrão
    if (summaryLinks.length > 0) {
        summaryLinks[0].classList.add('active');
    }

    // Funcionalidade do botão compartilhar
     if (!shareBtn) return;

  shareBtn.addEventListener('click', function() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: 'Confira este documento de legislação',
        url: window.location.href
      }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
      // fallback robusto para copiar o link
      const url = window.location.href;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showCopiedFeedback(this);
        }).catch(err => fallbackCopyText(url, this));
      } else {
        fallbackCopyText(url, this);
      }
    }
  });

  function fallbackCopyText(text, btn) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showCopiedFeedback(btn);
    } catch (err) {
      alert('Não foi possível copiar o link. URL: ' + text);
    }
    document.body.removeChild(input);
  }

  function showCopiedFeedback(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Link copiado!';
    btn.style.backgroundColor = '#28a745';
    btn.style.color = '#fff';
    btn.style.borderColor = '#28a745';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }

   
    // Funcionalidade do botão voltar
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Verifica se há histórico para voltar
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Se não há histórico, redireciona para a página principal
            window.location.href = 'index.html';
        }
    });

    // Funcionalidade dos links de documentos relacionados
    const relatedLinks = document.querySelectorAll('.related-item');
    relatedLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const documentName = this.textContent.trim();
            alert(`Redirecionando para: ${documentName}\n\nEsta funcionalidade abriria o documento relacionado.`);
        });
    });

    // Funcionalidade do link de anexo
    const annexLink = document.querySelector('.annex-link');
    if (annexLink) {
        annexLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalText = this.innerHTML;
            this.innerHTML = '⏳ Carregando...';
            
            setTimeout(() => {
                this.innerHTML = '✅ PDF carregado!';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    
                    // Simula abertura do PDF
                    console.log('Abrindo PDF consolidado...');
                    alert('PDF consolidado seria aberto em uma nova aba.');
                }, 1500);
            }, 1000);
        });
    }

    // Efeitos visuais adicionais
    const interactiveElements = document.querySelectorAll('.summary-link, .related-item, .annex-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'all 0.2s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Animação de entrada dos artigos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    articles.forEach(article => {
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        article.style.transition = 'all 0.6s ease';
        observer.observe(article);
    });

    // Funcionalidade de impressão (Ctrl+P)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            
            // Adiciona classe para estilos de impressão
            document.body.classList.add('printing');
            
            setTimeout(() => {
                window.print();
                document.body.classList.remove('printing');
            }, 100);
        }
    });

    // Funcionalidade de busca rápida (Ctrl+F customizada)
    let searchOverlay = null;
    
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            
            if (!searchOverlay) {
                createSearchOverlay();
            }
            
            searchOverlay.style.display = 'block';
            searchOverlay.querySelector('input').focus();
        }
    });

    function createSearchOverlay() {
        searchOverlay = document.createElement('div');
        searchOverlay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: none;
        `;
        
        searchOverlay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="text" placeholder="Buscar no documento..." style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; width: 200px;">
                <button onclick="this.parentElement.parentElement.style.display='none'" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 0.5rem; cursor: pointer;">✕</button>
            </div>
        `;
        
        document.body.appendChild(searchOverlay);
        
        const searchInput = searchOverlay.querySelector('input');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Remove highlights anteriores
            document.querySelectorAll('.highlight').forEach(el => {
                el.outerHTML = el.innerHTML;
            });
            
            if (searchTerm.length > 2) {
                highlightText(searchTerm);
            }
        });
    }

    function highlightText(searchTerm) {
        const walker = document.createTreeWalker(
            document.querySelector('.document-content'),
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<span class="highlight" style="background-color: yellow; padding: 2px;">$1</span>');
                const wrapper = document.createElement('div');
                wrapper.innerHTML = highlightedText;
                
                while (wrapper.firstChild) {
                    textNode.parentNode.insertBefore(wrapper.firstChild, textNode);
                }
                textNode.remove();
            }
        });
    }

    console.log('Página de detalhes carregada com sucesso!');
});

// CSS adicional para impressão
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .detail-header,
        .summary-sidebar,
        .bottom-sections {
            display: none !important;
        }
        
        .content-layout {
            grid-template-columns: 1fr !important;
        }
        
        .document-content {
            box-shadow: none !important;
            border: none !important;
        }
        
        .article {
            break-inside: avoid;
        }
    }
    
    .highlight {
        background-color: yellow !important;
        padding: 2px !important;
    }
`;
document.head.appendChild(printStyles);


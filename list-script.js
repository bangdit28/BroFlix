document.addEventListener('DOMContentLoaded', () => {
    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!contentGrid || !paginationContainer) {
        console.error("Critical elements not found!");
        return;
    }

    const contentType = document.body.dataset.contentType;
    if (!contentType) {
        console.error("FATAL: 'data-content-type' not found on <body> tag.");
        return;
    }

    const itemsPerPage = 24;
    let allItems = [];
    let currentPage = 1;

    // FUNGSI KARTU FILM KEMBALI KE SEMULA
    function displayItems(items) {
        contentGrid.innerHTML = '';
        if (items.length === 0) {
            contentGrid.innerHTML = '<p class="text-secondary text-center col-12">No content found.</p>';
            return;
        }
        let cardsHTML = '';
        items.forEach(item => {
            const qualityBadgeHTML = item.quality ? `<div class="quality-badge quality-${item.quality.toLowerCase()}">${item.quality}</div>` : '';
            const detailPage = item.type === 'series' ? 'detail-series.html' : 'detail-film.html';
            cardsHTML += `
                <div class="col">
                    <a href="${detailPage}?id=${item.id}" class="movie-card d-block text-decoration-none text-white">
                        ${qualityBadgeHTML}
                        <img src="${item.poster || ''}" alt="${item.title || 'No Title'}" loading="lazy">
                        <div class="card-info">
                            <h6 class="movie-title">${item.title}</h6>
                        </div>
                    </a>
                </div>`;
        });
        contentGrid.innerHTML = cardsHTML;
    }

    function setupPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('li');
            pageButton.className = 'page-item';
            if (i === currentPage) { pageButton.classList.add('active'); }
            const link = document.createElement('a');
            link.className = 'page-link';
            link.href = '#';
            link.innerText = i;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                loadContent(false);
                window.scrollTo(0, 0);
            });
            pageButton.appendChild(link);
            paginationContainer.appendChild(pageButton);
        }
    }
    
    async function loadContent(isInitialLoad = true) {
        if (isInitialLoad) {
            try {
                const response = await fetch('movies.json');
                if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
                const allContent = await response.json();
                allItems = allContent.filter(item => item.type === contentType).sort((a,b) => b.id - a.id);
                setupPagination(allItems.length);
            } catch (error) {
                console.error("Failed to load content:", error);
                contentGrid.innerHTML = '<p class="text-danger text-center col-12">Failed to load content.</p>';
                return;
            }
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = allItems.slice(startIndex, endIndex);
        displayItems(itemsToShow);

        const allButtons = paginationContainer.querySelectorAll('.page-item');
        allButtons.forEach(btn => btn.classList.remove('active'));
        if (allButtons[currentPage - 1]) {
            allButtons[currentPage - 1].classList.add('active');
        }
    }

    loadContent(true);
});

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mengambil semua elemen dari HTML
    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const trailerModalElement = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailer-iframe');
    
    if (!contentGrid || !paginationContainer || !trailerModalElement) {
        console.error("Critical elements like grid, pagination, or modal not found!");
        return;
    }

    const trailerModal = new bootstrap.Modal(trailerModalElement);
    trailerModalElement.addEventListener('hidden.bs.modal', () => {
        trailerIframe.src = ''; // Hentikan video
    });

    const contentType = document.body.dataset.contentType;
    if (!contentType) {
        console.error("FATAL: 'data-content-type' not found on <body> tag.");
        return;
    }

    const itemsPerPage = 24;
    let allItems = [];
    let currentPage = 1;

    // 2. Fungsi untuk membuat dan menampilkan kartu film/series
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
            const trailerButtonHTML = item.trailerUrl ? `<button class="btn btn-card btn-trailer" data-trailer-url="${item.trailerUrl}"><i class="fas fa-play me-1"></i>TRAILER</button>` : '';

            cardsHTML += `
                <div class="col">
                    <div class="movie-card">
                        <img src="${item.poster || ''}" alt="${item.title || 'No Title'}" loading="lazy">
                        ${qualityBadgeHTML}
                        <div class="card-overlay">
                            <div>
                                <h6 class="movie-title">${item.title}</h6>
                                <div class="button-group">
                                    ${trailerButtonHTML}
                                    <a href="${detailPage}?id=${item.id}" class="btn btn-card btn-movie"><i class="fas fa-film me-1"></i>MOVIE</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        contentGrid.innerHTML = cardsHTML;

        // Tambahkan fungsi klik untuk SEMUA tombol trailer yang baru dibuat
        contentGrid.querySelectorAll('.btn-trailer').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const trailerUrl = button.dataset.trailerUrl;
                if (trailerUrl) {
                    trailerIframe.src = trailerUrl + "?autoplay=1&mute=1";
                    trailerModal.show();
                }
            });
        });
    }

    // 3. Fungsi untuk membuat tombol halaman
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
    
    // 4. Fungsi utama untuk memuat data
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
                contentGrid.innerHTML = '<p class="text-danger text-center col-12">Failed to load content. Check console.</p>';
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

    // 5. Jalankan semuanya
    loadContent(true);
});

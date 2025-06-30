document.addEventListener('DOMContentLoaded', () => {
    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!contentGrid || !paginationContainer) { console.error("Critical elements not found!"); return; }

    const contentType = document.body.dataset.contentType;
    
    if (!contentType) {
        console.error("FATAL: Could not determine content type.");
        contentGrid.innerHTML = '<p class="text-danger text-center col-12">Error: Page configuration is missing.</p>';
        return;
    }
    
    const itemsPerPage = 24; // Tampilkan 24 item per halaman
    let allItems = [];
    let currentPage = 1;

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
            // UPDATE JUDUL: tambahkan tahun di sini
            cardsHTML += `
                <div class="col">
                    <a href="${detailPage}?id=${item.id}" class="movie-card d-block text-decoration-none text-white">
                        ${qualityBadgeHTML}
                        <img src="${item.poster || ''}" alt="${item.title || 'No Title'}" loading="lazy">
                        <div class="card-info">
                            <h6 class="movie-title">${item.title} (${item.year})</h6>
                        </div>
                    </a>
                </div>`;
        });
        contentGrid.innerHTML = cardsHTML;
    }

    function setupPagination(totalItems) { /* ... sama seperti versi final sebelumnya ... */ }
    
    async function loadContent(isInitialLoad = true) { /* ... sama seperti versi final sebelumnya ... */ }

    loadContent(true);
});

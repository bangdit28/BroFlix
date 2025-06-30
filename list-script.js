document.addEventListener('DOMContentLoaded', () => {
    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const trailerModalElement = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailer-iframe');
    
    if (!contentGrid || !paginationContainer || !trailerModalElement) { return; }

    const trailerModal = new bootstrap.Modal(trailerModalElement);
    trailerModalElement.addEventListener('hidden.bs.modal', () => {
        trailerIframe.src = '';
    });

    const contentType = document.body.dataset.contentType;
    if (!contentType) { return; }

    const itemsPerPage = 24;
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

    function setupPagination(totalItems) { /* ... sama seperti sebelumnya ... */ }
    async function loadContent(isInitialLoad = true) { /* ... sama seperti sebelumnya ... */ }

    loadContent(true);
});

document.addEventListener('DOMContentLoaded', async () => {
    
    const elements = { /* ... sama seperti sebelumnya ... */ };
    const trailerModalElement = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailer-iframe');
    const trailerModal = new bootstrap.Modal(trailerModalElement);

    trailerModalElement.addEventListener('hidden.bs.modal', () => {
        trailerIframe.src = ''; // Hentikan video saat modal ditutup
    });

    let allContent = [];

    function displayContent(content, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        if (!content || content.length === 0) {
            gridElement.innerHTML = '<p class="text-secondary text-center col-12">No content found.</p>';
            return;
        }
        let cardsHTML = '';
        content.forEach(item => {
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
        gridElement.innerHTML = cardsHTML;
        
        gridElement.querySelectorAll('.btn-trailer').forEach(button => {
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

    function createFilterDropdowns(items, menuElement, buttonElement, filterType) { /* ... sama seperti sebelumnya ... */ }
    function filterAndDisplayContent() { /* ... sama seperti sebelumnya ... */ }
    function showHomePageView() { /* ... sama seperti sebelumnya ... */ }

    async function initialize() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error(`Fetch error! status: ${response.status}`);
            allContent = await response.json();
            
            const movieLimit = 12;

            const latestMovies = allContent.filter(item => item.type === 'movie').sort((a,b) => b.id - a.id).slice(0, movieLimit);
            const popularSeries = allContent.filter(item => item.type === 'series').sort((a,b) => b.id - a.id).slice(0, movieLimit);
            
            displayContent(latestMovies, elements.latestGrid);
            displayContent(popularSeries, elements.popularSeriesGrid);
            
            // ... sisa fungsi initialize sama persis ...
        } catch (error) {
            console.error('Fatal Error during initialization:', error);
        }
    }
    initialize();
});

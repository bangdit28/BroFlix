document.addEventListener('DOMContentLoaded', async () => {
    
    const elements = {
        latestGrid: document.getElementById('latest-movies-grid'),
        popularSeriesGrid: document.getElementById('popular-series-grid'),
        movieGrid: document.getElementById('movie-grid'),
        genreDropdownMenu: document.getElementById('genre-dropdown-menu'),
        countryDropdownMenu: document.getElementById('country-dropdown-menu'),
        typeDropdownMenu: document.getElementById('type-dropdown-menu'),
        genreButton: document.querySelector('#genre-filter-container .btn'),
        countryButton: document.querySelector('#country-filter-container .btn'),
        typeButton: document.querySelector('#type-filter-container .btn'),
        homeButton: document.getElementById('home-button'),
        searchInput: document.getElementById('search-input'),
        defaultView: document.getElementById('default-view'),
        filterView: document.getElementById('filter-view'),
    };

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
        gridElement.innerHTML = cardsHTML;
    }

    function createFilterDropdowns(items, menuElement, buttonElement, filterType) { /* ... sama seperti versi final sebelumnya ... */ }
    function filterAndDisplayContent() { /* ... sama seperti versi final sebelumnya ... */ }
    function showHomePageView() { /* ... sama seperti versi final sebelumnya ... */ }

    async function initialize() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error(`Fetch error! status: ${response.status}`);
            allContent = await response.json();
            
            const movieLimit = 12; // Tampilkan 12 item di home agar pas dengan 6 kolom

            const latestMovies = allContent.filter(item => item.type === 'movie').sort((a,b) => b.id - a.id).slice(0, movieLimit);
            const popularSeries = allContent.filter(item => item.type === 'series').sort((a,b) => b.id - a.id).slice(0, movieLimit);
            
            displayContent(latestMovies, elements.latestGrid);
            displayContent(popularSeries, elements.popularSeriesGrid);

            const allGenres = allContent.flatMap(item => item.genre || []).filter(g => g);
            const allCountries = allContent.flatMap(item => item.country || []).filter(c => c);
            const allTypes = allContent.map(item => item.type).filter(Boolean);

            createFilterDropdowns(allGenres, elements.genreDropdownMenu, elements.genreButton, 'Genres');
            createFilterDropdowns(allCountries, elements.countryDropdownMenu, elements.countryButton, 'Countries');
            createFilterDropdowns(allTypes, elements.typeDropdownMenu, elements.typeButton, 'Types');
            
            elements.searchInput?.addEventListener('input', filterAndDisplayContent);
            elements.homeButton?.addEventListener('click', showHomePageView);
        } catch (error) {
            console.error('Fatal Error during initialization:', error);
            if(elements.latestGrid) elements.latestGrid.innerHTML = `<p class="text-danger col-12">Failed to load content.</p>`;
        }
    }
    initialize();
});

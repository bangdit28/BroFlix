document.addEventListener('DOMContentLoaded', async () => {
    
    // Variabel elemen dari HTML
    const latestGrid = document.getElementById('latest-movies-grid');
    const popularSeriesGrid = document.getElementById('popular-series-grid');
    const movieGrid = document.getElementById('movie-grid');
    
    // Dropdown elements
    const genreDropdownMenu = document.getElementById('genre-dropdown-menu');
    const countryDropdownMenu = document.getElementById('country-dropdown-menu');
    const typeDropdownMenu = document.getElementById('type-dropdown-menu');
    
    // Button elements
    const genreButton = document.querySelector('#genre-filter-container .btn');
    const countryButton = document.querySelector('#country-filter-container .btn');
    const typeButton = document.querySelector('#type-filter-container .btn');
    
    const homeButton = document.getElementById('home-button');
    const searchInput = document.getElementById('search-input');
    const defaultView = document.getElementById('default-view');
    const filterView = document.getElementById('filter-view');

    let allContent = [];

    function displayContent(content, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        if (!content || content.length === 0) {
            gridElement.innerHTML = '<p class="text-secondary text-center">No content found matching your criteria.</p>';
            return;
        }
        content.forEach(item => {
            const qualityBadgeHTML = item.quality ? `<div class="quality-badge quality-${item.quality.toLowerCase()}">${item.quality}</div>` : '';
            const detailPage = item.type === 'series' ? 'detail-series.html' : 'detail-film.html';
            
            const card = `
                <div class="col">
                    <a href="${detailPage}?id=${item.id}" class="movie-card d-block text-decoration-none text-white">
                        ${qualityBadgeHTML}
                        <img src="${item.poster}" alt="${item.title}" loading="lazy">
                        <div class="card-info">
                            <h6 class="movie-title">${item.title}</h6>
                        </div>
                    </a>
                </div>`;

            gridElement.innerHTML += card;
        });
    }

    function createFilterDropdowns(items, menuElement, buttonElement, filterType) {
        if (!menuElement || !buttonElement) return;
        let itemsHTML = `<li><a class="dropdown-item active" href="#" data-filter="all">All ${filterType}</a></li>`;
        [...new Set(items)].sort().forEach(item => {
            itemsHTML += `<li><a class="dropdown-item" href="#" data-filter="${item}">${item}</a></li>`;
        });
        menuElement.innerHTML = itemsHTML;
        menuElement.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                buttonElement.textContent = e.target.textContent;
                menuElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                filterAndDisplayContent();
            });
        });
    }
    
    function filterAndDisplayContent() {
        defaultView.classList.add('d-none');
        filterView.classList.remove('d-none');

        const activeGenre = genreDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const activeCountry = countryDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const activeType = typeDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        if (activeGenre === 'all' && activeCountry === 'all' && activeType === 'all' && searchTerm.trim() === '') {
            showHomePageView();
            return;
        }

        let filtered = allContent.filter(item => {
            const genreMatch = activeGenre === 'all' || (item.genre && item.genre.includes(activeGenre));
            const countryMatch = activeCountry === 'all' || (item.country && item.country.includes(activeCountry));
            const typeMatch = activeType === 'all' || (item.type && item.type === activeType);
            
            const searchMatch = searchTerm.trim() === '' || 
                                (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                                (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)));

            return genreMatch && countryMatch && typeMatch && searchMatch;
        });
        displayContent(filtered, movieGrid);
    }
    
    function showHomePageView() {
        defaultView.classList.remove('d-none');
        filterView.classList.add('d-none');
        searchInput.value = '';
        
        if (genreButton) genreButton.textContent = "Genre";
        if (countryButton) countryButton.textContent = "Country";
        if (typeButton) typeButton.textContent = "Type";
        
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.querySelectorAll('.dropdown-item.active').forEach(i => i.classList.remove('active'));
            menu.querySelector('[data-filter="all"]')?.classList.add('active');
        });
    }

    async function initialize() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allContent = await response.json();
            
            const latestMovies = allContent.filter(item => item.type === 'movie').sort((a,b) => b.id - a.id);
            const popularSeries = allContent.filter(item => item.type === 'series').sort((a,b) => b.id - a.id);
            displayContent(latestMovies, latestGrid);
            displayContent(popularSeries, popularSeriesGrid);

            const allGenres = allContent.flatMap(item => item.genre || []).filter(g => g);
            const allCountries = allContent.flatMap(item => item.country || []).filter(c => c);
            const allTypes = allContent.map(item => item.type).filter(t => t);

            createFilterDropdowns(allGenres, genreDropdownMenu, genreButton, 'Genres');
            createFilterDropdowns(allCountries, countryDropdownMenu, countryButton, 'Countries');
            createFilterDropdowns(allTypes, typeDropdownMenu, typeButton, 'Types');
            
            searchInput.addEventListener('input', filterAndDisplayContent);
            homeButton.addEventListener('click', showHomePageView);

        } catch (error) {
            console.error('Fatal Error:', error);
            if(latestGrid) latestGrid.innerHTML = `<p class="text-danger">Failed to load content. Please check the 'movies.json' file for errors or check the browser console (F12).</p>`;
        }
    }

    initialize();
});

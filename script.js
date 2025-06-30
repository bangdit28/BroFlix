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

    // FUNGSI KARTU FILM KEMBALI KE SEMULA (TANPA TOMBOL)
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
        gridElement.innerHTML = cardsHTML;
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
        if (!elements.defaultView || !elements.filterView) return;
        elements.defaultView.classList.add('d-none');
        elements.filterView.classList.remove('d-none');

        const activeGenre = elements.genreDropdownMenu?.querySelector('.active')?.dataset.filter || 'all';
        const activeCountry = elements.countryDropdownMenu?.querySelector('.active')?.dataset.filter || 'all';
        const activeType = elements.typeDropdownMenu?.querySelector('.active')?.dataset.filter || 'all';
        const searchTerm = elements.searchInput?.value.toLowerCase() || '';

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
        displayContent(filtered, elements.movieGrid);
    }
    
    function showHomePageView() {
        if (!elements.defaultView || !elements.filterView) return;
        elements.defaultView.classList.remove('d-none');
        elements.filterView.classList.add('d-none');
        if (elements.searchInput) elements.searchInput.value = '';
        
        if (elements.genreButton) elements.genreButton.textContent = "Genre";
        if (elements.countryButton) elements.countryButton.textContent = "Country";
        if (elements.typeButton) elements.typeButton.textContent = "Type";
        
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.querySelector('.active')?.classList.remove('active');
            menu.querySelector('[data-filter="all"]')?.classList.add('active');
        });
    }

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

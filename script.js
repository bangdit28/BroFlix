document.addEventListener('DOMContentLoaded', async () => {
    
    const latestGrid = document.getElementById('latest-movies-grid');
    const popularSeriesGrid = document.getElementById('popular-series-grid');
    const movieGrid = document.getElementById('movie-grid');
    const genreDropdownMenu = document.getElementById('genre-dropdown-menu');
    const countryDropdownMenu = document.getElementById('country-dropdown-menu');
    const genreButton = document.querySelector('#genre-filter-container .btn');
    const countryButton = document.querySelector('#country-filter-container .btn');
    const homeButton = document.getElementById('home-button');
    const searchInput = document.getElementById('search-input');
    const defaultView = document.getElementById('default-view');
    const filterView = document.getElementById('filter-view');

    let allContent = [];

    function displayContent(content, gridElement) {
        gridElement.innerHTML = '';
        if (!content || content.length === 0) {
            gridElement.innerHTML = '<p class="text-secondary">No content found.</p>';
            return;
        }
        content.forEach(item => {
            const qualityBadgeHTML = item.quality ? `<div class="quality-badge quality-${item.quality.toLowerCase()}">${item.quality}</div>` : '';
            const detailPage = item.type === 'series' ? 'detail-series.html' : 'detail-film.html';
            const card = `<div class="col"><a href="${detailPage}?id=${item.id}" class="movie-card d-block text-decoration-none text-white">${qualityBadgeHTML}<img src="${item.poster}" alt="${item.title}" loading="lazy"></a></div>`;
            gridElement.innerHTML += card;
        });
    }

    function createFilterDropdowns(items, menuElement, buttonElement, filterType) {
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
                filterAndDisplayMovies();
            });
        });
    }
    
    function filterAndDisplayMovies() {
        defaultView.classList.add('d-none');
        filterView.classList.remove('d-none');

        const activeGenre = genreDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const activeCountry = countryDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        if (activeGenre === 'all' && activeCountry === 'all' && searchTerm === '') {
            showHomePageView();
            return;
        }

        let filtered = allContent.filter(item => {
            const matchesGenre = activeGenre === 'all' || (item.genre && item.genre.includes(activeGenre));
            const matchesCountry = activeCountry === 'all' || item.country === activeCountry;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm);
            return matchesGenre && matchesCountry && matchesSearch;
        });
        displayContent(filtered, movieGrid);
    }
    
    function showHomePageView() {
        defaultView.classList.remove('d-none');
        filterView.classList.add('d-none');
        searchInput.value = '';
        genreButton.textContent = "Genre";
        countryButton.textContent = "Country";
        genreDropdownMenu.querySelector('.dropdown-item.active').classList.remove('active');
        genreDropdownMenu.querySelector('[data-filter="all"]').classList.add('active');
        countryDropdownMenu.querySelector('.dropdown-item.active').classList.remove('active');
        countryDropdownMenu.querySelector('[data-filter="all"]').classList.add('active');
    }

    async function initialize() {
        try {
            const response = await fetch('movies.json');
            allContent = await response.json();
            
            const latestMovies = allContent.filter(item => item.type === 'movie').reverse();
            const popularSeries = allContent.filter(item => item.type === 'series').reverse();
            displayContent(latestMovies, latestGrid);
            displayContent(popularSeries, popularSeriesGrid);

            const allGenres = allContent.flatMap(item => item.genre).filter(g => g);
            const allCountries = allContent.map(item => item.country).filter(c => c);
            createFilterDropdowns(allGenres, genreDropdownMenu, genreButton, 'Genres');
            createFilterDropdowns(allCountries, countryDropdownMenu, countryButton, 'Countries');
            
            searchInput.addEventListener('input', filterAndDisplayMovies);
            homeButton.addEventListener('click', showHomePageView);

        } catch (error) { console.error('Error:', error); }
    }
    initialize();
});

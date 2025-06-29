document.addEventListener('DOMContentLoaded', async () => {
    
    const movieGrid = document.getElementById('movie-grid');
    const genreDropdownMenu = document.getElementById('genre-dropdown-menu');
    const countryDropdownMenu = document.getElementById('country-dropdown-menu');
    const genreButton = document.querySelector('#genre-filter-container .btn');
    const countryButton = document.querySelector('#country-filter-container .btn');
    const searchInput = document.getElementById('search-input');

    let allMovies = [];

    function displayMovies(movies) {
        movieGrid.innerHTML = '';
        if (movies.length === 0) {
            movieGrid.innerHTML = '<p class="text-secondary">No movies found matching your criteria.</p>';
            return;
        }
        movies.forEach(movie => {
            let qualityClass = '';
            if (movie.quality) {
                qualityClass = `quality-${movie.quality.toLowerCase()}`;
            }
            const qualityBadgeHTML = movie.quality ? `<div class="quality-badge ${qualityClass}">${movie.quality}</div>` : '';

            const movieCard = `
                <div class="col">
                    <a href="detail-film.html?id=${movie.id}" class="movie-card d-block text-decoration-none text-white">
                        ${qualityBadgeHTML}
                        <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                        <div class="movie-info">
                            <h5>${movie.title}</h5>
                            <div class="d-flex justify-content-between small">
                                <span>${movie.year}</span>
                                <span><i class="fas fa-star text-warning"></i> ${movie.rating}</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            movieGrid.innerHTML += movieCard;
        });
    }

    function createFilterDropdowns(items, menuElement, buttonElement, filterType) {
        let itemsHTML = `<li><a class="dropdown-item active" href="#" data-filter="all">All ${filterType}</a></li>`;
        const uniqueItems = [...new Set(items)];
        uniqueItems.sort().forEach(item => {
            itemsHTML += `<li><a class="dropdown-item" href="#" data-filter="${item}">${item}</a></li>`;
        });
        menuElement.innerHTML = itemsHTML;

        menuElement.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedText = e.target.textContent;
                buttonElement.textContent = selectedText;
                menuElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                filterAndDisplayMovies();
            });
        });
    }
    
    function filterAndDisplayMovies() {
        const activeGenre = genreDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const activeCountry = countryDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredMovies = allMovies.filter(movie => {
            const matchesGenre = activeGenre === 'all' || movie.genre.includes(activeGenre);
            const matchesCountry = activeCountry === 'all' || movie.country === activeCountry;
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
            return matchesGenre && matchesCountry && matchesSearch;
        });
        
        displayMovies(filteredMovies);
    }

    async function initialize() {
        try {
            const response = await fetch('movies.json');
            allMovies = await response.json();
            
            const allGenres = allMovies.flatMap(movie => movie.genre);
            const allCountries = allMovies.map(movie => movie.country);

            createFilterDropdowns(allGenres, genreDropdownMenu, genreButton, 'Genres');
            createFilterDropdowns(allCountries, countryDropdownMenu, countryButton, 'Countries');
            
            displayMovies(allMovies);
            
            searchInput.addEventListener('input', filterAndDisplayMovies);

        } catch (error) {
            console.error('Failed to load movie data:', error);
            movieGrid.innerHTML = `<p class="text-danger">Error loading movie data. Please check the console.</p>`;
        }
    }

    initialize();
});

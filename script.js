document.addEventListener('DOMContentLoaded', async () => {
    
    // Ambil semua elemen penting
    const latestGrid = document.getElementById('latest-movies-grid');
    const popularSeriesGrid = document.getElementById('popular-series-grid');
    const movieGrid = document.getElementById('movie-grid');
    const genreDropdownMenu = document.getElementById('genre-dropdown-menu');
    const countryDropdownMenu = document.getElementById('country-dropdown-menu');
    const genreButton = document.querySelector('#genre-filter-container .btn');
    const countryButton = document.querySelector('#country-filter-container .btn');
    const homeButton = document.getElementById('home-button');
    const searchInput = document.getElementById('search-input');
    const allMoviesTitle = document.getElementById('all-movies-title');

    let allContent = []; // Menyimpan semua film dan series

    // Fungsi serbaguna untuk menampilkan konten ke grid manapun
    function displayContent(content, gridElement) {
        gridElement.innerHTML = '';
        if (content.length === 0) {
            gridElement.innerHTML = '<p class="text-secondary">No content found.</p>';
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
                    </a>
                </div>
            `;
            gridElement.innerHTML += card;
        });
    }

    // Fungsi untuk membuat dropdown filter
    function createFilterDropdowns(items, menuElement, buttonElement, filterType) {
        let itemsHTML = `<li><a class="dropdown-item active" href="#" data-filter="all">All ${filterType}</a></li>`;
        [...new Set(items)].sort().forEach(item => {
            itemsHTML += `<li><a class="dropdown-item" href="#" data-filter="${item}">${item}</a></li>`;
        });
        menuElement.innerHTML = itemsHTML;

        menuElement.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                buttonElement.textContent = e.target.textContent;
                menuElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                filterAndDisplayMovies();
            });
        });
    }
    
    // Fungsi untuk memfilter dan menampilkan hasil
    function filterAndDisplayMovies() {
        document.getElementById('latest-movies-section').style.display = 'none';
        document.getElementById('popular-series-section').style.display = 'none';
        allMoviesTitle.textContent = "Search & Filter Results";

        const activeGenre = genreDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const activeCountry = countryDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        let filtered = allContent.filter(item => {
            const matchesGenre = activeGenre === 'all' || item.genre.includes(activeGenre);
            const matchesCountry = activeCountry === 'all' || item.country === activeCountry;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm);
            return matchesGenre && matchesCountry && matchesSearch;
        });
        displayContent(filtered, movieGrid);
    }
    
    // Fungsi untuk reset ke tampilan awal
    function showHomePage() {
        document.getElementById('latest-movies-section').style.display = 'block';
        document.getElementById('popular-series-section').style.display = 'block';
        allMoviesTitle.textContent = "All Movies & Series";
        displayContent(allContent, movieGrid); // Tampilkan semua di grid bawah
    }

    // Fungsi utama
    async function initialize() {
        try {
            const response = await fetch('movies.json');
            allContent = await response.json();
            
            // 1. Tampilkan Terbaru (misal 5 entri terakhir)
            const latestContent = [...allContent].reverse().slice(0, 5);
            displayContent(latestContent, latestGrid);

            // 2. Tampilkan Series Populer
            const popularSeries = allContent.filter(item => item.type === 'series');
            displayContent(popularSeries, popularSeriesGrid);

            // 3. Tampilkan semua di grid bawah
            displayContent(allContent, movieGrid);

            // 4. Buat filter
            const allGenres = allContent.flatMap(item => item.genre).filter(g => g);
            const allCountries = allContent.map(item => item.country).filter(c => c);
            createFilterDropdowns(allGenres, genreDropdownMenu, genreButton, 'Genres');
            createFilterDropdowns(allCountries, countryDropdownMenu, countryButton, 'Countries');
            
            // 5. Setup event listener
            searchInput.addEventListener('input', filterAndDisplayMovies);
            homeButton.addEventListener('click', () => location.reload()); // Cara termudah reset

        } catch (error) {
            console.error('Error:', error);
        }
    }

    initialize();
});

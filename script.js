document.addEventListener('DOMContentLoaded', async () => {
    
    // Ambil elemen penting
    const movieGrid = document.getElementById('movie-grid');
    const genreDropdownMenu = document.getElementById('genre-dropdown-menu');
    const countryDropdownMenu = document.getElementById('country-dropdown-menu');
    const genreButton = document.querySelector('#genre-filter-container .btn');
    const countryButton = document.querySelector('#country-filter-container .btn');
    const searchInput = document.getElementById('search-input');

    let allMovies = []; // Variabel untuk menyimpan semua data film

    // Fungsi untuk menampilkan film ke grid
    function displayMovies(movies) {
        movieGrid.innerHTML = '';
        if (movies.length === 0) {
            movieGrid.innerHTML = '<p class="text-secondary">No movies found matching your criteria.</p>';
            return;
        }
        movies.forEach(movie => {
            const movieCard = `
                <div class="col">
                    <a href="detail-film.html?id=${movie.id}" class="movie-card d-block text-decoration-none text-white">
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

    // Fungsi BARU untuk membuat dan menampilkan item dropdown
    function createFilterDropdowns(items, menuElement, buttonElement, filterType) {
        // Tambahkan item "All" di paling atas
        let itemsHTML = `<li><a class="dropdown-item active" href="#" data-filter="all">All ${filterType}</a></li>`;
        
        // Buat item untuk setiap data unik
        const uniqueItems = [...new Set(items)];
        uniqueItems.sort().forEach(item => {
            itemsHTML += `<li><a class="dropdown-item" href="#" data-filter="${item}">${item}</a></li>`;
        });
        menuElement.innerHTML = itemsHTML;

        // Tambahkan event listener untuk setiap item dropdown
        menuElement.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Mencegah link pindah halaman
                const selectedFilter = e.target.dataset.filter;
                const selectedText = e.target.textContent;

                // Update teks tombol utama
                buttonElement.textContent = selectedText;

                // Hapus kelas 'active' dari semua item di menu ini
                menuElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                // Tambahkan kelas 'active' ke item yang diklik
                e.target.classList.add('active');
                
                // Panggil fungsi filter utama
                filterAndDisplayMovies();
            });
        });
    }
    
    // Fungsi utama untuk memfilter film
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

    // Fungsi utama untuk memuat semuanya (initialize)
    async function initialize() {
        try {
            const response = await fetch('movies.json');
            allMovies = await response.json();
            
            // Ekstrak semua genre dan negara dari data film
            const allGenres = allMovies.flatMap(movie => movie.genre);
            const allCountries = allMovies.map(movie => movie.country);

            // Buat item-item dropdown
            createFilterDropdowns(allGenres, genreDropdownMenu, genreButton, 'Genres');
            createFilterDropdowns(allCountries, countryDropdownMenu, countryButton, 'Countries');
            
            // Tampilkan semua film pada awalnya
            displayMovies(allMovies);
            
            // Tambahkan event listener untuk search bar
            searchInput.addEventListener('input', filterAndDisplayMovies);

        } catch (error) {
            console.error('Failed to load movie data:', error);
            movieGrid.innerHTML = `<p class="text-danger">Error loading movie data. Please check the console.</p>`;
        }
    }

    // Jalankan semuanya!
    initialize();
});

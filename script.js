document.addEventListener('DOMContentLoaded', async () => {
    
    // Ambil elemen penting
    const movieGrid = document.getElementById('movie-grid');
    const genreFilters = document.getElementById('genre-filters');
    const countryFilters = document.getElementById('country-filters');
    const searchInput = document.getElementById('search-input');

    let allMovies = []; // Variabel untuk menyimpan semua data film

    // Fungsi untuk menampilkan film ke grid
    function displayMovies(movies) {
        movieGrid.innerHTML = ''; // Kosongkan grid dulu
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

    // Fungsi untuk membuat dan menampilkan tombol filter
    function createFilterButtons(items, container, filterType) {
        // Tambahkan tombol "All"
        let buttonsHTML = `<button class="btn btn-sm filter-btn me-1 mb-1 active" data-filter="all">All</button>`;
        
        // Buat tombol untuk setiap item unik
        const uniqueItems = [...new Set(items)]; // Ambil item unik
        uniqueItems.sort().forEach(item => {
            buttonsHTML += `<button class="btn btn-sm filter-btn me-1 mb-1" data-filter="${item}">${item}</button>`;
        });
        container.innerHTML = buttonsHTML;

        // Tambahkan event listener untuk setiap tombol
        container.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Hapus kelas 'active' dari semua tombol di grup ini
                container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                // Tambahkan kelas 'active' ke tombol yang diklik
                e.target.classList.add('active');
                
                // Panggil fungsi filter utama
                filterAndDisplayMovies();
            });
        });
    }
    
    // Fungsi utama untuk memfilter film
    function filterAndDisplayMovies() {
        const activeGenre = genreFilters.querySelector('.filter-btn.active').dataset.filter;
        const activeCountry = countryFilters.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredMovies = allMovies.filter(movie => {
            const matchesGenre = activeGenre === 'all' || movie.genre.includes(activeGenre);
            const matchesCountry = activeCountry === 'all' || movie.country === activeCountry;
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
            return matchesGenre && matchesCountry && matchesSearch;
        });
        
        displayMovies(filteredMovies);
    }

    // Fungsi utama untuk memuat semuanya
    async function initialize() {
        try {
            const response = await fetch('movies.json');
            allMovies = await response.json();
            
            // Ekstrak semua genre dan negara dari data film
            const allGenres = allMovies.flatMap(movie => movie.genre);
            const allCountries = allMovies.map(movie => movie.country);

            // Buat tombol filter
            createFilterButtons(allGenres, genreFilters, 'genre');
            createFilterButtons(allCountries, countryFilters, 'country');
            
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

document.addEventListener('DOMContentLoaded', async () => {
    
    // Ambil semua elemen penting dari HTML
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

    let allContent = []; // Variabel untuk menyimpan semua data film dan series

    // Fungsi serbaguna untuk menampilkan konten
    function displayContent(content, gridElement) {
        if (!gridElement) return; // Pengaman jika elemen tidak ditemukan
        gridElement.innerHTML = '';
        if (!content || content.length === 0) {
            gridElement.innerHTML = '<p class="text-secondary">No content found.</p>';
            return;
        }

        content.forEach(item => {
            const qualityBadgeHTML = item.quality ? `<div class="quality-badge quality-${item.quality.toLowerCase()}">${item.quality}</div>` : '';
            // Pengecekan tipe konten untuk menentukan halaman detail
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
        if (!menuElement || !buttonElement) return; // Pengaman
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
    
    // Fungsi untuk memfilter dan menampilkan hasil
    function filterAndDisplayContent() {
        defaultView.classList.add('d-none');
        filterView.classList.remove('d-none');

        const activeGenre = genreDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const activeCountry = countryDropdownMenu.querySelector('.dropdown-item.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        if (activeGenre === 'all' && activeCountry === 'all' && searchTerm.trim() === '') {
            showHomePageView();
            return;
        }

        let filtered = allContent.filter(item => {
            // Pengecekan keamanan: pastikan properti ada sebelum diakses
            const genreMatch = item.genre ? item.genre.includes(activeGenre) : false;
            const countryMatch = item.country ? item.country === activeCountry : false;
            const titleMatch = item.title ? item.title.toLowerCase().includes(searchTerm) : false;

            return (activeGenre === 'all' || genreMatch) &&
                   (activeCountry === 'all' || countryMatch) &&
                   titleMatch;
        });
        displayContent(filtered, movieGrid);
    }
    
    // Fungsi untuk kembali ke tampilan awal (homepage)
    function showHomePageView() {
        defaultView.classList.remove('d-none');
        filterView.classList.add('d-none');
        searchInput.value = '';
        
        // Reset dropdowns dengan aman
        if (genreButton) genreButton.textContent = "Genre";
        if (countryButton) countryButton.textContent = "Country";
        if (genreDropdownMenu) {
            genreDropdownMenu.querySelector('.dropdown-item.active')?.classList.remove('active');
            genreDropdownMenu.querySelector('[data-filter="all"]')?.classList.add('active');
        }
        if (countryDropdownMenu) {
            countryDropdownMenu.querySelector('.dropdown-item.active')?.classList.remove('active');
            countryDropdownMenu.querySelector('[data-filter="all"]')?.classList.add('active');
        }
    }

    // Fungsi utama untuk memuat semua data dan menginisialisasi halaman
    async function initialize() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allContent = await response.json();
            
            // --- Memuat Konten ke Halaman Utama ---
            // Ambil 10 film terbaru (type: movie)
            const latestMovies = allContent.filter(item => item.type === 'movie').reverse().slice(0, 10);
            displayContent(latestMovies, latestGrid);

            // Ambil 10 series terbaru (type: series)
            const popularSeries = allContent.filter(item => item.type === 'series').reverse().slice(0, 10);
            displayContent(popularSeries, popularSeriesGrid);

            // --- Membuat Filter ---
            // Pengecekan keamanan saat mengekstrak genre dan negara
            const allGenres = allContent.flatMap(item => item.genre || []).filter(g => g);
            const allCountries = allContent.map(item => item.country).filter(c => c);
            createFilterDropdowns(allGenres, genreDropdownMenu, genreButton, 'Genres');
            createFilterDropdowns(allCountries, countryDropdownMenu, countryButton, 'Countries');
            
            // --- Menyiapkan Event Listener ---
            searchInput.addEventListener('input', filterAndDisplayContent);
            homeButton.addEventListener('click', showHomePageView);

        } catch (error) {
            console.error('Fatal Error:', error);
            // Tampilkan pesan error yang jelas di halaman
            if (latestGrid) latestGrid.innerHTML = `<p class="text-danger">Failed to load content. Please check the 'movies.json' file for errors or check the browser console (F12).</p>`;
        }
    }

    initialize();
});

// Tunggu halaman siap, baru jalankan script
document.addEventListener('DOMContentLoaded', () => {
    
    // Siapkan 'rak' kosong dari HTML
    const latestGrid = document.getElementById('latest-movies-grid');
    const seriesGrid = document.getElementById('series-grid');
    const animeGrid = document.getElementById('anime-grid');

    // Fungsi untuk mengambil dan menampilkan semua film
    async function loadAndDisplayMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error('Gagal mengambil movies.json');
            }
            const movies = await response.json();

            // Kosongkan rak sebelum diisi ulang
            latestGrid.innerHTML = '';
            seriesGrid.innerHTML = '';
            animeGrid.innerHTML = '';
            
            // Loop setiap film dari gudang data
            movies.forEach(movie => {
                // Buat kartu HTML untuk film ini
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

                // Masukkan kartu ke rak yang sesuai kategorinya
                if (movie.category === 'latest') {
                    latestGrid.innerHTML += movieCard;
                } else if (movie.category === 'series') {
                    seriesGrid.innerHTML += movieCard;
                } else if (movie.category === 'anime') {
                    animeGrid.innerHTML += movieCard;
                }
            });

        } catch (error) {
            console.error('Terjadi masalah:', error);
            latestGrid.innerHTML = `<p class="text-danger">Gagal memuat film. Cek console log.</p>`;
        }
    }

    // Jalankan fungsi utama
    loadAndDisplayMovies();
});
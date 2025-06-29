document.addEventListener('DOMContentLoaded', async () => {
    // Ambil elemen-elemen penting dari halaman
    const playerPlaceholder = document.getElementById('player-placeholder');
    const youtubePlayer = document.getElementById('youtube-player');
    const adModalElement = document.getElementById('adModal');
    const adModal = new bootstrap.Modal(adModalElement);
    const adLinkButton = document.getElementById('ad-link-button');

    // 1. Ambil ID film dari URL
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    if (!movieId) {
        document.body.innerHTML = '<h1 class="text-center text-danger mt-5">Movie ID not found!</h1>';
        return;
    }

    try {
        // 2. Ambil data film dari 'gudang'
        const response = await fetch('movies.json');
        const movies = await response.json();
        const movie = movies.find(m => m.id == movieId);

        if (!movie) {
            document.body.innerHTML = `<h1 class="text-center text-danger mt-5">Movie with ID ${movieId} not found!</h1>`;
            return;
        }

        // 3. Isi semua info film ke halaman
        document.title = `Watch ${movie.title} - BroFlix`;
        document.getElementById('movie-title').textContent = movie.title;
        // ... (kode untuk mengisi info lain tetap sama)
        document.getElementById('movie-description').textContent = movie.description;
        document.getElementById('movie-director').textContent = movie.director;
        document.getElementById('movie-cast').textContent = movie.cast;
        document.getElementById('movie-genre').textContent = movie.genre;
        document.getElementById('movie-quality').textContent = movie.quality;
        document.getElementById('movie-poster').src = movie.poster;

        // Isi placeholder dengan poster film
        playerPlaceholder.style.backgroundImage = `url('${movie.poster}')`;
        
        // Siapkan URL player tapi jangan langsung ditampilkan
        const playerUrl = movie.trailerUrl + "?autoplay=1&rel=0"; // Autoplay saat player muncul
        youtubePlayer.setAttribute('data-src', playerUrl);
        
        // Handle subtitle (kode tetap sama)
        const subtitlesContainer = document.getElementById('movie-subtitles');
        if (movie.availableSubtitles && movie.availableSubtitles.length > 0) {
            let subtitleBadges = '';
            movie.availableSubtitles.forEach(lang => {
                subtitleBadges += `<span class="badge rounded-pill me-1 badge-subtitle">${lang}</span>`;
            });
            subtitlesContainer.innerHTML = subtitleBadges;
        } else {
            subtitlesContainer.innerHTML = '<span>Not available</span>';
        }

        // ======================================================
        // LOGIKA BARU UNTUK IKLAN
        // ======================================================

        // Tampilkan popup iklan saat halaman siap
        adModal.show();

        // Tambahkan event listener ke tombol iklan
        adLinkButton.addEventListener('click', () => {
            // Sembunyikan popup
            adModal.hide();

            // Tampilkan video player yang sesungguhnya
            playerPlaceholder.classList.add('d-none'); // Sembunyikan placeholder
            youtubePlayer.src = youtubePlayer.getAttribute('data-src'); // Set src untuk memulai video
            youtubePlayer.classList.remove('d-none'); // Tampilkan player
        });
        
        // Jika pengguna mencoba klik placeholder sebelum klik iklan
        playerPlaceholder.addEventListener('click', () => {
            // Tampilkan kembali popup iklannya
            adModal.show();
        });

    } catch (error) {
        console.error('Failed to load movie data:', error);
        document.body.innerHTML = '<h1 class="text-center text-danger mt-5">Error loading movie data.</h1>';
    }
});

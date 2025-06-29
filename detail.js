document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil ID film dari URL
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    if (!movieId) {
        document.body.innerHTML = '<h1 class="text-center text-danger mt-5">Movie ID not found!</h1>';
        return;
    }

    // 2. Ambil data film dari 'gudang'
    try {
        const response = await fetch('movies.json');
        const movies = await response.json();
        const movie = movies.find(m => m.id == movieId);

        if (!movie) {
            document.body.innerHTML = `<h1 class="text-center text-danger mt-5">Movie with ID ${movieId} not found!</h1>`;
            return;
        }

        // 3. Isi semua elemen di halaman dengan data yang sesuai
        document.title = `Watch ${movie.title} - BroFlix`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-description').textContent = movie.description;
        document.getElementById('movie-director').textContent = movie.director;
        document.getElementById('movie-cast').textContent = movie.cast;
        document.getElementById('movie-genre').textContent = movie.genre;
        document.getElementById('movie-quality').textContent = movie.quality;
        document.getElementById('movie-poster').src = movie.poster;
        document.getElementById('youtube-player').src = movie.trailerUrl + "?autoplay=1&mute=1"; // Tambah autoplay & mute biar keren

        // 4. Urus tampilan daftar subtitle
        const subtitlesContainer = document.getElementById('movie-subtitles');
        if (movie.availableSubtitles && movie.availableSubtitles.length > 0) {
            let subtitleBadges = '';
            movie.availableSubtitles.forEach(lang => {
                // Buat "badge" Bootstrap untuk tiap bahasa
                subtitleBadges += `<span class="badge rounded-pill me-1 badge-subtitle">${lang}</span>`;
            });
            subtitlesContainer.innerHTML = subtitleBadges;
        } else {
            subtitlesContainer.innerHTML = '<span>Not available</span>';
        }

    } catch (error) {
        console.error('Failed to load movie data:', error);
        document.body.innerHTML = '<h1 class="text-center text-danger mt-5">Error loading movie data.</h1>';
    }
});

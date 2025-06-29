document.addEventListener('DOMContentLoaded', async () => {
    
    const playerPlaceholder = document.getElementById('player-placeholder');
    const youtubePlayer = document.getElementById('youtube-player');
    const adModalElement = document.getElementById('adModal');
    const adModal = new bootstrap.Modal(adModalElement);
    const adLinkButton = document.getElementById('ad-link-button');

    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    if (!movieId) {
        document.body.innerHTML = '<h1 class="text-center text-danger mt-5">Movie ID not found!</h1>';
        return;
    }

    try {
        const response = await fetch('movies.json');
        const movies = await response.json();
        const movie = movies.find(m => m.id == movieId);

        if (!movie) {
            document.body.innerHTML = `<h1 class="text-center text-danger mt-5">Movie with ID ${movieId} not found!</h1>`;
            return;
        }

        document.title = `Watch ${movie.title} - BroFlix`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-description').textContent = movie.description;
        document.getElementById('movie-director').textContent = movie.director;
        document.getElementById('movie-cast').textContent = movie.cast;
        document.getElementById('movie-genre').textContent = movie.genre.join(', '); // Gabungkan genre array
        document.getElementById('movie-quality').textContent = movie.quality;
        document.getElementById('movie-poster').src = movie.poster;

        playerPlaceholder.style.backgroundImage = `url('${movie.poster}')`;
        
        const playerUrl = movie.trailerUrl + "?autoplay=1&rel=0";
        youtubePlayer.setAttribute('data-src', playerUrl);
        
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

        adModal.show();

        adLinkButton.addEventListener('click', () => {
            adModal.hide();
            playerPlaceholder.classList.add('d-none');
            youtubePlayer.src = youtubePlayer.getAttribute('data-src');
            youtubePlayer.classList.remove('d-none');
        });
        
        playerPlaceholder.addEventListener('click', () => {
            adModal.show();
        });

    } catch (error) {
        console.error('Failed to load movie data:', error);
        document.body.innerHTML = '<h1 class="text-center text-danger mt-5">Error loading movie data.</h1>';
    }
});

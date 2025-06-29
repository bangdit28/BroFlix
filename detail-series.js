document.addEventListener('DOMContentLoaded', async () => {

    const seriesTitle = document.getElementById('series-title');
    const seriesDescription = document.getElementById('series-description');
    const seasonTabs = document.getElementById('season-tabs');
    const episodeList = document.getElementById('episode-list');
    const videoPlayer = document.getElementById('video-player');

    const params = new URLSearchParams(window.location.search);
    const seriesId = params.get('id');

    if (!seriesId) return;

    try {
        const response = await fetch('movies.json');
        const allContent = await response.json();
        const series = allContent.find(item => item.id == seriesId);

        if (!series || series.type !== 'series') return;

        // Isi Info Umum
        document.title = `Watching ${series.title} - BroFlix`;
        seriesTitle.textContent = series.title;
        seriesDescription.textContent = series.description;
        
        // Fungsi untuk menampilkan episode
        function showEpisodes(seasonNumber) {
            const seasonData = series.seasons.find(s => s.season == seasonNumber);
            episodeList.innerHTML = '';
            seasonData.episodes.forEach(ep => {
                episodeList.innerHTML += `<a href="#" class="list-group-item list-group-item-action" data-url="${ep.trailerUrl}">Episode ${ep.episode}: ${ep.title}</a>`;
            });

            // Tambah event listener ke episode yang baru dibuat
            episodeList.querySelectorAll('a').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Hapus kelas active dari episode lain
                    episodeList.querySelectorAll('a').forEach(i => i.classList.remove('active'));
                    // Tambahkan active ke yang diklik
                    e.target.classList.add('active');
                    videoPlayer.src = e.target.dataset.url + "?autoplay=1";
                });
            });
            
            // Otomatis putar episode pertama di season itu
            if (episodeList.firstChild) {
                episodeList.firstChild.click();
            }
        }

        // Buat Tab Season
        series.seasons.forEach((season, index) => {
            const isActive = index === 0 ? 'active' : '';
            seasonTabs.innerHTML += `<li class="nav-item"><a class="nav-link ${isActive}" data-season="${season.season}" href="#">Season ${season.season}</a></li>`;
        });
        
        // Tambah event listener ke tab season
        seasonTabs.querySelectorAll('a').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                seasonTabs.querySelectorAll('a').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                showEpisodes(e.target.dataset.season);
            });
        });
        
        // Tampilkan episode untuk season pertama secara default
        showEpisodes(series.seasons[0].season);

    } catch (error) {
        console.error("Error loading series data:", error);
    }
});

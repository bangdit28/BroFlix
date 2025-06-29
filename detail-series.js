document.addEventListener('DOMContentLoaded', async () => {

    const seriesTitle = document.getElementById('series-title');
    const seriesDescription = document.getElementById('series-description');
    const seriesPoster = document.getElementById('series-poster');
    const seriesCast = document.getElementById('series-cast');
    const seriesGenre = document.getElementById('series-genre');
    const seasonSelector = document.getElementById('season-selector');
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

        document.title = `Watching ${series.title} - BroFlix`;
        seriesTitle.textContent = series.title;
        seriesDescription.textContent = series.description;
        seriesPoster.src = series.poster;
        seriesCast.textContent = series.cast;
        seriesGenre.textContent = series.genre.join(', ');
        
        function showEpisodes(seasonNumber) {
            const seasonData = series.seasons.find(s => s.season == seasonNumber);
            episodeList.innerHTML = '';
            if (!seasonData) return;
            
            seasonData.episodes.forEach(ep => {
                const epBtn = document.createElement('button');
                epBtn.className = 'btn episode-btn';
                epBtn.textContent = ep.episode;
                epBtn.dataset.url = ep.videoUrl;
                epBtn.dataset.ep = ep.episode;
                episodeList.appendChild(epBtn);
                
                epBtn.addEventListener('click', (e) => {
                    episodeList.querySelectorAll('.episode-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    videoPlayer.src = e.target.dataset.url + "?autoplay=1";
                });
            });
            if (episodeList.firstChild) episodeList.firstChild.click();
        }

        let seasonDropdownHTML = '<button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">Season 1</button><ul class="dropdown-menu">';
        series.seasons.forEach(season => {
            seasonDropdownHTML += `<li><a class="dropdown-item" href="#" data-season="${season.season}">Season ${season.season}</a></li>`;
        });
        seasonDropdownHTML += '</ul>';
        seasonSelector.innerHTML = seasonDropdownHTML;

        const mainButton = seasonSelector.querySelector('.btn');
        seasonSelector.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                mainButton.textContent = e.target.textContent;
                showEpisodes(e.target.dataset.season);
            });
        });
        
        showEpisodes(series.seasons[0].season);

    } catch (error) { console.error("Error:", error); }
});

document.addEventListener('DOMContentLoaded', async () => {

    const playerPlaceholder = document.getElementById('player-placeholder');
    const videoPlayer = document.getElementById('video-player');
    const adModalElement = document.getElementById('adModal');
    const adModal = new bootstrap.Modal(adModalElement);
    const adLinkButton = document.getElementById('ad-link-button');

    const seriesTitle = document.getElementById('series-title');
    const seriesDescription = document.getElementById('series-description');
    const seriesPoster = document.getElementById('series-poster');
    const seriesCast = document.getElementById('series-cast');
    const seriesGenre = document.getElementById('series-genre');
    const seriesQuality = document.getElementById('series-quality');
    const seriesSubtitles = document.getElementById('series-subtitles');
    const seasonSelector = document.getElementById('season-selector');
    const episodeList = document.getElementById('episode-list');

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
        seriesQuality.textContent = series.quality;
        playerPlaceholder.style.backgroundImage = `url('${series.poster}')`;

        if (series.availableSubtitles && series.availableSubtitles.length > 0) {
            let subtitleBadges = '';
            series.availableSubtitles.forEach(lang => {
                subtitleBadges += `<span class="badge rounded-pill me-1 badge-subtitle">${lang}</span>`;
            });
            seriesSubtitles.innerHTML = subtitleBadges;
        } else {
            seriesSubtitles.innerHTML = '<span>Not available</span>';
        }

        adModal.show();
        adLinkButton.addEventListener('click', () => {
            adModal.hide();
            playerPlaceholder.classList.add('d-none');
            videoPlayer.classList.remove('d-none');
            if (episodeList.querySelector('.episode-btn.active')) {
                videoPlayer.src = episodeList.querySelector('.episode-btn.active').dataset.url + "?autoplay=1";
            } else if (episodeList.firstChild) {
                episodeList.firstChild.click();
            }
        });
        playerPlaceholder.addEventListener('click', () => adModal.show());

        function showEpisodes(seasonNumber) {
            const seasonData = series.seasons.find(s => s.season == seasonNumber);
            episodeList.innerHTML = '';
            if (!seasonData) return;
            
            seasonData.episodes.forEach((ep, index) => {
                const epBtn = document.createElement('button');
                epBtn.className = 'btn episode-btn';
                epBtn.textContent = ep.episode;
                epBtn.dataset.url = ep.videoUrl;
                if (index === 0) epBtn.classList.add('active'); // Set episode 1 sebagai active default
                episodeList.appendChild(epBtn);
                
                epBtn.addEventListener('click', (e) => {
                    if (videoPlayer.classList.contains('d-none')) {
                        adModal.show();
                        return;
                    }
                    episodeList.querySelectorAll('.episode-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    videoPlayer.src = e.target.dataset.url + "?autoplay=1";
                });
            });
        }

        let seasonDropdownHTML = `<button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">Season 1</button><ul class="dropdown-menu">`;
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
                
                if (!videoPlayer.classList.contains('d-none') && episodeList.firstChild) {
                    episodeList.firstChild.click();
                }
            });
        });
        
        showEpisodes(series.seasons[0].season);

        // Setelah iklan ditutup dan episode pertama belum terpilih, klik
        adModalElement.addEventListener('hidden.bs.modal', () => {
             if (episodeList.firstChild && !videoPlayer.src) {
                episodeList.firstChild.click();
            }
        });

    } catch (error) { console.error("Error:", error); }
});

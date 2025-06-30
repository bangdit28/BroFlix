document.addEventListener('DOMContentLoaded', () => {
    console.log("list-script.js loaded");

    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!contentGrid || !paginationContainer) {
        console.error("Critical elements not found! Make sure 'content-grid' and 'pagination-container' exist in your HTML.");
        return;
    }

    // =======================================================
    // PEMBARUAN LOGIKA PALING PENTING ADA DI SINI
    // =======================================================
    function getContentType() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('movies.html')) {
            return 'movie';
        } else if (path.includes('series.html')) {
            return 'series';
        }
        // Jika tidak ada yang cocok, kembalikan null sebagai tanda error
        return null; 
    }

    const contentType = getContentType();
    // =======================================================
    
    // Hentikan script jika tipe konten tidak jelas
    if (!contentType) {
        console.error("Could not determine content type from URL. URL must contain 'movies.html' or 'series.html'.");
        contentGrid.innerHTML = '<p class="text-danger text-center col-12">Error: Page type could not be determined.</p>';
        return;
    }
    
    console.log("Content type detected:", contentType);

    const itemsPerPage = 18;
    let allItems = [];
    let currentPage = 1;

    // Fungsi displayItems (tidak ada perubahan)
    function displayItems(items) {
        contentGrid.innerHTML = '';
        if (items.length === 0) {
            contentGrid.innerHTML = '<p class="text-secondary text-center col-12">No content found for this category.</p>';
            return;
        }
        let cardsHTML = '';
        items.forEach(item => {
            const qualityBadgeHTML = item.quality ? `<div class="quality-badge quality-${item.quality.toLowerCase()}">${item.quality}</div>` : '';
            const detailPage = item.type === 'series' ? 'detail-series.html' : 'detail-film.html';
            cardsHTML += `
                <div class="col">
                    <a href="${detailPage}?id=${item.id}" class="movie-card d-block text-decoration-none text-white">
                        ${qualityBadgeHTML}
                        <img src="${item.poster || ''}" alt="${item.title || 'No Title'}" loading="lazy">
                    </a>
                </div>`;
        });
        contentGrid.innerHTML = cardsHTML;
    }

    // Fungsi setupPagination (tidak ada perubahan)
    function setupPagination(totalItems) { /* ... sama seperti sebelumnya ... */ }
    
    // Fungsi loadContent (tidak ada perubahan)
    async function loadContent(isInitialLoad = true) {
        if (isInitialLoad) {
            try {
                const response = await fetch('movies.json');
                if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
                const allContent = await response.json();
                
                // Filter berdasarkan contentType yang sudah kita deteksi dengan benar
                allItems = allContent.filter(item => item.type === contentType).sort((a,b) => b.id - a.id);
                console.log(`Found ${allItems.length} items of type '${contentType}'`);
                
                setupPagination(allItems.length);
            } catch (error) {
                console.error("Failed to load content:", error);
                contentGrid.innerHTML = '<p class="text-danger text-center col-12">Failed to load content. Please check console (F12).</p>';
                return;
            }
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = allItems.slice(startIndex, endIndex);
        
        displayItems(itemsToShow);

        const allButtons = paginationContainer.querySelectorAll('.page-item');
        allButtons.forEach(btn => btn.classList.remove('active'));
        if (allButtons[currentPage - 1]) {
            allButtons[currentPage - 1].classList.add('active');
        }
    }

    loadContent(true);
});

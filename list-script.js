document.addEventListener('DOMContentLoaded', () => {

    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    
    // Tentukan tipe konten berdasarkan nama file HTML
    const contentType = window.location.pathname.includes('movies.html') ? 'movie' : 'series';
    const itemsPerPage = 18; // Berapa item per halaman
    let allItems = [];
    let currentPage = 1;

    // Fungsi untuk menampilkan kartu film (sama seperti di script.js)
    function displayItems(items) {
        contentGrid.innerHTML = '';
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

    // Fungsi untuk membuat tombol paginasi
    function setupPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('li');
            pageButton.className = 'page-item';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            const link = document.createElement('a');
            link.className = 'page-link';
            link.href = '#';
            link.innerText = i;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                loadContent();
                window.scrollTo(0, 0); // Scroll ke atas setelah ganti halaman
            });
            pageButton.appendChild(link);
            paginationContainer.appendChild(pageButton);
        }
    }
    
    // Fungsi utama untuk memuat dan menampilkan konten
    async function loadContent() {
        if (allItems.length === 0) { // Hanya fetch jika data belum ada
            try {
                const response = await fetch('movies.json');
                const allContent = await response.json();
                allItems = allContent.filter(item => item.type === contentType).sort((a,b) => b.id - a.id);
                setupPagination(allItems.length);
            } catch (error) {
                console.error("Failed to load content:", error);
                contentGrid.innerHTML = '<p class="text-danger">Failed to load content.</p>';
                return;
            }
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = allItems.slice(startIndex, endIndex);
        displayItems(itemsToShow);

        // Update status 'active' pada tombol paginasi
        const allButtons = paginationContainer.querySelectorAll('.page-item');
        allButtons.forEach(btn => btn.classList.remove('active'));
        if (allButtons[currentPage - 1]) {
            allButtons[currentPage - 1].classList.add('active');
        }
    }

    loadContent();
});

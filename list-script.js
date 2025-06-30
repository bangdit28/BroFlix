document.addEventListener('DOMContentLoaded', () => {
    console.log("list-script.js loaded"); // Pesan untuk memastikan script berjalan

    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    
    // Jika elemen penting tidak ditemukan, hentikan script
    if (!contentGrid || !paginationContainer) {
        console.error("Critical elements not found! Make sure 'content-grid' and 'pagination-container' exist in your HTML.");
        return;
    }

    // Cara yang lebih aman untuk menentukan tipe konten
    const pagePath = window.location.pathname.toLowerCase();
    const contentType = pagePath.includes('series.html') ? 'series' : 'movie';
    console.log("Content type detected:", contentType); // Cek apakah tipe konten terdeteksi benar

    const itemsPerPage = 18;
    let allItems = [];
    let currentPage = 1;

    // Fungsi displayItems (tidak berubah, tapi kita pastikan benar)
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

    // Fungsi setupPagination (tidak berubah)
    function setupPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        if (pageCount <= 1) return; // Jangan tampilkan paginasi jika cuma 1 halaman

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
                loadContent(false); // false berarti tidak perlu fetch data lagi
                window.scrollTo(0, 0);
            });
            pageButton.appendChild(link);
            paginationContainer.appendChild(pageButton);
        }
    }
    
    // Fungsi loadContent sedikit di-refactor agar lebih aman
    async function loadContent(isInitialLoad = true) {
        // Hanya ambil data dari JSON saat pertama kali load
        if (isInitialLoad) {
            try {
                const response = await fetch('movies.json');
                if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
                const allContent = await response.json();
                
                allItems = allContent.filter(item => item.type === contentType).sort((a,b) => b.id - a.id);
                console.log(`Found ${allItems.length} items of type '${contentType}'`); // Cek jumlah item yang ditemukan
                
                setupPagination(allItems.length);
            } catch (error) {
                console.error("Failed to load content:", error);
                contentGrid.innerHTML = '<p class="text-danger text-center col-12">Failed to load content. Please check the console (F12) for more details.</p>';
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

    // Jalankan fungsi utama
    loadContent(true);
});

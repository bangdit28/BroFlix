document.addEventListener('DOMContentLoaded', () => {
    console.log("list-script.js loaded");

    const contentGrid = document.getElementById('content-grid');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!contentGrid || !paginationContainer) {
        console.error("Critical elements not found! Make sure 'content-grid' and 'pagination-container' exist in your HTML.");
        return;
    }

    // =======================================================
    // METODE DETEKSI BARU YANG ANTI-GAGAL
    // =======================================================
    const contentType = document.body.dataset.contentType;
    // =======================================================
    
    if (!contentType) {
        console.error("FATAL: Could not determine content type. Make sure the <body> tag has a 'data-content-type' attribute (e.g., <body data-content-type='movie'>).");
        contentGrid.innerHTML = '<p class="text-danger text-center col-12">Error: Page configuration is missing.</p>';
        return;
    }
    
    console.log("Content type detected via data-attribute:", contentType);

    const itemsPerPage = 18;
    let allItems = [];
    let currentPage = 1;

    // Fungsi displayItems (tidak berubah)
    function displayItems(items) {
        // ... sama seperti sebelumnya ...
    }

    // Fungsi setupPagination (tidak berubah)
    function setupPagination(totalItems) {
        // ... sama seperti sebelumnya ...
    }
    
    // Fungsi loadContent (tidak berubah)
    async function loadContent(isInitialLoad = true) {
        if (isInitialLoad) {
            try {
                const response = await fetch('movies.json');
                if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
                const allContent = await response.json();
                
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

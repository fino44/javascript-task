const API_URL = "https://dummyjson.com/products";

let products = [];

// Ambil elemen HTML
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const resetButton = document.getElementById("resetButton");
const productCounter = document.getElementById("productCounter");
const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const retryButton = document.getElementById("retryButton");
const detailModal = document.getElementById("detailModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

// Mengambil data dari API
async function getProducts() {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    productGrid.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Gagal mengambil data");
        }

        const data = await response.json();
        products = data.products;

        createCategoryOptions();
        showProducts();

    } catch (err) {
        console.error(err);
        error.classList.remove("hidden");
        productCounter.textContent = "Product tidak dapat ditampilkan.";
    } finally {
        loading.classList.add("hidden");
    }
}

// Membuat pilihan category secara otomatis
function createCategoryOptions() {
    categorySelect.innerHTML = '<option value="all">Semua kategori</option>';

    const categories = [];

    products.forEach(function(product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    categories.sort();

    categories.forEach(function(category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Menampilkan product sesuai search, category, dan sorting
function showProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const selectedSort = sortSelect.value;

    let filteredProducts = products.filter(function(product) {
        const matchSearch = product.title.toLowerCase().includes(searchText);

        const matchCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    // Sorting
    if (selectedSort === "price-low") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (selectedSort === "price-high") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (selectedSort === "rating-high") {
        filteredProducts.sort(function(a, b) {
            return b.rating - a.rating;
        });
    } else if (selectedSort === "name-az") {
        filteredProducts.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    }

    renderProducts(filteredProducts);

    productCounter.textContent =
        `${filteredProducts.length} dari ${products.length} product ditampilkan.`;
}

// Membuat product card
function renderProducts(productList) {
    productGrid.innerHTML = "";

    if (productList.length === 0) {
        productGrid.innerHTML = `
            <div class="message" style="grid-column: 1 / -1;">
                Product tidak ditemukan.
            </div>
        `;
        return;
    }

    productList.forEach(function(product) {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="product-info">
                <h3>${product.title}</h3>
                <p class="category">Category: ${product.category}</p>
                <p class="price">$${product.price}</p>
                <p class="rating">⭐ ${product.rating}</p>
                <button class="detail-button" onclick="showDetail(${product.id})">
                    Lihat Detail
                </button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// Menampilkan detail product dalam modal
function showDetail(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    modalBody.innerHTML = `
        <div class="modal-product">
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="modal-info">
                <h2>${product.title}</h2>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <p class="modal-price">$${product.price}</p>
                <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p><strong>Brand:</strong> ${product.brand || "Tidak tersedia"}</p>
            </div>
        </div>
    `;

    detailModal.classList.remove("hidden");
}

// Tutup modal
function closeDetailModal() {
    detailModal.classList.add("hidden");
}

// Event Search
searchInput.addEventListener("input", function() {
    showProducts();
});

// Event Category
categorySelect.addEventListener("change", function() {
    showProducts();
});

// Event Sorting
sortSelect.addEventListener("change", function() {
    showProducts();
});

// Event Reset
resetButton.addEventListener("click", function() {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "default";

    showProducts();
});

// Event tutup modal
closeModal.addEventListener("click", function() {
    closeDetailModal();
});

// Bonus: tutup modal dengan klik area luar
detailModal.addEventListener("click", function(event) {
    if (event.target === detailModal) {
        closeDetailModal();
    }
});

// Bonus: tutup modal dengan tombol Escape
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeDetailModal();
    }
});

// Tombol coba lagi jika API error
retryButton.addEventListener("click", function() {
    getProducts();
});

// Jalankan aplikasi
getProducts();

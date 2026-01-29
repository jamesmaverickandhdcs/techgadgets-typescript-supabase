import { supabase } from './config.js';
import { Product, Category } from './types.js';

// Fetch all products from Supabase
export async function fetchProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Fetch products by category
export async function fetchProductsByCategory(category: Category): Promise<Product[]> {
    if (category === 'all') return fetchProducts();

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('id');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

// Search products by name
export async function searchProducts(searchTerm: string): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${searchTerm}%`)
            .order('id');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

// Display products on the page
export function displayProducts(products: Product[], containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">No products found.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image_url}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="description">${product.description}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    </div>
  `).join('');
}

// Initialize products page
export async function initProductsPage(): Promise<void> {
    const products = await fetchProducts();
    displayProducts(products, 'products-grid');

    // Search functionality
    const searchBox = document.getElementById('search-box') as HTMLInputElement;
    if (searchBox) {
        searchBox.addEventListener('input', async () => {
            const searchTerm = searchBox.value.trim();
            if (searchTerm) {
                const results = await searchProducts(searchTerm);
                displayProducts(results, 'products-grid');
            } else {
                const allProducts = await fetchProducts();
                displayProducts(allProducts, 'products-grid');
            }
        });
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
    if (categoryFilter) {
        categoryFilter.addEventListener('change', async () => {
            const category = categoryFilter.value as Category;
            const filtered = await fetchProductsByCategory(category);
            displayProducts(filtered, 'products-grid');
        });
    }
}

// Initialize homepage (show first 4 products)
export async function initHomePage(): Promise<void> {
    const products = await fetchProducts();
    const featured = products.slice(0, 4);
    displayProducts(featured, 'featured-products');
}
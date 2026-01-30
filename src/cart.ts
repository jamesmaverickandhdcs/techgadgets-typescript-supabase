import { Product, CartItem } from './types.js';

const CART_KEY = 'techgadgets_cart';

// Get cart from localStorage
export function getCart(): CartItem[] {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
}

// Save cart to localStorage
export function saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add product to cart
export function addToCart(product: Product): void {
    const cart = getCart();
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();

    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
export function removeFromCart(productId: number): void {
    let cart = getCart();
    cart = cart.filter(item => item.product.id !== productId);
    saveCart(cart);
    updateCartCount();
}

// Update quantity
export function updateQuantity(productId: number, quantity: number): void {
    const cart = getCart();
    const item = cart.find(item => item.product.id === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

// Calculate cart totals
export function calculateCartTotals(): { subtotal: number; shipping: number; total: number } {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10.00 : 0;
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
}

// Get total items in cart
export function getTotalItems(): number {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update cart count in navigation
export function updateCartCount(): void {
    const totalItems = getTotalItems();
    const cartLinks = document.querySelectorAll('nav a[href="cart.html"]');

    cartLinks.forEach(link => {
        link.textContent = `Cart (${totalItems})`;
    });
}

// Clear cart
export function clearCart(): void {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

// Show notification
function showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Display cart items on cart page
export function displayCartItems(): void {
    const cart = getCart();
    const cartItemsDiv = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    const cartSummaryDiv = document.getElementById('cart-summary');

    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        if (cartItemsDiv) cartItemsDiv.style.display = 'none';
        if (cartSummaryDiv) cartSummaryDiv.style.display = 'none';
        if (emptyCartDiv) emptyCartDiv.style.display = 'block';
        return;
    }

    if (emptyCartDiv) emptyCartDiv.style.display = 'none';
    if (cartItemsDiv) cartItemsDiv.style.display = 'block';
    if (cartSummaryDiv) cartSummaryDiv.style.display = 'block';

    const cartHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.product.image_url}" alt="${item.product.name}">
      <div class="cart-item-details">
        <h3>${item.product.name}</h3>
        <p class="cart-item-price">$${item.product.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-quantity">
        <button class="qty-btn" data-id="${item.product.id}" data-action="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-id="${item.product.id}" data-action="increase">+</button>
      </div>
      <div class="cart-item-total">
        <p>$${(item.product.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" data-id="${item.product.id}">Remove</button>
      </div>
    </div>
  `).join('');

    cartItemsDiv.innerHTML = cartHTML;

    // Update totals
    const { subtotal, shipping, total } = calculateCartTotals();
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = shipping.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);

    // Attach event listeners
    attachCartEventListeners();
}

// Attach event listeners for cart page
function attachCartEventListeners(): void {
    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const productId = parseInt(target.dataset.id || '0');
            const action = target.dataset.action;
            const cart = getCart();
            const item = cart.find(item => item.product.id === productId);

            if (item) {
                if (action === 'increase') {
                    updateQuantity(productId, item.quantity + 1);
                } else if (action === 'decrease') {
                    updateQuantity(productId, item.quantity - 1);
                }
                displayCartItems();
            }
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const productId = parseInt(target.dataset.id || '0');
            removeFromCart(productId);
            displayCartItems();
        });
    });
}

// Initialize cart page
export function initCartPage(): void {
    displayCartItems();
    updateCartCount();
}
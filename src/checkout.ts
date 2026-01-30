import { getCart, clearCart, calculateCartTotals } from './cart.js';
import { Order, CustomerInfo } from './types.js';

export function displayCheckoutSummary(): void {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const itemsDiv = document.getElementById('checkout-items');
    if (!itemsDiv) return;

    itemsDiv.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.product.name} × ${item.quantity}</span>
      <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

    const { subtotal, shipping, total } = calculateCartTotals();
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = shipping.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

export async function handleCheckout(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const customer: CustomerInfo = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        postal: formData.get('postal') as string,
        country: formData.get('country') as string,
    };

    const { subtotal, shipping, total } = calculateCartTotals();
    const orderNumber = 'ORD-' + Date.now();

    const order = {
        order_number: orderNumber,
        user_email: customer.email,
        customer_info: customer,
        items: getCart(),
        subtotal,
        shipping,
        total,
        payment_method: formData.get('payment') as string,
    };

    // Save to Supabase
    const { supabase } = await import('./config.js');
    const { error } = await supabase.from('orders').insert([order]);

    if (error) {
        alert('Error placing order: ' + error.message);
        return;
    }

    // Also save to localStorage for quick access
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        orderNumber,
        orderDate: new Date().toISOString(),
        customer,
        items: getCart(),
        subtotal,
        shipping,
        total,
        payment: formData.get('payment') as string,
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('lastOrder', JSON.stringify(orders[orders.length - 1]));

    clearCart();
    window.location.href = 'order-confirmation.html';
}

export function initCheckoutPage(): void {
    displayCheckoutSummary();

    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }
}
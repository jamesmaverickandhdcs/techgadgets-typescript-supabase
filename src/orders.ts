import { Order } from './types.js';

export function displayOrderConfirmation(): void {
    const lastOrder = localStorage.getItem('lastOrder');
    if (!lastOrder) {
        window.location.href = 'index.html';
        return;
    }

    const order: Order = JSON.parse(lastOrder);

    const orderNumEl = document.getElementById('order-number');
    const orderDateEl = document.getElementById('order-date');
    const orderTotalEl = document.getElementById('order-total');
    const shippingEl = document.getElementById('shipping-address');
    const itemsEl = document.getElementById('ordered-items');

    if (orderNumEl) orderNumEl.textContent = order.orderNumber;
    if (orderDateEl) orderDateEl.textContent = new Date(order.orderDate).toLocaleDateString();
    if (orderTotalEl) orderTotalEl.textContent = order.total.toFixed(2);

    if (shippingEl) {
        shippingEl.innerHTML = `
      <p>${order.customer.firstName} ${order.customer.lastName}</p>
      <p>${order.customer.address}</p>
      <p>${order.customer.city}, ${order.customer.postal}</p>
      <p>${order.customer.country}</p>
      <p>Email: ${order.customer.email}</p>
      <p>Phone: ${order.customer.phone}</p>
    `;
    }

    if (itemsEl) {
        itemsEl.innerHTML = order.items.map(item => `
      <div class="ordered-item">
        <span>${item.product.name} × ${item.quantity}</span>
        <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
    }
}
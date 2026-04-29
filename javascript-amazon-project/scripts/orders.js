import { getProduct } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { addToCart, calculateCartQuantity } from '../data/cart.js';

function renderOrdersPage() {
  // Update header cart quantity
  const cartQuantity = calculateCartQuantity();
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  let ordersHTML = '';

  orders.forEach((order) => {
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderTime}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsListHTML(order)}
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  // Event listeners for "Buy it again"
  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId, 1); 
      button.innerHTML = 'Added!';
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 500);
    });
  });
}

function productsListHTML(order) {
  let productsHTML = '';
  order.products.forEach((productDetails) => {
    const product = getProduct(productDetails.productId);
    productsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-delivery-date">Arriving on: August 15</div>
        <div class="product-quantity">Quantity: ${productDetails.quantity}</div>
        <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>
      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">Track package</button>
        </a>
      </div>
    `;
  });
  return productsHTML;
}

// --- CALL IT HERE ---
renderOrdersPage();
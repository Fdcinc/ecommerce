import { getProduct } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { cart } from '../data/cart.js';

function renderOrdersPage() {
  // 1. Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  let ordersHTML = '';

  // 2. Loop through each order to build the header
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
}

// 3. Sub-function to build the list of products within that order
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
        <button class="buy-again-button button-primary">
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

renderOrdersPage();
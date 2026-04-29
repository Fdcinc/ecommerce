import { getProduct } from '../data/products.js';
import { calculateCartQuantity } from '../data/cart.js';

function renderTrackingPage() {
  // 1. Get the IDs from the URL (e.g., ?orderId=123&productId=456)
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  // 2. Load orders and find the specific one we need
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  
  // 3. Find the specific product details within that order
  const productDetails = order.products.find(p => p.productId === productId);
  const product = getProduct(productId);

  // 4. Update the Header Cart Quantity
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

  // 5. Build the HTML
  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label">Preparing</div>
      <div class="progress-label current-status">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: 50%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

renderTrackingPage();
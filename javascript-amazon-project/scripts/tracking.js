import { getProduct } from '../data/products.js';
import { calculateCartQuantity } from '../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function renderTrackingPage() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    console.error('Order not found');
    return;
  }
  
  const productDetails = order.products.find(p => p.productId === productId);
  const product = getProduct(productId);

  if (!productDetails || !product) {
    console.error('Product not found in this order');
    return;
  }

  // --- FIXED PROGRESS CALCULATION ---
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  // 1. Calculate time differences using DayJS .diff()
  const totalTime = deliveryTime.diff(orderTime);
  const elapsedTime = today.diff(orderTime);

  // 2. Turn into a percentage
  let progressPercent = (elapsedTime / totalTime) * 100;

  // 3. The "Clamp" - prevent the bar from breaking the layout boundaries
  if (progressPercent < 0) progressPercent = 0;
  if (progressPercent > 100) progressPercent = 100;

  // 4. Round the number to avoid messy floating decimals in CSS width
  progressPercent = Math.round(progressPercent);

  // Update Header Cart Counter
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

  // Generate the HTML String
  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on: ${deliveryTime.format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${progressPercent < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${(progressPercent >= 50 && progressPercent < 100) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${progressPercent >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressPercent}%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

renderTrackingPage();
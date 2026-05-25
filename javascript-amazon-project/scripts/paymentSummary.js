import { cart, resetCart } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOptionId = cartItem.deliveryOptionId || '1';
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
    
    cartQuantity += cartItem.quantity;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order-button">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // Event listener for the Place Order button
  document.querySelector('.js-place-order-button')
    .addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty! Add items before placing an order.');
        return;
      }

      // MAP OVER CART ITEMS TO CONSTRUCT THE DETAILED PRODUCTS OBJECT
      const orderProducts = cart.map((cartItem) => {
        const deliveryOptionId = cartItem.deliveryOptionId || '1';
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        
        let deliveryDays = 7; 
        if (deliveryOptionId === '2') deliveryDays = 3;
        if (deliveryOptionId === '3') deliveryDays = 1;

        // --- FIXED: WEEKEND SKIPPING LOGIC ---
        let remainingDays = deliveryDays;
        let deliveryDate = dayjs(); // Start calculations at today's time stamp

        while (remainingDays > 0) {
          deliveryDate = deliveryDate.add(1, 'day'); // Advance the calendar by 1 day
          
          const dayOfWeek = deliveryDate.format('dddd');
          
          // Only decrement remaining target days if it's a weekday
          if (dayOfWeek !== 'Saturday' && dayOfWeek !== 'Sunday') {
            remainingDays--;
          }
        }

        const estimatedDeliveryTime = deliveryDate.toISOString();

        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          deliveryOptionId: deliveryOptionId,
          estimatedDeliveryTime: estimatedDeliveryTime 
        };
      });

      // Create the order object with the formatted products array
      const order = {
        id: crypto.randomUUID(), 
        orderTime: dayjs().toISOString(), 
        totalCostCents: totalCents,
        products: orderProducts
      };

      // Save order to history (LocalStorage)
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.unshift(order); 
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear the cart data
      resetCart();

      // Redirect to the orders page
      window.location.href = 'orders.html';
    });
}
import { cart, addToCart, updateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js'; 
import { formatCurrency } from './utils/money.js';

updateCartQuantity();

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">${product.rating.count}</div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector" data-product-id="${product.id}">
          ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}"${i === 0 ? "selected" : ""}>${i + 1}</option>`).join("")}
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector(".js-products-grid").innerHTML = productsHTML;

const addedMessageTimeouts = {};

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    
    // 1. First, find the element
    const quantitySelector = document.querySelector(
      `.js-quantity-selector[data-product-id="${productId}"]`
    );

    if (quantitySelector) {
      // 2. Second, get the value and convert to Number
      const quantity = Number(quantitySelector.value);

      // 3. Third, pass that quantity into your function
      // If you do this first, you get NaN!
      addToCart(productId, quantity);

      // 2. Use the imported function to update the header UI.
      // This replaces the manual 'cart.forEach' loop!
      updateCartQuantity();

      // --- Added Message Logic ---
      handleAddedMessage(productId);
    }
  });
});

function handleAddedMessage(productId) {
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  if (!addedMessage) return;

  addedMessage.classList.add('added-to-cart-visible');

  if (addedMessageTimeouts[productId]) {
    clearTimeout(addedMessageTimeouts[productId]);
  }

  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove('added-to-cart-visible');
    delete addedMessageTimeouts[productId];
  }, 2000);

  addedMessageTimeouts[productId] = timeoutId;
}
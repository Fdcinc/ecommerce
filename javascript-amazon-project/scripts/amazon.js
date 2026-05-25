import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

function renderProductsGrid() {
  // 1. READ THE SEARCH QUERY FROM THE URL
  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  // Let's keep track of our filtered list (defaults to all products)
  let filteredProducts = products;

  // 2. FILTER LOGIC
  if (search) {
    filteredProducts = products.filter((product) => {
      const matchingName = product.name.toLowerCase().includes(search.toLowerCase());
      
      // Also search through keywords if your product object has them
      let matchingKeyword = false;
      if (product.keywords) {
        product.keywords.forEach((keyword) => {
          if (keyword.toLowerCase().includes(search.toLowerCase())) {
            matchingKeyword = true;
          }
        });
      }

      return matchingName || matchingKeyword;
    });
  }

  // Generate the grid HTML using our filtered list
  let productsHTML = '';

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
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

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  // Update header cart count
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

  // Re-attach standard Add-to-Cart event listeners
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      const quantitySelect = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelect.value);

      addToCart(productId, quantity);
      document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

      const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
      addedMessage.classList.add('added-to-cart-visible');
      setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);
    });
  });

  // --- 3. SEARCH BAR EVENT LISTENERS ---
  const searchButton = document.querySelector('.js-search-button');
  const searchInput = document.querySelector('.js-search-bar');

  // Helper function to trigger the redirect
  function executeSearch() {
    const searchString = searchInput.value.trim();
    if (searchString) {
      // FIXED: Pointing to index.html instead of amazon.html
      window.location.href = `index.html?search=${searchString}`;
    } else {
      // FIXED: Pointing to index.html instead of amazon.html
      window.location.href = 'index.html'; 
    }
  }

  searchButton.addEventListener('click', () => {
    executeSearch();
  });

  // Also let users hit 'Enter' to submit
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  });

  // Preserve the search query text inside the input box after reload
  if (search) {
    searchInput.value = search;
  }
}

renderProductsGrid();
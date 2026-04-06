export let cart = JSON.parse(localStorage.getItem('cart')) || [
  { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2 }, 
  { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1 }
];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 1. Logic: Calculate the number
export function calculateCartQuantity() {
  let cartQuantity = 0; 
  cart.forEach((cartItem) => {
     cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

// 2. UI: Display the number on the page
export function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  // Update Amazon Home Page header
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerText = cartQuantity;
  }

  // Update Checkout Page header "X items" link
  const returnToHomeLink = document.querySelector('.js-return-to-home-link');
  if (returnToHomeLink) {
    returnToHomeLink.innerHTML = `${cartQuantity} items in your cart`;
  }
}

export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}


export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage();
  }
}
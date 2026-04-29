import { renderOrderSummary } from './orderSummary.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { updateCartQuantity } from '../data/cart.js';

renderOrderSummary();
renderPaymentSummary();
updateCartQuantity();
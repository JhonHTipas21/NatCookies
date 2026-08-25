/* ==========================================================================
   Operaciones del Carrito de Compras (js/cart.js)
   ========================================================================== */

import { PRODUCTS } from './products.js';
import { getStock } from './inventory.js';

let cart = [];
let onCartUpdateCallback = null;

// Registers callback to run on cart state updates
export function onCartUpdated(callback) {
  onCartUpdateCallback = callback;
}

export function getCart() {
  return cart;
}

export function clearCart() {
  cart = [];
  triggerUpdate();
}

// Simulates adding an item to verify stock availability
export function checkStockAvailable(itemType, itemId, boxFlavors = null, amount = 1) {
  // Compute how many cookies of each flavor / catering items are needed in total (cart + new addition)
  const totalsNeeded = {};

  // Accumulate current cart contents
  cart.forEach(item => {
    if (item.type === 'box') {
      item.flavors.forEach(fId => {
        totalsNeeded[fId] = (totalsNeeded[fId] || 0) + (item.quantity);
      });
    } else {
      totalsNeeded[item.id] = (totalsNeeded[item.id] || 0) + (item.quantity);
    }
  });

  // Accumulate the new addition
  if (itemType === 'box' && boxFlavors) {
    boxFlavors.forEach(fId => {
      totalsNeeded[fId] = (totalsNeeded[fId] || 0) + amount;
    });
  } else if (itemType === 'individual' || itemType === 'catering') {
    totalsNeeded[itemId] = (totalsNeeded[itemId] || 0) + amount;
  }

  // Validate against database stock
  for (const [id, reqQty] of Object.entries(totalsNeeded)) {
    const stock = getStock(id);
    if (reqQty > stock) {
      return { valid: false, productId: id, stockAvailable: stock };
    }
  }

  return { valid: true };
}

// Adds a customized box to the cart list
export function addBoxToCart(boxId, flavorsList) {
  // Validate stock before adding
  const validation = checkStockAvailable('box', boxId, flavorsList, 1);
  if (!validation.valid) {
    const cookieName = PRODUCTS.individual.find(c => c.id === validation.productId)?.name || validation.productId;
    alert(`No es posible agregar: Quedan pocas existencias de galletas sabor ${cookieName} (Stock: ${validation.stockAvailable}).`);
    return false;
  }

  const combo = PRODUCTS.combos[boxId];
  const sortedFlavors = [...flavorsList].sort();
  
  const existingIndex = cart.findIndex(item =>
    item.type === 'box' &&
    item.id === boxId &&
    JSON.stringify([...item.flavors].sort()) === JSON.stringify(sortedFlavors)
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      type: 'box',
      id: boxId,
      name: combo.name,
      flavors: flavorsList,
      price: combo.price,
      quantity: 1
    });
  }

  triggerUpdate();
  return true;
}

// Adds individual cookie flavor directly to the cart
export function addIndividualToCart(cookieId) {
  // Validate stock
  const validation = checkStockAvailable('individual', cookieId, null, 1);
  if (!validation.valid) {
    const cookieName = PRODUCTS.individual.find(c => c.id === cookieId)?.name || cookieId;
    alert(`No es posible agregar: Stock insuficiente de galletas sabor ${cookieName} (Stock: ${validation.stockAvailable}).`);
    return false;
  }

  const cookie = PRODUCTS.individual.find(c => c.id === cookieId);
  const existingItem = cart.find(item => item.type === 'individual' && item.id === cookieId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      type: 'individual',
      id: cookieId,
      name: `Galleta ${cookie.name}`,
      price: cookie.price,
      quantity: 1,
      img: cookie.img
    });
  }

  triggerUpdate();
  return true;
}

// Adds catering items directly to the cart
export function addCateringToCart(itemId) {
  // Validate stock
  const validation = checkStockAvailable('catering', itemId, null, 1);
  if (!validation.valid) {
    const itemName = PRODUCTS.catering.find(c => c.id === itemId)?.name || itemId;
    alert(`No es posible agregar: Stock insuficiente de ${itemName} (Stock: ${validation.stockAvailable}).`);
    return false;
  }

  const item = PRODUCTS.catering.find(c => c.id === itemId);
  const existingItem = cart.find(item => item.type === 'catering' && item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      type: 'catering',
      id: itemId,
      name: item.name,
      price: item.price,
      quantity: 1,
      img: item.img
    });
  }

  triggerUpdate();
  return true;
}

// Adjusts index quantities in cart list
export function updateItemQuantity(index, amount) {
  if (index < 0 || index >= cart.length) return;

  const item = cart[index];
  
  // If amount is positive, validate stock limits before incrementing
  if (amount > 0) {
    const validation = checkStockAvailable(item.type, item.id, item.type === 'box' ? item.flavors : null, 1);
    if (!validation.valid) {
      const name = item.type === 'box' 
        ? (PRODUCTS.individual.find(c => c.id === validation.productId)?.name || validation.productId)
        : item.name;
      alert(`No puedes agregar más: Quedan pocas existencias de ${name} (Stock: ${validation.stockAvailable}).`);
      return;
    }
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

  triggerUpdate();
}

// Removes a row from the cart
export function removeItemFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  triggerUpdate();
}

export function calculateCartTotals(deliveryMethod = 'domicilio') {
  let count = 0;
  let total = 0;

  cart.forEach(item => {
    count += item.quantity;
    total += (item.price * item.quantity);
  });

  const shipping = deliveryMethod === 'domicilio' ? 3000 : 0;
  const grandTotal = total + shipping;

  return { count, total, shipping, grandTotal };
}

// Helper to notify changes
function triggerUpdate() {
  if (onCartUpdateCallback) {
    onCartUpdateCallback();
  }
}

// Formats amount to COP currency string
export function formatCOP(amount) {
  return '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

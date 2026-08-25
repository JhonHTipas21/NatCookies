/* ==========================================================================
   Lógica del Personalizador de Cajas (js/builder.js)
   ========================================================================== */

import { PRODUCTS } from './products.js';
import { getStock } from './inventory.js';
import { getCart } from './cart.js';

// Holds active box builder configuration state
export let activeBoxConfig = {
  id: null, // 'caja_x2' or 'caja_x3'
  size: 0,
  flavors: {} // Map: { cookieId: quantity }
};

// Initializes builder configurations (Paso 1 selection)
export function initBoxConfig(comboId) {
  const combo = PRODUCTS.combos[comboId];
  if (!combo) return;

  activeBoxConfig.id = comboId;
  activeBoxConfig.size = combo.size;
  activeBoxConfig.flavors = {};

  PRODUCTS.individual.forEach(cookie => {
    activeBoxConfig.flavors[cookie.id] = 0;
  });
}

// Counts cookies of a specific flavor already placed in the shopping cart
function getCartCookiesCountForFlavor(cookieId) {
  let count = 0;
  const cart = getCart();

  cart.forEach(item => {
    if (item.type === 'box') {
      item.flavors.forEach(fId => {
        if (fId === cookieId) count += item.quantity;
      });
    } else if (item.type === 'individual' && item.id === cookieId) {
      count += item.quantity;
    }
  });

  return count;
}

// Retrieves total count of cookies currently placed in the active box
export function getActiveBoxCookiesCount() {
  return Object.values(activeBoxConfig.flavors).reduce((sum, val) => sum + val, 0);
}

// Adjusts the quantity of a cookie flavor in the current box
export function adjustFlavorCount(cookieId, change) {
  const currentTotal = getActiveBoxCookiesCount();
  const targetQty = (activeBoxConfig.flavors[cookieId] || 0) + change;

  // Block increment if box is full
  if (change > 0 && currentTotal >= activeBoxConfig.size) return false;
  // Block decrement if at 0
  if (change < 0 && targetQty < 0) return false;

  // Inventory validation: cart count + current box count + new addition
  if (change > 0) {
    const stock = getStock(cookieId);
    const cartCount = getCartCookiesCountForFlavor(cookieId);
    const boxCount = activeBoxConfig.flavors[cookieId] || 0;

    if (cartCount + boxCount + 1 > stock) {
      const cookieName = PRODUCTS.individual.find(c => c.id === cookieId)?.name || cookieId;
      alert(`No puedes agregar más: Quedan pocas existencias de galletas sabor ${cookieName} (Stock: ${stock}).`);
      return false;
    }
  }

  activeBoxConfig.flavors[cookieId] = targetQty;
  return true;
}

// Clears all choices back to 0
export function resetActiveBox() {
  PRODUCTS.individual.forEach(cookie => {
    activeBoxConfig.flavors[cookie.id] = 0;
  });
}

// Exports flat flavors list (repeating ids based on quantity)
export function getBuiltFlavorsList() {
  const list = [];
  Object.entries(activeBoxConfig.flavors).forEach(([cookieId, qty]) => {
    for (let i = 0; i < qty; i++) {
      list.push(cookieId);
    }
  });
  return list;
}

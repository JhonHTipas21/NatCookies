/* ==========================================================================
   Gestión de Inventario (js/inventory.js)
   ========================================================================== */

import { CONFIG } from './config.js';
import { PRODUCTS } from './products.js';

let inventoryState = {};

// Fetches the current stock states from database or localStorage fallback
export async function loadInventory() {
  if (CONFIG.FIREBASE_DB_URL) {
    try {
      const res = await fetch(`${CONFIG.FIREBASE_DB_URL}/inventory.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          inventoryState = data;
          return inventoryState;
        }
      }
    } catch (e) {
      console.warn("Error consultando base de datos Firebase. Cargando fallback de LocalStorage:", e);
    }
  }

  // LocalStorage fallback
  const localData = localStorage.getItem('natcookies_inventory');
  if (localData) {
    inventoryState = JSON.parse(localData);
  } else {
    // Bootstrap initial default stock values (15 of each flavor, 5 of each catering)
    const initial = {};
    PRODUCTS.individual.forEach(cookie => {
      initial[cookie.id] = 15;
    });
    PRODUCTS.catering.forEach(item => {
      initial[item.id] = 5;
    });
    
    inventoryState = initial;
    localStorage.setItem('natcookies_inventory', JSON.stringify(initial));
  }
  
  return inventoryState;
}

// Saves updated inventory quantities
export async function saveInventory(newInventory) {
  inventoryState = newInventory;
  localStorage.setItem('natcookies_inventory', JSON.stringify(newInventory));

  if (CONFIG.FIREBASE_DB_URL) {
    try {
      const res = await fetch(`${CONFIG.FIREBASE_DB_URL}/inventory.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInventory)
      });
      return res.ok;
    } catch (e) {
      console.error("Error al sincronizar con base de datos Firebase:", e);
      return false;
    }
  }
  return true;
}

// Returns stock amount for a specific product ID
export function getStock(productId) {
  return inventoryState[productId] !== undefined ? parseInt(inventoryState[productId], 10) : 999;
}

// Returns true if product is out of stock (quantity <= 0)
export function isOutOfStock(productId) {
  return getStock(productId) <= 0;
}

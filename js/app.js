/* ==========================================================================
   Coordinador Principal y Renders (js/app.js)
   ========================================================================== */

import { CONFIG } from './config.js';
import { PRODUCTS } from './products.js';
import { navigateTo, goBack, onRouteChanged } from './router.js';
import { loadInventory, isOutOfStock, getStock } from './inventory.js';
import { 
  getCart, 
  addBoxToCart, 
  addIndividualToCart, 
  addCateringToCart, 
  updateItemQuantity, 
  removeItemFromCart, 
  calculateCartTotals, 
  onCartUpdated, 
  formatCOP,
  checkStockAvailable
} from './cart.js';
import { 
  initBoxConfig, 
  activeBoxConfig, 
  adjustFlavorCount, 
  getActiveBoxCookiesCount, 
  getBuiltFlavorsList, 
  resetActiveBox 
} from './builder.js';
import { generateWhatsAppLink } from './checkout.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch current inventory from Firebase/LocalStorage
  await loadInventory();

  // 2. Render initial catalog items
  renderHomeCatalog();

  // 3. Register global DOM listeners
  setupCartEventListeners();

  // 4. Bind view routers and cart events
  onRouteChanged(handleRouteChanges);
  onCartUpdated(updateCartUI);

  // 5. Initial cart updates
  updateCartUI();
});

// --- Renders Catalog Listings ---
function renderHomeCatalog() {
  const cookiesGrid = document.getElementById('home-cookies-grid');
  const cateringGrid = document.getElementById('home-catering-grid');

  if (cookiesGrid) {
    cookiesGrid.innerHTML = PRODUCTS.individual.map(cookie => {
      const outOfStock = isOutOfStock(cookie.id);
      const badgeText = outOfStock ? "AGOTADO" : cookie.tag;
      const badgeClass = outOfStock ? "tag-out-of-stock" : `tag-${cookie.id}`;
      const clickAction = outOfStock 
        ? `window.alertOutOfStock('${cookie.name}')` 
        : `window.openProductDetail('${cookie.id}', 'individual')`;

      return `
        <div class="catalog-card ${outOfStock ? 'out-of-stock' : ''}" onclick="${clickAction}">
          <div class="catalog-img-wrapper">
            <span class="catalog-badge ${badgeClass}">${badgeText}</span>
            <img src="${cookie.img}" alt="Galleta ${cookie.name}" class="catalog-img" loading="lazy">
          </div>
          <div class="catalog-info">
            <h4 class="catalog-name font-alt">* ${cookie.name} *</h4>
            <p class="catalog-desc">${cookie.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Hide catering section if it contains no active items
  const cateringSection = document.getElementById('section-catering');
  if (cateringSection) {
    cateringSection.style.display = PRODUCTS.catering.length === 0 ? 'none' : 'block';
  }

  if (cateringGrid && PRODUCTS.catering.length > 0) {
    cateringGrid.innerHTML = PRODUCTS.catering.map(item => {
      const outOfStock = isOutOfStock(item.id);
      const badgeText = outOfStock ? "AGOTADO" : item.tag;
      const badgeClass = outOfStock ? "tag-out-of-stock" : "tag-catering";
      const clickAction = outOfStock 
        ? `window.alertOutOfStock('${item.name}')` 
        : `window.openProductDetail('${item.id}', 'catering')`;

      return `
        <div class="catalog-card ${outOfStock ? 'out-of-stock' : ''}" onclick="${clickAction}">
          <div class="catalog-img-wrapper">
            <span class="catalog-badge ${badgeClass}">${badgeText}</span>
            <img src="${item.img}" alt="${item.name}" class="catalog-img" loading="lazy">
          </div>
          <div class="catalog-info">
            <h4 class="catalog-name font-alt">${item.name}</h4>
            <p class="catalog-desc">${item.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }
}

// --- Screen Router Observers ---
function handleRouteChanges(viewId, data) {
  if (viewId === 'product-detail' && data) {
    loadProductDetailView(data.id, data.type);
  } else if (viewId === 'box-step2') {
    renderBuilderFlavorsRows();
    updateBuilderStep2Status();
  }
}

// --- Detail View Populator ---
function loadProductDetailView(productId, type) {
  let product = null;
  const ctaBtn = document.getElementById('detail-cta-btn');
  const individualBtn = document.getElementById('detail-buy-individual-btn');
  const outOfStock = isOutOfStock(productId);

  if (type === 'individual') {
    product = PRODUCTS.individual.find(c => c.id === productId);
    document.getElementById('detail-badge-tag').textContent = outOfStock ? "AGOTADO" : product.tag;
    document.getElementById('detail-badge-tag').className = `detail-badge ${outOfStock ? 'badge-color-rose' : `tag-${product.id}`}`;
    
    individualBtn.style.display = 'block';
    
    if (outOfStock) {
      ctaBtn.disabled = true;
      ctaBtn.querySelector('span').textContent = 'Temporalmente agotada';
      ctaBtn.querySelector('svg').style.display = 'none';
      ctaBtn.removeAttribute('onclick');
      
      individualBtn.disabled = true;
      individualBtn.querySelector('span').textContent = 'Temporalmente agotada';
      individualBtn.removeAttribute('onclick');
    } else {
      ctaBtn.disabled = false;
      ctaBtn.setAttribute('onclick', "window.navigateTo('box-step1')");
      ctaBtn.querySelector('span').textContent = 'Armar caja (Ahorra desde $6.000 c/u)';
      ctaBtn.querySelector('svg').style.display = 'block';
      
      individualBtn.disabled = false;
      individualBtn.setAttribute('onclick', `window.addIndividualFromDetail('${product.id}')`);
      individualBtn.querySelector('span').textContent = 'Llevar Individual • $7.000 COP';
    }
  } else {
    product = PRODUCTS.catering.find(c => c.id === productId);
    document.getElementById('detail-badge-tag').textContent = outOfStock ? "AGOTADO" : product.tag;
    document.getElementById('detail-badge-tag').className = `detail-badge ${outOfStock ? 'badge-color-rose' : 'tag-catering'}`;
    
    individualBtn.style.display = 'none';
    
    if (outOfStock) {
      ctaBtn.disabled = true;
      ctaBtn.querySelector('span').textContent = 'Agotado';
      ctaBtn.querySelector('svg').style.display = 'none';
      ctaBtn.removeAttribute('onclick');
    } else {
      ctaBtn.disabled = false;
      ctaBtn.setAttribute('onclick', `window.addCateringFromDetail('${product.id}')`);
      ctaBtn.querySelector('span').textContent = `Agregar al pedido • ${formatCOP(product.price)}`;
      ctaBtn.querySelector('svg').style.display = 'none';
    }
  }

  if (product) {
    document.getElementById('detail-cookie-img').src = product.img;
    document.getElementById('detail-cookie-img').alt = product.name;
    document.getElementById('detail-cookie-name').textContent = type === 'individual' ? `Galleta ${product.name}` : product.name;
    document.getElementById('detail-cookie-desc').textContent = product.desc;
  }
}

// --- Step 2 Customizer Rows Render ---
function renderBuilderFlavorsRows() {
  const list = document.getElementById('builder-flavors-list');
  if (!list) return;

  const count = getActiveBoxCookiesCount();
  const capacity = activeBoxConfig.size;
  const isBoxFull = count >= capacity;

  list.innerHTML = PRODUCTS.individual.map(cookie => {
    const qty = activeBoxConfig.flavors[cookie.id] || 0;
    const outOfStock = isOutOfStock(cookie.id);
    
    const isMinusDisabled = qty <= 0;
    const isPlusDisabled = isBoxFull || outOfStock;
    const rowSubtext = outOfStock ? 'Agotada' : 'siempre disponible';
    const subtextClass = outOfStock ? 'flavor-row-sub out-of-stock' : 'flavor-row-sub';

    return `
      <div class="flavor-row-item ${outOfStock ? 'out-of-stock' : ''}">
        <img src="${cookie.img}" alt="${cookie.name}" class="flavor-row-thumb">
        <div class="flavor-row-info">
          <h4 class="flavor-row-name">${cookie.name}</h4>
          <span class="${subtextClass}">${rowSubtext}</span>
        </div>
        <div class="row-qty-controls">
          <button class="row-qty-btn" ${isMinusDisabled ? 'disabled' : ''} onclick="window.adjustFlavorCount('${cookie.id}', -1)" aria-label="Remover">&minus;</button>
          <span class="row-qty-val">${qty}</span>
          <button class="row-qty-btn ${!isPlusDisabled ? 'btn-plus-active' : ''}" ${isPlusDisabled ? 'disabled' : ''} onclick="window.adjustFlavorCount('${cookie.id}', 1)" aria-label="Agregar">+</button>
        </div>
      </div>
    `;
  }).join('');
}

// Adjust quantity click handler inside Step 2 view
async function handleAdjustFlavorCount(cookieId, change) {
  await loadInventory();
  const success = adjustFlavorCount(cookieId, change);
  if (success) {
    renderBuilderFlavorsRows();
    updateBuilderStep2Status();
  }
}

// Updates step 2 metrics and bottom button
function updateBuilderStep2Status() {
  const count = getActiveBoxCookiesCount();
  const capacity = activeBoxConfig.size;
  const missingCount = capacity - count;

  document.getElementById('builder-count-ratio').textContent = `${count} / ${capacity}`;
  document.getElementById('builder-progress-fill').style.width = `${(count / capacity) * 100}%`;

  const successIndicator = document.getElementById('builder-success-indicator');
  const submitBtn = document.getElementById('builder-submit-btn');

  if (missingCount === 0) {
    successIndicator.style.display = 'flex';
    submitBtn.textContent = 'Agregar al pedido';
    submitBtn.disabled = false;
  } else {
    successIndicator.style.display = 'none';
    submitBtn.textContent = `Faltan ${missingCount} galleta${missingCount > 1 ? 's' : ''}`;
    submitBtn.disabled = true;
  }
}

// Adds full customized box configuration to cart
function handleAddBuiltBoxToCart() {
  const flavors = getBuiltFlavorsList();
  const success = addBoxToCart(activeBoxConfig.id, flavors);
  if (success) {
    resetActiveBox();
    navigateTo('home');
    openCart();
  }
}

// --- Cart Drawer Interface Updates ---
function updateCartUI() {
  const cart = getCart();
  
  // Read current delivery method from DOM to compute shipping cost (defaults to 'domicilio')
  const deliveryMethodInput = document.getElementById('delivery-method');
  const deliveryMethod = deliveryMethodInput ? deliveryMethodInput.value : 'domicilio';
  
  const { count, total, shipping, grandTotal } = calculateCartTotals(deliveryMethod);

  // Floating trigger count and price (displays items subtotal)
  document.getElementById('cart-badge-count').textContent = count;
  document.getElementById('cart-badge-total').textContent = formatCOP(total);

  const step1Footer = document.getElementById('cart-step1-footer');
  const itemsWrapper = document.getElementById('cart-items-wrapper');

  if (cart.length === 0) {
    if (step1Footer) step1Footer.style.display = 'none';
    
    // Automatically reset back to Step 1 if cart is empty
    const stepItems = document.getElementById('cart-step-items');
    const stepForm = document.getElementById('cart-step-form');
    if (stepItems && stepForm) {
      stepForm.style.display = 'none';
      stepForm.classList.remove('active');
      stepItems.style.display = 'flex';
      stepItems.classList.add('active');
    }

    itemsWrapper.innerHTML = `
      <div class="cart-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Tu carrito está vacío.</p>
        <button class="btn btn-secondary btn-sm" onclick="window.closeCart()">Ver Sabores</button>
      </div>
    `;
    return;
  }

  // Populate Step 1 items list
  if (step1Footer) {
    step1Footer.style.display = 'block';
    document.getElementById('cart-subtotal-price').textContent = formatCOP(total);
  }

  // Populate Step 2 price breakdowns
  const breakdownSubtotal = document.getElementById('breakdown-subtotal');
  const breakdownShipping = document.getElementById('breakdown-shipping');
  const breakdownTotal = document.getElementById('breakdown-total');

  if (breakdownSubtotal) breakdownSubtotal.textContent = formatCOP(total);
  if (breakdownShipping) breakdownShipping.textContent = shipping > 0 ? formatCOP(shipping) : 'Gratis';
  if (breakdownTotal) breakdownTotal.textContent = formatCOP(grandTotal);

  // Render elements in drawer list
  itemsWrapper.innerHTML = cart.map((item, index) => {
    let detailText = '';
    let imgHTML = '';

    if (item.type === 'box') {
      const grouped = {};
      item.flavors.forEach(fId => {
        const name = PRODUCTS.individual.find(c => c.id === fId)?.name || fId;
        grouped[name] = (grouped[name] || 0) + 1;
      });
      detailText = Object.entries(grouped)
        .map(([name, qty]) => `${qty}x ${name}`)
        .join(', ');
      imgHTML = `<div class="cart-item-img-placeholder">${item.id === 'caja_x2' ? 'x2' : 'x3'}</div>`;
    } else {
      detailText = item.type === 'individual' ? 'Galleta individual' : 'Catering / Especial';
      imgHTML = `<img src="${item.img}" alt="${item.name}" class="cart-item-img">`;
    }

    return `
      <div class="cart-item">
        ${imgHTML}
        <div class="cart-item-details">
          <h5 class="cart-item-name">${item.name}</h5>
          <p class="cart-item-subdetails">${detailText}</p>
          <div class="cart-item-row">
            <div class="quantity-controls">
              <button class="qty-btn" onclick="window.updateItemQuantity(${index}, -1)" aria-label="Disminuir">&minus;</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.updateItemQuantity(${index}, 1)" aria-label="Aumentar">+</button>
            </div>
            <span class="cart-item-price">${formatCOP(item.price * item.quantity)}</span>
          </div>
        </div>
        <button class="cart-item-remove-btn" onclick="window.removeItemFromCart(${index})" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
  }).join('');
}

// --- Cart Panel UI Bindings ---
function setupCartEventListeners() {
  const toggleBtn = document.getElementById('cart-toggle-btn');
  const sidebar = document.getElementById('cart-sidebar');
  const closeBtn = document.getElementById('cart-sidebar-close');

  if (toggleBtn) toggleBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target === sidebar) closeCart();
    });
  }
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('active');
  window.goToCartStep('items'); // Reset to step 1 on open
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('active');
  window.goToCartStep('items'); // Reset to step 1 on close
}

// Form action handler
async function handleCheckoutForm(event) {
  event.preventDefault();
  const cart = getCart();
  if (cart.length === 0) return;

  // Re-fetch latest inventory state from DB/LocalStorage before validating
  await loadInventory();

  // Final inventory stock validation safeguard before redirecting to WhatsApp
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const validation = checkStockAvailable(item.type, item.id, item.type === 'box' ? item.flavors : null, 0);
    if (!validation.valid) {
      const name = item.type === 'box' 
        ? (PRODUCTS.individual.find(c => c.id === validation.productId)?.name || validation.productId)
        : item.name;
      alert(`Lo sentimos, algunas galletas sabor "${name}" de tu pedido se encuentran agotadas en este momento. Por favor, edita tu carrito.`);
      return;
    }
  }

  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const method = document.getElementById('delivery-method').value;
  const address = document.getElementById('client-address').value.trim();
  const notes = document.getElementById('client-notes').value.trim();

  const url = generateWhatsAppLink(cart, name, phone, method, address, notes);
  window.open(url, '_blank');
}

// --- Bridge functions exported to global window scope for inline HTML triggers ---

window.navigateTo = navigateTo;
window.goBack = goBack;
window.openProductDetail = (productId, productType) => navigateTo('product-detail', { id: productId, type: productType });

window.selectBoxSize = async (comboId) => {
  await loadInventory();
  initBoxConfig(comboId);
  navigateTo('box-step2');
};
window.adjustFlavorCount = handleAdjustFlavorCount;
window.addBuiltBoxToCart = handleAddBuiltBoxToCart;
window.resetActiveBox = () => {
  resetActiveBox();
  renderBuilderFlavorsRows();
  updateBuilderStep2Status();
};

window.addCateringFromDetail = async (itemId) => {
  await loadInventory();
  const success = addCateringToCart(itemId);
  if (success) {
    navigateTo('home');
    openCart();
  }
};

window.addIndividualFromDetail = async (cookieId) => {
  await loadInventory();
  const success = addIndividualToCart(cookieId);
  if (success) {
    navigateTo('home');
    openCart();
  }
};

window.updateItemQuantity = async (index, amount) => {
  await loadInventory();
  updateItemQuantity(index, amount);
};
window.removeItemFromCart = removeItemFromCart;
window.openCart = openCart;
window.closeCart = closeCart;

window.alertOutOfStock = (name) => {
  alert(`Lo sentimos, el sabor ${name} está temporalmente agotado.`);
};

// Navigation steps inside cart drawer
window.goToCartStep = (stepId) => {
  const stepItems = document.getElementById('cart-step-items');
  const stepForm = document.getElementById('cart-step-form');

  if (stepId === 'form') {
    stepItems.style.display = 'none';
    stepItems.classList.remove('active');
    stepForm.style.display = 'flex';
    stepForm.classList.add('active');
  } else {
    stepForm.style.display = 'none';
    stepForm.classList.remove('active');
    stepItems.style.display = 'flex';
    stepItems.classList.add('active');
  }
  // Recalculate totals in case shipping method triggers updates
  updateCartUI();
};

window.toggleAddressField = () => {
  const method = document.getElementById('delivery-method').value;
  const addressGroup = document.getElementById('address-group');
  const addressInput = document.getElementById('client-address');

  if (method === 'recogida') {
    addressGroup.style.display = 'none';
    addressInput.required = false;
    addressInput.value = '';
  } else {
    addressGroup.style.display = 'flex';
    addressInput.required = true;
  }
  
  // Recalculate shipping cost in real time
  updateCartUI();
};

window.handleCheckout = handleCheckoutForm;

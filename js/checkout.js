/* ==========================================================================
   Generación de Mensajes de Checkout (js/checkout.js)
   ========================================================================== */

import { CONFIG } from './config.js';
import { PRODUCTS } from './products.js';
import { calculateCartTotals, formatCOP } from './cart.js';

// Generates the final redirection URL for the WhatsApp API
export function generateWhatsAppLink(cart, name, phone, deliveryMethod, address, notes) {
  const deliveryStr = deliveryMethod === 'domicilio' ? address : 'Recoger en Tienda (Recogida física)';

  // Build the items summaries breakdown rows
  const summaries = cart.map(item => {
    if (item.type === 'box') {
      const grouped = {};
      item.flavors.forEach(fId => {
        const name = PRODUCTS.individual.find(c => c.id === fId)?.name || fId;
        grouped[name] = (grouped[name] || 0) + 1;
      });
      const composition = Object.entries(grouped)
        .map(([name, qty]) => `${qty}x ${name}`)
        .join(', ');
      
      return `• *${item.quantity}x ${item.name}* _(${composition})_ ➔ *${formatCOP(item.price * item.quantity)} COP*`;
    } else {
      return `• *${item.quantity}x ${item.name}* ➔ *${formatCOP(item.price * item.quantity)} COP*`;
    }
  });

  const { total, shipping, grandTotal } = calculateCartTotals(deliveryMethod);
  const shippingStr = shipping > 0 ? `*${formatCOP(shipping)} COP*` : '_Gratis (Recoger en Tienda)_';

  // Construct structured text template in Spanish
  const message = `🍪 *¡Hola NatCookies!* Me gustaría realizar el siguiente pedido:

📋 *RESUMEN DEL PEDIDO*
${summaries.join('\n')}
--------------------------------------------------
💰 *Subtotal:* _${formatCOP(total)} COP_
🛵 *Domicilio:* ${shippingStr}
✨ *Total a Pagar:* *${formatCOP(grandTotal)} COP*
--------------------------------------------------

📍 *DATOS DE ENTREGA*
👤 *Nombre:* ${name}
📞 *Teléfono:* ${phone}
🏡 *Dirección:* _${deliveryStr}_
💬 *Notas:* _${notes || 'Ninguna'}_

🧁 _¡Muchas gracias! Espero la confirmación para realizar el pago._`;

  const encoded = encodeURIComponent(message);
  
  return `https://api.whatsapp.com/send?phone=${CONFIG.CONTACT_PHONE}&text=${encoded}`;
}

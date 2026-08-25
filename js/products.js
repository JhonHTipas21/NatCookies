/* ==========================================================================
   Catálogo de Productos y Precios (js/products.js)
   ========================================================================== */

export const PRODUCTS = {
  // Galletas individuales a $6.000 COP cada una
  individual: [
    { id: 'macadamia', name: 'Macadamia', desc: 'Macadamia tostada y chocolate blanco.', price: 6000, img: 'assets/macadamia.jpg', tag: 'Edición Limitada' },
    { id: 'chips', name: 'Chips Clásica', desc: 'Vainilla con chispas de chocolate semi-amargo.', price: 6000, img: 'assets/chips.jpg', tag: 'Nueva' },
    { id: 'red_velvet', name: 'Red Velvet', desc: 'Terciopelo rojo con chispas de chocolate blanco.', price: 6000, img: 'assets/red_velvet.jpg', tag: 'Intensa' },
    { id: 'oreo', name: 'Oreo', desc: 'Vainilla con trozos crujientes de galleta Oreo.', price: 6000, img: 'assets/oreo.jpg', tag: 'Crujiente' },
    { id: 'maracuya', name: 'Maracuyá', desc: 'Rellena con crema de maracuyá y chocolate blanco.', price: 6000, img: 'assets/maracuya.jpg', tag: 'Cremosa' },
    { id: 'churro', name: 'Churro', desc: 'Canela y azúcar con centro suave de dulce de leche.', price: 6000, img: 'assets/churro.jpg', tag: 'Rellena' },
    { id: 'leche_klim', name: 'Leche Klim', desc: 'Galleta suave con el dulce sabor de la leche en polvo Klim.', price: 6000, img: 'assets/leche_klim.jpg', tag: 'Especial' }
  ],
  
  // Cajas personalizadas
  combos: {
    caja_x2: { id: 'caja_x2', name: 'Caja x2', price: 13000, size: 2 },
    caja_x3: { id: 'caja_x3', name: 'Caja x3', price: 18000, size: 3 }
  },
  
  // Catering y Detalles de Regalo
  catering: [
    // { id: 'mesa_dulce', name: 'Mesa Dulce (x50)', desc: 'Arreglo decorativo con mini-galletas surtidas.', price: 180000, img: 'assets/mesa_dulce.jpg', tag: 'Eventos' },
    // { id: 'detalle_regalo', name: 'Detalle de Regalo', desc: 'Caja premium envuelta en cinta (incluye galletas).', price: 32000, img: 'assets/detalle_regalo.jpg', tag: 'Especial' }
  ]
};

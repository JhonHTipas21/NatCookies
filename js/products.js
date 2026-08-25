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
    caja_x1: { id: 'caja_x1', name: 'Galleta Individual', price: 7000, size: 1 },
    caja_x2: { id: 'caja_x2', name: 'Caja x2', price: 13000, size: 2 },
    caja_x3: { id: 'caja_x3', name: 'Caja x3', price: 18000, size: 3 }
  },
  
  // Catering y Detalles de Regalo
  catering: [
    { id: 'brownie', name: 'Brownie Artesanal', desc: 'Brownie melcochudo con chispas de chocolate semi-amargo.', price: 7000, img: 'assets/brownie.jpeg', tag: 'Nuevo' },
    { id: 'pave_leche_klim', name: 'Pavé de Leche Klim', desc: 'Delicioso postre frío en capas con crema y leche Klim.', price: 13000, img: 'assets/pavelecheklim.jpeg', tag: 'Exclusivo' },
    { id: 'pave_arequipe', name: 'Pavé de Arequipe', desc: 'Suave postre frío con capas de arequipe artesanal y galleta.', price: 13000, img: 'assets/pavearequipe.jpeg', tag: 'Favorito' }
  ]
};

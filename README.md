# 🍪 NatCookies - Repostería Artesanal Premium

Una aplicación web responsiva (SPA, Mobile-First) interactiva y de alta gama diseñada para que los clientes de la repostería artesanal **NatCookies** puedan configurar y personalizar sus pedidos de forma digital, calculando existencias en tiempo real y enviando órdenes estructuradas a WhatsApp.

Inspirado en la estética minimalista, transiciones fluidas y flujos móviles de la repostería **Sam G Bakes**.

---

## 🚀 Características Clave

* **Arquitectura Modular (SOLID)**: Proyecto desacoplado en archivos CSS independientes y módulos de JavaScript nativos (ES6 Modules).
* **Navegación Single-Page Application (SPA)**: Transiciones fluidas entre pantallas de catálogo, detalles de productos y flujos de selección sin recargar la página.
* **Configurador de Cajas por Filas**: Sistema paso a paso para armar cajas (Caja x2 y Caja x3) seleccionando sabores de galletas por filas independientes, con una barra de progreso visual verde salvia reactiva.
* **Control de Inventario en Tiempo Real**: 
  * Panel de administración seguro ([`/admin.html`](/admin.html)) protegido por contraseña para editar stock disponible de cada producto.
  * Integración opcional mediante base de datos serverless (Firebase Realtime Database REST API) o persistencia local (`localStorage`).
  * Deshabilita automáticamente sabores agotados en el catálogo y bloquea los selectores en el configurador de cajas cuando se alcanza el límite.
* **Carrito de Compras en 2 Pasos**:
  * **Paso 1 (Tu Pedido)**: Revisión limpia de ítems y cantidades.
  * **Paso 2 (Datos de Entrega)**: Captura de datos de entrega y cálculo de domicilio dinámico ($3.000 COP para envío, $0 COP para recogida en tienda).
* **Branding Premium**: Cierre estético elegante con logotipo oficial circular, detalles de ubicación en Pradera (Valle del Cauca, Colombia) y accesos directos interactivos a Instagram, TikTok y WhatsApp.

---

## 🛠️ Estructura del Código

El proyecto sigue estrictamente buenas prácticas de **Clean Code** y **SOLID**:

```
Natcookies-/
├── index.html             # Estructura HTML de la SPA (Cliente)
├── admin.html             # Panel Administrativo de Control de Inventario
├── index.css              # Importador centralizado de estilos
├── README.md              # Documentación del proyecto
├── css/                   # Hojas de estilo modulares
│   ├── variables.css      # Tokens de color, fuentes y animaciones
│   ├── base.css           # Resets y contenedores responsivos
│   ├── components.css     # Botones, inputs y badges reutilizables
│   └── views.css          # Estilos detallados de cada pantalla y el footer
├── js/                    # Módulos JavaScript (ES Modules)
│   ├── app.js             # Bootstrap y renderizado del DOM
│   ├── config.js          # Variables globales (Contraseñas y teléfonos)
│   ├── products.js        # Catálogo estático de productos
│   ├── router.js          # Control de navegación SPA
│   ├── inventory.js       # Sincronización de stock con la base de datos
│   ├── cart.js            # Modelo de datos y operaciones del carrito
│   ├── builder.js         # Lógica del constructor de cajas personalizadas
│   └── checkout.js        # Formateador de mensaje WhatsApp
└── assets/                # Imágenes de marca optimizadas
```

---

## 💻 Desarrollo Local

No requieres dependencias complejas ni procesos de compilación (build steps). Puedes servir el proyecto con cualquier servidor estático:

1. **Iniciar el servidor local** (usando Python en puerto 8080):
   ```bash
   python3 -m http.server 8080
   ```
2. **Acceder a la aplicación**:
   * Cliente: `http://localhost:8080`
   * Administración: `http://localhost:8080/admin.html` (Contraseña por defecto: `nat123`)

3. **Detener el servidor**:
   Presiona `Ctrl + C` en la terminal, o libera el puerto ejecutando:
   ```bash
   kill $(lsof -t -i:8080)
   ```

---

## ☁️ Despliegue en Vercel

Este proyecto está 100% optimizado para ser desplegado en **Vercel** de forma directa como un sitio estático:

1. Crea un repositorio en tu cuenta de GitHub y sube los archivos.
2. Ve a tu panel de **Vercel**, haz clic en **Add New** > **Project** e importa el repositorio.
3. Vercel detectará el archivo `index.html` automáticamente. Haz clic en **Deploy** y la aplicación estará en línea en segundos.

---

## 🤝 Contacto Oficial de la Marca
* **Ubicación:** Pradera, Valle del Cauca, Colombia
* **Teléfono WhatsApp:** +57 320 573 0481
* **Instagram:** [@natcookies.artesanal](https://www.instagram.com/natcookies.artesanal?igsi=MWEwdWRjbWJmMm1wcw==)
* **TikTok:** [@natcookies_0](https://www.tiktok.com/@natcookies_0?_r=1&_t=ZS-99AdreL8Tif)

# 🍪 NatCookies - Premium Artisanal Pastries

An interactive, high-end responsive web application (SPA, Mobile-First) designed so that customers of the artisanal bakery **NatCookies** can configure and personalize their orders digitally, calculating stock in real time and sending structured orders to WhatsApp.

Inspired by the minimalist aesthetic, fluid transitions and mobile flows of **Sam G Bakes** baking.

---

## 🚀 Key Features

* **Modular Architecture (SOLID)**: Decoupled project into independent CSS files and native JavaScript modules (ES6 Modules).
* **Single-Page Application (SPA) Navigation**: Smooth transitions between catalog screens, product details and selection flows without page reloads.
* **Boxes by Rows Configurator**: Step-by-step system to assemble boxes (Box x2 and Box x3) by selecting cookie flavors by independent rows, with a reactive sage green visual progress bar.
* **Real-Time Inventory Control**: 
* Secure administration panel ([`/admin.html`](/admin.html)) password protected to edit available stock of each product. 
* Optional integration via serverless database (Firebase Realtime Database REST API) or local persistence (`localStorage`). 
* Automatically disables out-of-stock flavors in the catalog and locks selectors in the case configurator when the limit is reached.
* **2 Step Shopping Cart**: 
* **Step 1 (Your Order)**: Clean review of items and quantities. 
* **Step 2 (Delivery Data)**: Capture delivery data and dynamic address calculation ($3,000 COP for shipping, $0 COP for store pickup).
* **Premium Branding**: Elegant aesthetic closure with circular official logo, location details in Pradera (Valle del Cauca, Colombia) and interactive shortcuts to Instagram, TikTok and WhatsApp.

---

## 🛠️ Code Structure

The project strictly follows **Clean Code** and **SOLID** good practices:

```
Natcookies-/
├── index.html # HTML structure of the SPA (Client)
├── admin.html # Inventory Control Administrative Panel
├── index.css # Centralized style importer
├── README.md # Project documentation
├── css/ # Modular style sheets
│ ├── variables.css # Color tokens, fonts and animations
│ ├── base.css # Responsive resets and containers
│ ├── components.css # Reusable buttons, inputs and badges
│ └── views.css # Detailed styles for each screen and the footer
├── js/ # JavaScript Modules (ES Modules)
│ ├── app.js # Bootstrap and DOM rendering
│ ├── config.js # Global variables (Passwords and phones)
│ ├── products.js # Static product catalog
│ ├── router.js # SPA navigation control
│ ├── inventory.js # Synchronizing stock with the database
│ ├── cart.js # Cart data model and operations
│ ├── builder.js # Custom box builder logic
│ └── checkout.js # WhatsApp message formatter
└── assets/ # Optimized brand images
```

---

## 💻 Local Development

You do not require complex dependencies or build steps. You can serve the project with any static server:

1. **Start the local server** (using Python on port 8080): 
```bash 
python3 -m http.server 8080 
```
2. **Access the application**: 
* Client: `http://localhost:8080` 
* Administration: `http://localhost:8080/admin.html` 

3. **Stop the server**: 
Press `Ctrl + C` in the terminal, or free the port by running: 
```bash 
kill $(lsof -t -i:8080) 
```

---

## ☁️ Deployment in Vercel

This project is 100% optimized to be deployed in **Vercel** directly as a static site:

1. Create a repository in your GitHub account and upload the files.
2. Go to your **Vercel** dashboard, click **Add New** > **Project** and import the repository.
3. Vercel will detect the `index.html` file automatically. Click **Deploy** and the application will be online in seconds.

---

## 🤝 Official Brand Contact
* **Location:** Pradera, Valle del Cauca, Colombia
* **WhatsApp phone:** +57 320 573 0481
* **Instagram:** [@natcookies.artesanal](https://www.instagram.com/natcookies.artesanal?igsi=MWEwdWRjbWJmMm1wcw==)
* **TikTok:** [@natcookies_0](https://www.tiktok.com/@natcookies_0?_r=1&_t=ZS-99AdreL8Tif)

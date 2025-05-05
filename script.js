document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Product data
    const products = [
        { name: "Aderezo Panza Verde (500ml)", img: "https://i.imgur.com/YDjR9QQ.png", price: 55, includes: "Especial para pizzas, hamburguesas, sushi, milanesas, alitas. etc.", category: "Otros" },
        { name: "Ate de fruta", img: "https://i.imgur.com/Yk8a3AC.jpeg", price: 70, includes: "Membrillo (350g aprox)", category: "Dulces" },
        { name: "Alfajor argentino", img: "https://i.imgur.com/7zoiYN8.png", price: 50, includes: "Hecho con dulce de leche auténtico", category: "Dulces" },
        { name: "Almendras cubiertas de cocoa (100g)", img: "https://i.imgur.com/LznPjo4.jpeg", price: 55, includes: "", category: "Dulces" },
        { name: "Almendras cubiertas de Matcha (100g)", img: "https://i.imgur.com/WDPDcq1.jpeg", price: 55, includes: "con chocolate blanco", category: "Dulces" },
        { name: "Arándanos enchilados (100g)", img: "https://i.imgur.com/pLKUISA.jpeg", price: 35, includes: "Arándanos deshidratados con chile", category: "Dulces picositos" },
        { name: "Arrayanes (230g)", img: "https://i.imgur.com/PQNiYFI.jpeg", price: 50, includes: "Arrayanes con azúcar", category: "Dulces" },
        { name: "Botana Gourmet enchilada (100g)", img: "https://i.imgur.com/Yo5R1in.jpeg", price: 55, includes: "Mezcla de nueces enchiladas", category: "Botanas" },
        { name: "Botana Gourmet salada (100g)", img: "https://i.imgur.com/jhlGdSc.jpeg", price: 55, includes: "Mezcla de nueces", category: "Botanas" },
        { name: "Botana Panza Verde (300g)", img: "https://i.imgur.com/Sp53Fq9.jpeg", price: 120, includes: "Nuez de la india, pretzels, arándanos enchilados", category: "Botanas" },
        { name: "Churritos de amaranto con sal y un toque de limón (500g)", img: "https://i.imgur.com/sLaUnO7.jpeg", price: 80, includes: "", category: "Botanas" },
        { name: "Churritos de amaranto con chipotle (500g)", img: "https://i.imgur.com/sLaUnO7.jpeg", price: 80, includes: "", category: "Botanas" },
        { name: "Churritos de amaranto con nopal (500g)", img: "https://i.imgur.com/sLaUnO7.jpeg", price: 80, includes: "", category: "Botanas" },
        { name: "Dátiles rellenos de nuez (100g)", img: "https://i.imgur.com/EBqMxqr.jpeg", price: 45, includes: "Dátiles rellenos de nuez cubiertos con un toque de azúcar", category: "Dulces" },
        { name: "Fresas Deshidratadas (100g)", img: "https://i.imgur.com/0SK8MuI.jpeg", price: 50, includes: "", category: "Dulces" },
        { name: "Gomitas de frutos  (250g)", img: "https://i.imgur.com/kWyjWlf.jpeg", price: 45, includes: "Tutti fruti", category: "Dulces" },
        { name: "Gomitas de corazón (100g)", img: "https://i.imgur.com/CAtOzlA.jpeg", price: 20, includes: "Hechas con amor", category: "Dulces" },
        { name: "Gomitas de frutas con chile (250g)", img: "https://i.imgur.com/HN5cFUm.jpeg", price: 45, includes: "", category: "Dulces picositos" },
        { name: "Gomitas de sandía con chile (250g)", img: "https://i.imgur.com/Gh1ozVF.jpeg", price: 45, includes: "", category: "Dulces picositos" },
        { name: "Gomitas de hierbas (250g)", img: "https://i.imgur.com/rk9xzMb.jpeg", price: 45, includes: "Combinación de sabores: canela, hierbabuena, menta y anís.", category: "Dulces" },
        { name: "Gomitas de rompope (250g)", img: "https://i.imgur.com/TqhrfIN.jpeg", price: 45, includes: "", category: "Dulces" },
        { name: "Granos de café cubiertos de chocolate semi amargo (100g)", img: "https://i.imgur.com/ODAIYHh.jpeg", price: 45, includes: "", category: "Dulces" },
        { name: "Guayabate con nuez (330g aprox.)", img: "https://i.imgur.com/jrJlWHl.jpeg", price: 85, includes: "Dulce de guayaba con cajeta, coco y nuez", category: "Dulces" },
        { name: "Guayabate con piñón (330g aprox.)", img: "https://i.imgur.com/jrJlWHl.jpeg", price: 85, includes: "Dulce de guayaba con cajeta, coco y piñón", category: "Dulces" },
        { name: "Macadamias cubiertas de cocoa (100g)", img: "https://i.imgur.com/jehZ5Bu.jpeg", price: 60, includes: "", category: "Dulces" },
        { name: "Mangomitas cubiertas de chile (100g)", img: "https://i.imgur.com/6mljk5L.png", price: 20, includes: "", category: "Dulces picositos" },
        { name: "Mangos enchilados (100g)", img: "https://i.imgur.com/jLK6q3R.png", price: 45, includes: "", category: "Dulces picositos" },
        { name: "Nuez de la india enchilada (100g)", img: "https://i.imgur.com/5kbXrDR.png", price: 55, includes: "", category: "Botanas" },
        { name: "Nuez de la india salada (100g)", img: "https://i.imgur.com/N49fDtW.jpeg", price: 50, includes: "", category: "Botanas" },
        { name: "Palomas (50g aprox.)", img: "https://i.imgur.com/wpgUaGP.jpeg", price: 25, includes: "Obleas rellenas de coco y cajeta", category: "Dulces" },
        { name: "Piñas con chile (100g)", img: "https://i.imgur.com/gRCANyj.jpeg", price: 45, includes: "", category: "Dulces picositos" },
        { name: "Pistaches enchilados (100g)", img: "https://i.imgur.com/FxIyawD.png", price: 55, includes: "Con ajo", category: "Botanas" },
        { name: "Queso de Almendras (40g aprox)", img: "https://i.imgur.com/CuhnSD3.jpeg", price: 25, includes: "Dulce fino de Almendra con un toque de limón", category: "Dulces" },
        { name: "Suspiros (50g)", img: "https://i.imgur.com/6uZUzF8.jpeg", price: 20, includes: "Galletas pequeñas cubiertas de chocolate semi amargo", category: "Dulces" },
        { name: "Suaves de coco (300g)", img: "https://i.imgur.com/CtURNmF.jpeg", price: 80, includes: "", category: "Dulces" },
        { name: "Tarugos rellenos de panditas (100g)", img: "https://i.imgur.com/QlbwTrr.jpeg", price: 20, includes: "", category: "Dulces picositos" },
        { name: "Tarugos rellenos de tamborcito (100g)", img: "https://i.imgur.com/QlbwTrr.jpeg", price: 20, includes: "", category: "Dulces picositos" },
        { name: "Tarugos rellenos de picafresa (100g)", img: "https://i.imgur.com/QlbwTrr.jpeg", price: 20, includes: "", category: "Dulces picositos" },
        { name: "Tarugos rellenos de rocaleta (100g)", img: "https://i.imgur.com/QlbwTrr.jpeg", price: 20, includes: "", category: "Dulces picositos" },
        { name: "Vasitos con pulpa de fruta y chile (230g)", img: "https://i.imgur.com/iXCpNDz.jpeg", price: 45, includes: "", category: "Dulces picositos" }
    ];

    // Cart and app state
    let cart = [];
    let total = 0;
    let orderNumber = null;
    let selectedPaymentMethod = "en línea";
    let filteredProducts = [...products];

    // Initialize the app
    function init() {
        // Display top 6 most expensive products in horizontal layout
        const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 6);
        displayProducts(topProducts, 'horizontal');
        
        // Display all products in vertical layout initially
        displayProducts(products, 'vertical');
        
        // Update cart count
        updateCartCount();
    }

    // Create product element based on layout
    function createProductElement(product, index, layout = 'vertical') {
        const productItem = document.createElement('div');
        productItem.classList.add(layout === 'horizontal' ? 'horizontal-product-item' : 'product-item');
        
        if (layout === 'horizontal') {
            productItem.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="view-btn">Ver más</button>
                </div>
            `;
        } else {
            productItem.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="view-btn">Ver más</button>
                </div>
            `;
        }

        // Add click event to open product modal
        productItem.addEventListener('click', (e) => {
            // Don't open modal if clicking on the view button (handled separately)
            if (!e.target.classList.contains('view-btn')) {
                openProductModal(product);
            }
        });

        // Add click event to view button
        const viewBtn = productItem.querySelector('.view-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openProductModal(product);
        });

        return productItem;
    }

    // Display products in the specified layout
    function displayProducts(productsToDisplay, layout = 'vertical') {
        const menu = layout === 'horizontal' ? 
            document.getElementById('menu-horizontal') : 
            document.getElementById('menu-vertical');
        
        menu.innerHTML = '';
        
        productsToDisplay.forEach((product, index) => {
            menu.appendChild(createProductElement(product, index, layout));
        });
    }

    // Add product to cart
    window.addToCart = function(product) {
        const productId = product.name.replace(/\s+/g, '-').toLowerCase();
        const quantitySelect = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantitySelect.value);
        const existingProduct = cart.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ 
                name: product.name, 
                price: product.price, 
                quantity: quantity,
                img: product.img
            });
        }
        
        updateCart();
        updateCartCount();
        
        // Update modal content to show confirmation and similar products
        const modalBody = document.getElementById('product-modal-body');
        modalBody.innerHTML = `
            <div class="added-to-cart">
                <i class="fas fa-check-circle"></i>
                <p>Se agregó ${quantity} ${product.name} al carrito</p>
            </div>
            <div class="similar-products">
                <h3>También te puede interesar:</h3>
                <div id="similar-products" class="similar-products-grid"></div>
            </div>
        `;

        // Display similar products
        const similarProductsContainer = document.getElementById('similar-products');
        const similarProducts = getSimilarProducts(product);

        similarProducts.forEach((similarProduct) => {
            const productItem = document.createElement('div');
            productItem.classList.add('similar-product-item');
            productItem.innerHTML = `
                <img src="${similarProduct.img}" alt="${similarProduct.name}">
                <h4>${similarProduct.name}</h4>
                <p>$${similarProduct.price.toFixed(2)}</p>
            `;

            productItem.addEventListener('click', () => {
                openProductModal(similarProduct);
            });

            similarProductsContainer.appendChild(productItem);
        });
    };

    // Update cart UI
    window.updateCart = function() {
        const cartItemsSection = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const paypalForm = document.getElementById('paypal-form');
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const editCartItems = document.getElementById('edit-cart-items');

        cartItemsSection.innerHTML = '';
        editCartItems.innerHTML = '';
        total = 0;

        if (cart.length === 0) {
            cartItemsSection.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            editCartItems.innerHTML = '<p class="empty-cart">No hay productos en el carrito</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                // Main cart items
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                `;
                cartItemsSection.appendChild(cartItem);

                // Edit cart items
                const editItem = document.createElement('div');
                editItem.classList.add('edit-cart-item');
                editItem.innerHTML = `
                    <div class="edit-item-info">
                        <div class="edit-item-name">${item.name}</div>
                        <div class="edit-item-price">$${item.price.toFixed(2)} c/u</div>
                    </div>
                    <div class="edit-item-actions">
                        <button class="quantity-btn" onclick="window.updateCartItemQuantity(${index}, -1)">-</button>
                        <span class="edit-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="window.updateCartItemQuantity(${index}, 1)">+</button>
                        <button class="remove-item-btn" onclick="window.removeCartItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="edit-item-total">$${itemTotal.toFixed(2)}</div>
                `;
                editCartItems.appendChild(editItem);
            });
        }

        cartTotal.textContent = `$${total.toFixed(2)}`;
        updatePayPalForm();
        updateWhatsAppLink();
        updateCartCount();
    }

    // Update cart item quantity
    window.updateCartItemQuantity = function(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart[index].quantity = 1;
        }
        window.updateCart();
    }

    // Remove item from cart
    window.removeCartItem = function(index) {
        cart.splice(index, 1);
        window.updateCart();
    }

    // Update PayPal form
    function updatePayPalForm() {
        const paypalForm = document.getElementById('paypal-form');
        
        if (cart.length === 0) {
            paypalForm.innerHTML = '';
            return;
        }

        paypalForm.innerHTML = `
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="erandi27gasca@gmail.com" />
                <input type="hidden" name="currency_code" value="MXN" />
                <input type="hidden" name="amount" value="${total.toFixed(2)}" />
                <input type="hidden" name="item_name" value="${cart.map(item => `${item.name} (${item.quantity})`).join(', ')}" />
                <input type="image" src="https://www.paypalobjects.com/webstatic/en_US/i/btn/png/silver-pill-paypal-44px.png" border="0" name="submit" title="Pay with PayPal" alt="PayPal - The safer, easier way to pay online!" />
            </form>
        `;
    }

    // Update WhatsApp link
    function updateWhatsAppLink() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        
        if (cart.length === 0) {
            whatsappBtn.style.display = 'none';
            return;
        }

        const message = `Orden de Panza Verde:\n${cart.map(item => `${item.name} (${item.quantity}) - $${item.price.toFixed(2)} c/u`).join('\n')}\nTotal: $${total.toFixed(2)}\nMétodo de pago: ${selectedPaymentMethod}`;
        const encodedMessage = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/525526627851?text=${encodedMessage}`;
        whatsappBtn.style.display = 'flex';
    }

    // Update payment method
    window.updatePaymentMethod = function(method) {
        selectedPaymentMethod = method;
        updateWhatsAppLink();
    }

    // Upload order to Google Sheets
    window.uploadOrder = function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de hacer un pedido.');
            return;
        }

        if (!orderNumber) {
            orderNumber = Math.floor(Math.random() * 1000000) + 1;
        }

        const orderData = {
            timestamp: new Date().toLocaleString(),
            orderNumber: orderNumber,
            paymentMethod: selectedPaymentMethod,
            cart: JSON.stringify(cart),
            total: total.toFixed(2)
        };

        updateWhatsAppLink();

        fetch('https://script.google.com/macros/s/AKfycbzRuFIWEDIAmaWXRcEGT-N4D6PAhH35I04hAArX_-vuR2MzLpdb-4bVTCr51z8O0bGjYg/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            alert('Pedido enviado correctamente. Por favor confirma tu pedido por WhatsApp.');
            document.getElementById('whatsapp-btn').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al enviar tu pedido. Por favor inténtalo de nuevo o contáctanos por WhatsApp.');
        });
    };

    // Clear cart
    window.clearCart = function() {
        if (cart.length === 0) return;
        
        if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
            cart = [];
            window.updateCart();
        }
    };

    // Filter products by category
    window.filterProducts = function(category) {
        if (category === 'Todos') {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => product.category === category);
        }
        displayProducts(filteredProducts, 'vertical');
        
        // Scroll to product catalog section
        document.querySelector('.product-catalog').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };

    // Search products
    window.searchProducts = function(query) {
        if (query.trim() === '') {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        displayProducts(filteredProducts, 'vertical');
    };

    // Open product modal
    window.openProductModal = function(product) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('product-modal-title');
        const modalBody = document.getElementById('product-modal-body');

        const productId = product.name.replace(/\s+/g, '-').toLowerCase();

        modalTitle.textContent = product.name;
        modalBody.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-modal-img">
            <div class="product-modal-details">
                <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                ${product.includes ? `<p><strong>Descripción:</strong> ${product.includes}</p>` : ''}
                <p><strong>Categoría:</strong> ${product.category}</p>
                <label for="quantity-${productId}"><strong>Cantidad:</strong></label>
                <select id="quantity-${productId}" class="quantity-select">
                    ${[...Array(10)].map((_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                </select>
                <button class="add-to-cart-btn" onclick="window.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close product modal
    window.closeProductModal = function() {
        const modal = document.getElementById('product-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Get similar products
    function getSimilarProducts(currentProduct, numSimilar = 4) {
        const similarProducts = products.filter(product => 
            product.category === currentProduct.category && 
            product.name !== currentProduct.name
        );
        
        // Shuffle and get specified number of similar products
        return [...similarProducts]
            .sort(() => Math.random() - 0.5)
            .slice(0, numSimilar);
    }

    // Toggle cart visibility
    window.toggleCart = function() {
        const cart = document.getElementById('cart');
        cart.classList.toggle('active');
        document.body.style.overflow = cart.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Toggle edit modal visibility
    window.toggleModal = function() {
        const modal = document.getElementById('edit-modal');
        modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'block' : 'none';
        document.body.style.overflow = modal.style.display === 'block' ? 'hidden' : 'auto';
    }

    // Update cart count badge
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        const editModal = document.getElementById('edit-modal');
        const productModal = document.getElementById('product-modal');
        
        if (event.target === editModal) {
            window.toggleModal();
        }
        
        if (event.target === productModal) {
            window.closeProductModal();
        }
    }

    // Initialize the app
    init();
});

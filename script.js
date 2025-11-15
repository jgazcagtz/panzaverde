import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTFRVMUd66Dwr7Ec_2qj6SNPhgNIVBURg",
    authDomain: "bagueteria-3cbdb.firebaseapp.com",
    projectId: "bagueteria-3cbdb",
    storageBucket: "bagueteria-3cbdb.firebasestorage.app",
    messagingSenderId: "181467777153",
    appId: "1:181467777153:web:23b774efebd3251abfe580"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

googleProvider.setCustomParameters({ prompt: "select_account" });

document.addEventListener("DOMContentLoaded", () => {
    const defaultImage = "https://i.imgur.com/8zf86ss.png";

    const rawSeedProducts = [
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

    const seedProducts = rawSeedProducts.map((product, index) => ({
        ...product,
        id: `seed-${index}-${product.name.replace(/\s+/g, "-").toLowerCase()}`,
        featured: product.featured ?? product.price >= 70
    }));

    let products = [...seedProducts];
    let filteredProducts = [...products];
    let cart = [];
    let total = 0;
    let orderNumber = null;
    let selectedPaymentMethod = "en línea";

    const dom = {
        currentYear: document.getElementById("current-year"),
        signupForm: document.getElementById("buyer-signup-form"),
        signinForm: document.getElementById("buyer-signin-form"),
        signoutBtn: document.getElementById("signout-btn"),
        googleBtn: document.getElementById("google-signin-btn"),
        accountStatus: document.getElementById("account-status"),
        toast: document.getElementById("toast"),
        categoryToggle: document.querySelector(".category-toggle"),
        categoryMenu: document.querySelector(".category-menu")
    };

    init();

    function init() {
        if (dom.currentYear) {
            dom.currentYear.textContent = new Date().getFullYear();
        }
        renderFeaturedProducts();
        displayProducts(filteredProducts, "vertical");
        updateCartCount();
        registerAuthListeners();
        registerCategoryToggle();
        subscribeToProducts();
        onAuthStateChanged(auth, (user) => {
            updateAuthUI(user);
        });
    }

    function registerAuthListeners() {
        dom.signupForm?.addEventListener("submit", handleSignup);
        dom.signinForm?.addEventListener("submit", handleSignin);
        dom.signoutBtn?.addEventListener("click", handleSignOut);
        dom.googleBtn?.addEventListener("click", handleGoogleSignIn);
    }


    function registerCategoryToggle() {
        if (dom.categoryToggle && dom.categoryMenu) {
            dom.categoryToggle.addEventListener("click", () => {
                dom.categoryMenu.classList.toggle("open");
            });
        }
    }

    function subscribeToProducts() {
        try {
            const productsRef = collection(db, "products");
            onSnapshot(
                productsRef,
                (snapshot) => {
                    if (snapshot.empty) {
                        products = [...seedProducts];
                    } else {
                        products = snapshot.docs.map((docSnap) => {
                            const data = docSnap.data();
                            return {
                                id: docSnap.id,
                                name: data.name || "Producto sin nombre",
                                price: Number(data.price) || 0,
                                img: data.img || defaultImage,
                                includes: data.includes || "",
                                category: data.category || "Otros",
                                featured: data.featured ?? false
                            };
                        });
                    }
                    filteredProducts = [...products];
                    renderFeaturedProducts();
                    displayProducts(filteredProducts, "vertical");
                },
                (error) => {
                    console.error("Error al escuchar productos", error);
                    showToast("No pudimos sincronizar con Firebase. Mostramos el catálogo local.", "warning");
                }
            );
        } catch (error) {
            console.error("Error de Firebase", error);
            showToast("Firebase no está configurado correctamente.", "error");
        }
    }

    function renderFeaturedProducts() {
        const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 6);
        if (topProducts.length === 0) {
            const horizontal = document.getElementById("menu-horizontal");
            if (horizontal) horizontal.innerHTML = '<p class="empty-state">Sin productos destacados.</p>';
            return;
        }
        displayProducts(topProducts, "horizontal");
    }

    function displayProducts(productsToDisplay, layout = "vertical") {
        const menu = layout === "horizontal"
            ? document.getElementById("menu-horizontal")
            : document.getElementById("menu-vertical");

        if (!menu) return;
        menu.innerHTML = "";

        if (!productsToDisplay || productsToDisplay.length === 0) {
            menu.innerHTML = '<p class="empty-state">No encontramos productos para esta búsqueda.</p>';
            return;
        }

        productsToDisplay.forEach((product, index) => {
            menu.appendChild(createProductElement(product, index, layout));
        });
    }

    function createProductElement(product, index, layout = "vertical") {
        const productItem = document.createElement("div");
        productItem.classList.add(layout === "horizontal" ? "horizontal-product-item" : "product-item");

        productItem.innerHTML = `
            <div class="product-image-wrapper">
                ${product.featured ? '<span class="featured-badge">Destacado</span>' : ""}
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${Number(product.price).toFixed(2)}</p>
                <button class="view-btn">Ver más</button>
            </div>
        `;

        productItem.addEventListener("click", (event) => {
            if (!event.target.classList.contains("view-btn")) {
                openProductModal(product);
            }
        });

        productItem.querySelector(".view-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            openProductModal(product);
        });

        return productItem;
    }


    function updateAuthUI(user) {
        if (!dom.accountStatus) return;
        if (user) {
            dom.accountStatus.innerHTML = `Bienvenido, <strong>${user.displayName || user.email}</strong>. Tus datos están guardados para tus próximos pedidos.`;
            dom.signoutBtn?.classList.add("visible");
        } else {
            dom.accountStatus.textContent = "Navegas como invitado. Inicia sesión para desbloquear beneficios y agilizar tus compras.";
            dom.signoutBtn?.classList.remove("visible");
        }
    }

    async function handleSignup(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = (formData.get("name") || "").trim();
        const email = (formData.get("email") || "").trim();
        const password = (formData.get("password") || "").trim();

        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(credential.user, { displayName: name });
            }
            showToast("Cuenta creada con éxito. ¡Bienvenido a Panza Verde!", "success");
            event.target.reset();
        } catch (error) {
            showToast(parseFirebaseError(error), "error");
        }
    }

    async function handleSignin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = (formData.get("email") || "").trim();
        const password = (formData.get("password") || "").trim();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast("Sesión iniciada. Listo para comprar.", "success");
            event.target.reset();
        } catch (error) {
            showToast(parseFirebaseError(error), "error");
        }
    }

    async function handleSignOut() {
        try {
            await signOut(auth);
            showToast("Sesión cerrada correctamente.", "info");
        } catch (error) {
            showToast("No pudimos cerrar la sesión. Intenta de nuevo.", "error");
        }
    }

    async function handleGoogleSignIn() {
        try {
            await signInWithPopup(auth, googleProvider);
            showToast("¡Hola! Te autenticamos con Google.", "success");
        } catch (error) {
            showToast(parseFirebaseError(error), "error");
        }
    }


    function showToast(message, type = "info") {
        if (!dom.toast) {
            console.log(`[${type}] ${message}`);
            return;
        }
        dom.toast.textContent = message;
        dom.toast.className = `toast toast--${type}`;
        requestAnimationFrame(() => dom.toast.classList.add("show"));
        clearTimeout(dom.toast.hideTimeout);
        dom.toast.hideTimeout = setTimeout(() => {
            dom.toast.classList.remove("show");
        }, 3500);
    }

    function parseFirebaseError(error) {
        const map = {
            "auth/email-already-in-use": "El correo ya está registrado.",
            "auth/invalid-email": "El correo no es válido.",
            "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
            "auth/user-not-found": "No encontramos una cuenta con ese correo.",
            "auth/wrong-password": "La contraseña no es correcta.",
            "auth/popup-closed-by-user": "Cerraste la ventana de inicio de sesión.",
            "auth/popup-blocked": "El navegador bloqueó la ventana de Google. Permítela para continuar."
        };
        return map[error?.code] || "No pudimos completar la acción. Inténtalo de nuevo.";
    }

    function addToCart(product) {
        const productId = product.name.replace(/\s+/g, "-").toLowerCase();
        const quantitySelect = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantitySelect?.value, 10) || 1;
        const existingProduct = cart.find((item) => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                name: product.name,
                price: Number(product.price),
                quantity,
                img: product.img
            });
        }

        updateCart();
        updateCartCount();
        renderSimilarProducts(product, quantity);
    }

    function renderSimilarProducts(product, quantity) {
        const modalBody = document.getElementById("product-modal-body");
        if (!modalBody) return;

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

        const similarProductsContainer = document.getElementById("similar-products");
        if (!similarProductsContainer) return;

        const similarProducts = getSimilarProducts(product);
        similarProducts.forEach((similarProduct) => {
            const productItem = document.createElement("div");
            productItem.classList.add("similar-product-item");
            productItem.innerHTML = `
                <img src="${similarProduct.img}" alt="${similarProduct.name}">
                <h4>${similarProduct.name}</h4>
                <p>$${Number(similarProduct.price).toFixed(2)}</p>
            `;
            productItem.addEventListener("click", () => {
                openProductModal(similarProduct);
            });
            similarProductsContainer.appendChild(productItem);
        });
    }

    function updateCart() {
        const cartItemsSection = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const editCartItems = document.getElementById("edit-cart-items");

        if (!cartItemsSection || !cartTotal || !editCartItems) return;

        cartItemsSection.innerHTML = "";
        editCartItems.innerHTML = "";
        total = 0;

        if (cart.length === 0) {
            cartItemsSection.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            editCartItems.innerHTML = '<p class="empty-cart">No hay productos en el carrito</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                `;
                cartItemsSection.appendChild(cartItem);

                const editItem = document.createElement("div");
                editItem.classList.add("edit-cart-item");
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

    function updateCartItemQuantity(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart[index].quantity = 1;
        }
        updateCart();
    }

    function removeCartItem(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updatePayPalForm() {
        const paypalForm = document.getElementById("paypal-form");
        if (!paypalForm) return;

        if (cart.length === 0) {
            paypalForm.innerHTML = "";
            return;
        }

        paypalForm.innerHTML = `
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="erandi27gasca@gmail.com" />
                <input type="hidden" name="currency_code" value="MXN" />
                <input type="hidden" name="amount" value="${total.toFixed(2)}" />
                <input type="hidden" name="item_name" value="${cart.map((item) => `${item.name} (${item.quantity})`).join(", ")}" />
                <input type="image" src="https://www.paypalobjects.com/webstatic/en_US/i/btn/png/silver-pill-paypal-44px.png" border="0" name="submit" title="Pay with PayPal" alt="PayPal - The safer, easier way to pay online!" />
            </form>
        `;
    }

    function updateWhatsAppLink() {
        const whatsappBtn = document.getElementById("whatsapp-btn");
        if (!whatsappBtn) return;

        if (cart.length === 0) {
            whatsappBtn.style.display = "none";
            return;
        }

        const message = `Orden de Panza Verde:\n${cart
            .map((item) => `${item.name} (${item.quantity}) - $${item.price.toFixed(2)} c/u`)
            .join("\n")}\nTotal: $${total.toFixed(2)}\nMétodo de pago: ${selectedPaymentMethod}`;

        const encodedMessage = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/525526627851?text=${encodedMessage}`;
        whatsappBtn.style.display = "flex";
    }

    function updatePaymentMethod(method) {
        selectedPaymentMethod = method;
        updateWhatsAppLink();
    }

    async function uploadOrder() {
        if (cart.length === 0) {
            showToast("Tu carrito está vacío. Agrega productos antes de hacer un pedido.", "warning");
            return;
        }

        if (!orderNumber) {
            orderNumber = Math.floor(Math.random() * 1000000) + 1;
        }

        const orderData = {
            timestamp: new Date().toLocaleString(),
            orderNumber,
            paymentMethod: selectedPaymentMethod,
            cart: JSON.stringify(cart),
            total: total.toFixed(2)
        };

        updateWhatsAppLink();

        try {
            await fetch("https://script.google.com/macros/s/AKfycbzRuFIWEDIAmaWXRcEGT-N4D6PAhH35I04hAArX_-vuR2MzLpdb-4bVTCr51z8O0bGjYg/exec", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });
            showToast("Pedido enviado correctamente. Confirma por WhatsApp.", "success");
            document.getElementById("whatsapp-btn").style.display = "flex";
        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            showToast("Hubo un error al enviar tu pedido. Inténtalo nuevamente.", "error");
        }
    }

    function clearCart() {
        if (cart.length === 0) return;
        if (confirm("¿Estás seguro de que quieres vaciar tu carrito?")) {
            cart = [];
            updateCart();
            showToast("Carrito vaciado.", "info");
        }
    }

    function filterProducts(category) {
        if (category === "Todos") {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter((product) => product.category === category);
        }
        displayProducts(filteredProducts, "vertical");
        document.querySelector(".product-catalog")?.scrollIntoView({ behavior: "smooth" });
    }

    function searchProducts(query) {
        const normalized = query.trim().toLowerCase();
        if (normalized === "") {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(normalized) ||
                    product.category.toLowerCase().includes(normalized)
            );
        }
        displayProducts(filteredProducts, "vertical");
    }

    function openProductModal(product) {
        const modal = document.getElementById("product-modal");
        const modalTitle = document.getElementById("product-modal-title");
        const modalBody = document.getElementById("product-modal-body");

        if (!modal || !modalTitle || !modalBody) return;

        const productId = product.name.replace(/\s+/g, "-").toLowerCase();

        modalTitle.textContent = product.name;
        modalBody.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-modal-img">
            <div class="product-modal-details">
                <p><strong>Precio:</strong> $${Number(product.price).toFixed(2)}</p>
                ${product.includes ? `<p><strong>Descripción:</strong> ${product.includes}</p>` : ""}
                <p><strong>Categoría:</strong> ${product.category}</p>
                <label for="quantity-${productId}"><strong>Cantidad:</strong></label>
                <select id="quantity-${productId}" class="quantity-select">
                    ${Array.from({ length: 10 }).map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
                </select>
                <button class="add-to-cart-btn">
                    <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        `;

        modalBody.querySelector(".add-to-cart-btn")?.addEventListener("click", () => addToCart(product));

        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    function closeProductModal() {
        const modal = document.getElementById("product-modal");
        if (!modal) return;
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    function getSimilarProducts(currentProduct, numSimilar = 4) {
        const similarProducts = products.filter(
            (product) => product.category === currentProduct.category && product.name !== currentProduct.name
        );
        return [...similarProducts].sort(() => Math.random() - 0.5).slice(0, numSimilar);
    }

    function toggleCart() {
        const cartPanel = document.getElementById("cart");
        if (!cartPanel) return;
        cartPanel.classList.toggle("active");
        document.body.style.overflow = cartPanel.classList.contains("active") ? "hidden" : "auto";
    }

    function toggleModal() {
        const modal = document.getElementById("edit-modal");
        if (!modal) return;
        const shouldOpen = modal.style.display === "none" || modal.style.display === "";
        modal.style.display = shouldOpen ? "block" : "none";
        document.body.style.overflow = shouldOpen ? "hidden" : "auto";
    }

    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        if (!cartCount) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? "flex" : "none";
    }

    window.addEventListener("click", (event) => {
        const editModal = document.getElementById("edit-modal");
        const productModal = document.getElementById("product-modal");

        if (event.target === editModal) {
            toggleModal();
        }

        if (event.target === productModal) {
            closeProductModal();
        }
    });

    window.addToCart = addToCart;
    window.updateCart = updateCart;
    window.updateCartItemQuantity = updateCartItemQuantity;
    window.removeCartItem = removeCartItem;
    window.updatePaymentMethod = updatePaymentMethod;
    window.uploadOrder = uploadOrder;
    window.clearCart = clearCart;
    window.filterProducts = filterProducts;
    window.searchProducts = searchProducts;
    window.openProductModal = openProductModal;
    window.closeProductModal = closeProductModal;
    window.toggleCart = toggleCart;
    window.toggleModal = toggleModal;
});


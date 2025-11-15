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
    serverTimestamp,
    query,
    where,
    orderBy,
    getDocs
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

// Initialize currentLanguage before DOMContentLoaded
let currentLanguage = localStorage.getItem('language') || 'es';

// Expose functions to window immediately (before DOMContentLoaded)
window.toggleCart = function() {
    const cartPanel = document.getElementById("cart");
    if (!cartPanel) {
        console.warn('Cart panel not found');
        return;
    }
    cartPanel.classList.toggle("active");
    document.body.style.overflow = cartPanel.classList.contains("active") ? "hidden" : "auto";
};

window.closeProductModal = function() {
    const modal = document.getElementById("product-modal");
    if (!modal) {
        console.warn('Product modal not found');
        return;
    }
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

window.toggleModal = function() {
    const modal = document.getElementById("edit-modal");
    if (!modal) {
        console.warn('Edit modal not found');
        return;
    }
    const shouldOpen = modal.style.display === "none" || modal.style.display === "";
    modal.style.display = shouldOpen ? "block" : "none";
    document.body.style.overflow = shouldOpen ? "hidden" : "auto";
};

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
    let categories = [];
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
        updateCart(); // Initialize cart display
        updateCartCount();
        registerAuthListeners();
        registerCategoryToggle();
        subscribeToProducts();
        subscribeToCategories();
        subscribeToBlogPosts();
        initLanguageToggle();
        onAuthStateChanged(auth, (user) => {
            updateAuthUI(user);
            if (user) {
                loadOrderHistory(user.uid);
                document.getElementById("pedidos-link")?.style.setProperty("display", "inline-flex");
            } else {
                document.getElementById("pedidos-link")?.style.setProperty("display", "none");
            }
        });
    }

    function registerAuthListeners() {
        dom.signupForm?.addEventListener("submit", handleSignup);
        dom.signinForm?.addEventListener("submit", handleSignin);
        dom.signoutBtn?.addEventListener("click", handleSignOut);
        dom.googleBtn?.addEventListener("click", handleGoogleSignIn);
        // Google signup button
        const googleSignupBtn = document.getElementById("google-signup-btn");
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener("click", handleGoogleSignIn);
        }
    }


    function registerCategoryToggle() {
        if (dom.categoryToggle && dom.categoryMenu) {
            dom.categoryToggle.addEventListener("click", () => {
                dom.categoryMenu.classList.toggle("open");
            });
        }
    }

    function subscribeToCategories() {
        try {
            const categoriesRef = collection(db, "categories");
            onSnapshot(
                categoriesRef,
                (snapshot) => {
                    if (snapshot.empty) {
                        categories = ["Dulces", "Dulces picositos", "Botanas", "Otros"];
                    } else {
                        categories = snapshot.docs.map((docSnap) => {
                            const data = docSnap.data();
                            return data.name || "Sin nombre";
                        });
                    }
                    updateCategoryMenu();
                },
                (error) => {
                    console.error("Error al escuchar categorías", error);
                    categories = ["Dulces", "Dulces picositos", "Botanas", "Otros"];
                    updateCategoryMenu();
                }
            );
        } catch (error) {
            console.error("Error de Firebase en categorías", error);
            categories = ["Dulces", "Dulces picositos", "Botanas", "Otros"];
            updateCategoryMenu();
        }
    }

    function updateCategoryMenu() {
        const categoryMenu = document.querySelector(".category-menu");
        if (!categoryMenu) return;
        
        categoryMenu.innerHTML = `
            <a href="#" onclick="window.filterProducts('Todos'); event.preventDefault();">Todos</a>
            ${categories.map(cat => 
                `<a href="#" onclick="window.filterProducts('${cat}'); event.preventDefault();">${cat}</a>`
            ).join("")}
        `;
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
            document.getElementById("pedidos")?.style.setProperty("display", "block");
            document.getElementById("pedidos-link")?.style.setProperty("display", "inline-flex");
        } else {
            dom.accountStatus.textContent = "Navegas como invitado. Inicia sesión para desbloquear beneficios y agilizar tus compras.";
            dom.signoutBtn?.classList.remove("visible");
            document.getElementById("pedidos")?.style.setProperty("display", "none");
            document.getElementById("pedidos-link")?.style.setProperty("display", "none");
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
            paypalForm.innerHTML = `
                <div class="paypal-placeholder">
                    <p>Selecciona productos para ver opciones de pago</p>
                </div>
            `;
            return;
        }

        if (selectedPaymentMethod === "en línea") {
            paypalForm.innerHTML = `
                <div class="paypal-button-wrapper">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" class="paypal-form">
                        <input type="hidden" name="cmd" value="_xclick" />
                        <input type="hidden" name="business" value="erandi27gasca@gmail.com" />
                        <input type="hidden" name="currency_code" value="MXN" />
                        <input type="hidden" name="amount" value="${total.toFixed(2)}" />
                        <input type="hidden" name="item_name" value="Panza Verde - ${cart.map((item) => `${item.name} (${item.quantity})`).join(", ")}" />
                        <button type="submit" class="paypal-button">
                            <i class="fab fa-paypal"></i>
                            <span>Pagar $${total.toFixed(2)} con PayPal</span>
                        </button>
                    </form>
                    <p class="paypal-note">Pago seguro y protegido por PayPal</p>
                </div>
            `;
        } else {
            paypalForm.innerHTML = `
                <div class="paypal-placeholder">
                    <p>Para pagar con ${selectedPaymentMethod}, confirma tu pedido por WhatsApp</p>
                </div>
            `;
        }
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
        updatePayPalForm(); // Update PayPal form when payment method changes
        updateWhatsAppLink();
    }

    async function uploadOrder() {
        if (cart.length === 0) {
            showToast("Tu carrito está vacío. Agrega productos antes de hacer un pedido.", "warning");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            showToast("Por favor inicia sesión para guardar tu pedido en tu historial.", "warning");
            updateWhatsAppLink();
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
            total: total.toFixed(2),
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || user.email,
            status: "pendiente",
            createdAt: serverTimestamp()
        };

        updateWhatsAppLink();

        try {
            // Save to Firestore
            const orderRef = await addDoc(collection(db, "orders"), orderData);
            showToast("Pedido guardado correctamente. Confirma por WhatsApp.", "success");
            document.getElementById("whatsapp-btn").style.display = "flex";
            
            // Also send to Google Sheets (optional)
            try {
                await fetch("https://script.google.com/macros/s/AKfycbzRuFIWEDIAmaWXRcEGT-N4D6PAhH35I04hAArX_-vuR2MzLpdb-4bVTCr51z8O0bGjYg/exec", {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData)
                });
            } catch (e) {
                console.log("Google Sheets sync failed, but order saved to Firestore");
            }
            
            // Clear cart after successful order
            cart = [];
            orderNumber = null;
            updateCart();
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
        if (!modal) {
            console.warn('Product modal not found');
            return;
        }
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
        if (!cartPanel) {
            console.warn('Cart panel not found');
            return;
        }
        cartPanel.classList.toggle("active");
        document.body.style.overflow = cartPanel.classList.contains("active") ? "hidden" : "auto";
    }

    function toggleModal() {
        const modal = document.getElementById("edit-modal");
        if (!modal) {
            console.warn('Edit modal not found');
            return;
        }
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
    // Update window functions (they're already set above, but update references to use local functions)
    window.toggleCart = toggleCart;
    window.closeProductModal = closeProductModal;
    window.toggleModal = toggleModal;

    // Translation system (currentLanguage already declared at top level)
    // Ensure it's synced with localStorage
    if (!currentLanguage) {
        currentLanguage = localStorage.getItem('language') || 'es';
    }

    const translations = {
        es: {
            'tagline': 'Dulces y botanas artesanales mexicanas',
            'nav-home': 'Inicio',
            'nav-favorites': 'Favoritos',
            'nav-catalog': 'Catálogo',
            'nav-blog': 'Blog',
            'nav-account': 'Mi Cuenta',
            'nav-orders': 'Mis Pedidos',
            'nav-admin': 'Admin',
            'nav-cart': 'Carrito',
            'create-account-title': 'Crear cuenta',
            'name-label': 'Nombre',
            'name-placeholder': 'Nombre completo',
            'email-label': 'Correo',
            'email-placeholder': 'email@panza.com',
            'password-label': 'Contraseña',
            'password-placeholder': '8 caracteres mínimo',
            'signup-button': 'Registrarme',
            'or-text': 'o',
            'continue-with-google': 'Continuar con Google',
            'blog-title': 'Blog',
            'blog-subtitle': 'Descubre la tradición y cultura de la dulcería mexicana',
            'distributor-title': '¿Quieres ser distribuidor?',
            'distributor-text': 'Pregunta por el Programa de Distribuidores Panza Verde',
            'distributor-contact': 'Contáctanos al +5526627851 para más información:',
            'whatsapp-contact': 'Escríbenos por WhatsApp'
        },
        en: {
            'tagline': 'Artisanal Mexican sweets and snacks',
            'nav-home': 'Home',
            'nav-favorites': 'Favorites',
            'nav-catalog': 'Catalog',
            'nav-blog': 'Blog',
            'nav-account': 'My Account',
            'nav-orders': 'My Orders',
            'nav-admin': 'Admin',
            'nav-cart': 'Cart',
            'create-account-title': 'Create account',
            'name-label': 'Name',
            'name-placeholder': 'Full name',
            'email-label': 'Email',
            'email-placeholder': 'email@panza.com',
            'password-label': 'Password',
            'password-placeholder': 'Minimum 8 characters',
            'signup-button': 'Sign up',
            'or-text': 'or',
            'continue-with-google': 'Continue with Google',
            'blog-title': 'Blog',
            'blog-subtitle': 'Discover the tradition and culture of Mexican confectionery',
            'distributor-title': 'Want to be a distributor?',
            'distributor-text': 'Ask about the Panza Verde Distributor Program',
            'distributor-contact': 'Contact us at +5526627851 for more information:',
            'whatsapp-contact': 'Write us on WhatsApp'
        }
    };

    function initLanguageToggle() {
        const langToggle = document.getElementById('language-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguage);
            updateLanguage(currentLanguage);
        }
    }

    function toggleLanguage() {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        localStorage.setItem('language', currentLanguage);
        updateLanguage(currentLanguage);
    }

    function updateLanguage(lang) {
        currentLanguage = lang;
        const currentLangSpan = document.getElementById('current-lang');
        if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    }

    // Blog functionality
    function subscribeToBlogPosts() {
        try {
            const blogRef = collection(db, "blogPosts");
            onSnapshot(
                blogRef,
                (snapshot) => {
                    if (snapshot.empty) {
                        // Show default posts if collection is empty
                        renderDefaultBlogPosts();
                    } else {
                        const posts = snapshot.docs.map((docSnap) => {
                            const data = docSnap.data();
                            return {
                                id: docSnap.id,
                                title: data.title || "",
                                content: data.content || "",
                                excerpt: data.excerpt || "",
                                author: data.author || "Panza Verde",
                                date: data.date || data.createdAt || data.createdAt?.toDate?.() || new Date(),
                                image: data.image || "https://i.imgur.com/8zf86ss.png",
                                category: data.category || "Dulcería Mexicana",
                                published: data.published !== false
                            };
                        }).filter(post => post.published); // Only show published posts
                        renderBlogPosts(posts);
                    }
                },
                (error) => {
                    console.error("Error al escuchar blog posts", error);
                    // Show default posts on error (permission errors are expected for unauthenticated users)
                    renderDefaultBlogPosts();
                }
            );
        } catch (error) {
            console.error("Error de Firebase en blog", error);
            renderDefaultBlogPosts();
        }
    }

    async function createInitialBlogPosts() {
        const initialPosts = [
            {
                title: "La Tradición de la Dulcería Mexicana: Un Legado de Sabores",
                excerpt: "Descubre cómo la dulcería mexicana ha evolucionado desde las recetas prehispánicas hasta convertirse en un arte culinario reconocido mundialmente.",
                content: `<p>La dulcería mexicana es mucho más que simples golosinas; es un patrimonio cultural que refleja la rica historia de México. Desde los tiempos prehispánicos, cuando se utilizaban ingredientes como el cacao, el amaranto y la miel de abeja, hasta la llegada de los españoles que introdujeron el azúcar y nuevas técnicas, la dulcería mexicana ha evolucionado creando sabores únicos e inigualables.</p>
                <p>En Panza Verde, honramos esta tradición utilizando ingredientes naturales y recetas familiares que han pasado de generación en generación. Cada producto que ofrecemos cuenta una historia, desde las gomitas artesanales hasta los guayabates tradicionales.</p>
                <p>Los dulces mexicanos no solo endulzan el paladar, sino que también conectan a las personas con sus raíces, evocando recuerdos de la infancia y celebraciones familiares. Es por eso que cada bocado de nuestros productos es una experiencia que trasciende el simple sabor.</p>`,
                category: "Tradición",
                image: "https://i.imgur.com/8zf86ss.png"
            },
            {
                title: "Ingredientes Naturales: El Corazón de Nuestros Productos",
                excerpt: "Conoce por qué elegimos ingredientes 100% naturales y cómo esto impacta no solo el sabor, sino también tu salud y el medio ambiente.",
                content: `<p>En Panza Verde, creemos firmemente que la calidad comienza con los ingredientes. Por eso, todos nuestros productos están elaborados con ingredientes 100% naturales, sin conservadores artificiales ni colorantes sintéticos.</p>
                <p>Utilizamos frutas frescas, nueces de la más alta calidad, chocolate artesanal y especias naturales. Esto no solo garantiza un sabor auténtico, sino que también asegura que nuestros productos sean más saludables y respetuosos con el medio ambiente.</p>
                <p>Desde las almendras cubiertas de cocoa hasta los mangos enchilados, cada ingrediente es cuidadosamente seleccionado para ofrecerte lo mejor de la naturaleza en cada bocado.</p>`,
                category: "Ingredientes",
                image: "https://i.imgur.com/8zf86ss.png"
            },
            {
                title: "Snacks Picositos: La Combinación Perfecta de Dulce y Picante",
                excerpt: "Explora la fascinante tradición mexicana de combinar sabores dulces con picantes, creando una experiencia sensorial única que despierta todos los sentidos.",
                content: `<p>Una de las características más distintivas de la gastronomía mexicana es la combinación de sabores dulces y picantes. Esta tradición se refleja perfectamente en nuestros snacks picositos, donde el chile se convierte en el complemento perfecto para frutas y dulces.</p>
                <p>Productos como los mangos enchilados, las gomitas con chile y los arándanos enchilados son ejemplos perfectos de cómo los mexicanos han perfeccionado el arte de equilibrar sabores. El picante no enmascara el dulce, sino que lo realza, creando una experiencia sensorial única.</p>
                <p>Esta combinación no es casual; tiene raíces profundas en la cultura mexicana, donde el chile ha sido un ingrediente fundamental desde tiempos prehispánicos. En Panza Verde, respetamos esta tradición mientras innovamos con nuevos sabores y texturas.</p>`,
                category: "Sabores",
                image: "https://i.imgur.com/8zf86ss.png"
            }
        ];

        try {
            for (const post of initialPosts) {
                await addDoc(collection(db, "blogPosts"), {
                    ...post,
                    createdAt: serverTimestamp(),
                    published: true
                });
            }
        } catch (error) {
            console.error("Error creating initial blog posts", error);
            renderDefaultBlogPosts();
        }
    }

    function renderDefaultBlogPosts() {
        const defaultPosts = [
            {
                id: 'default-1',
                title: "La Tradición de la Dulcería Mexicana: Un Legado de Sabores",
                excerpt: "Descubre cómo la dulcería mexicana ha evolucionado desde las recetas prehispánicas hasta convertirse en un arte culinario reconocido mundialmente.",
                author: "Panza Verde",
                date: new Date(),
                category: "Tradición",
                image: "https://i.imgur.com/8zf86ss.png"
            },
            {
                id: 'default-2',
                title: "Ingredientes Naturales: El Corazón de Nuestros Productos",
                excerpt: "Conoce por qué elegimos ingredientes 100% naturales y cómo esto impacta no solo el sabor, sino también tu salud y el medio ambiente.",
                author: "Panza Verde",
                date: new Date(),
                category: "Ingredientes",
                image: "https://i.imgur.com/8zf86ss.png"
            },
            {
                id: 'default-3',
                title: "Snacks Picositos: La Combinación Perfecta de Dulce y Picante",
                excerpt: "Explora la fascinante tradición mexicana de combinar sabores dulces con picantes, creando una experiencia sensorial única que despierta todos los sentidos.",
                author: "Panza Verde",
                date: new Date(),
                category: "Sabores",
                image: "https://i.imgur.com/8zf86ss.png"
            }
        ];
        renderBlogPosts(defaultPosts);
    }

    function renderBlogPosts(posts) {
        const blogContainer = document.getElementById("blog-posts");
        if (!blogContainer) return;

        if (!posts || posts.length === 0) {
            blogContainer.innerHTML = '<p class="empty-state">No hay artículos del blog aún.</p>';
            return;
        }

        blogContainer.innerHTML = posts.slice(0, 3).map(post => {
            const date = post.date instanceof Date ? post.date : (post.date?.toDate?.() || new Date());
            const lang = currentLanguage || 'es';
            const formattedDate = date.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return `
                <article class="blog-post-card">
                    <div class="blog-post-image">
                        <img src="${post.image}" alt="${post.title}">
                        <span class="blog-post-category">${post.category}</span>
                    </div>
                    <div class="blog-post-content">
                        <h3>${post.title}</h3>
                        <p class="blog-post-excerpt">${post.excerpt}</p>
                        <div class="blog-post-meta">
                            <span class="blog-post-author"><i class="fas fa-user"></i> ${post.author}</span>
                            <span class="blog-post-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        </div>
                        <button class="blog-read-more" onclick="openBlogPost('${post.id}')">
                            ${(currentLanguage || 'es') === 'es' ? 'Leer más' : 'Read more'}
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    }

    function openBlogPost(postId) {
        // This will be implemented to show full blog post
        console.log("Opening blog post:", postId);
    }

    window.toggleLanguage = toggleLanguage;
    window.openBlogPost = openBlogPost;

    async function loadOrderHistory(userId) {
        try {
            const ordersRef = collection(db, "orders");
            let q;
            try {
                q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
            } catch (e) {
                // If orderBy fails (no index), just filter by userId
                q = query(ordersRef, where("userId", "==", userId));
            }
            const querySnapshot = await getDocs(q);
            
            const orders = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                orders.push({
                    id: docSnap.id,
                    ...data,
                    cart: JSON.parse(data.cart || "[]")
                });
            });
            
            // Sort by timestamp if orderBy didn't work
            orders.sort((a, b) => {
                const timeA = a.timestamp || a.createdAt?.toDate?.() || new Date(0);
                const timeB = b.timestamp || b.createdAt?.toDate?.() || new Date(0);
                return timeB - timeA;
            });
            
            renderOrderHistory(orders);
        } catch (error) {
            console.error("Error loading order history:", error);
            // Show empty state on error
            renderOrderHistory([]);
        }
    }

    function renderOrderHistory(orders) {
        const pedidosSection = document.getElementById("pedidos-section");
        if (!pedidosSection) return;
        
        if (orders.length === 0) {
            pedidosSection.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Aún no tienes pedidos. ¡Empieza a comprar!</p>
                    <button class="btn-primary" onclick="document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' })">
                        Ver catálogo
                    </button>
                </div>
            `;
            return;
        }
        
        pedidosSection.innerHTML = `
            <div class="orders-list">
                ${orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3>Pedido #${order.orderNumber}</h3>
                                <p class="order-date">${order.timestamp}</p>
                            </div>
                            <span class="order-status order-status-${order.status || 'pendiente'}">
                                ${order.status || 'Pendiente'}
                            </span>
                        </div>
                        <div class="order-items">
                            ${order.cart.map(item => `
                                <div class="order-item">
                                    <span>${item.name} x${item.quantity}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join("")}
                        </div>
                        <div class="order-footer">
                            <div class="order-total">
                                <strong>Total: $${order.total}</strong>
                            </div>
                            <div class="order-payment">
                                <i class="fas fa-credit-card"></i> ${order.paymentMethod}
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }
});


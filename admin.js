import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
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
    getDocs,
    query,
    where
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
const db = getFirestore(app);

const adminCredentials = {
    email: "erandi@panzaverde.store"
};

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

let products = [];
let categories = [];
let orders = [];
let blogPosts = [];
let users = [];
let editingProductId = null;
let editingCategoryId = null;
let editingBlogId = null;
let isAdminAuthenticated = false;

const dom = {
    loginScreen: document.getElementById("admin-login-screen"),
    dashboardScreen: document.getElementById("admin-dashboard-screen"),
    loginForm: document.getElementById("admin-login-form"),
    logoutBtn: document.getElementById("admin-logout-btn"),
    welcomeText: document.getElementById("admin-welcome-text"),
    productForm: document.getElementById("product-form"),
    productFormContainer: document.getElementById("product-form-container"),
    clearProductFormBtn: document.getElementById("clear-product-form"),
    seedCatalogBtn: document.getElementById("seed-catalog-btn"),
    newProductBtn: document.getElementById("new-product-btn"),
    adminProductList: document.getElementById("admin-product-list"),
    adminSearch: document.getElementById("admin-search"),
    toast: document.getElementById("toast"),
    statTotalProducts: document.getElementById("stat-total-products"),
    statFeaturedProducts: document.getElementById("stat-featured-products"),
    statCategories: document.getElementById("stat-categories"),
    statTotalValue: document.getElementById("stat-total-value"),
    productName: document.getElementById("product-name"),
    productPrice: document.getElementById("product-price"),
    productCategory: document.getElementById("product-category"),
    productImage: document.getElementById("product-image"),
    productDescription: document.getElementById("product-description"),
    productFeatured: document.getElementById("product-featured"),
    categoryForm: document.getElementById("category-form"),
    categoryFormContainer: document.getElementById("category-form-container"),
    newCategoryBtn: document.getElementById("new-category-btn"),
    cancelCategoryFormBtn: document.getElementById("cancel-category-form"),
    categoryName: document.getElementById("category-name"),
    adminCategoriesList: document.getElementById("admin-categories-list"),
    orderForm: document.getElementById("order-form"),
    orderFormContainer: document.getElementById("order-form-container"),
    newOrderBtn: document.getElementById("new-order-btn"),
    cancelOrderFormBtn: document.getElementById("cancel-order-form"),
    adminOrderSearch: document.getElementById("admin-order-search"),
    statTotalOrders: document.getElementById("stat-total-orders"),
    statTotalRevenue: document.getElementById("stat-total-revenue"),
    blogForm: document.getElementById("blog-form"),
    blogFormContainer: document.getElementById("blog-form-container"),
    newBlogBtn: document.getElementById("new-blog-btn"),
    cancelBlogFormBtn: document.getElementById("cancel-blog-form"),
    blogTitle: document.getElementById("blog-title"),
    blogExcerpt: document.getElementById("blog-excerpt"),
    blogContent: document.getElementById("blog-content"),
    blogCategory: document.getElementById("blog-category"),
    blogImage: document.getElementById("blog-image"),
    blogAuthor: document.getElementById("blog-author"),
    adminBlogList: document.getElementById("admin-blog-list"),
    adminUsersList: document.getElementById("admin-users-list"),
    userForm: document.getElementById("user-form"),
    userFormContainer: document.getElementById("user-form-container"),
    newUserBtn: document.getElementById("new-user-btn"),
    cancelUserFormBtn: document.getElementById("cancel-user-form"),
    userEmail: document.getElementById("user-email"),
    userName: document.getElementById("user-name"),
    userPassword: document.getElementById("user-password")
};

function init() {
    // Ensure dashboard is hidden on initial load
    if (dom.dashboardScreen) {
        dom.dashboardScreen.setAttribute("hidden", "true");
        dom.dashboardScreen.style.display = "none";
    }
    // Ensure login screen is visible on initial load
    if (dom.loginScreen) {
        dom.loginScreen.classList.remove("hidden");
        dom.loginScreen.style.display = "flex";
    }
    
    checkAuthState();
    registerListeners();
    // Data subscriptions are now handled in checkAuthState() after authentication
}

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user && user.email === adminCredentials.email) {
            isAdminAuthenticated = true;
            showDashboard();
            updateWelcomeText(user);
            // Subscribe to data only when authenticated
            subscribeToProducts();
            subscribeToCategories();
            subscribeToOrders();
            subscribeToBlogPosts();
            subscribeToUsers();
        } else {
            isAdminAuthenticated = false;
            showLogin();
            // Clear data subscriptions when logged out
            products = [];
            categories = [];
            orders = [];
            if (dom.adminProductList) dom.adminProductList.innerHTML = '';
            if (dom.adminCategoriesList) dom.adminCategoriesList.innerHTML = '';
            if (dom.adminOrdersList) dom.adminOrdersList.innerHTML = '';
            if (dom.adminBuyersList) dom.adminBuyersList.innerHTML = '';
        }
    });
}

function registerListeners() {
    dom.loginForm?.addEventListener("submit", handleAdminLogin);
    dom.logoutBtn?.addEventListener("click", handleAdminLogout);
    dom.productForm?.addEventListener("submit", handleProductFormSubmit);
    dom.clearProductFormBtn?.addEventListener("click", clearProductForm);
    dom.seedCatalogBtn?.addEventListener("click", seedCatalog);
    dom.newProductBtn?.addEventListener("click", () => {
        clearProductForm();
        dom.productFormContainer?.scrollIntoView({ behavior: "smooth" });
    });
    dom.adminSearch?.addEventListener("input", (e) => {
        filterProducts(e.target.value);
    });
    dom.newCategoryBtn?.addEventListener("click", () => {
        clearCategoryForm();
        dom.categoryFormContainer.style.display = "block";
        dom.categoryFormContainer.scrollIntoView({ behavior: "smooth" });
    });
    dom.cancelCategoryFormBtn?.addEventListener("click", () => {
        clearCategoryForm();
        dom.categoryFormContainer.style.display = "none";
    });
    dom.categoryForm?.addEventListener("submit", handleCategoryFormSubmit);
    dom.newOrderBtn?.addEventListener("click", () => {
        clearOrderForm();
        populateOrderProductSelects();
        dom.orderFormContainer.style.display = "block";
        dom.orderFormContainer.scrollIntoView({ behavior: "smooth" });
    });
    dom.cancelOrderFormBtn?.addEventListener("click", () => {
        clearOrderForm();
        dom.orderFormContainer.style.display = "none";
    });
    dom.orderForm?.addEventListener("submit", handleOrderFormSubmit);
    dom.adminOrderSearch?.addEventListener("input", (e) => {
        filterOrders(e.target.value);
    });

    dom.adminProductList?.addEventListener("click", (event) => {
        const row = event.target.closest(".admin-product-row");
        if (!row) return;
        const productId = row.dataset.productId;
        if (event.target.closest(".edit")) {
            startEditProduct(productId);
        } else if (event.target.closest(".delete")) {
            deleteProduct(productId);
        }
    });

    // Blog listeners
    dom.newBlogBtn?.addEventListener("click", () => {
        clearBlogForm();
        dom.blogFormContainer.style.display = "block";
        dom.blogFormContainer.scrollIntoView({ behavior: "smooth" });
    });
    dom.cancelBlogFormBtn?.addEventListener("click", () => {
        clearBlogForm();
        dom.blogFormContainer.style.display = "none";
    });
    dom.blogForm?.addEventListener("submit", handleBlogFormSubmit);

    dom.adminBlogList?.addEventListener("click", (event) => {
        const row = event.target.closest(".admin-blog-row");
        if (!row) return;
        const blogId = row.dataset.blogId;
        if (event.target.closest(".edit")) {
            startEditBlog(blogId);
        } else if (event.target.closest(".delete")) {
            deleteBlog(blogId);
        }
    });

    // Chatbot management
    const refreshChatbotStatsBtn = document.getElementById("refresh-chatbot-stats");
    if (refreshChatbotStatsBtn) {
        refreshChatbotStatsBtn.addEventListener("click", loadChatbotData);
    }

    // Chatbot training form
    const chatbotTrainingForm = document.getElementById("chatbot-training-form");
    if (chatbotTrainingForm) {
        chatbotTrainingForm.addEventListener("submit", handleChatbotTraining);
    }

    // Initialize admin chatbot
    initAdminChatbot();

    // User management
    dom.newUserBtn?.addEventListener("click", () => {
        clearUserForm();
        dom.userFormContainer.style.display = "block";
        dom.userFormContainer.scrollIntoView({ behavior: "smooth" });
    });
    dom.cancelUserFormBtn?.addEventListener("click", () => {
        clearUserForm();
        dom.userFormContainer.style.display = "none";
    });
    dom.userForm?.addEventListener("submit", handleUserFormSubmit);

    // Order delete functionality
    const adminOrdersList = document.getElementById("admin-orders-list");
    if (adminOrdersList) {
        adminOrdersList.addEventListener("click", (event) => {
            if (event.target.closest(".delete-order")) {
                const orderId = event.target.closest(".admin-order-card")?.dataset.orderId;
                if (orderId) {
                    deleteOrder(orderId);
                }
            }
        });
    }

    // User delete functionality
    const adminUsersList = document.getElementById("admin-users-list");
    if (adminUsersList) {
        adminUsersList.addEventListener("click", (event) => {
            if (event.target.closest(".delete-user")) {
                const userId = event.target.closest(".admin-user-card")?.dataset.userId;
                if (userId) {
                    deleteUserAccount(userId);
                }
            }
        });
    }
}

// Chatbot Management Functions
async function loadChatbotData() {
    try {
        const [messagesSnapshot, conversationsSnapshot] = await Promise.all([
            getDocs(collection(db, 'chatbot_messages')),
            getDocs(collection(db, 'chatbot_conversations'))
        ]);

        const messages = [];
        const conversations = [];
        const uniqueUsers = new Set();

        messagesSnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({ id: doc.id, ...data });
            if (data.userId) uniqueUsers.add(data.userId);
        });

        conversationsSnapshot.forEach((doc) => {
            conversations.push({ id: doc.id, ...doc.data() });
        });

        // Update stats
        document.getElementById('chatbot-total-messages').textContent = messages.length;
        document.getElementById('chatbot-total-users').textContent = uniqueUsers.size;
        document.getElementById('chatbot-total-conversations').textContent = conversations.length;

        // Render recent conversations
        renderChatbotConversations(conversations.slice(0, 20));

    } catch (error) {
        console.error('Error loading chatbot data:', error);
        showToast('Error al cargar datos del chatbot', 'error');
    }
}

function renderChatbotConversations(conversations) {
    const container = document.getElementById('admin-chatbot-conversations');
    if (!container) return;

    if (conversations.length === 0) {
        container.innerHTML = '<div class="admin-hint">No hay conversaciones aún</div>';
        return;
    }

    container.innerHTML = conversations.map(conv => {
        const timestamp = conv.timestamp?.toDate ? conv.timestamp.toDate() : new Date();
        const dateStr = timestamp.toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const userMsg = conv.messages?.find(m => m.role === 'user')?.content || 'Sin mensaje';
        const botMsg = conv.messages?.find(m => m.role === 'assistant')?.content || 'Sin respuesta';

        return `
            <div class="admin-order-card">
                <div class="admin-order-header">
                    <div>
                        <h4>Usuario: ${conv.userId?.substring(0, 20) || 'Desconocido'}...</h4>
                        <p class="admin-order-info">
                            <i class="fas fa-calendar"></i> ${dateStr}
                            <span style="margin-left: 1rem;">
                                <i class="fas fa-box"></i> ${conv.productCount || 0} productos disponibles
                            </span>
                        </p>
                    </div>
                </div>
                <div class="admin-order-items">
                    <div class="admin-order-item">
                        <strong>Usuario:</strong>
                        <span>${userMsg.substring(0, 100)}${userMsg.length > 100 ? '...' : ''}</span>
                    </div>
                    <div class="admin-order-item">
                        <strong>Chatbot:</strong>
                        <span>${botMsg.substring(0, 100)}${botMsg.length > 100 ? '...' : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function handleChatbotTraining(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para entrenar el chatbot.", "warning");
        return;
    }

    const formData = new FormData(event.target);
    const prompt = formData.get("prompt").trim();
    const response = formData.get("response").trim();

    if (!prompt || !response) {
        showToast("Completa todos los campos.", "warning");
        return;
    }

    const submitBtn = document.getElementById("training-form-submit");
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        // Save training data to Firestore
        await addDoc(collection(db, "chatbot_training"), {
            prompt: prompt,
            response: response,
            createdAt: serverTimestamp(),
            createdBy: "admin"
        });
        showToast("Entrenamiento guardado correctamente. El chatbot aprenderá de esta información.", "success");
        event.target.reset();
    } catch (error) {
        console.error("Error al guardar entrenamiento", error);
        showToast("No pudimos guardar el entrenamiento.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || '<i class="fas fa-save"></i> Guardar entrenamiento';
        }
    }
}

function initAdminChatbot() {
    // Initialize admin chatbot widget
    const toggle = document.getElementById('admin-chatbot-toggle');
    const close = document.getElementById('admin-chatbot-close');
    const send = document.getElementById('admin-chatbot-send');
    const input = document.getElementById('admin-chatbot-input');
    const window = document.getElementById('admin-chatbot-window');

    if (!toggle || !window) return;

    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            window.classList.add('open');
            if (input) setTimeout(() => input.focus(), 100);
        } else {
            window.classList.remove('open');
        }
        toggle.classList.toggle('active', isOpen);
    });

    if (close) {
        close.addEventListener('click', () => {
            isOpen = false;
            window.classList.remove('open');
            toggle.classList.remove('active');
        });
    }

    if (send && input) {
        const sendMessage = async () => {
            const message = input.value.trim();
            if (!message) return;

            const messagesContainer = document.getElementById('admin-chatbot-messages');
            if (!messagesContainer) return;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'chatbot-message user-message';
            userMsg.innerHTML = `<div class="message-content"><p>${message}</p></div>`;
            messagesContainer.appendChild(userMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            input.value = '';
            input.disabled = true;
            send.disabled = true;

            // Show typing indicator
            const typing = document.createElement('div');
            typing.className = 'chatbot-message bot-message typing-indicator';
            typing.innerHTML = '<div class="message-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
            messagesContainer.appendChild(typing);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                // Call chatbot API with admin context
                const response = await fetch(`${window.location.origin}/api/chatbot`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        conversationHistory: [],
                        products: products,
                        userId: 'admin',
                        sessionId: 'admin-session',
                        isAdmin: true
                    })
                });

                typing.remove();

                if (!response.ok) {
                    throw new Error('API error');
                }

                const data = await response.json();
                const aiResponse = data.response || 'Lo siento, no pude procesar tu mensaje.';

                const botMsg = document.createElement('div');
                botMsg.className = 'chatbot-message bot-message';
                botMsg.innerHTML = `<div class="message-content"><p>${aiResponse}</p></div>`;
                messagesContainer.appendChild(botMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                typing.remove();
                const errorMsg = document.createElement('div');
                errorMsg.className = 'chatbot-message bot-message';
                errorMsg.innerHTML = '<div class="message-content"><p>Lo siento, hubo un error. Por favor intenta de nuevo.</p></div>';
                messagesContainer.appendChild(errorMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } finally {
                input.disabled = false;
                send.disabled = false;
                if (input) setTimeout(() => input.focus(), 100);
            }
        };

        send.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();

    const loginBtn = event.target.querySelector("button[type='submit']");
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.email === adminCredentials.email) {
                isAdminAuthenticated = true;
                showDashboard();
                updateWelcomeText(user);
                event.target.reset();
                showToast("Sesión iniciada correctamente.", "success");
            } else {
                signOut(auth);
                showToast("Acceso denegado. Solo administradores autorizados.", "error");
            }
        })
        .catch((error) => {
            showToast(parseFirebaseError(error), "error");
        })
        .finally(() => {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        });
}

function handleAdminLogout() {
    signOut(auth)
        .then(() => {
            isAdminAuthenticated = false;
            showLogin();
            showToast("Sesión cerrada correctamente.", "info");
        })
        .catch((error) => {
            showToast("Error al cerrar sesión.", "error");
        });
}

function showLogin() {
    // Show login screen
    if (dom.loginScreen) {
        dom.loginScreen.classList.remove("hidden");
        dom.loginScreen.style.display = "flex";
    }
    // Hide dashboard screen completely
    if (dom.dashboardScreen) {
        dom.dashboardScreen.setAttribute("hidden", "true");
        dom.dashboardScreen.style.display = "none";
    }
    // Hide stats when logged out
    const statsSection = document.getElementById("admin-stats-section");
    if (statsSection) statsSection.style.display = "none";
}

function showDashboard() {
    // Hide login screen
    if (dom.loginScreen) {
        dom.loginScreen.classList.add("hidden");
        dom.loginScreen.style.display = "none";
    }
    // Show dashboard screen
    if (dom.dashboardScreen) {
        dom.dashboardScreen.removeAttribute("hidden");
        dom.dashboardScreen.style.display = "flex";
    }
    // Show stats when logged in
    const statsSection = document.getElementById("admin-stats-section");
    if (statsSection) statsSection.style.display = "grid";
}

function updateWelcomeText(user) {
    if (dom.welcomeText) {
        dom.welcomeText.textContent = `Bienvenida, Erandi`;
    }
}

function subscribeToCategories() {
    try {
        const categoriesRef = collection(db, "categories");
        onSnapshot(
            categoriesRef,
            (snapshot) => {
                if (snapshot.empty) {
                    // Initialize with default categories if none exist
                    const defaultCategories = ["Dulces", "Dulces picositos", "Botanas", "Otros"];
                    categories = defaultCategories.map(name => ({ name, id: name }));
                    updateCategoryDropdown();
                    renderCategoriesList();
                } else {
                    categories = snapshot.docs.map((docSnap) => {
                        const data = docSnap.data();
                        return {
                            id: docSnap.id,
                            name: data.name || "Sin nombre"
                        };
                    });
                    updateCategoryDropdown();
                    renderCategoriesList();
                }
            },
            (error) => {
                console.error("Error al escuchar categorías", error);
                // Fallback to default categories
                categories = ["Dulces", "Dulces picositos", "Botanas", "Otros"].map(name => ({ name, id: name }));
                updateCategoryDropdown();
            }
        );
    } catch (error) {
        console.error("Error de Firebase en categorías", error);
        categories = ["Dulces", "Dulces picositos", "Botanas", "Otros"].map(name => ({ name, id: name }));
        updateCategoryDropdown();
    }
}

function updateCategoryDropdown() {
    if (!dom.productCategory) return;
    const currentValue = dom.productCategory.value;
    dom.productCategory.innerHTML = categories.map(cat => 
        `<option value="${cat.name}">${cat.name}</option>`
    ).join("");
    if (currentValue && categories.some(cat => cat.name === currentValue)) {
        dom.productCategory.value = currentValue;
    }
}

function renderCategoriesList() {
    if (!dom.adminCategoriesList) return;
    
    if (categories.length === 0) {
        dom.adminCategoriesList.innerHTML = '<p class="admin-hint">No hay categorías. Crea una nueva categoría para comenzar.</p>';
        return;
    }
    
    dom.adminCategoriesList.innerHTML = `
        <div class="admin-categories-grid">
            ${categories.map(category => `
                <div class="admin-category-card">
                    <div class="admin-category-info">
                        <h4>${category.name}</h4>
                        <p>${products.filter(p => p.category === category.name).length} producto(s)</p>
                    </div>
                    <div class="admin-category-actions">
                        <button class="admin-action-btn delete" onclick="deleteCategory('${category.id}', '${category.name}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

async function handleCategoryFormSubmit(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para crear categorías.", "warning");
        return;
    }
    
    const formData = new FormData(event.target);
    const categoryName = formData.get("name").trim();
    
    if (!categoryName) {
        showToast("El nombre de la categoría es requerido.", "warning");
        return;
    }
    
    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
        showToast("Esta categoría ya existe.", "warning");
        return;
    }
    
    const submitBtn = document.getElementById("category-form-submit");
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }
    
    try {
        await addDoc(collection(db, "categories"), {
            name: categoryName,
            createdAt: serverTimestamp()
        });
        showToast("Categoría creada correctamente.", "success");
        clearCategoryForm();
        dom.categoryFormContainer.style.display = "none";
    } catch (error) {
        console.error("Error al guardar categoría", error);
        showToast("No pudimos guardar la categoría. Revisa la consola o tus reglas de Firebase.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || '<i class="fas fa-save"></i> Guardar categoría';
        }
    }
}

async function deleteCategory(categoryId, categoryName) {
    if (!isAdminAuthenticated) {
        showToast("No autorizado.", "error");
        return;
    }
    
    // Check if category is being used
    const productsUsingCategory = products.filter(p => p.category === categoryName);
    if (productsUsingCategory.length > 0) {
        showToast(`No se puede eliminar. ${productsUsingCategory.length} producto(s) usan esta categoría.`, "warning");
        return;
    }
    
    if (!confirm(`¿Eliminar la categoría "${categoryName}"?`)) return;
    
    try {
        // Only delete if it's in Firebase (has a real ID, not a default one)
        if (!categoryId.startsWith("seed-") && categoryId !== categoryName) {
            await deleteDoc(doc(db, "categories", categoryId));
        }
        showToast("Categoría eliminada correctamente.", "success");
    } catch (error) {
        console.error("Error al eliminar categoría", error);
        showToast("No pudimos eliminar la categoría.", "error");
    }
}

function clearCategoryForm() {
    if (!dom.categoryForm) return;
    dom.categoryForm.reset();
    editingCategoryId = null;
}

function subscribeToProducts() {
    try {
        const productsRef = collection(db, "products");
        onSnapshot(
            productsRef,
            (snapshot) => {
                if (snapshot.empty) {
                    products = [];
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
                updateStats();
                renderProductList();
                if (dom.adminCategoriesList) {
                    renderCategoriesList();
                }
                // Update order form product selects if form is visible
                if (dom.orderFormContainer && dom.orderFormContainer.style.display !== "none") {
                    populateOrderProductSelects();
                }
            },
            (error) => {
                console.error("Error al escuchar productos", error);
                showToast("Error al sincronizar con Firebase.", "error");
            }
        );
    } catch (error) {
        console.error("Error de Firebase", error);
        showToast("Firebase no está configurado correctamente.", "error");
    }
}

function updateStats() {
    const totalProducts = products.length;
    const featuredProducts = products.filter(p => p.featured).length;
    const categoriesCount = new Set(products.map(p => p.category)).size;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    if (dom.statTotalProducts) dom.statTotalProducts.textContent = totalProducts;
    if (dom.statFeaturedProducts) dom.statFeaturedProducts.textContent = featuredProducts;
    if (dom.statCategories) dom.statCategories.textContent = categoriesCount;
    if (dom.statTotalValue) dom.statTotalValue.textContent = `$${totalValue.toFixed(2)}`;
    if (dom.statTotalOrders) dom.statTotalOrders.textContent = totalOrders;
    if (dom.statTotalRevenue) dom.statTotalRevenue.textContent = `$${totalRevenue.toFixed(2)}`;
}

function renderProductList(searchQuery = "") {
    if (!dom.adminProductList) return;

    let filteredProducts = products;
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    if (filteredProducts.length === 0) {
        dom.adminProductList.innerHTML = '<p class="admin-hint">No hay productos para mostrar.</p>';
        return;
    }

    const markup = filteredProducts.map((product) => `
        <article class="admin-product-row" data-product-id="${product.id ?? ""}">
            <div class="admin-product-details">
                <img src="${product.img || defaultImage}" alt="${product.name}">
                <div class="admin-product-info">
                    <h4>${product.name}${product.featured ? '<span class="admin-product-badge badge-featured"><i class="fas fa-star"></i> Destacado</span>' : ""}</h4>
                    <p>
                        <i class="fas fa-tag"></i> ${product.category}
                        <span style="margin: 0 0.5rem;">•</span>
                        <i class="fas fa-dollar-sign"></i> $${Number(product.price).toFixed(2)}
                    </p>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="admin-action-btn edit" title="Editar">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="admin-action-btn delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </article>
    `).join("");

    dom.adminProductList.innerHTML = markup;
}

function filterProducts(query) {
    renderProductList(query);
}

function startEditProduct(productId) {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para editar.", "warning");
        return;
    }

    const product = products.find((item) => item.id === productId);
    if (!product || !dom.productForm) {
        showToast("No encontramos el producto seleccionado.", "error");
        return;
    }

    editingProductId = productId;
    if (dom.productName) dom.productName.value = product.name;
    if (dom.productPrice) dom.productPrice.value = product.price;
    if (dom.productCategory) dom.productCategory.value = product.category;
    if (dom.productImage) dom.productImage.value = product.img || "";
    if (dom.productDescription) dom.productDescription.value = product.includes || "";
    if (dom.productFeatured) dom.productFeatured.checked = !!product.featured;

    const submitBtn = document.getElementById("product-form-submit");
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar producto';
    }

    dom.productFormContainer?.scrollIntoView({ behavior: "smooth" });
}

async function deleteProduct(productId) {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para eliminar.", "warning");
        return;
    }

    if (!productId || productId.startsWith("seed-")) {
        showToast("Sincroniza el producto con Firebase antes de eliminarlo.", "info");
        return;
    }

    if (!confirm("¿Eliminar este producto del catálogo?")) return;

    try {
        await deleteDoc(doc(db, "products", productId));
        showToast("Producto eliminado correctamente.", "success");
        if (editingProductId === productId) {
            clearProductForm();
        }
    } catch (error) {
        console.error("Error al eliminar producto", error);
        showToast("No pudimos eliminar el producto. Verifica permisos en Firebase.", "error");
    }
}

async function handleProductFormSubmit(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para crear productos.", "warning");
        return;
    }

    const formData = new FormData(event.target);
    const productData = {
        name: formData.get("name").trim(),
        price: Number(formData.get("price")),
        category: formData.get("category"),
        img: (formData.get("img") || "").trim() || defaultImage,
        includes: (formData.get("includes") || "").trim(),
        featured: formData.get("featured") === "on"
    };

    if (!productData.name || !productData.price) {
        showToast("Completa el nombre y el precio.", "warning");
        return;
    }

    const submitBtn = document.getElementById("product-form-submit");
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        if (editingProductId) {
            await updateDoc(doc(db, "products", editingProductId), {
                ...productData,
                updatedAt: serverTimestamp()
            });
            showToast("Producto actualizado correctamente.", "success");
        } else {
            await addDoc(collection(db, "products"), {
                ...productData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            showToast("Producto creado correctamente.", "success");
        }
        clearProductForm();
    } catch (error) {
        console.error("Error al guardar producto", error);
        showToast("No pudimos guardar el producto. Revisa la consola o tus reglas de Firebase.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || '<i class="fas fa-save"></i> Guardar producto';
        }
    }
}

function clearProductForm() {
    if (!dom.productForm) return;
    dom.productForm.reset();
    editingProductId = null;
    const submitBtn = document.getElementById("product-form-submit");
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar producto';
    }
}

async function seedCatalog() {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para importar.", "warning");
        return;
    }
    if (!dom.seedCatalogBtn) return;

    const existingNames = new Set(products.map((product) => product.name.toLowerCase()));
    const missingProducts = seedProducts.filter((product) => !existingNames.has(product.name.toLowerCase()));

    if (missingProducts.length === 0) {
        showToast("El catálogo ya incluye la base completa.", "info");
        return;
    }

    const originalLabel = dom.seedCatalogBtn.innerHTML;
    dom.seedCatalogBtn.disabled = true;
    dom.seedCatalogBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importando...';

    try {
        await Promise.all(
            missingProducts.map((product) =>
                addDoc(collection(db, "products"), {
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    img: product.img,
                    includes: product.includes,
                    featured: product.featured,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        );
        showToast(`Catálogo base importado correctamente. ${missingProducts.length} productos agregados.`, "success");
    } catch (error) {
        console.error("Error al importar catálogo", error);
        showToast("No pudimos importar el catálogo base. Verifica la configuración de Firebase.", "error");
    } finally {
        dom.seedCatalogBtn.disabled = false;
        dom.seedCatalogBtn.innerHTML = originalLabel;
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
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
        "auth/network-request-failed": "Error de conexión. Verifica tu internet."
    };
    return map[error?.code] || "No pudimos completar la acción. Inténtalo de nuevo.";
}

function subscribeToOrders() {
    try {
        const ordersRef = collection(db, "orders");
        let q;
        try {
            q = query(ordersRef, orderBy("createdAt", "desc"));
        } catch (e) {
            // If orderBy fails (no index), just get all orders
            q = ordersRef;
        }
        onSnapshot(
            q,
            (snapshot) => {
                const orders = [];
                snapshot.forEach((docSnap) => {
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
                window.allOrders = orders; // Store for filtering
                renderOrdersList(orders);
                renderBuyersList(orders);
                updateStats();
            },
            (error) => {
                console.error("Error al escuchar pedidos", error);
            }
        );
    } catch (error) {
        console.error("Error de Firebase en pedidos", error);
    }
}

function filterOrders(searchQuery) {
    if (!window.allOrders) return;
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
        renderOrdersList(window.allOrders);
        return;
    }
    const filtered = window.allOrders.filter(order => {
        const orderNum = String(order.orderNumber || order.id || "").toLowerCase();
        const userName = (order.userName || "").toLowerCase();
        const userEmail = (order.userEmail || "").toLowerCase();
        const status = (order.status || "").toLowerCase();
        return orderNum.includes(query) || userName.includes(query) || userEmail.includes(query) || status.includes(query);
    });
    renderOrdersList(filtered);
}

function renderOrdersList(ordersToRender) {
    const ordersList = document.getElementById("admin-orders-list");
    if (!ordersList) return;

    if (!ordersToRender || ordersToRender.length === 0) {
        ordersList.innerHTML = '<p class="admin-hint">No hay pedidos aún.</p>';
        return;
    }

    ordersList.innerHTML = ordersToRender.map(order => `
        <div class="admin-order-card" data-order-id="${order.id}">
            <div class="admin-order-header">
                <div>
                    <h4>Pedido #${order.orderNumber || order.id}</h4>
                    <p class="admin-order-info">
                        <i class="fas fa-user"></i> ${order.userName || order.userEmail || "Cliente"}
                        <span style="margin: 0 0.5rem;">•</span>
                        <i class="fas fa-calendar"></i> ${order.timestamp || "Fecha no disponible"}
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <select class="order-status-select" data-order-id="${order.id}" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="pendiente" ${order.status === "pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="confirmado" ${order.status === "confirmado" ? "selected" : ""}>Confirmado</option>
                        <option value="en_preparacion" ${order.status === "en_preparacion" ? "selected" : ""}>En preparación</option>
                        <option value="enviado" ${order.status === "enviado" ? "selected" : ""}>Enviado</option>
                        <option value="entregado" ${order.status === "entregado" ? "selected" : ""}>Entregado</option>
                        <option value="cancelado" ${order.status === "cancelado" ? "selected" : ""}>Cancelado</option>
                    </select>
                    <button class="admin-action-btn delete delete-order" title="Eliminar pedido">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-order-items">
                ${order.cart.map(item => `
                    <div class="admin-order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join("")}
            </div>
            <div class="admin-order-footer">
                <div class="admin-order-total">
                    <strong>Total: $${order.total}</strong>
                </div>
                <div class="admin-order-payment">
                    <i class="fas fa-credit-card"></i> ${order.paymentMethod || "No especificado"}
                </div>
                <div class="admin-order-actions">
                    <a href="mailto:${order.userEmail}" class="admin-action-link" title="Contactar cliente">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="https://wa.me/525526627851?text=Pedido%20%23${order.orderNumber}" target="_blank" class="admin-action-link" title="WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join("");
}

async function updateOrderStatus(orderId, newStatus) {
    if (!isAdminAuthenticated) {
        showToast("No autorizado.", "error");
        return;
    }

    try {
        await updateDoc(doc(db, "orders", orderId), {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
        showToast("Estado del pedido actualizado.", "success");
    } catch (error) {
        console.error("Error al actualizar pedido", error);
        showToast("No pudimos actualizar el pedido.", "error");
    }
}

async function deleteOrder(orderId) {
    if (!isAdminAuthenticated) {
        showToast("No autorizado.", "error");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        await deleteDoc(doc(db, "orders", orderId));
        showToast("Pedido eliminado correctamente.", "success");
    } catch (error) {
        console.error("Error al eliminar pedido", error);
        showToast("No pudimos eliminar el pedido.", "error");
    }
}

function renderBuyersList(orders) {
    const buyersList = document.getElementById("admin-buyers-list");
    if (!buyersList) return;

    // Get unique buyers
    const buyersMap = new Map();
    orders.forEach(order => {
        if (order.userEmail) {
            if (!buyersMap.has(order.userEmail)) {
                buyersMap.set(order.userEmail, {
                    email: order.userEmail,
                    name: order.userName || order.userEmail,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrder: order.timestamp
                });
            }
            const buyer = buyersMap.get(order.userEmail);
            buyer.totalOrders++;
            buyer.totalSpent += parseFloat(order.total || 0);
            if (order.timestamp > buyer.lastOrder) {
                buyer.lastOrder = order.timestamp;
            }
        }
    });

    const buyers = Array.from(buyersMap.values());

    if (buyers.length === 0) {
        buyersList.innerHTML = '<p class="admin-hint">No hay compradores registrados aún.</p>';
        return;
    }

    // Sort buyers by total spent (descending)
    buyers.sort((a, b) => b.totalSpent - a.totalSpent);
    
    buyersList.innerHTML = `
        <div class="admin-buyers-grid">
            ${buyers.map(buyer => {
                // Get buyer's orders
                const buyerOrders = orders.filter(o => o.userEmail === buyer.email);
                const avgOrderValue = buyer.totalOrders > 0 ? (buyer.totalSpent / buyer.totalOrders).toFixed(2) : 0;
                
                return `
                <div class="admin-buyer-card">
                    <div class="admin-buyer-header">
                        <h4>${buyer.name}</h4>
                        <a href="mailto:${buyer.email}" class="admin-buyer-email">
                            <i class="fas fa-envelope"></i> ${buyer.email}
                        </a>
                    </div>
                    <div class="admin-buyer-stats">
                        <div class="admin-buyer-stat">
                            <i class="fas fa-shopping-bag"></i>
                            <span>${buyer.totalOrders} pedido${buyer.totalOrders !== 1 ? "s" : ""}</span>
                        </div>
                        <div class="admin-buyer-stat">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${buyer.totalSpent.toFixed(2)}</span>
                        </div>
                        <div class="admin-buyer-stat">
                            <i class="fas fa-chart-line"></i>
                            <span>Promedio: $${avgOrderValue}</span>
                        </div>
                    </div>
                    <div class="admin-buyer-footer">
                        <small>Último pedido: ${buyer.lastOrder || "N/A"}</small>
                        <div class="admin-buyer-actions">
                            <a href="mailto:${buyer.email}" class="admin-action-link" title="Enviar correo">
                                <i class="fas fa-envelope"></i>
                            </a>
                            <button class="admin-action-link" onclick="viewBuyerOrders('${buyer.email}')" title="Ver pedidos">
                                <i class="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            }).join("")}
        </div>
    `;
}

function populateOrderProductSelects() {
    const selects = document.querySelectorAll(".order-product-select");
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Seleccionar producto</option>' +
            products.map(p => `<option value="${p.id}" data-price="${p.price}" data-name="${p.name}">${p.name} - $${p.price.toFixed(2)}</option>`).join("");
        if (currentValue) select.value = currentValue;
        select.addEventListener("change", calculateOrderTotal);
    });
    calculateOrderTotal();
}

function addOrderItem() {
    const container = document.getElementById("order-items-container");
    if (!container) return;
    
    const newRow = document.createElement("div");
    newRow.className = "order-item-row";
    newRow.innerHTML = `
        <select class="order-product-select" required>
            <option value="">Seleccionar producto</option>
            ${products.map(p => `<option value="${p.id}" data-price="${p.price}" data-name="${p.name}">${p.name} - $${p.price.toFixed(2)}</option>`).join("")}
        </select>
        <input type="number" class="order-quantity-input" min="1" value="1" placeholder="Cantidad" required>
        <button type="button" class="btn-remove-order-item" onclick="removeOrderItem(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newRow);
    
    const select = newRow.querySelector(".order-product-select");
    const quantityInput = newRow.querySelector(".order-quantity-input");
    select.addEventListener("change", calculateOrderTotal);
    quantityInput.addEventListener("input", calculateOrderTotal);
}

function removeOrderItem(button) {
    const container = document.getElementById("order-items-container");
    if (!container) return;
    if (container.children.length <= 1) {
        showToast("Debe haber al menos un producto en el pedido.", "warning");
        return;
    }
    button.closest(".order-item-row").remove();
    calculateOrderTotal();
}

function calculateOrderTotal() {
    const container = document.getElementById("order-items-container");
    const totalDisplay = document.getElementById("order-total-display");
    if (!container || !totalDisplay) return;
    
    let total = 0;
    const rows = container.querySelectorAll(".order-item-row");
    rows.forEach(row => {
        const select = row.querySelector(".order-product-select");
        const quantityInput = row.querySelector(".order-quantity-input");
        if (select && select.value && quantityInput) {
            const price = parseFloat(select.options[select.selectedIndex].dataset.price || 0);
            const quantity = parseInt(quantityInput.value || 0, 10);
            total += price * quantity;
        }
    });
    
    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

async function handleOrderFormSubmit(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para crear pedidos.", "warning");
        return;
    }
    
    const formData = new FormData(event.target);
    const customerName = formData.get("customerName").trim();
    const customerEmail = formData.get("customerEmail").trim();
    const paymentMethod = formData.get("paymentMethod");
    const status = formData.get("status");
    
    // Collect order items
    const container = document.getElementById("order-items-container");
    const orderItems = [];
    const rows = container.querySelectorAll(".order-item-row");
    
    for (const row of rows) {
        const select = row.querySelector(".order-product-select");
        const quantityInput = row.querySelector(".order-quantity-input");
        if (!select || !select.value || !quantityInput) continue;
        
        const productId = select.value;
        const product = products.find(p => p.id === productId);
        if (!product) continue;
        
        const quantity = parseInt(quantityInput.value || 1, 10);
        orderItems.push({
            name: product.name,
            price: product.price,
            quantity: quantity,
            img: product.img
        });
    }
    
    if (orderItems.length === 0) {
        showToast("Agrega al menos un producto al pedido.", "warning");
        return;
    }
    
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = Math.floor(Math.random() * 1000000) + 1;
    const timestamp = new Date().toLocaleString("es-MX");
    
    const submitBtn = document.getElementById("order-form-submit");
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    }
    
    try {
        const orderData = {
            orderNumber,
            timestamp,
            paymentMethod,
            cart: JSON.stringify(orderItems),
            total: total.toFixed(2),
            userEmail: customerEmail,
            userName: customerName,
            status: status || "pendiente",
            createdBy: "admin",
            createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, "orders"), orderData);
        showToast("Pedido creado correctamente.", "success");
        clearOrderForm();
        dom.orderFormContainer.style.display = "none";
    } catch (error) {
        console.error("Error al crear pedido", error);
        showToast("No pudimos crear el pedido. Revisa la consola o tus reglas de Firebase.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || '<i class="fas fa-save"></i> Crear pedido';
        }
    }
}

function clearOrderForm() {
    if (!dom.orderForm) return;
    dom.orderForm.reset();
    const container = document.getElementById("order-items-container");
    if (container) {
        container.innerHTML = `
            <div class="order-item-row">
                <select class="order-product-select" required>
                    <option value="">Seleccionar producto</option>
                </select>
                <input type="number" class="order-quantity-input" min="1" value="1" placeholder="Cantidad" required>
                <button type="button" class="btn-remove-order-item" onclick="removeOrderItem(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        populateOrderProductSelects();
    }
    const totalDisplay = document.getElementById("order-total-display");
    if (totalDisplay) totalDisplay.textContent = "$0.00";
}

function viewBuyerOrders(email) {
    if (!email || !window.allOrders) return;
    const buyerOrders = window.allOrders.filter(o => o.userEmail === email);
    if (buyerOrders.length === 0) {
        showToast("Este comprador no tiene pedidos.", "info");
        return;
    }
    // Filter orders list to show only this buyer's orders
    renderOrdersList(buyerOrders);
    showToast(`Mostrando ${buyerOrders.length} pedido(s) de este comprador.`, "info");
    // Scroll to orders section
    document.querySelector("#admin-orders-list")?.scrollIntoView({ behavior: "smooth" });
}

// Blog Management Functions
function subscribeToBlogPosts() {
    try {
        const blogRef = collection(db, "blogPosts");
        onSnapshot(
            blogRef,
            (snapshot) => {
                blogPosts = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        title: data.title || "",
                        content: data.content || "",
                        excerpt: data.excerpt || "",
                        author: data.author || "Panza Verde",
                        date: data.createdAt?.toDate?.() || new Date(),
                        image: data.image || "https://i.imgur.com/8zf86ss.png",
                        category: data.category || "Dulcería Mexicana",
                        published: data.published !== false
                    };
                });
                renderBlogList(blogPosts);
            },
            (error) => {
                console.error("Error al escuchar blog posts", error);
                showToast("Error al cargar artículos del blog", "error");
            }
        );
    } catch (error) {
        console.error("Error de Firebase en blog", error);
        showToast("Error de conexión con Firebase", "error");
    }
}

function renderBlogList(posts) {
    if (!dom.adminBlogList) return;
    
    if (!posts || posts.length === 0) {
        dom.adminBlogList.innerHTML = '<p class="empty-state">No hay artículos del blog aún. Crea uno nuevo para comenzar.</p>';
        return;
    }

    dom.adminBlogList.innerHTML = posts.map(post => {
        const date = post.date instanceof Date ? post.date : (post.date?.toDate?.() || new Date());
        const formattedDate = date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="admin-blog-row" data-blog-id="${post.id}">
                <div class="admin-blog-info">
                    <div class="admin-blog-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    <div class="admin-blog-details">
                        <h4>${post.title}</h4>
                        <p class="admin-blog-excerpt">${post.excerpt}</p>
                        <div class="admin-blog-meta">
                            <span><i class="fas fa-tag"></i> ${post.category}</span>
                            <span><i class="fas fa-user"></i> ${post.author}</span>
                            <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                            ${post.published ? '<span class="published-badge"><i class="fas fa-check"></i> Publicado</span>' : '<span class="draft-badge"><i class="fas fa-clock"></i> Borrador</span>'}
                        </div>
                    </div>
                </div>
                <div class="admin-blog-actions">
                    <button class="edit" title="Editar artículo">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete" title="Eliminar artículo">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

async function handleBlogFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const blogData = {
        title: formData.get("title").trim(),
        excerpt: formData.get("excerpt").trim(),
        content: formData.get("content").trim(),
        category: formData.get("category").trim(),
        image: formData.get("image").trim() || "https://i.imgur.com/8zf86ss.png",
        author: formData.get("author").trim() || "Panza Verde",
        published: true
    };

    if (!blogData.title || !blogData.excerpt || !blogData.content) {
        showToast("Por favor completa todos los campos requeridos", "error");
        return;
    }

    try {
        if (editingBlogId) {
            // Update existing blog post
            const blogRef = doc(db, "blogPosts", editingBlogId);
            await updateDoc(blogRef, blogData);
            showToast("Artículo actualizado exitosamente", "success");
        } else {
            // Create new blog post
            await addDoc(collection(db, "blogPosts"), {
                ...blogData,
                createdAt: serverTimestamp()
            });
            showToast("Artículo creado exitosamente", "success");
        }
        clearBlogForm();
        dom.blogFormContainer.style.display = "none";
    } catch (error) {
        console.error("Error al guardar artículo", error);
        showToast("Error al guardar el artículo", "error");
    }
}

function startEditBlog(blogId) {
    const post = blogPosts.find(p => p.id === blogId);
    if (!post) return;

    editingBlogId = blogId;
    if (dom.blogTitle) dom.blogTitle.value = post.title;
    if (dom.blogExcerpt) dom.blogExcerpt.value = post.excerpt;
    if (dom.blogContent) dom.blogContent.value = post.content;
    if (dom.blogCategory) dom.blogCategory.value = post.category;
    if (dom.blogImage) dom.blogImage.value = post.image;
    if (dom.blogAuthor) dom.blogAuthor.value = post.author;

    dom.blogFormContainer.style.display = "block";
    dom.blogFormContainer.scrollIntoView({ behavior: "smooth" });
}

async function deleteBlog(blogId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este artículo del blog?")) {
        return;
    }

    try {
        await deleteDoc(doc(db, "blogPosts", blogId));
        showToast("Artículo eliminado exitosamente", "success");
    } catch (error) {
        console.error("Error al eliminar artículo", error);
        showToast("Error al eliminar el artículo", "error");
    }
}

function clearBlogForm() {
    editingBlogId = null;
    if (dom.blogForm) dom.blogForm.reset();
    if (dom.blogAuthor) dom.blogAuthor.value = "Panza Verde";
}

// User Management Functions
async function subscribeToUsers() {
    try {
        // Get all users from Firebase Auth (we'll need to use Admin SDK for this, but for now we'll get from orders)
        // For now, we'll extract unique users from orders
        // In production, you'd want to use Firebase Admin SDK to list all users
        const ordersRef = collection(db, "orders");
        onSnapshot(
            ordersRef,
            (snapshot) => {
                const usersMap = new Map();
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    if (data.userId && data.userEmail) {
                        if (!usersMap.has(data.userId)) {
                            usersMap.set(data.userId, {
                                uid: data.userId,
                                email: data.userEmail,
                                name: data.userName || data.userEmail,
                                orderCount: 0,
                                totalSpent: 0,
                                lastOrder: data.timestamp || data.createdAt
                            });
                        }
                        const user = usersMap.get(data.userId);
                        user.orderCount++;
                        user.totalSpent += parseFloat(data.total || 0);
                        if (data.timestamp > user.lastOrder) {
                            user.lastOrder = data.timestamp;
                        }
                    }
                });
                users = Array.from(usersMap.values());
                renderUsersList();
            },
            (error) => {
                console.error("Error al escuchar usuarios", error);
            }
        );
    } catch (error) {
        console.error("Error de Firebase en usuarios", error);
    }
}

function renderUsersList() {
    const usersList = document.getElementById("admin-users-list");
    if (!usersList) return;

    if (!users || users.length === 0) {
        usersList.innerHTML = '<p class="admin-hint">No hay usuarios registrados aún.</p>';
        return;
    }

    usersList.innerHTML = `
        <div class="admin-users-grid">
            ${users.map(user => `
                <div class="admin-user-card" data-user-id="${user.uid}">
                    <div class="admin-user-header">
                        <h4>${user.name}</h4>
                        <a href="mailto:${user.email}" class="admin-user-email">
                            <i class="fas fa-envelope"></i> ${user.email}
                        </a>
                    </div>
                    <div class="admin-user-stats">
                        <div class="admin-user-stat">
                            <i class="fas fa-shopping-bag"></i>
                            <span>${user.orderCount} pedido${user.orderCount !== 1 ? "s" : ""}</span>
                        </div>
                        <div class="admin-user-stat">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${user.totalSpent.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="admin-user-footer">
                        <small>Último pedido: ${user.lastOrder || "N/A"}</small>
                        <div class="admin-user-actions">
                            <a href="mailto:${user.email}" class="admin-action-link" title="Enviar correo">
                                <i class="fas fa-envelope"></i>
                            </a>
                            <button class="admin-action-link delete-user" title="Eliminar usuario">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

async function handleUserFormSubmit(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador para crear usuarios.", "warning");
        return;
    }

    const formData = new FormData(event.target);
    const email = formData.get("email").trim();
    const name = formData.get("name").trim();
    const password = formData.get("password").trim();

    if (!email || !password) {
        showToast("El correo y la contraseña son requeridos.", "warning");
        return;
    }

    if (password.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres.", "warning");
        return;
    }

    const submitBtn = document.getElementById("user-form-submit");
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    }

    try {
        // Note: In production, you'd want to use Firebase Admin SDK to create users
        // For now, we'll show a message that users should register themselves
        showToast("Para crear usuarios, usa el panel de Firebase Console o permite que los usuarios se registren desde la tienda.", "info");
        clearUserForm();
        dom.userFormContainer.style.display = "none";
    } catch (error) {
        console.error("Error al crear usuario", error);
        showToast("No pudimos crear el usuario. " + error.message, "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || '<i class="fas fa-save"></i> Crear usuario';
        }
    }
}

async function deleteUserAccount(userId) {
    if (!isAdminAuthenticated) {
        showToast("No autorizado.", "error");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        // Note: In production, you'd want to use Firebase Admin SDK to delete users
        // For now, we'll delete all orders associated with this user
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const deletePromises = [];
        querySnapshot.forEach((docSnap) => {
            deletePromises.push(deleteDoc(doc(db, "orders", docSnap.id)));
        });

        await Promise.all(deletePromises);
        
        // Also delete user profile if it exists
        try {
            await deleteDoc(doc(db, "users", userId));
        } catch (e) {
            // User profile might not exist, that's okay
        }

        showToast("Usuario y sus pedidos eliminados correctamente.", "success");
    } catch (error) {
        console.error("Error al eliminar usuario", error);
        showToast("No pudimos eliminar el usuario. " + error.message, "error");
    }
}

function clearUserForm() {
    if (!dom.userForm) return;
    dom.userForm.reset();
}

window.updateOrderStatus = updateOrderStatus;
window.deleteCategory = deleteCategory;
window.addOrderItem = addOrderItem;
window.removeOrderItem = removeOrderItem;
window.viewBuyerOrders = viewBuyerOrders;
window.deleteOrder = deleteOrder;

// Sidebar Navigation
function initSidebarNavigation() {
    const sidebar = document.getElementById("admin-sidebar");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const navItems = document.querySelectorAll(".admin-nav-item[data-section]");
    const sidebarLogoutBtn = document.getElementById("admin-sidebar-logout-btn");

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", () => {
            if (sidebar) sidebar.classList.toggle("open");
        });
    }

    // Sidebar toggle (desktop)
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            if (sidebar) sidebar.classList.toggle("open");
        });
    }

    // Navigation item clicks
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const section = item.getAttribute("data-section");
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove("active"));
            // Add active class to clicked item
            item.classList.add("active");

            // Scroll to section
            let targetElement = null;
            if (section === "stats") {
                targetElement = document.getElementById("admin-stats-section");
            } else if (section === "products") {
                targetElement = document.getElementById("product-management");
            } else if (section === "categories") {
                targetElement = document.getElementById("category-management");
            } else if (section === "orders") {
                targetElement = document.getElementById("orders-management");
            } else if (section === "blog") {
                targetElement = document.getElementById("blog-management");
            } else if (section === "buyers") {
                targetElement = document.getElementById("buyers-management");
            } else if (section === "chatbot") {
                targetElement = document.getElementById("chatbot-management");
                loadChatbotData();
            } else if (section === "users") {
                targetElement = document.getElementById("users-management");
            }

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 1024 && sidebar) {
                sidebar.classList.remove("open");
            }
        });
    });

    // Sidebar logout button
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener("click", handleAdminLogout);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains("open")) {
            if (!sidebar.contains(e.target) && !mobileMenuToggle?.contains(e.target)) {
                sidebar.classList.remove("open");
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    init();
    initSidebarNavigation();
});


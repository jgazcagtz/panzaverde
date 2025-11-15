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
    where,
    orderBy
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
let inventory = [];
let editingProductId = null;
let editingCategoryId = null;
let editingBlogId = null;
let editingInventoryId = null;
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
            subscribeToInventory();
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

    // Create initial SEO blog posts button
    const createBlogPostsBtn = document.getElementById("create-seo-blog-posts");
    if (createBlogPostsBtn) {
        createBlogPostsBtn.addEventListener("click", createSEOBlogPosts);
    }

    // Business Manager - Inventory Management
    initInventoryManagement();
    
    // Business Manager - Analytics and Data Download
    initBusinessManagerFeatures();
    
    // Tutorial navigation
    initTutorialNavigation();

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
                const apiEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:3000/api/chatbot'
                    : `${window.location.origin}/api/chatbot`;
                
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        conversationHistory: [],
                        products: products,
                        orders: window.allOrders || [],
                        stats: {
                            totalProducts: products.length,
                            totalOrders: (window.allOrders || []).length,
                            totalRevenue: (window.allOrders || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
                        },
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
    // Show loading screen first
    const loadingScreen = document.getElementById("admin-loading-screen");
    if (loadingScreen) {
        loadingScreen.style.display = "flex";
    }

    // Hide login screen
    if (dom.loginScreen) {
        dom.loginScreen.classList.add("hidden");
        dom.loginScreen.style.display = "none";
    }

    // Simulate loading time and then show dashboard with animation
    setTimeout(() => {
        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }

        // Show dashboard screen with fade-in animation
        if (dom.dashboardScreen) {
            dom.dashboardScreen.removeAttribute("hidden");
            dom.dashboardScreen.style.display = "flex";
            dom.dashboardScreen.classList.add("dashboard-fade-in");
        }

        // Show stats when logged in
        const statsSection = document.getElementById("admin-stats-section");
        if (statsSection) {
            statsSection.style.display = "grid";
            statsSection.classList.add("stats-fade-in");
        }

        // Ensure products list is rendered
        setTimeout(() => {
            if (dom.adminProductList && products.length > 0) {
                renderProductList();
            }
        }, 200);

        // Trigger welcome animation
        triggerWelcomeAnimation();
    }, 1500); // 1.5 second loading animation
}

function triggerWelcomeAnimation() {
    const welcomeText = document.getElementById("admin-welcome-text");
    if (welcomeText) {
        welcomeText.classList.add("animate-welcome");
        
        // Add sparkle effect to Erandina text
        const erandinaText = welcomeText.querySelector(".erandina-text");
        if (erandinaText) {
            erandinaText.classList.add("sparkle-animation");
        }
    }
}

function updateWelcomeText(user) {
    if (dom.welcomeText) {
        // Keep the HTML structure for animation
        const erandinaSpan = dom.welcomeText.querySelector('.erandina-text');
        if (erandinaSpan) {
            erandinaSpan.textContent = 'Erandina';
        } else {
            dom.welcomeText.innerHTML = `Bienvenida, <span class="erandina-text">Erandina</span>`;
        }
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

// Create SEO-optimized blog posts with product images
async function createSEOBlogPosts() {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador.", "warning");
        return;
    }

    const btn = document.getElementById("create-seo-blog-posts");
    const originalText = btn?.innerHTML;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    }

    // Get featured products for blog images
    const featuredProducts = products.filter(p => p.featured).slice(0, 5);
    const productImages = featuredProducts.length > 0 
        ? featuredProducts.map(p => p.img)
        : products.slice(0, 5).map(p => p.img);

    const seoBlogPosts = [
        {
            title: "Dulces Artesanales Mexicanos: Tradición y Sabor en Cada Bocado",
            excerpt: "Descubre la rica tradición de los dulces artesanales mexicanos. En Panza Verde, cada producto es elaborado con ingredientes 100% naturales y recetas familiares que han pasado de generación en generación.",
            content: `<h2>La Dulcería Mexicana: Un Patrimonio Cultural</h2>
            <p>Los dulces artesanales mexicanos representan mucho más que simples golosinas; son un patrimonio cultural que refleja la rica historia gastronómica de México. Desde tiempos prehispánicos, cuando se utilizaban ingredientes como el cacao, el amaranto y la miel de abeja, hasta la llegada de los españoles que introdujeron el azúcar y nuevas técnicas de confitería.</p>
            
            <img src="${productImages[0] || 'https://i.imgur.com/8zf86ss.png'}" alt="Dulces artesanales mexicanos" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Ingredientes 100% Naturales</h3>
            <p>En Panza Verde, nos enorgullecemos de utilizar únicamente ingredientes naturales en todos nuestros productos. No utilizamos conservadores artificiales, colorantes sintéticos ni saborizantes químicos. Cada gomita, cada alfajor y cada botana gourmet está elaborada con frutas frescas, nueces de la más alta calidad y especias naturales.</p>
            
            <h3>Recetas Familiares Tradicionales</h3>
            <p>Nuestras recetas han sido transmitidas de generación en generación, preservando los sabores auténticos que han endulzado la vida de familias mexicanas durante décadas. Cada producto cuenta una historia y conecta a las personas con sus raíces culturales.</p>
            
            <h3>Productos Destacados</h3>
            <p>Entre nuestros productos más populares se encuentran las gomitas artesanales en diversas presentaciones, los alfajores argentinos con dulce de leche auténtico, los guayabates tradicionales con nuez o piñón, y las botanas gourmet que combinan sabores únicos mexicanos.</p>
            
            <img src="${productImages[1] || 'https://i.imgur.com/8zf86ss.png'}" alt="Gomitas artesanales mexicanas" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Compromiso con la Calidad</h3>
            <p>Nuestro compromiso es ofrecer productos de la más alta calidad, elaborados con pasión y dedicación. Cada pedido es preparado con cuidado y atención a los detalles, asegurando que nuestros clientes reciban productos frescos y deliciosos.</p>`,
            category: "Tradición y Calidad",
            image: productImages[0] || "https://i.imgur.com/8zf86ss.png",
            author: "Panza Verde"
        },
        {
            title: "Snacks Picositos: La Combinación Perfecta de Dulce y Picante",
            excerpt: "Explora la fascinante tradición mexicana de combinar sabores dulces con picantes. Descubre cómo el chile realza el sabor de frutas y dulces, creando una experiencia sensorial única.",
            content: `<h2>La Tradición de los Sabores Picositos en México</h2>
            <p>Una de las características más distintivas de la gastronomía mexicana es la combinación magistral de sabores dulces y picantes. Esta tradición se refleja perfectamente en nuestros snacks picositos, donde el chile se convierte en el complemento perfecto para frutas y dulces.</p>
            
            <img src="${productImages[2] || 'https://i.imgur.com/8zf86ss.png'}" alt="Snacks picositos mexicanos" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Mangos Enchilados: Un Clásico Mexicano</h3>
            <p>Los mangos enchilados son uno de nuestros productos más populares. La combinación del dulzor natural del mango con el toque picante del chile crea una experiencia sensorial que despierta todos los sentidos. Este snack es perfecto para cualquier momento del día.</p>
            
            <h3>Gomitas con Chile: Innovación en la Tradición</h3>
            <p>Nuestras gomitas con chile son una innovación que respeta la tradición mexicana. El chile no enmascara el dulce, sino que lo realza, creando un equilibrio perfecto de sabores. Disponibles en presentaciones de 250g, son ideales para compartir o disfrutar personalmente.</p>
            
            <img src="${productImages[3] || 'https://i.imgur.com/8zf86ss.png'}" alt="Gomitas con chile" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Arándanos y Piñas Enchilados</h3>
            <p>También ofrecemos arándanos enchilados y piñas con chile, productos que combinan la frescura de las frutas con el picante característico mexicano. Estos snacks son perfectos para quienes buscan algo diferente y auténtico.</p>
            
            <h3>Beneficios de los Snacks Picositos</h3>
            <p>Los snacks picositos no solo son deliciosos, sino que también pueden tener beneficios para la salud. El chile contiene capsaicina, que puede ayudar a acelerar el metabolismo y proporcionar sensación de saciedad. Además, las frutas deshidratadas conservan sus nutrientes naturales.</p>`,
            category: "Sabores y Tradición",
            image: productImages[2] || "https://i.imgur.com/8zf86ss.png",
            author: "Panza Verde"
        },
        {
            title: "Botanas Gourmet: Snacks Premium para Disfrutar en Cualquier Ocasión",
            excerpt: "Descubre nuestra selección de botanas gourmet elaboradas con ingredientes premium. Desde nueces de la india hasta pistaches enchilados, cada botana es una experiencia de sabor única.",
            content: `<h2>Botanas Gourmet: Calidad Premium en Cada Bocado</h2>
            <p>Nuestras botanas gourmet representan lo mejor de la tradición mexicana combinada con ingredientes de la más alta calidad. Cada producto está cuidadosamente seleccionado y preparado para ofrecer una experiencia gastronómica excepcional.</p>
            
            <img src="${productImages[4] || 'https://i.imgur.com/8zf86ss.png'}" alt="Botanas gourmet mexicanas" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Nuez de la India: El Snack Premium</h3>
            <p>La nuez de la india es uno de nuestros productos estrella. Disponible en presentaciones enchiladas y saladas, esta botana gourmet es perfecta para acompañar cualquier momento. Rica en proteínas y grasas saludables, es una opción nutritiva y deliciosa.</p>
            
            <h3>Pistaches Enchilados con Ajo</h3>
            <p>Nuestros pistaches enchilados con ajo combinan el sabor único del pistache con el picante del chile y el aroma del ajo. Esta combinación crea un snack irresistible que es difícil de dejar de comer.</p>
            
            <h3>Botana Panza Verde: La Mezcla Perfecta</h3>
            <p>Nuestra botana Panza Verde es una mezcla exclusiva de nuez de la india, pretzels y arándanos enchilados. Esta combinación única ofrece una textura crujiente y sabores que se complementan perfectamente.</p>
            
            <img src="${productImages[1] || 'https://i.imgur.com/8zf86ss.png'}" alt="Botana Panza Verde" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Churritos de Amaranto: Tradición y Nutrición</h3>
            <p>Los churritos de amaranto son una opción nutritiva y deliciosa. Disponibles en diferentes sabores como sal y limón, chipotle y nopal, estos snacks son ricos en proteínas y fibra, además de ser una excelente fuente de calcio y hierro.</p>
            
            <h3>Ideal para Compartir</h3>
            <p>Todas nuestras botanas gourmet vienen en presentaciones generosas, perfectas para compartir en reuniones familiares, fiestas o simplemente para disfrutar en casa. Cada botana está empacada con cuidado para mantener su frescura y crujiente.</p>`,
            category: "Productos Premium",
            image: productImages[4] || "https://i.imgur.com/8zf86ss.png",
            author: "Panza Verde"
        },
        {
            title: "Dulces Tradicionales: Alfajores, Guayabates y Más",
            excerpt: "Conoce nuestros dulces tradicionales mexicanos: alfajores argentinos, guayabates, palomas y más. Cada uno elaborado con ingredientes naturales y recetas que honran la tradición.",
            content: `<h2>Dulces Tradicionales que Endulzan el Corazón</h2>
            <p>Nuestra colección de dulces tradicionales incluye algunos de los sabores más queridos de México y Argentina. Cada producto está elaborado con ingredientes naturales y técnicas artesanales que preservan el sabor auténtico.</p>
            
            <img src="${productImages[0] || 'https://i.imgur.com/8zf86ss.png'}" alt="Alfajores argentinos" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Alfajores Argentinos: Dulce de Leche Auténtico</h3>
            <p>Nuestros alfajores argentinos están hechos con dulce de leche auténtico, creando un sabor cremoso y delicioso que se derrite en la boca. Cada alfajor es una pequeña obra de arte que combina la textura suave de las galletas con la riqueza del dulce de leche.</p>
            
            <h3>Guayabates: Tradición en Cada Bocado</h3>
            <p>Los guayabates son uno de nuestros productos más tradicionales. Disponibles con nuez o piñón, estos dulces combinan el sabor único de la guayaba con cajeta, coco y nueces. Cada bocado es una explosión de sabores que recuerda a la cocina mexicana tradicional.</p>
            
            <img src="${productImages[2] || 'https://i.imgur.com/8zf86ss.png'}" alt="Guayabates tradicionales" style="width: 100%; max-width: 600px; border-radius: 12px; margin: 1.5rem 0;">
            
            <h3>Palomas: Obleas Rellenas de Sabor</h3>
            <p>Las palomas son obleas delgadas rellenas de coco y cajeta, creando un dulce ligero pero lleno de sabor. Perfectas para disfrutar como postre o merienda, estas delicias son un favorito entre nuestros clientes.</p>
            
            <h3>Suspiros: Pequeñas Delicias</h3>
            <p>Nuestros suspiros son pequeñas galletas cubiertas de chocolate semi amargo. Aunque pequeños en tamaño, están llenos de sabor y son perfectos para satisfacer ese antojo de algo dulce sin excederse.</p>
            
            <h3>El Compromiso con la Tradición</h3>
            <p>En Panza Verde, cada dulce tradicional que ofrecemos es una celebración de la rica herencia culinaria mexicana y latinoamericana. Utilizamos solo los mejores ingredientes y técnicas artesanales para asegurar que cada producto mantenga su sabor auténtico y tradicional.</p>`,
            category: "Dulces Tradicionales",
            image: productImages[0] || "https://i.imgur.com/8zf86ss.png",
            author: "Panza Verde"
        }
    ];

    try {
        let created = 0;
        for (const post of seoBlogPosts) {
            try {
                await addDoc(collection(db, "blogPosts"), {
                    ...post,
                    createdAt: serverTimestamp(),
                    published: true,
                    seoOptimized: true
                });
                created++;
            } catch (error) {
                console.error("Error creating blog post:", error);
            }
        }
        showToast(`${created} artículos SEO creados exitosamente.`, "success");
    } catch (error) {
        console.error("Error creating SEO blog posts:", error);
        showToast("Error al crear artículos SEO.", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText || '<i class="fas fa-magic"></i> Crear artículos SEO';
        }
    }
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
    const allSections = document.querySelectorAll(".admin-section, #admin-stats-section");

    // Hide all sections initially
    function hideAllSections() {
        allSections.forEach(section => {
            if (section) section.style.display = "none";
        });
    }

    // Show specific section
    function showSection(sectionId) {
        hideAllSections();
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            targetElement.style.display = "block";
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // Show stats section by default
    const statsSection = document.getElementById("admin-stats-section");
    if (statsSection) statsSection.style.display = "grid";

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

            // Show only the selected section
            let targetSectionId = null;
            if (section === "stats") {
                targetSectionId = "admin-stats-section";
            } else if (section === "products") {
                targetSectionId = "product-management";
                // Ensure products list is visible and rendered when clicking products tab
                setTimeout(() => {
                    if (dom.adminProductList) {
                        renderProductList();
                        // Make sure the list container is visible
                        const productSection = document.getElementById("product-management");
                        if (productSection) {
                            const listContainer = productSection.querySelector("#admin-product-list");
                            if (listContainer) {
                                listContainer.style.display = "block";
                            }
                        }
                    }
                }, 100);
            } else if (section === "categories") {
                targetSectionId = "category-management";
            } else if (section === "orders") {
                targetSectionId = "orders-management";
            } else if (section === "blog") {
                targetSectionId = "blog-management";
            } else if (section === "buyers") {
                targetSectionId = "buyers-management";
            } else if (section === "business") {
                targetSectionId = "business-manager";
            } else if (section === "chatbot") {
                targetSectionId = "chatbot-management";
                loadChatbotData();
            } else if (section === "users") {
                targetSectionId = "users-management";
            } else if (section === "help") {
                targetSectionId = "help-tutorial";
            }

            if (targetSectionId) {
                showSection(targetSectionId);
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

// ==================== INVENTORY MANAGEMENT ====================

function initInventoryManagement() {
    const inventoryForm = document.getElementById("inventory-form");
    const inventoryFormContainer = document.getElementById("inventory-form-container");
    const bulkInventoryForm = document.getElementById("bulk-inventory-form");
    const bulkInventoryFormContainer = document.getElementById("bulk-inventory-form-container");
    const addInventoryBtn = document.getElementById("add-inventory-btn");
    const bulkUploadBtn = document.getElementById("bulk-upload-inventory-btn");
    const cancelInventoryFormBtn = document.getElementById("cancel-inventory-form");
    const cancelBulkInventoryFormBtn = document.getElementById("cancel-bulk-inventory-form");

    // Show inventory form
    if (addInventoryBtn) {
        addInventoryBtn.addEventListener("click", () => {
            clearInventoryForm();
            populateInventoryProductSelect();
            inventoryFormContainer.style.display = "block";
            inventoryFormContainer.scrollIntoView({ behavior: "smooth" });
        });
    }

    const inventoryProductSelect = document.getElementById("inventory-product-select");
    if (inventoryProductSelect) {
        inventoryProductSelect.addEventListener("focus", () => {
            populateInventoryProductSelect();
        });
    }

    if (inventoryForm) {
        inventoryForm.addEventListener("submit", handleInventoryFormSubmit);
    }

    if (bulkInventoryForm) {
        bulkInventoryForm.addEventListener("submit", handleBulkInventorySubmit);
    }

    if (bulkUploadBtn) {
        bulkUploadBtn.addEventListener("click", () => {
            bulkInventoryFormContainer.style.display = bulkInventoryFormContainer.style.display === "none" ? "block" : "none";
            if (bulkInventoryFormContainer.style.display === "block") {
                populateInventoryProductSelect();
            }
        });
    }

    if (cancelInventoryFormBtn) {
        cancelInventoryFormBtn.addEventListener("click", () => {
            clearInventoryForm();
            inventoryFormContainer.style.display = "none";
        });
    }

    if (cancelBulkInventoryFormBtn) {
        cancelBulkInventoryFormBtn.addEventListener("click", () => {
            bulkInventoryFormContainer.style.display = "none";
        });
    }

    // Show inventory form when clicking on inventory item
    const inventoryList = document.getElementById("admin-inventory-list");
    if (inventoryList) {
        inventoryList.addEventListener("click", (e) => {
            if (e.target.closest(".edit-inventory")) {
                const inventoryId = e.target.closest(".admin-inventory-row")?.dataset.inventoryId;
                if (inventoryId) {
                    startEditInventory(inventoryId);
                }
            } else if (e.target.closest(".delete-inventory")) {
                const inventoryId = e.target.closest(".admin-inventory-row")?.dataset.inventoryId;
                if (inventoryId) {
                    deleteInventory(inventoryId);
                }
            }
        });
    }
}

function subscribeToInventory() {
    try {
        const inventoryRef = collection(db, "inventory");
        onSnapshot(
            inventoryRef,
            (snapshot) => {
                inventory = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        productId: data.productId || "",
                        productName: data.productName || "",
                        quantity: Number(data.quantity) || 0,
                        minStock: Number(data.minStock) || 0,
                        location: data.location || "",
                        notes: data.notes || "",
                        lastUpdated: data.lastUpdated || serverTimestamp(),
                        createdAt: data.createdAt || serverTimestamp()
                    };
                });
                renderInventoryList();
                updateAnalytics();
            },
            (error) => {
                console.error("Error al escuchar inventario", error);
            }
        );
    } catch (error) {
        console.error("Error de Firebase en inventario", error);
    }
}

function populateInventoryProductSelect() {
    const select = document.getElementById("inventory-product-select");
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">Seleccionar producto</option>' +
        products.map(p => `<option value="${p.id}" data-name="${p.name}">${p.name} - $${p.price.toFixed(2)}</option>`).join("");
    if (currentValue) select.value = currentValue;
}

function renderInventoryList() {
    const container = document.getElementById("admin-inventory-list");
    if (!container) return;

    if (inventory.length === 0) {
        container.innerHTML = '<p class="admin-hint">No hay inventario registrado. Agrega inventario para comenzar.</p>';
        return;
    }

    container.innerHTML = inventory.map(inv => {
        const product = products.find(p => p.id === inv.productId);
        const isLowStock = inv.quantity <= inv.minStock;
        const inventoryValue = product ? (product.price * inv.quantity) : 0;
        
        return `
            <div class="admin-inventory-row ${isLowStock ? 'low-stock' : ''}" data-inventory-id="${inv.id}">
                <div class="admin-inventory-info">
                    <h4>${inv.productName || product?.name || 'Producto desconocido'}</h4>
                    <div class="admin-inventory-details">
                        <span class="inventory-badge ${isLowStock ? 'badge-warning' : 'badge-success'}">
                            <i class="fas fa-${isLowStock ? 'exclamation-triangle' : 'check-circle'}"></i>
                            Stock: ${inv.quantity} ${isLowStock ? '(Bajo Stock)' : ''}
                        </span>
                        <span>Stock Mínimo: ${inv.minStock}</span>
                        ${product ? `<span>Valor: $${inventoryValue.toFixed(2)}</span>` : ''}
                        ${inv.location ? `<span><i class="fas fa-map-marker-alt"></i> ${inv.location}</span>` : ''}
                    </div>
                    ${inv.notes ? `<p class="inventory-notes">${inv.notes}</p>` : ''}
                </div>
                <div class="admin-inventory-actions">
                    <button class="admin-action-btn edit-inventory" title="Editar">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="admin-action-btn delete-inventory" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

async function handleInventoryFormSubmit(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador.", "warning");
        return;
    }

    const formData = new FormData(event.target);
    const productId = formData.get("productId");
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast("Selecciona un producto válido.", "warning");
        return;
    }

    const inventoryData = {
        productId: productId,
        productName: product.name,
        quantity: Number(formData.get("quantity")) || 0,
        minStock: Number(formData.get("minStock")) || 0,
        location: formData.get("location")?.trim() || "",
        notes: formData.get("notes")?.trim() || "",
        lastUpdated: serverTimestamp()
    };

    const submitBtn = document.getElementById("inventory-form-submit");
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        if (editingInventoryId) {
            await updateDoc(doc(db, "inventory", editingInventoryId), inventoryData);
            showToast("Inventario actualizado correctamente.", "success");
        } else {
            // Check if inventory already exists for this product
            const existingInventory = inventory.find(inv => inv.productId === productId);
            if (existingInventory) {
                await updateDoc(doc(db, "inventory", existingInventory.id), inventoryData);
                showToast("Inventario actualizado correctamente.", "success");
            } else {
                await addDoc(collection(db, "inventory"), {
                    ...inventoryData,
                    createdAt: serverTimestamp()
                });
                showToast("Inventario agregado correctamente.", "success");
            }
        }
        clearInventoryForm();
        document.getElementById("inventory-form-container").style.display = "none";
    } catch (error) {
        console.error("Error al guardar inventario", error);
        showToast("No pudimos guardar el inventario.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || '<i class="fas fa-save"></i> Guardar Inventario';
        }
    }
}

async function handleBulkInventorySubmit(event) {
    event.preventDefault();
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador.", "warning");
        return;
    }

    const formData = new FormData(event.target);
    const bulkData = formData.get("bulkData").trim();
    
    if (!bulkData) {
        showToast("Ingresa datos para procesar.", "warning");
        return;
    }

    const lines = bulkData.split('\n').filter(line => line.trim());
    const inventoryItems = [];
    
    for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
            const productName = parts[0];
            const quantity = parseInt(parts[1]) || 0;
            const minStock = parseInt(parts[2]) || 0;
            
            const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
            if (product) {
                inventoryItems.push({ product, quantity, minStock });
            }
        }
    }

    if (inventoryItems.length === 0) {
        showToast("No se encontraron productos válidos en los datos.", "warning");
        return;
    }

    const submitBtn = event.target.querySelector("button[type='submit']");
    const originalText = submitBtn?.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

    try {
        const promises = inventoryItems.map(async ({ product, quantity, minStock }) => {
            const existingInventory = inventory.find(inv => inv.productId === product.id);
            const inventoryData = {
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                minStock: minStock,
                lastUpdated: serverTimestamp()
            };

            if (existingInventory) {
                await updateDoc(doc(db, "inventory", existingInventory.id), inventoryData);
            } else {
                await addDoc(collection(db, "inventory"), {
                    ...inventoryData,
                    createdAt: serverTimestamp()
                });
            }
        });

        await Promise.all(promises);
        showToast(`${inventoryItems.length} productos procesados correctamente.`, "success");
        event.target.reset();
        document.getElementById("bulk-inventory-form-container").style.display = "none";
    } catch (error) {
        console.error("Error al procesar inventario masivo", error);
        showToast("Error al procesar el inventario masivo.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText || '<i class="fas fa-upload"></i> Procesar Carga Masiva';
    }
}

function startEditInventory(inventoryId) {
    const inv = inventory.find(i => i.id === inventoryId);
    if (!inv) return;

    editingInventoryId = inventoryId;
    const form = document.getElementById("inventory-form");
    if (!form) return;

    populateInventoryProductSelect();
    document.getElementById("inventory-product-select").value = inv.productId;
    document.getElementById("inventory-quantity").value = inv.quantity;
    document.getElementById("inventory-min-stock").value = inv.minStock;
    document.getElementById("inventory-location").value = inv.location || "";
    document.getElementById("inventory-notes").value = inv.notes || "";

    document.getElementById("inventory-form-container").style.display = "block";
    document.getElementById("inventory-form-container").scrollIntoView({ behavior: "smooth" });
}

async function deleteInventory(inventoryId) {
    if (!isAdminAuthenticated) {
        showToast("No autorizado.", "error");
        return;
    }

    if (!confirm("¿Eliminar este registro de inventario?")) return;

    try {
        await deleteDoc(doc(db, "inventory", inventoryId));
        showToast("Inventario eliminado correctamente.", "success");
    } catch (error) {
        console.error("Error al eliminar inventario", error);
        showToast("No pudimos eliminar el inventario.", "error");
    }
}

function clearInventoryForm() {
    editingInventoryId = null;
    const form = document.getElementById("inventory-form");
    if (form) form.reset();
}

// ==================== ANALYTICS & DATA DOWNLOAD ====================

function initBusinessManagerFeatures() {
    const downloadDataBtn = document.getElementById("download-data-btn");
    const aiInsightsBtn = document.getElementById("ai-insights-btn");

    if (downloadDataBtn) {
        downloadDataBtn.addEventListener("click", downloadAllData);
    }

    if (aiInsightsBtn) {
        aiInsightsBtn.addEventListener("click", generateAIInsights);
    }
}

function updateAnalytics() {
    // Calculate total inventory value
    let totalInventoryValue = 0;
    let lowStockCount = 0;
    const lowStockProducts = [];

    inventory.forEach(inv => {
        const product = products.find(p => p.id === inv.productId);
        if (product) {
            totalInventoryValue += product.price * inv.quantity;
            if (inv.quantity <= inv.minStock) {
                lowStockCount++;
                lowStockProducts.push({ ...inv, product });
            }
        }
    });

    // Update analytics display
    const totalValueEl = document.getElementById("analytics-total-inventory-value");
    if (totalValueEl) totalValueEl.textContent = `$${totalInventoryValue.toFixed(2)}`;

    const lowStockEl = document.getElementById("analytics-low-stock-count");
    if (lowStockEl) lowStockEl.textContent = lowStockCount;

    // Update low stock products list
    const lowStockList = document.getElementById("low-stock-products-list");
    if (lowStockList) {
        if (lowStockProducts.length === 0) {
            lowStockList.innerHTML = '<p class="admin-hint">Todos los productos tienen stock suficiente.</p>';
        } else {
            lowStockList.innerHTML = lowStockProducts.map(item => `
                <div class="low-stock-item">
                    <strong>${item.productName}</strong>
                    <span class="stock-warning">Stock: ${item.quantity} / Mínimo: ${item.minStock}</span>
                </div>
            `).join("");
        }
    }

    // Calculate turnover rate (simplified - based on recent orders)
    const recentOrders = orders.filter(o => {
        const orderDate = o.createdAt?.toDate?.() || new Date(0);
        const daysAgo = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 30;
    });
    
    const turnoverEl = document.getElementById("analytics-turnover-rate");
    if (turnoverEl) {
        if (recentOrders.length > 0) {
            const totalSold = recentOrders.reduce((sum, o) => {
                const cart = Array.isArray(o.cart) ? o.cart : JSON.parse(o.cart || "[]");
                return sum + cart.reduce((s, item) => s + item.quantity, 0);
            }, 0);
            turnoverEl.textContent = `${totalSold} unidades (últimos 30 días)`;
        } else {
            turnoverEl.textContent = "Sin datos recientes";
        }
    }
}

function downloadAllData() {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador.", "warning");
        return;
    }

    const data = {
        timestamp: new Date().toISOString(),
        products: products,
        categories: categories,
        inventory: inventory,
        orders: orders.map(o => ({
            ...o,
            cart: Array.isArray(o.cart) ? o.cart : JSON.parse(o.cart || "[]")
        })),
        blogPosts: blogPosts,
        stats: {
            totalProducts: products.length,
            totalInventoryValue: inventory.reduce((sum, inv) => {
                const product = products.find(p => p.id === inv.productId);
                return sum + (product ? product.price * inv.quantity : 0);
            }, 0),
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
        }
    };

    // Download as JSON
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `panza-verde-data-${new Date().toISOString().split('T')[0]}.json`;
    jsonLink.click();

    // Download inventory as CSV
    const csvRows = [
        ['Producto', 'Cantidad', 'Stock Mínimo', 'Valor', 'Ubicación', 'Notas'],
        ...inventory.map(inv => {
            const product = products.find(p => p.id === inv.productId);
            const value = product ? product.price * inv.quantity : 0;
            return [
                inv.productName || product?.name || '',
                inv.quantity,
                inv.minStock,
                value.toFixed(2),
                inv.location || '',
                inv.notes || ''
            ];
        })
    ];
    
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `panza-verde-inventario-${new Date().toISOString().split('T')[0]}.csv`;
    csvLink.click();

    showToast("Datos descargados correctamente.", "success");
}

async function generateAIInsights() {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador.", "warning");
        return;
    }

    const btn = document.getElementById("ai-insights-btn");
    const originalText = btn?.innerHTML;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    }

    try {
        const apiEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api/chatbot'
            : `${window.location.origin}/api/chatbot`;

        const prompt = `Analiza los siguientes datos de Panza Verde y proporciona insights y recomendaciones:

PRODUCTOS: ${products.length} productos en total
INVENTARIO: ${inventory.length} productos con inventario registrado
PEDIDOS: ${orders.length} pedidos totales
INGRESOS: $${orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0).toFixed(2)}

PRODUCTOS CON BAJO STOCK:
${inventory.filter(inv => inv.quantity <= inv.minStock).map(inv => {
    const product = products.find(p => p.id === inv.productId);
    return `- ${inv.productName}: ${inv.quantity} unidades (mínimo: ${inv.minStock})`;
}).join('\n') || 'Ninguno'}

PRODUCTOS MÁS VENDIDOS (últimos 30 días):
${getTopSellingProducts(30).map((p, i) => `${i + 1}. ${p.name}: ${p.quantity} unidades vendidas`).join('\n') || 'Sin datos'}

Proporciona:
1. Recomendaciones de reabastecimiento
2. Análisis de productos más/menos vendidos
3. Sugerencias de precios
4. Estrategias de marketing
5. Mejoras operativas

Responde en español, de manera profesional y accionable.`;

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                conversationHistory: [],
                products: products,
                orders: orders,
                isAdmin: true
            })
        });

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        const insights = data.response || 'No se pudieron generar insights en este momento.';

        // Show insights in a modal or alert
        const insightsModal = document.createElement('div');
        insightsModal.className = 'insights-modal';
        insightsModal.innerHTML = `
            <div class="insights-modal-content">
                <div class="insights-modal-header">
                    <h3><i class="fas fa-brain"></i> Insights de IA</h3>
                    <button class="insights-modal-close" onclick="this.closest('.insights-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="insights-modal-body">
                    <div class="insights-content">${insights.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="insights-modal-footer">
                    <button class="btn-primary" onclick="this.closest('.insights-modal').remove()">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(insightsModal);
    } catch (error) {
        console.error("Error generating AI insights", error);
        showToast("Error al generar insights. Verifica la configuración de la API.", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText || '<i class="fas fa-brain"></i> Insights de IA';
        }
    }
}

function getTopSellingProducts(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const productSales = {};
    
    orders.forEach(order => {
        const orderDate = order.createdAt?.toDate?.() || new Date(0);
        if (orderDate >= cutoffDate) {
            const cart = Array.isArray(order.cart) ? order.cart : JSON.parse(order.cart || "[]");
            cart.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { name: item.name, quantity: 0 };
                }
                productSales[item.name].quantity += item.quantity;
            });
        }
    });
    
    return Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
}

// ==================== TUTORIAL NAVIGATION ====================

function initTutorialNavigation() {
    const tutorialTabs = document.querySelectorAll(".tutorial-tab");
    const tutorialSections = document.querySelectorAll(".tutorial-section");

    tutorialTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tutorialId = tab.getAttribute("data-tutorial");
            
            // Remove active class from all tabs and sections
            tutorialTabs.forEach(t => t.classList.remove("active"));
            tutorialSections.forEach(s => s.classList.remove("active"));
            
            // Add active class to clicked tab and corresponding section
            tab.classList.add("active");
            const section = document.getElementById(`tutorial-${tutorialId}`);
            if (section) section.classList.add("active");
        });
    });

    const generateAIHelpBtn = document.getElementById("generate-ai-help-btn");
    if (generateAIHelpBtn) {
        generateAIHelpBtn.addEventListener("click", generateAIHelpContent);
    }
}

async function generateAIHelpContent() {
    if (!isAdminAuthenticated) {
        showToast("Inicia sesión como administrador.", "warning");
        return;
    }

    const btn = document.getElementById("generate-ai-help-btn");
    const originalText = btn?.innerHTML;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    }

    try {
        const apiEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api/chatbot'
            : `${window.location.origin}/api/chatbot`;

        const prompt = `Crea una guía completa y detallada para usar el panel de administración de Panza Verde. Incluye:

1. Cómo gestionar productos (crear, editar, eliminar)
2. Cómo gestionar inventario (agregar cantidades, establecer stock mínimo)
3. Cómo gestionar pedidos (crear, actualizar estado)
4. Cómo usar las funciones de analytics
5. Cómo generar contenido para blog con IA
6. Cómo descargar datos
7. Consejos y mejores prácticas

Responde en español, de manera clara y estructurada, como si fuera un tutorial paso a paso.`;

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                conversationHistory: [],
                products: products,
                isAdmin: true
            })
        });

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        const helpContent = data.response || 'No se pudo generar el contenido de ayuda.';

        // Add to tutorial section
        const gettingStartedSection = document.getElementById("tutorial-getting-started");
        if (gettingStartedSection) {
            gettingStartedSection.innerHTML += `
                <div class="ai-generated-help" style="margin-top: 2rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                    <h4><i class="fas fa-magic"></i> Guía Generada por IA</h4>
                    <div>${helpContent.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }

        showToast("Contenido de ayuda generado correctamente.", "success");
    } catch (error) {
        console.error("Error generating AI help", error);
        showToast("Error al generar ayuda. Verifica la configuración de la API.", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText || '<i class="fas fa-magic"></i> Generar Ayuda con IA';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    init();
    initSidebarNavigation();
});


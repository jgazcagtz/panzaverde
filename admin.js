import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
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
const db = getFirestore(app);

const adminCredentials = {
    email: "erandi@panzaverde.com"
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
let editingProductId = null;
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
    productFeatured: document.getElementById("product-featured")
};

function init() {
    checkAuthState();
    registerListeners();
    subscribeToProducts();
}

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user && user.email === adminCredentials.email) {
            isAdminAuthenticated = true;
            showDashboard();
            updateWelcomeText(user);
        } else {
            isAdminAuthenticated = false;
            showLogin();
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
    dom.loginScreen?.classList.remove("hidden");
    dom.dashboardScreen?.setAttribute("hidden", "true");
}

function showDashboard() {
    dom.loginScreen?.classList.add("hidden");
    dom.dashboardScreen?.removeAttribute("hidden");
}

function updateWelcomeText(user) {
    if (dom.welcomeText) {
        dom.welcomeText.textContent = `Bienvenido, ${user.displayName || user.email}`;
    }
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
    const categories = new Set(products.map(p => p.category)).size;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    if (dom.statTotalProducts) dom.statTotalProducts.textContent = totalProducts;
    if (dom.statFeaturedProducts) dom.statFeaturedProducts.textContent = featuredProducts;
    if (dom.statCategories) dom.statCategories.textContent = categories;
    if (dom.statTotalValue) dom.statTotalValue.textContent = `$${totalValue.toFixed(2)}`;
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

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);


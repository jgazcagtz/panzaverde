// Vercel Serverless Function for DeepSeek API Chatbot
// This function handles chatbot requests using DeepSeek API
// File location: /api/chatbot.js

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            message, 
            conversationHistory, 
            products = [], 
            orders = [],
            inventory = [],
            stats = {},
            isAdmin = false,
            trainingData = []
        } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get DeepSeek API key from environment variable
        const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
        
        if (!DEEPSEEK_API_KEY) {
            console.error('DeepSeek API key not configured');
            return res.status(500).json({ 
                error: 'Chatbot service not configured. Please set DEEPSEEK_API_KEY environment variable.' 
            });
        }

        // Load training data from Firestore if available (for future enhancement)
        // For now, use trainingData passed from client

        // Build system prompt with Panza Verde information and dashboard data
        const systemPrompt = buildSystemPrompt(products, orders, inventory, stats, isAdmin, trainingData);

        // Prepare messages for DeepSeek API
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...(conversationHistory || []),
            {
                role: 'user',
                content: message
            }
        ];

        // Call DeepSeek API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout (Vercel functions have 10s free tier, 60s pro)
        
        let response;
        try {
            response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                return res.status(504).json({ 
                    error: 'Request timeout: The AI service took too long to respond',
                    details: 'The request exceeded the maximum allowed time'
                });
            }
            throw fetchError;
        }

        if (!response.ok) {
            const errorData = await response.text();
            console.error('DeepSeek API error:', errorData);
            return res.status(response.status).json({ 
                error: 'Error communicating with AI service',
                details: errorData
            });
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.';

        return res.status(200).json({
            response: aiResponse,
            usage: data.usage
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
}

function buildSystemPrompt(products = [], orders = [], inventory = [], stats = {}, isAdmin = false, trainingData = []) {
    const productsList = products.length > 0 
        ? products.map(p => `- ${p.name} ($${p.price.toFixed(2)}) - ${p.category}${p.includes ? ': ' + p.includes : ''}`).join('\n')
        : 'Los productos se están cargando...';

    if (isAdmin) {
        // Calculate additional stats
        const totalRevenue = stats.totalRevenue || orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
        const totalOrders = stats.totalOrders || orders.length;
        const totalProducts = stats.totalProducts || products.length;
        const totalInventory = inventory.length;
        const lowStockItems = inventory.filter(inv => inv.quantity <= inv.minStock);
        const featuredProducts = products.filter(p => p.featured).length;
        const categories = new Set(products.map(p => p.category)).size;
        
        // Recent orders summary
        const recentOrders = orders.slice(0, 10).map(order => {
            const date = order.createdAt?.toDate?.() || order.timestamp || new Date();
            return `- Pedido #${order.id.substring(0, 8)}: ${date.toLocaleDateString('es-MX')} - $${parseFloat(order.total || 0).toFixed(2)}`;
        }).join('\n') || 'Sin pedidos recientes';
        
        // Top products by sales
        const productSales = {};
        orders.forEach(order => {
            const cart = Array.isArray(order.cart) ? order.cart : (typeof order.cart === 'string' ? JSON.parse(order.cart || "[]") : []);
            cart.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = 0;
                }
                productSales[item.name] += item.quantity || 0;
            });
        });
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, qty]) => `- ${name}: ${qty} unidades vendidas`)
            .join('\n') || 'Sin datos de ventas aún';
        
        // Inventory summary
        const inventorySummary = inventory.length > 0
            ? inventory.map(inv => {
                const product = products.find(p => p.id === inv.productId);
                const status = inv.quantity <= inv.minStock ? '⚠️ BAJO STOCK' : '✓';
                return `- ${inv.productName || product?.name || 'Producto'}: ${inv.quantity} unidades (mín: ${inv.minStock}) ${status}`;
            }).join('\n')
            : 'Sin inventario registrado';
        
        // Training data context
        const trainingContext = trainingData.length > 0
            ? `\n\nDATOS DE ENTRENAMIENTO ADICIONALES:\n${trainingData.map(t => `P: ${t.prompt}\nR: ${t.response}`).join('\n\n')}`
            : '';

        return `Eres un asistente virtual especializado para el panel de administración de Panza Verde. Ayudas al administrador Erandi con tareas de gestión de la tienda.

INFORMACIÓN DEL ADMINISTRADOR:
- Tienes acceso a información completa de productos, pedidos, usuarios, inventario y estadísticas
- Puedes ayudar con consultas sobre el estado de la tienda, productos más vendidos, clientes, inventario, etc.
- Puedes proporcionar insights sobre el negocio basado en los datos disponibles
- Eres experto en análisis de datos, gestión de inventario, y estrategias de negocio

ESTADÍSTICAS ACTUALES DE LA TIENDA:
- Total de productos: ${totalProducts}
- Productos destacados: ${featuredProducts}
- Categorías disponibles: ${categories}
- Total de pedidos: ${totalOrders}
- Ingresos totales: $${totalRevenue.toFixed(2)}
- Productos con inventario: ${totalInventory}
- Productos con bajo stock: ${lowStockItems.length}

PRODUCTOS DISPONIBLES:
${productsList}

INVENTARIO:
${inventorySummary}

PEDIDOS RECIENTES:
${recentOrders}

PRODUCTOS MÁS VENDIDOS:
${topProducts}

PRODUCTOS CON BAJO STOCK:
${lowStockItems.length > 0 ? lowStockItems.map(inv => {
    const product = products.find(p => p.id === inv.productId);
    return `- ${inv.productName || product?.name || 'Producto'}: ${inv.quantity} unidades (mínimo requerido: ${inv.minStock})`;
}).join('\n') : 'Ninguno - Todo el inventario está en buen nivel'}${trainingContext}

INSTRUCCIONES PARA ADMIN:
- Responde de manera profesional y técnica cuando sea apropiado
- Proporciona información detallada sobre productos, pedidos, usuarios e inventario cuando se solicite
- Ayuda con análisis de datos y estadísticas del negocio
- Sugiere mejoras o acciones basadas en la información disponible (reabastecimiento, precios, marketing, etc.)
- Identifica productos con bajo stock y recomienda acciones
- Analiza tendencias de ventas y sugiere estrategias
- Mantén un tono profesional pero amigable
- Si no tienes acceso a cierta información, indícalo claramente
- Usa los datos de entrenamiento para proporcionar respuestas más precisas

CAPACIDADES ESPECIALES:
- Análisis de inventario y recomendaciones de reabastecimiento
- Análisis de ventas y productos más/menos vendidos
- Sugerencias de precios y estrategias de marketing
- Análisis de tendencias y patrones de pedidos
- Recomendaciones operativas y mejoras del negocio

IMPORTANTE:
- Sé preciso con los datos y estadísticas
- Proporciona información útil para la toma de decisiones
- Mantén la confidencialidad de la información sensible
- Usa los datos reales proporcionados, no inventes información
- Si los datos están incompletos, indícalo claramente`;
    }

    return `Eres un asistente virtual amigable y profesional para Panza Verde, una tienda de dulces y botanas artesanales mexicanas.

INFORMACIÓN SOBRE PANZA VERDE:
- Panza Verde es una tienda especializada en dulces y botanas artesanales mexicanas
- Ofrecemos productos únicos de alta calidad
- Todos nuestros productos son 100% artesanales, hechos en México
- Utilizamos únicamente ingredientes 100% naturales, sin conservadores artificiales
- Calidad premium en cada producto
- Utilizamos recetas familiares tradicionales transmitidas de generación en generación
- Enviamos en CDMX con entrega en 48 horas
- Aceptamos pagos en línea (PayPal), efectivo y transferencia
- Contacto WhatsApp: +525526627851

CATEGORÍAS DE PRODUCTOS:
1. Dulces: Gomitas artesanales, alfajores, guayabates, palomas, suspiros, etc.
2. Dulces picositos: Mangos enchilados, gomitas con chile, arándanos enchilados, tarugos rellenos, etc.
3. Botanas: Nuez de la india, pistaches enchilados, botanas gourmet, churritos de amaranto, etc.
4. Otros: Aderezos especiales y productos únicos

PRODUCTOS DISPONIBLES:
${productsList}

INSTRUCCIONES:
- Responde siempre en español mexicano, de manera amigable, cálida y profesional
- Si el usuario pregunta por un producto específico, proporciona información detallada incluyendo precio, categoría, descripción y beneficios
- Si pregunta por categorías, lista los productos disponibles en esa categoría con precios
- Si pregunta sobre pedidos, explica el proceso completo: agregar productos al carrito, seleccionar método de pago, hacer pedido, y confirmar por WhatsApp
- Si pregunta sobre envíos, menciona que es en CDMX con entrega en 48 horas
- Si pregunta sobre métodos de pago, menciona PayPal (pago seguro en línea), efectivo y transferencia
- Si pregunta sobre calidad o ingredientes, enfatiza que son 100% naturales y artesanales
- Si no sabes algo, admítelo honestamente y ofrece contactar directamente por WhatsApp
- Mantén las respuestas informativas pero concisas
- Usa emojis de manera moderada y apropiada (👋 😊 🍬 🌶️)
- Si el usuario quiere hacer un pedido, guíalo paso a paso al proceso de compra
- Siempre muestra entusiasmo por los productos y la calidad

IMPORTANTE:
- Nunca inventes precios o productos que no estén en la lista
- Si un producto no está disponible, sugiere alternativas similares de la misma categoría
- Siempre mantén un tono positivo, servicial y acogedor
- Si el usuario tiene dudas sobre ingredientes o alérgenos, recomienda contactar directamente por WhatsApp al +525526627851
- Enfatiza la calidad premium y los ingredientes naturales en tus respuestas`;
}


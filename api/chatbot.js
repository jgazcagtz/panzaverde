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
        const { message, conversationHistory, products } = req.body;

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

        // Build system prompt with Panza Verde information
        const systemPrompt = buildSystemPrompt(products);

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

        // Call DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
            })
        });

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

function buildSystemPrompt(products = []) {
    const productsList = products.length > 0 
        ? products.map(p => `- ${p.name} ($${p.price.toFixed(2)}) - ${p.category}${p.includes ? ': ' + p.includes : ''}`).join('\n')
        : 'Los productos se están cargando...';

    return `Eres un asistente virtual amigable y profesional para Panza Verde, una tienda de dulces y botanas artesanales mexicanas.

INFORMACIÓN SOBRE PANZA VERDE:
- Panza Verde es una tienda especializada en dulces y botanas artesanales mexicanas
- Ofrecemos más de 120 productos únicos
- Todos nuestros productos son 100% artesanales, hechos en México
- Utilizamos ingredientes naturales y recetas familiares tradicionales
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
- Responde siempre en español mexicano, de manera amigable y profesional
- Si el usuario pregunta por un producto específico, proporciona información detallada incluyendo precio y categoría
- Si pregunta por categorías, lista los productos disponibles en esa categoría
- Si pregunta sobre pedidos, explica el proceso: agregar al carrito, seleccionar método de pago, y confirmar por WhatsApp
- Si pregunta sobre envíos, menciona que es en CDMX con entrega en 48 horas
- Si pregunta sobre métodos de pago, menciona PayPal, efectivo y transferencia
- Si no sabes algo, admítelo y ofrece contactar por WhatsApp
- Mantén las respuestas concisas pero informativas
- Usa emojis de manera moderada y apropiada
- Si el usuario quiere hacer un pedido, guíalo al proceso de compra

IMPORTANTE:
- Nunca inventes precios o productos que no estén en la lista
- Si un producto no está disponible, sugiere alternativas similares
- Siempre mantén un tono positivo y servicial
- Si el usuario tiene dudas sobre ingredientes o alérgenos, recomienda contactar directamente por WhatsApp`;
}


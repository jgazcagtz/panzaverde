// Panza Verde Chatbot with DeepSeek API Integration
// Enhanced AI Agent with Firebase data management and analytics

import { 
    getFirestore, 
    collection, 
    onSnapshot,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTFRVMUd66Dwr7Ec_2qj6SNPhgNIVBURg",
    authDomain: "bagueteria-3cbdb.firebaseapp.com",
    projectId: "bagueteria-3cbdb",
    storageBucket: "bagueteria-3cbdb.firebasestorage.app",
    messagingSenderId: "181467777153",
    appId: "1:181467777153:web:23b774efebd3251abfe580"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class PanzaVerdeChatbot {
    constructor() {
        this.products = [];
        this.conversationHistory = [];
        this.isOpen = false;
        this.isLoading = false;
        this.sessionId = this.generateSessionId();
        this.userId = this.getOrCreateUserId();
        
        // Get API endpoint - use Vercel deployment URL or localhost for development
        // Auto-detect environment
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.apiEndpoint = 'http://localhost:3000/api/chatbot';
        } else {
            // Use current domain for API endpoint
            // Try to use the API endpoint, fallback to a placeholder if it doesn't exist
            this.apiEndpoint = `${window.location.origin}/api/chatbot`;
        }
        
        // Check if we're on admin page - use different IDs
        this.isAdminPage = window.location.pathname.includes('admin.html');
        this.toggleId = this.isAdminPage ? 'admin-chatbot-toggle' : 'chatbot-toggle';
        this.windowId = this.isAdminPage ? 'admin-chatbot-window' : 'chatbot-window';
        this.closeId = this.isAdminPage ? 'admin-chatbot-close' : 'chatbot-close';
        this.sendId = this.isAdminPage ? 'admin-chatbot-send' : 'chatbot-send';
        this.inputId = this.isAdminPage ? 'admin-chatbot-input' : 'chatbot-input';
        this.messagesId = this.isAdminPage ? 'admin-chatbot-messages' : 'chatbot-messages';
        
        this.init();
        this.subscribeToProducts();
        this.loadConversationHistory();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('panza_verde_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('panza_verde_user_id', userId);
        }
        return userId;
    }

    async loadConversationHistory() {
        try {
            const conversationsRef = collection(db, 'chatbot_conversations');
            const q = query(
                conversationsRef,
                orderBy('timestamp', 'desc'),
                limit(10)
            );
            
            // Load recent conversations for context
            onSnapshot(q, (snapshot) => {
                const recentMessages = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.userId === this.userId && data.messages) {
                        recentMessages.push(...data.messages);
                    }
                });
                // Use last 10 messages for context
                this.conversationHistory = recentMessages.slice(-10);
            });
        } catch (error) {
            console.error('Error loading conversation history:', error);
        }
    }

    init() {
        const toggle = document.getElementById(this.toggleId);
        const close = document.getElementById(this.closeId);
        const send = document.getElementById(this.sendId);
        const input = document.getElementById(this.inputId);
        const window = document.getElementById(this.windowId);

        if (!toggle) {
            console.warn(`Chatbot toggle not found with ID: ${this.toggleId}`);
            return;
        }

        if (!window) {
            console.warn(`Chatbot window not found with ID: ${this.windowId}`);
            return;
        }

        // Add click event listener to toggle
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Chatbot toggle clicked');
            this.toggleChatbot();
        });

        if (close) {
            close.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeChatbot();
            });
        }

        if (send) {
            send.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.sendMessage();
            });
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Prevent closing on window click
        if (window) {
            window.addEventListener('click', (e) => e.stopPropagation());
        }

        // Close modal when clicking outside (but not the toggle button)
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !window?.contains(e.target) && 
                !toggle?.contains(e.target) &&
                !close?.contains(e.target)) {
                // Optionally close on outside click - commented out for better UX
                // this.closeChatbot();
            }
        });
    }

    subscribeToProducts() {
        try {
            const productsRef = collection(db, 'products');
            onSnapshot(productsRef, (snapshot) => {
                this.products = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        name: data.name || 'Producto sin nombre',
                        price: Number(data.price) || 0,
                        category: data.category || 'Otros',
                        includes: data.includes || '',
                        img: data.img || 'https://i.imgur.com/8zf86ss.png',
                        featured: data.featured ?? false
                    };
                });
                console.log('Chatbot: Products updated', this.products.length);
            }, (error) => {
                console.error('Error loading products for chatbot:', error);
            });
        } catch (error) {
            console.error('Firebase error in chatbot:', error);
        }
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById(this.windowId);
        const toggle = document.getElementById(this.toggleId);
        
        console.log('Toggling chatbot, isOpen:', this.isOpen);
        
        if (window) {
            if (this.isOpen) {
                window.classList.add('open');
                console.log('Chatbot window opened');
                const input = document.getElementById(this.inputId);
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            } else {
                window.classList.remove('open');
                console.log('Chatbot window closed');
            }
        } else {
            console.error('Chatbot window element not found');
        }

        if (toggle) {
            toggle.classList.toggle('active', this.isOpen);
        } else {
            console.error('Chatbot toggle element not found');
        }
    }

    closeChatbot() {
        this.isOpen = false;
        const window = document.getElementById(this.windowId);
        const toggle = document.getElementById(this.toggleId);
        
        if (window) {
            window.classList.remove('open');
        }
        if (toggle) {
            toggle.classList.remove('active');
        }
    }

    async sendMessage() {
        const input = document.getElementById(this.inputId);
        const sendBtn = document.getElementById(this.sendId);
        const messagesContainer = document.getElementById(this.messagesId);

        if (!input || !messagesContainer) return;

        const message = input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to UI
        this.addMessage(message, 'user');
        const userMessage = message;
        input.value = '';
        input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        this.isLoading = true;

        // Show typing indicator
        const typingId = this.addTypingIndicator();

        try {
            // Prepare conversation history (last 10 messages for context)
            const recentHistory = this.conversationHistory.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Save user message to Firebase
            await this.saveMessageToFirebase('user', userMessage);

            // Call API - handle errors gracefully
            let response;
            try {
                response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        conversationHistory: recentHistory,
                        products: this.products,
                        userId: this.userId,
                        sessionId: this.sessionId
                    })
                });
            } catch (fetchError) {
                // Network error or API not available
                throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión o contacta directamente por WhatsApp al +525526627851.');
            }

            // Remove typing indicator
            this.removeTypingIndicator(typingId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response || 'Lo siento, no pude procesar tu mensaje.';

            // Add AI response to UI
            this.addMessage(aiResponse, 'bot');

            // Save bot response to Firebase
            await this.saveMessageToFirebase('assistant', aiResponse);

            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: aiResponse }
            );

            // Save conversation to Firebase
            await this.saveConversationToFirebase(userMessage, aiResponse);

            // Keep history manageable (last 20 messages)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            this.removeTypingIndicator(typingId);
            const errorMessage = error.message?.includes('API') 
                ? 'Lo siento, hubo un error al comunicarme con el servidor. Por favor, intenta de nuevo o contáctanos directamente por WhatsApp al +525526627851.'
                : 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo o contáctanos directamente por WhatsApp al +525526627851.';
            
            this.addMessage(errorMessage, 'bot');
            
            // Save error to Firebase for monitoring
            await this.saveMessageToFirebase('system', `Error: ${error.message}`);
        } finally {
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            this.isLoading = false;
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    async saveMessageToFirebase(role, content) {
        try {
            await addDoc(collection(db, 'chatbot_messages'), {
                userId: this.userId,
                sessionId: this.sessionId,
                role: role,
                content: content,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        } catch (error) {
            console.error('Error saving message to Firebase:', error);
        }
    }

    async saveConversationToFirebase(userMessage, botResponse) {
        try {
            await addDoc(collection(db, 'chatbot_conversations'), {
                userId: this.userId,
                sessionId: this.sessionId,
                messages: [
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: botResponse }
                ],
                timestamp: serverTimestamp(),
                productCount: this.products.length
            });
        } catch (error) {
            console.error('Error saving conversation to Firebase:', error);
        }
    }

    addMessage(text, role) {
        const messagesContainer = document.getElementById(this.messagesId);
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${role}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = text;
        
        contentDiv.appendChild(p);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addTypingIndicator() {
        const messagesContainer = document.getElementById(this.messagesId);
        if (!messagesContainer) return null;

        const typingId = 'typing-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.id = typingId;
        messageDiv.className = 'chatbot-message bot-message typing-indicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const typing = document.createElement('div');
        typing.className = 'typing-dots';
        typing.innerHTML = '<span></span><span></span><span></span>';
        
        contentDiv.appendChild(typing);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingId;
    }

    removeTypingIndicator(id) {
        if (!id) return;
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }
}

// Initialize chatbot when DOM is ready
function initializeChatbot() {
    // Only initialize if we're on the main store page (not admin)
    // Admin has its own chatbot initialization
    if (window.location.pathname.includes('admin.html')) {
        // Don't initialize main chatbot on admin page
        return;
    }
    
    // Check if chatbot elements exist
    const toggle = document.getElementById('chatbot-toggle');
    if (!toggle) {
        console.warn('Chatbot toggle not found, retrying...');
        // Retry after a short delay
        setTimeout(initializeChatbot, 500);
        return;
    }
    
    try {
        window.panzaVerdeChatbot = new PanzaVerdeChatbot();
        console.log('Chatbot initialized successfully');
    } catch (error) {
        console.error('Error initializing chatbot:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    // DOM already loaded
    initializeChatbot();
}


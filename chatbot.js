// Panza Verde Chatbot with DeepSeek API Integration
// This chatbot is trained on Panza Verde products and updates automatically

import { 
    getFirestore, 
    collection, 
    onSnapshot 
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
        
        // Get API endpoint - use Vercel deployment URL or localhost for development
        // TODO: Update this with your actual Vercel deployment URL after deploying
        this.apiEndpoint = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/chatbot'
            : 'https://your-project.vercel.app/api/chatbot'; // Update with your Vercel URL
        
        this.init();
        this.subscribeToProducts();
    }

    init() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const window = document.getElementById('chatbot-window');

        if (toggle) {
            toggle.addEventListener('click', () => this.toggleChatbot());
        }

        if (close) {
            close.addEventListener('click', () => this.closeChatbot());
        }

        if (send) {
            send.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Close on outside click
        if (window) {
            window.addEventListener('click', (e) => e.stopPropagation());
        }

        document.addEventListener('click', (e) => {
            if (this.isOpen && !window?.contains(e.target) && !toggle?.contains(e.target)) {
                // Don't close on outside click - let user explicitly close
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
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        if (window) {
            if (this.isOpen) {
                window.classList.add('open');
                const input = document.getElementById('chatbot-input');
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            } else {
                window.classList.remove('open');
            }
        }

        if (toggle) {
            toggle.classList.toggle('active', this.isOpen);
        }
    }

    closeChatbot() {
        this.isOpen = false;
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        if (window) {
            window.classList.remove('open');
        }
        if (toggle) {
            toggle.classList.remove('active');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        const messagesContainer = document.getElementById('chatbot-messages');

        if (!input || !messagesContainer) return;

        const message = input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to UI
        this.addMessage(message, 'user');
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

            // Call API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: recentHistory,
                    products: this.products
                })
            });

            // Remove typing indicator
            this.removeTypingIndicator(typingId);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response || 'Lo siento, no pude procesar tu mensaje.';

            // Add AI response to UI
            this.addMessage(aiResponse, 'bot');

            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );

            // Keep history manageable (last 20 messages)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            this.removeTypingIndicator(typingId);
            this.addMessage(
                'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo o contáctanos directamente por WhatsApp al +525526627851.',
                'bot'
            );
        } finally {
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            this.isLoading = false;
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    addMessage(text, role) {
        const messagesContainer = document.getElementById('chatbot-messages');
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
        const messagesContainer = document.getElementById('chatbot-messages');
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.panzaVerdeChatbot = new PanzaVerdeChatbot();
    });
} else {
    window.panzaVerdeChatbot = new PanzaVerdeChatbot();
}


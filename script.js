// ================================================================
// 1. MENÚ HAMBURGUESA
// ================================================================
document.getElementById('menuToggle')?.addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('open');
});

// ================================================================
// 2. FAQ - ACORDEÓN
// ================================================================
function cargarFAQ() {
    const container = document.getElementById('faqContainer');

    const faqs = [{
        pregunta: '¿Qué es el Desarrollo Seguro de Aplicaciones?',
        respuesta: 'Es una metodología que integra prácticas de seguridad en todas las fases del ciclo de vida del desarrollo de software, desde la concepción hasta la producción, para minimizar vulnerabilidades y proteger la información.'
    }, {
        pregunta: '¿Cuáles son las fases del S-SDLC?',
        respuesta: 'Las 6 fases son: 1) Concepción, 2) Análisis, 3) Diseño, 4) Implementación, 5) Validación y 6) Producción. Cada fase incluye actividades específicas de seguridad.'
    }, {
        pregunta: '¿Qué significa el acrónimo STRIDE?',
        respuesta: 'STRIDE es un modelo de amenazas que clasifica 6 tipos: Spoofing (suplantación), Tampering (alteración), Repudiation (negación), Information Disclosure (divulgación), Denial of Service (denegación) y Elevation of Privilege (elevación de privilegios).'
    }, {
        pregunta: '¿Qué diferencia hay entre SAST, DAST y SCA?',
        respuesta: 'SAST analiza el código fuente estáticamente (antes de ejecutar), DAST prueba la aplicación en ejecución (dinámicamente) y SCA analiza las dependencias y librerías de terceros en busca de vulnerabilidades conocidas.'
    }, {
        pregunta: '¿Qué es OWASP Top 10?',
        respuesta: 'Es una lista de las 10 vulnerabilidades más críticas en aplicaciones web, publicada por la Open Web Application Security Project, que sirve como referencia para priorizar esfuerzos de seguridad.'
    }, {
        pregunta: '¿Cómo puedo implementar DevSecOps en mi organización?',
        respuesta: 'DevSecOps integra seguridad en el pipeline de CI/CD, automatizando pruebas SAST/DAST/SCA, implementando políticas de seguridad como código y fomentando una cultura de responsabilidad compartida por la seguridad.'
    }];

    container.innerHTML = faqs.map((faq, index) => `
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this, ${index})">
                        <span>${faq.pregunta}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer" id="faqAnswer${index}">
                        ${faq.respuesta}
                    </div>
                </div>
            `).join('');
}

function toggleFAQ(element, index) {
    const answer = document.getElementById(`faqAnswer${index}`);
    const isOpen = answer.classList.contains('open');

    document.querySelectorAll('.faq-answer').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(el => el.classList.remove('active'));

    if (!isOpen) {
        answer.classList.add('open');
        element.classList.add('active');
    }
}

// ================================================================
// 3. FORMULARIO - ENVÍO A GOOGLE SHEETS
// ================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzk1Lp7kpgZlVqgsCS71HvbTbzzSPQJ8mZ1lk1C8xxmOAICQn7YzOmcj613qNItdZ6k/exec';

async function enviarFormulario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const consulta = document.getElementById('consulta').value.trim();
    const messageDiv = document.getElementById('formMessage');

    if (!nombre || !correo || !consulta) {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = '⚠️ Por favor, completa los campos obligatorios (Nombre, Correo y Consulta).';
        messageDiv.style.display = 'block';
        return false;
    }

    const btn = document.querySelector('#contactForm button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, telefono, empresa, consulta })
        });

        messageDiv.className = 'form-message success';
        messageDiv.textContent = '✅ ¡Consulta enviada correctamente! Te contactaremos pronto.';
        messageDiv.style.display = 'block';
        document.getElementById('contactForm').reset();

    } catch (error) {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = '❌ Error al enviar: ' + error.message;
        messageDiv.style.display = 'block';
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Consulta';
    return false;
}

// ================================================================
// 4. SCROLL SUAVE
// ================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.querySelector('nav ul')?.classList.remove('open');
        }
    });
});

// ================================================================
// 5. INICIALIZAR
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    cargarFAQ();
});

// ================================================================
// 6. CHATBOT FLOTANTE
// ================================================================

// ⚠️ IMPORTANTE: Reemplaza TU_SCRIPT_ID con el ID real de tu Web App
// O usa la misma URL que ya tienes en SCRIPT_URL
const CHATBOT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzk1Lp7kpgZlVqgsCS71HvbTbzzSPQJ8mZ1lk1C8xxmOAICQn7YzOmcj613qNItdZ6k/exec';

let chatHistorial = [];

// Función para abrir/cerrar el chatbot
function toggleChatbot() {
    const window = document.getElementById('chatbotWindow');
    const toggle = document.getElementById('chatbotToggle');
    if (!window) return;
    
    window.classList.toggle('open');
    if (window.classList.contains('open')) {
        toggle.style.display = 'none';
    } else {
        toggle.style.display = 'flex';
    }
}

// Función para sugerencias rápidas
function sendSuggestion(texto) {
    const input = document.getElementById('chatbotInput');
    if (input) {
        input.value = texto;
        sendChatMessage();
    }
}

// Función para enviar mensaje
// Función para enviar mensaje
function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const mensaje = input.value.trim();
    const errorDiv = document.getElementById('chatbotError');
    const sendBtn = input.nextElementSibling;

    if (!mensaje) return;

    if (errorDiv) {
        errorDiv.className = 'chatbot-error';
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

    const messagesDiv = document.getElementById('chatbotMessages');
    if (!messagesDiv) return;

    // Mostrar mensaje del usuario en la interfaz
    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-message user';
    userMsg.textContent = mensaje;
    messagesDiv.appendChild(userMsg);
    input.value = '';
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    chatHistorial.push({ role: 'user', content: mensaje });

    // ================================================================
    // SOLUCIÓN CORS: Conversión a formulario clásico
    // ================================================================
    const formBody = new URLSearchParams();
    formBody.append('json', JSON.stringify({
        mensaje: mensaje,
        historial: chatHistorial
    }));

    // Enviar a Apps Script usando Content-Type simple que salta el Preflight de CORS
    fetch(CHATBOT_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody
    })
    .then(res => res.json()) // Procesamos la respuesta JSON estructurada directamente
    .then(data => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';

        if (data.error) {
            if (errorDiv) {
                errorDiv.className = 'chatbot-error visible';
                errorDiv.textContent = '❌ ' + data.error;
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = data.respuesta || "Lo siento, no pude procesar tu consulta.";
        const botMsg = document.createElement('div');
        botMsg.className = 'chatbot-message bot';
        botMsg.innerHTML = respuesta.replace(/\n/g, '<br>');
        messagesDiv.appendChild(botMsg);
        chatHistorial.push({ role: 'assistant', content: respuesta });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    })
    .catch(err => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        if (errorDiv) {
            errorDiv.className = 'chatbot-error visible';
            errorDiv.textContent = '❌ Error de conexión: ' + err.message;
            errorDiv.style.display = 'block';
        }
    });
}
// Cerrar chatbot al hacer clic fuera
document.addEventListener('click', function(e) {
    const window = document.getElementById('chatbotWindow');
    const toggle = document.getElementById('chatbotToggle');
    if (window && window.classList.contains('open')) {
        if (!window.contains(e.target) && !toggle.contains(e.target)) {
            window.classList.remove('open');
            toggle.style.display = 'flex';
        }
    }
});

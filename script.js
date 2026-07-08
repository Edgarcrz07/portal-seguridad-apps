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

    // FAQ predefinidas sobre Desarrollo Seguro de Aplicaciones
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

    // Cerrar todas
    document.querySelectorAll('.faq-answer').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(el => el.classList.remove('active'));

    if (!isOpen) {
        answer.classList.add('open');
        element.classList.add('active');
    }
}

// ================================================================
// 3. FORMULARIO - ENVÍO A GOOGLE SHEETS (Apps Script)
// ================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOMf1a8jJ-rDqYQZ3P4YEfh9ytk8hrt6nck60FzG6JkbWrzugdj7F8lHq6KTMaojc/exec'; // ⚠️ Reemplazar con tu URL de Apps Script

async function enviarFormulario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const consulta = document.getElementById('consulta').value.trim();
    const messageDiv = document.getElementById('formMessage');

    // Validar campos requeridos
    if (!nombre || !correo || !consulta) {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = '⚠️ Por favor, completa los campos obligatorios (Nombre, Correo y Consulta).';
        messageDiv.style.display = 'block';
        return false;
    }

    // Deshabilitar botón
    const btn = document.querySelector('#contactForm button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Necesario para Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                telefono: telefono,
                empresa: empresa,
                consulta: consulta
            })
        });

        // Con no-cors, no podemos leer la respuesta, así que asumimos éxito
        messageDiv.className = 'form-message success';
        messageDiv.textContent = '✅ ¡Consulta enviada correctamente! Te contactaremos pronto.';
        messageDiv.style.display = 'block';

        // Limpiar formulario
        document.getElementById('contactForm').reset();

    } catch (error) {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = '❌ Error al enviar: ' + error.message;
        messageDiv.style.display = 'block';
    }

    // Restaurar botón
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Consulta';

    return false;
}

// ================================================================
// 4. SCROLL SUAVE PARA NAVEGACIÓN
// ================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Cerrar menú móvil
            document.querySelector('nav ul')?.classList.remove('open');
        }
    });
});

// ================================================================
// 5. INICIALIZAR
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    cargarFAQ();

    // Detectar si la URL de Apps Script está configurada
    if (SCRIPT_URL.includes('TU_SCRIPT_ID')) {
        console.warn('⚠️ Configura la URL de Apps Script en SCRIPT_URL');
    }
});

// ================================================================
// 6. EFECTO DE CONTADOR (Opcional)
// ================================================================
// Si quieres animar los números, descomenta esta función
/*
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.textContent);
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + '+';
            }
        }, 50);
    });
}
*/
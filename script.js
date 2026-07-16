/* ===========================================
   LA PREVIA - Landing Page Scripts
   Bar de barrio en Ramos Mejía, Buenos Aires
   =========================================== */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initGalleryHover();
    initWhatsAppFloat();
});

/* ===========================================
   Header Scroll Effect
   =========================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Agregar/quitar clase según la posición del scroll
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ===========================================
   Mobile Menu Toggle
   =========================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav.querySelectorAll('.nav-link');
    
    // Toggle del menú al hacer clic en el botón hamburguesa
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mainNav.contains(e.target)) {
            menuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ===========================================
   Smooth Scroll for Anchor Links
   =========================================== */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===========================================
   Scroll Animations (Intersection Observer)
   =========================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Opciones del observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Callback del observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Crear el observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observar todos los elementos animados
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ===========================================
   Contact Form → WhatsApp
   =========================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validar campos
        if (!name || !phone || !message) {
            showNotification('Por favor completá todos los campos', 'error');
            return;
        }
        
        // Construir mensaje de WhatsApp
        const whatsappMessage = `¡Hola! Soy ${name}. ${message} Mi WhatsApp: ${phone}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Número de WhatsApp del negocio (formato internacional sin +)
        const whatsappNumber = '5491131098445';
        
        // Abrir WhatsApp con el mensaje prellenado
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        
        // Resetear el formulario
        form.reset();
        
        // Mostrar notificación de éxito
        showNotification('¡Redirigiendo a WhatsApp!', 'success');
    });
}

/* ===========================================
   Notification System
   =========================================== */
function showNotification(message, type = 'info') {
    // Eliminar notificación existente si la hay
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#25D366' : type === 'error' ? '#e74c3c' : '#3498db',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: '1001',
        animation: 'slideIn 0.3s ease-out',
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem'
    });
    
    // Estilos para el botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    });
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Event listeners
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Agregar animaciones CSS dinámicamente
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

/* ===========================================
   Gallery Hover Effect Enhancement
   =========================================== */
function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        item.addEventListener('mouseenter', () => {
            // Efecto de zoom suave
            img.style.transform = 'scale(1.1)';
            overlay.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            overlay.style.opacity = '0';
        });
    });
}

/* ===========================================
   WhatsApp Float Button Animation
   =========================================== */
function initWhatsAppFloat() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    
    // Mostrar el botón después de 2 segundos
    setTimeout(() => {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.transform = 'scale(1)';
    }, 2000);
    
    // Efecto de rebote al pasar el mouse
    whatsappBtn.addEventListener('mouseenter', () => {
        whatsappBtn.style.animation = 'none';
        whatsappBtn.style.transform = 'scale(1.1)';
    });
    
    whatsappBtn.addEventListener('mouseleave', () => {
        whatsappBtn.style.animation = 'pulse 2s infinite';
        whatsappBtn.style.transform = 'scale(1)';
    });
}

/* ===========================================
   Parallax Effect for Hero (Optional)
   =========================================== */
function initParallax() {
    const heroImg = document.querySelector('.hero-img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (heroImg) {
            heroImg.style.transform = `translateY(${rate}px)`;
        }
    });
}

/* ===========================================
   Dynamic Copyright Year
   =========================================== */
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.footer-bottom p');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        if (element.textContent.includes('©')) {
            element.innerHTML = element.innerHTML.replace(/\d{4}/, currentYear);
        }
    });
}

// Ejecutar actualización del año
updateCopyrightYear();

/* ===========================================
   Lazy Loading for Images (Fallback)
   =========================================== */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Navegador soporta lazy loading nativo
        return;
    }
    
    // Fallback para navegadores que no soportan lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Inicializar lazy loading
initLazyLoading();

/* ===========================================
   Smooth Scroll Progress Indicator
   =========================================== */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0%',
        height: '3px',
        backgroundColor: '#FFD966',
        zIndex: '1001',
        transition: 'width 0.1s ease-out'
    });
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// Inicializar barra de progreso
initScrollProgress();

/* ===========================================
   Keyboard Navigation Support
   =========================================== */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Cerrar menú móvil con Escape
        if (e.key === 'Escape') {
            const menuBtn = document.getElementById('mobileMenuBtn');
            const mainNav = document.getElementById('mainNav');
            
            if (mainNav.classList.contains('active')) {
                menuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// Inicializar navegación por teclado
initKeyboardNavigation();

/* ===========================================
   Console Easter Egg
   =========================================== */
console.log('%c🍺 La Previa - Bar en Ramos Mejía', 'font-size: 20px; color: #FFD966; font-weight: bold;');
console.log('%c¿Te gusta nuestro sitio? ¡Visitános en Güemes 196!', 'font-size: 14px; color: #666;');
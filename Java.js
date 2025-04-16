document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Configuración del tema oscuro/claro
    // =============================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Verificar preferencia del sistema o tema guardado
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Alternar tema
    themeToggle.addEventListener('click', function() {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // =============================================
    // Menú móvil - Versión corregida
    // =============================================
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const navbar = document.getElementById('navbar');
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevenir que el evento llegue al documento
        
        // Alternar menú
        menu.classList.toggle('active');
        
        // Cambiar icono
        const icon = menuToggle.querySelector('i');
        if (menu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
            document.body.style.overflow = 'hidden';
            navbar.style.backdropFilter = 'none'; // Remover blur cuando el menú está abierto
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = '';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const menuLinks = document.querySelectorAll('#menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = '';
            navbar.style.backdropFilter = 'blur(10px)';
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target) && menu.classList.contains('active')) {
            menu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = '';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // =============================================
    // Navegación con scroll
    // =============================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =============================================
    // Botón "volver arriba"
    // =============================================
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =============================================
    // Filtro de portafolio - Versión mejorada
    // =============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Cambiar botón activo
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.pointerEvents = 'none'; // Deshabilitar durante la transición
            });
            
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar items con animación
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Rehabilitar botones después de la animación
            setTimeout(() => {
                filterButtons.forEach(btn => {
                    btn.style.pointerEvents = 'auto';
                });
            }, 350);
        });
    });

    // =============================================
    // Animaciones al hacer scroll
    // =============================================
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);

    // =============================================
    // Contador de estadísticas - Versión mejorada para móviles
    // =============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const aboutSection = document.querySelector('#about');

    function animateStats() {
        statNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            
            let current = 0;
            const increment = () => {
                current += step;
                if (current < target) {
                    number.textContent = Math.floor(current);
                    requestAnimationFrame(increment);
                } else {
                    number.textContent = target;
                }
            };
            
            increment();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px' // Activa 100px antes de llegar al elemento
    });

    // Observar la sección about
    statsObserver.observe(aboutSection);

    // Ejecutar en móviles si la sección está visible al cargar
    function checkMobileStats() {
        if (window.innerWidth <= 768) {
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = (
                rect.top <= window.innerHeight * 0.75 && 
                rect.bottom >= 0
            );
            
            if (isVisible) {
                animateStats();
                // Dejar de observar si ya está visible
                statsObserver.unobserve(aboutSection);
            }
        }
    }

    // Verificar al cargar y al hacer scroll
    window.addEventListener('load', checkMobileStats);
    window.addEventListener('scroll', checkMobileStats);

    // =============================================
    // Formulario de contacto con FormSubmit - Versión mejorada
    // =============================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const form = this;
            const formFields = this.querySelectorAll('input, textarea');
            
            // Mostrar estado de carga
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Ocultar mensajes anteriores si existen
            const existingMessages = form.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Enviar el formulario a FormSubmit
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Mostrar mensaje de éxito
                    showFormMessage(form, 'success', '¡Mensaje enviado con éxito!');
                    
                    // Limpiar todos los campos del formulario
                    formFields.forEach(field => {
                        field.value = '';
                    });
                } else {
                    throw new Error('Error en el envío');
                }
            })
            .catch(error => {
                // Mostrar mensaje de error
                showFormMessage(form, 'error', 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });

        // Función para mostrar mensajes del formulario
        function showFormMessage(form, type, message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                ${message}
            `;
            
            // Insertar después del último elemento del formulario
            form.appendChild(messageDiv);
            
            // Desplazarse suavemente al mensaje
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Eliminar mensaje después de 5 segundos
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    // =============================================
    // Actualizar año en el footer
    // =============================================
    document.getElementById('year').textContent = new Date().getFullYear();

    // =============================================
    // Mejoras para dispositivos móviles
    // =============================================
    function handleMobileResize() {
        // Ajustar altura del menú móvil
        if (menu) {
            const navbarHeight = navbar.offsetHeight;
            menu.style.top = `${navbarHeight}px`;
            menu.style.height = `calc(100vh - ${navbarHeight}px)`;
        }
        
        // Ajustar efectos para móviles
        if (window.innerWidth < 768) {
            document.body.style.setProperty('--neon-glow', 'none');
        } else {
            document.body.style.setProperty('--neon-glow', '0 0 10px rgba(59, 130, 246, 0.8)');
        }
    }
    
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();
});
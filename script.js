// Variables globales
let currentSlide = 0;
let slides = [];
let carouselInterval;

// Función para inicializar la aplicación
function init() {
    // Obtener elementos del DOM
    const welcomeBtn = document.getElementById('welcomeBtn');
    const welcomePage = document.getElementById('welcomePage');
    const mainPage = document.getElementById('mainPage');
    
    // Event listener para el botón de bienvenida
    welcomeBtn.addEventListener('click', function() {
        showMainPage(welcomePage, mainPage);
    });
    
    // Inicializar el carrusel pero no iniciarlo hasta que se muestre la página principal
    slides = document.querySelectorAll('.carousel-slide');
}

// Función para mostrar la página principal con transición
function showMainPage(welcomePage, mainPage) {
    // Agregar efecto de transición
    welcomePage.style.transform = 'translateX(-100%)';
    welcomePage.style.transition = 'transform 0.8s ease-in-out';
    
    setTimeout(() => {
        welcomePage.style.display = 'none';
        mainPage.style.display = 'block';
        
        // Iniciar el carrusel después de mostrar la página principal
        startCarousel();
        
        // Crear efectos especiales
        createFloatingHearts();
        
        // Mostrar el botón de música de Spotify
        showMusicButton();
    }, 800);
}

// Función para iniciar el carrusel automático
function startCarousel() {
    // Asegurarse de que la primera imagen esté activa
    showSlide(currentSlide);
    
    // Cambiar imagen cada 1 segundo
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 1000);
}

// Función para mostrar una slide específica
function showSlide(n) {
    // Ocultar todas las slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Mostrar la slide actual
    if (slides[n]) {
        slides[n].classList.add('active');
    }
}

// Función para ir a la siguiente slide
function nextSlide() {
    currentSlide++;
    
    // Si llegamos al final, volver al principio
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    
    showSlide(currentSlide);
}

// Función para crear corazones flotantes adicionales
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '🌹'];
    
    // Crear corazones adicionales dinámicamente
    setInterval(() => {
        if (document.querySelectorAll('.floating-hearts .dynamic-heart').length < 3) {
            const heart = document.createElement('span');
            heart.className = 'heart dynamic-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.animationDuration = (2 + Math.random() * 3) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            
            heartsContainer.appendChild(heart);
            
            // Remover el corazón después de un tiempo
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 6000);
        }
    }, 2000);
}

// Función para crear efectos de brillo en la página de bienvenida
function createSparkles() {
    const welcomePage = document.querySelector('.welcome-page');
    
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animation = 'sparkle 2s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1';
        
        welcomePage.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }, 500);
}

// Función para pausar/reanudar el carrusel cuando la ventana pierde/gana foco
function handleVisibilityChange() {
    if (document.hidden) {
        // Pausar el carrusel cuando la pestaña no está visible
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    } else {
        // Reanudar el carrusel cuando la pestaña vuelve a ser visible
        if (document.getElementById('mainPage').style.display === 'block') {
            startCarousel();
        }
    }
}

// Event listeners adicionales
document.addEventListener('visibilitychange', handleVisibilityChange);

// Event listener para teclas (funcionalidad extra)
document.addEventListener('keydown', function(e) {
    // Si estamos en la página principal, permitir navegación manual con las flechas
    if (document.getElementById('mainPage').style.display === 'block') {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            showSlide(currentSlide);
        } else if (e.key === ' ') {
            // Pausa/reanuda con espacebar
            e.preventDefault();
            if (carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = null;
            } else {
                startCarousel();
            }
        }
    }
});

// Soporte para gestos táctiles en móviles
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (touchEndX < touchStartX - 50) {
        // Swipe izquierda - siguiente imagen
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe derecha - imagen anterior
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }
}

// Event listeners para touch
document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

// Detectar orientación del dispositivo
function handleOrientationChange() {
    setTimeout(() => {
        // Reajustar elementos después del cambio de orientación
        if (window.innerHeight < window.innerWidth && window.innerWidth <= 768) {
            // Modo landscape en móvil/tablet
            document.body.classList.add('landscape-mobile');
        } else {
            document.body.classList.remove('landscape-mobile');
        }
    }, 100);
}

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);

// Función para optimizar rendimiento en móviles
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar velocidad del carrusel según el dispositivo
function getCarouselSpeed() {
    return isMobile() ? 1500 : 1000; // Más lento en móviles para mejor experiencia
}

// Función mejorada para iniciar el carrusel
function startCarousel() {
    // Limpiar intervalo anterior si existe
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    // Asegurarse de que la primera imagen esté activa
    showSlide(currentSlide);
    
    // Cambiar imagen con velocidad adaptativa
    carouselInterval = setInterval(() => {
        nextSlide();
    }, getCarouselSpeed());
}

// Función para animar el texto del poema gradualmente
function animatePoem() {
    const poemElements = document.querySelectorAll('.typewriter-poem');
    
    poemElements.forEach((element, index) => {
        // El título aparece primero (después de 2 segundos)
        // Cada verso aparece con 2 segundos de diferencia
        const delay = index === 0 ? 2000 : 2000 + (index * 2000);
        
        setTimeout(() => {
            element.classList.add('show');
            element.style.animationDelay = '0s';
        }, delay);
    });
}

// Función mejorada para animar cada línea del verso
function animatePoemLinesSequentially() {
    const verses = document.querySelectorAll('.poem-verse');
    
    verses.forEach((verse, verseIndex) => {
        // Dividir el contenido en líneas
        const originalHTML = verse.innerHTML;
        const lines = originalHTML.split('<br>');
        
        // Limpiar el verso y preparar para animación
        verse.innerHTML = '';
        verse.style.opacity = '0';
        
        // Crear spans para cada línea
        const lineSpans = lines.map(line => {
            const span = document.createElement('span');
            span.innerHTML = line;
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            span.style.display = 'block';
            span.style.transition = 'all 0.8s ease-out';
            return span;
        });
        
        // Agregar las líneas al verso
        lineSpans.forEach(span => verse.appendChild(span));
        
        // Calcular el delay base para este verso
        const verseDelay = verseIndex === 0 ? 3000 : 3000 + (verseIndex * 3000);
        
        // Mostrar el verso
        setTimeout(() => {
            verse.style.opacity = '1';
            
            // Animar cada línea con delay
            lineSpans.forEach((span, lineIndex) => {
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, lineIndex * 800); // 800ms entre líneas
            });
        }, verseDelay);
    });
}

// Función para mostrar la página principal con transición
function showMainPage(welcomePage, mainPage) {
    // Agregar efecto de transición
    welcomePage.style.transform = 'translateX(-100%)';
    welcomePage.style.transition = 'transform 0.8s ease-in-out';
    
    setTimeout(() => {
        welcomePage.style.display = 'none';
        mainPage.style.display = 'block';
        
        // Iniciar el carrusel después de mostrar la página principal
        startCarousel();
        
        // Crear efectos especiales
        createFloatingHearts();
        
        // Iniciar animación del poema
        setTimeout(() => {
            animatePoem();
            animatePoemLinesSequentially();
        }, 1000); // Esperar 1 segundo después de mostrar la página
        
        console.log('🎵 Página principal cargada con efectos de texto');
    }, 800);
}

function toggleSpotifyPlayer() {
    if (isSpotifyVisible) {
        hideSpotifyPlayer();
    } else {
        // Aquí debes poner el ID real de la canción que quieres
        const trackId = spotifyTrackId || prompt('Ingresa el ID de Spotify de la canción "I Don\'t Want to Set the World on Fire":');
        if (trackId) {
            spotifyTrackId = trackId;
            showSpotifyPlayer(trackId);
        }
    }
}

function showMusicButton() {
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🎵 Spotify Music';
    musicButton.className = 'music-control-btn';
    musicButton.onclick = toggleSpotifyPlayer;
    
    // Agregar el botón a la página principal
    const mainPage = document.getElementById('mainPage');
    mainPage.appendChild(musicButton);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    init();
    createSparkles();
    initSpotifyMusic(); // Inicializar la música de Spotify
    
    // Mensaje de console para el desarrollador
    console.log('¡Feliz cumpleaños mamá! 🎉❤️');
    console.log('Controles adicionales:');
    console.log('- Flecha derecha: siguiente foto');
    console.log('- Flecha izquierda: foto anterior');
    console.log('- Espacebar: pausar/reanudar carrusel');
    console.log('- Música de Spotify disponible');
    console.log('');
    console.log('🎵 Para agregar música de Spotify:');
    console.log('1. Ve a Spotify Web/App');
    console.log('2. Busca "I Don\'t Want to Set the World on Fire"');
    console.log('3. Click derecho → Compartir → Copiar enlace de canción');
    console.log('4. El ID está después de "/track/"');
    console.log('   Ejemplo: https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC');
    console.log('   ID: 4uLU6hMCjMI75M1A2tKUQC');
});

// Función para optimizar el rendimiento
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar el redimensionado de ventana
window.addEventListener('resize', debounce(function() {
    // Reajustar elementos si es necesario
    console.log('Ventana redimensionada');
}, 250));
// Utility: Scroll to section
function scrollToSection(id){
  const element = document.getElementById(id);
  if(element) {
    const offset = 80; // Offset for navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if(navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
}

function reveal(){
  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight-100){
      el.classList.add('active');
    }
  });
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if(window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if(navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if(!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

// Gallery Modal
function initGalleryModal() {
  const photos = document.querySelectorAll('.photo[data-image]');
  const modal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalClose = document.querySelector('.modal-close');
  const modalPrev = document.querySelector('.modal-prev');
  const modalNext = document.querySelector('.modal-next');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  let currentIndex = 0;
  const photoArray = Array.from(photos);
  
  function openModal(index) {
    const photo = photoArray[index];
    if(!photo) return;
    
    const img = photo.querySelector('img');
    const title = photo.querySelector('h4')?.textContent || '';
    const description = photo.querySelector('p')?.textContent || '';
    
    modalImage.src = photo.dataset.image;
    modalImage.alt = img?.alt || title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    currentIndex = index;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  function showNext() {
    const nextIndex = (currentIndex + 1) % photoArray.length;
    openModal(nextIndex);
  }
  
  function showPrev() {
    const prevIndex = (currentIndex - 1 + photoArray.length) % photoArray.length;
    openModal(prevIndex);
  }
  
  // Open modal on photo click
  photos.forEach((photo, index) => {
    photo.addEventListener('click', () => openModal(index));
    photo.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(index);
      }
    });
  });
  
  // Close modal
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalOverlay) modalOverlay.addEventListener('click', closeModal);
  
  // Navigation
  if(modalNext) modalNext.addEventListener('click', showNext);
  if(modalPrev) modalPrev.addEventListener('click', showPrev);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if(!modal.classList.contains('active')) return;
    
    if(e.key === 'Escape') closeModal();
    if(e.key === 'ArrowRight') showNext();
    if(e.key === 'ArrowLeft') showPrev();
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  if(!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const nome = formData.get('nome');
    const telefone = formData.get('telefone');
    const email = formData.get('email');
    const servico = formData.get('servico');
    const mensagem = formData.get('mensagem');
    
    // Format service name
    const servicoNames = {
      'poda-preventiva': 'Poda Preventiva',
      'poda-risco': 'Poda de Risco',
      'remocao-controlada': 'Remoção Controlada',
      'residencial-comercial': 'Residencial e Comercial',
      'outro': 'Outro'
    };
    
    const servicoNome = servicoNames[servico] || servico;
    
    // Create WhatsApp message
    let whatsappMessage = `*Solicitação de Orçamento - Piuco Podas*\n\n`;
    whatsappMessage += `*Nome:* ${nome}\n`;
    whatsappMessage += `*Telefone:* ${telefone}\n`;
    if(email) whatsappMessage += `*E-mail:* ${email}\n`;
    whatsappMessage += `*Serviço:* ${servicoNome}\n\n`;
    whatsappMessage += `*Mensagem:*\n${mensagem}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/5551998379668?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Show success feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>✓ Enviado! Redirecionando...</span>';
    submitBtn.style.background = '#4caf50';
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      form.reset();
    }, 2000);
  });
  
  // Phone mask
  const telefoneInput = document.getElementById('telefone');
  if(telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if(value.length <= 11) {
        if(value.length <= 10) {
          value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        e.target.value = value;
      }
    });
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    if(targetId) scrollToSection(targetId);
  });
});

// Scroll Progress Indicator
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if(!progressBar) return;
  
  function updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress(); // Initial call
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if(!backToTopBtn) return;
  
  function toggleButton() {
    if(window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleButton, { passive: true });
  toggleButton(); // Initial call
}

// Enhanced Form Validation
function enhanceFormValidation() {
  const form = document.getElementById('contactForm');
  if(!form) return;
  
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    // Real-time validation
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      if(input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
  
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error state
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message');
    if(existingError) {
      existingError.remove();
    }
    
    // Required field validation
    if(field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    }
    
    // Email validation
    if(field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um e-mail válido';
      }
    }
    
    // Phone validation
    if(field.type === 'tel' && value) {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if(!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um telefone válido';
      }
    }
    
    // Show error if invalid
    if(!isValid) {
      field.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = errorMessage;
      field.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
  }
  
  // Form submission validation
  form.addEventListener('submit', (e) => {
    let formValid = true;
    
    inputs.forEach(input => {
      if(!validateField(input)) {
        formValid = false;
      }
    });
    
    if(!formValid) {
      e.preventDefault();
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if(firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

// Scroll events with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
  if(scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    reveal();
    handleNavbarScroll();
  });
}, { passive: true });

// Animated Counter
function animateCounter() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        if (counter.getAttribute('data-target') === '100') {
          counter.textContent = Math.floor(current) + '%';
        } else {
          counter.textContent = Math.floor(current) + '+';
        }
        requestAnimationFrame(updateCounter);
      } else {
        if (counter.getAttribute('data-target') === '100') {
          counter.textContent = target + '%';
        } else {
          counter.textContent = target + '+';
        }
      }
    };
    
    // Start animation when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counter.classList.contains('animated')) {
          counter.classList.add('animated');
          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// Image lazy loading enhancement
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const img = entry.target;
          if(img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.style.opacity = '1';
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.style.opacity = '1';
    });
  }
}

// Performance: Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    'images/trabalhos/trabalho1.jpeg',
    'images/trabalhos/trabalho2.jpeg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
  reveal();
  handleNavbarScroll();
  animateCounter();
  initMobileMenu();
  initGalleryModal();
  initContactForm();
  initLazyLoading();
  preloadCriticalImages();
  initScrollProgress();
  initBackToTop();
  enhanceFormValidation();
});

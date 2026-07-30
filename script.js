/**
 * Hajira Baloch - Personal Portfolio JS
 * Interactive features: Neural network background, typing effect, scroll animations, project sorting.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initCanvasBackground();
  initProjectFilter();
  initGithubStats();
  initBackToTop();
  initContactForm();
});

/* ==========================================================================
   Github Stats Dynamic Generation
   ========================================================================== */
function initGithubStats() {
  const grid = document.getElementById('github-grid');
  if (!grid) return;

  // Create 53 columns (weeks)
  for (let i = 0; i < 53; i++) {
    const col = document.createElement('div');
    col.className = 'github-col-placeholder';
    
    // Create 7 squares per column (days of week)
    for (let j = 0; j < 7; j++) {
      const square = document.createElement('div');
      square.className = 'github-square';
      
      // Randomize levels for a realistic layout placeholder
      const rand = Math.random();
      if (rand > 0.92) {
        square.classList.add('level-4');
      } else if (rand > 0.82) {
        square.classList.add('level-3');
      } else if (rand > 0.65) {
        square.classList.add('level-2');
      } else if (rand > 0.40) {
        square.classList.add('level-1');
      }
      
      col.appendChild(square);
    }
    grid.appendChild(col);
  }
}

/* ==========================================================================
   Navbar & Navigation Logic
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      // Accessibility states
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active Navigation Link Tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in main view
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Typing Subheading Effect
   ========================================================================== */
function initTypingEffect() {
  const textElement = document.querySelector('.hero-subtitle span');
  if (!textElement) return;

  const roles = [
    "BS Data Science Student",
    "AI & Machine Learning Enthusiast",
    "Data Research Assistant"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting character
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Delete faster
    } else {
      // Typing character
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Determine state changes
    if (!isDeleting && charIndex === currentRole.length) {
      // Finished typing, pause before deleting
      isDeleting = true;
      typingSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Brief pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  // Start the typing loop
  setTimeout(type, 800);
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to keep element visible once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Reveal slightly before entering viewport
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Canvas Interactive Neural Network Background
   ========================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let isTabActive = true;
  let isCanvasInView = true;

  // Track page visibility to pause canvas loops
  document.addEventListener('visibilitychange', () => {
    isTabActive = document.visibilityState === 'visible';
    handleAnimationLoop();
  });

  // Track if canvas is in view (optimization)
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasInView = entry.isIntersecting;
      handleAnimationLoop();
    });
  });
  canvasObserver.observe(canvas);

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // Dynamic particle density
  const connectionDistance = 120;
  const mouse = { x: null, y: null, radius: 150 };

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      // Boundary check
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Update positions
      this.x += this.vx;
      this.y += this.vy;

      // Mouse interactive push/pull
      if (mouse.x != null && mouse.y != null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Subtly push particles away from mouse
          this.x += (dx / dist) * force * 0.5;
          this.y += (dy / dist) * force * 0.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 180, 216, 0.45)';
      ctx.fill();
    }
  }

  // Generate particles
  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connections
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          // Fade connection based on distance
          const alpha = (connectionDistance - dist) / connectionDistance * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 180, 216, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // Main animation loop
  function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    
    animationFrameId = requestAnimationFrame(loop);
  }

  function handleAnimationLoop() {
    if (isTabActive && isCanvasInView) {
      if (!animationFrameId) {
        loop();
      }
    } else {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  // Initialize
  initParticles();
  handleAnimationLoop();
}

/* ==========================================================================
   Project Categorization & Filtering
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          // Force reflow and re-trigger simple scale reveal
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Back-to-Top Floating Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Contact Form Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');

    let isValid = true;

    // Check simple validations
    if (!nameInput.value.trim()) {
      showInputError(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      clearInputError(nameInput);
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      showInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearInputError(emailInput);
    }

    if (!messageInput.value.trim()) {
      showInputError(messageInput, 'Please enter a message');
      isValid = false;
    } else {
      clearInputError(messageInput);
    }

    if (isValid) {
      // Mock submit state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.backgroundColor = '#2ec4b6';
        submitBtn.style.borderColor = '#2ec4b6';
        submitBtn.style.color = '#ffffff';

        // Clear Form inputs
        form.reset();

        // Restore button state after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1500);
    }
  });

  function showInputError(input, message) {
    input.style.borderColor = '#ff4d4d';
    // Accessibility alert (could be expanded)
    input.setAttribute('aria-invalid', 'true');
  }

  function clearInputError(input) {
    input.style.borderColor = '';
    input.setAttribute('aria-invalid', 'false');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}

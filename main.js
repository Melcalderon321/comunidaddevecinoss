/* ============================================================
   SECURACOM — main.js
   Interactions: navbar scroll, quiz steps, form, FAQ, observers
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. NAVBAR — scroll behaviour
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  /* ──────────────────────────────────────────────
     2. SMOOTH SCROLL — all anchor links
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────────
     3. HERO CALL FORM — submit
  ────────────────────────────────────────────── */
  const heroCallForm = document.getElementById('hero-call-form');
  if (heroCallForm) {
    heroCallForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById('hero-phone-input');
      const privacyCheck = document.getElementById('hero-privacy');
      const phone = phoneInput.value.trim();

      if (!phone || phone.length < 9) {
        shakeElement(phoneInput);
        phoneInput.focus();
        return;
      }

      if (!privacyCheck.checked) {
        shakeElement(privacyCheck.closest('label'));
        return;
      }

      // Success feedback
      const btn = heroCallForm.querySelector('.btn-call');
      btn.textContent = '✓ Te llamamos pronto';
      btn.style.background = '#16a34a';
      btn.disabled = true;
      phoneInput.value = '';

      setTimeout(() => {
        btn.innerHTML = 'TE LLAMAMOS <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    });
  }

  /* ──────────────────────────────────────────────
     4. INTERACTIVE QUIZ / COTIZADOR
  ────────────────────────────────────────────── */
  const quizSteps     = document.querySelectorAll('.quiz-step');
  const progSteps     = document.querySelectorAll('.progress-step');
  const quizSuccess   = document.getElementById('quiz-success');
  const quizWrapper   = document.getElementById('quiz-wrapper');

  let currentStep = 1;
  let quizData = {
    problem: null,
    accesses: null,
    phone: null,
  };

  // Option buttons (steps 1 & 2)
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function () {
      const step = parseInt(this.dataset.step);
      const value = this.dataset.value;

      // Visual selection
      const siblings = document.querySelectorAll(`[data-step="${step}"]`);
      siblings.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');

      if (step === 1) quizData.problem = value;
      if (step === 2) quizData.accesses = value;

      // Auto-advance after short delay
      setTimeout(() => goToStep(step + 1), 350);
    });
  });

  // Contact form submit
  const quizContactForm = document.getElementById('quiz-contact-form');
  if (quizContactForm) {
    quizContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById('quiz-phone');
      const phone = phoneInput.value.trim();

      if (!phone || phone.length < 9) {
        shakeElement(phoneInput);
        phoneInput.focus();
        return;
      }

      quizData.phone = phone;

      // Animate out the step, show success
      const step3 = document.getElementById('quiz-step-3');
      step3.style.opacity = '0';
      step3.style.transform = 'scale(0.96)';

      setTimeout(() => {
        step3.classList.remove('active');
        quizSuccess.removeAttribute('hidden');
        quizSuccess.style.animation = 'slide-in 0.4s ease forwards';

        // Mark all progress done
        progSteps.forEach(ps => {
          ps.classList.remove('active');
          ps.classList.add('completed');
        });
      }, 280);
    });
  }

  function goToStep(nextStep) {
    if (nextStep > 3) return;

    // Hide current
    const currentEl = document.getElementById(`quiz-step-${currentStep}`);
    if (currentEl) {
      currentEl.style.opacity = '0';
      currentEl.style.transform = 'translateX(-20px)';
      currentEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

      setTimeout(() => {
        currentEl.classList.remove('active');
        currentEl.style.opacity = '';
        currentEl.style.transform = '';
        currentEl.style.transition = '';

        // Show next
        const nextEl = document.getElementById(`quiz-step-${nextStep}`);
        if (nextEl) {
          nextEl.classList.add('active');
        }

        // Update progress
        updateProgress(nextStep);
        currentStep = nextStep;

        // Scroll quiz into view
        quizWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 250);
    }
  }

  function updateProgress(step) {
    progSteps.forEach((ps, idx) => {
      const stepNum = idx + 1;
      ps.classList.remove('active', 'completed');
      if (stepNum < step) ps.classList.add('completed');
      if (stepNum === step) ps.classList.add('active');
    });
  }

  /* ──────────────────────────────────────────────
     5. FAQ — subtle open/close animation
  ────────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('.faq-question');
    if (!summary) return;

    item.addEventListener('toggle', () => {
      if (item.open) {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = '0';
          answer.style.overflow = 'hidden';
          answer.style.transition = 'max-height 0.35s ease';
          requestAnimationFrame(() => {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          });
        }
      }
    });
  });

  /* ──────────────────────────────────────────────
     6. INTERSECTION OBSERVER — fade-up animations
  ────────────────────────────────────────────── */
  const animatableSelectors = [
    '.sol-card-new',
    '.tech-col-center',
    '.process-step',
    '.contadores-image-card',
    '.contadores-feature-row',
    '.trust-item',
    '.faq-item',
    '.trust-logo-item',
  ];

  const fadeTargets = document.querySelectorAll(animatableSelectors.join(','));
  fadeTargets.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(el => observer.observe(el));

  /* Also observe section headers */
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });

  /* ──────────────────────────────────────────────
     7. MOBILE STICKY BAR — hide when footer visible
  ────────────────────────────────────────────── */
  const stickyBar = document.getElementById('mobile-sticky-bar');
  const footer    = document.getElementById('footer');

  if (stickyBar && footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        stickyBar.style.opacity = entry.isIntersecting ? '0' : '1';
        stickyBar.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
  }

  /* ──────────────────────────────────────────────
     8. PHONE NUMBER FORMATTING — hero & quiz
  ────────────────────────────────────────────── */
  const formatPhone = (input) => {
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '').slice(0, 9);
      let formatted = '';
      if (val.length > 6) {
        formatted = val.slice(0,3) + ' ' + val.slice(3,6) + ' ' + val.slice(6);
      } else if (val.length > 3) {
        formatted = val.slice(0,3) + ' ' + val.slice(3);
      } else {
        formatted = val;
      }
      input.value = formatted;
    });
  };

  const heroPhoneInput = document.getElementById('hero-phone-input');
  const quizPhoneInput = document.getElementById('quiz-phone');
  if (heroPhoneInput) formatPhone(heroPhoneInput);
  if (quizPhoneInput) formatPhone(quizPhoneInput);

  /* ──────────────────────────────────────────────
     9. UTILITY — shake animation for validation
  ────────────────────────────────────────────── */
  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 500);
  }

  // Inject shake keyframes dynamically
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }

  /* ──────────────────────────────────────────────
     10. HERO IMAGE — copy to project root
         (hero_portal.jpg must be in same directory)
  ────────────────────────────────────────────── */
  // If hero image fails to load, use a CSS gradient fallback
  const heroBgImg = document.getElementById('hero-bg-img');
  if (heroBgImg) {
    heroBgImg.addEventListener('error', () => {
      heroBgImg.style.display = 'none';
      document.querySelector('.hero').style.background =
        'linear-gradient(135deg, #0d1b35 0%, #162040 50%, #1e2f58 100%)';
    });
  }

  /* ──────────────────────────────────────────────
     11. PROMO COUNTDOWN TIMER
  ────────────────────────────────────────────── */
  const startCountdown = () => {
    const countdownDuration = 24 * 60 * 60 * 1000;
    let targetTime = localStorage.getItem('promo_target_time');

    if (!targetTime || new Date().getTime() > parseInt(targetTime)) {
      const initialMs = (23 * 3600 + 27 * 60 + 46) * 1000;
      targetTime = new Date().getTime() + initialMs;
      localStorage.setItem('promo_target_time', targetTime.toString());
    } else {
      targetTime = parseInt(targetTime);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      let diff = targetTime - now;

      if (diff <= 0) {
        targetTime = new Date().getTime() + countdownDuration;
        localStorage.setItem('promo_target_time', targetTime.toString());
        diff = countdownDuration;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');

      const h1 = document.getElementById('timer-h1');
      const h2 = document.getElementById('timer-h2');
      const m1 = document.getElementById('timer-m1');
      const m2 = document.getElementById('timer-m2');
      const s1 = document.getElementById('timer-s1');
      const s2 = document.getElementById('timer-s2');

      if (h1) h1.textContent = hStr[0];
      if (h2) h2.textContent = hStr[1];
      if (m1) m1.textContent = mStr[0];
      if (m2) m2.textContent = mStr[1];
      if (s1) s1.textContent = sStr[0];
      if (s2) s2.textContent = sStr[1];
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  };

  startCountdown();

  /* ──────────────────────────────────────────────
     12. TECHNOLOGY CAROUSEL
  ────────────────────────────────────────────── */
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track ? track.children : []);
  const btnPrev = document.getElementById('carousel-btn-prev');
  const btnNext = document.getElementById('carousel-btn-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const dots = Array.from(dotsContainer ? dotsContainer.children : []);

  if (track && slides.length > 0) {
    let currentIndex = 0;

    const updateCarousel = (index) => {
      // Boundaries
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentIndex = index;

      // Translate track
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots active class
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    // Click events for buttons
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
      });
    }

    // Click events for dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
      });
    });

    // Optional: Auto play every 5 seconds
    let autoPlayInterval = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 5000);

    // Pause autoplay on mouse hover or touch
    const carouselEl = document.getElementById('tech-carousel');
    if (carouselEl) {
      const stopAutoPlay = () => clearInterval(autoPlayInterval);
      const startAutoPlay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
          updateCarousel(currentIndex + 1);
        }, 5000);
      };
      
      carouselEl.addEventListener('mouseenter', stopAutoPlay);
      carouselEl.addEventListener('mouseleave', startAutoPlay);
      carouselEl.addEventListener('touchstart', stopAutoPlay, { passive: true });
      carouselEl.addEventListener('touchend', startAutoPlay, { passive: true });
    }
  }

  /* ──────────────────────────────────────────────
     13. LIGHTBOX FOR CAROUSEL IMAGES
  ────────────────────────────────────────────── */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightboxModal && lightboxImg) {
    // Add click listeners to all carousel slide images
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    carouselImages.forEach(img => {
      // Style cursor to show it is zoomable
      img.style.cursor = 'zoom-in';

      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // disable scrolling
      });
    });

    // Close on click close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        closeLightbox();
      });
    }

    // Close on click overlay background (outside the image)
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close on press Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = ''; // restore scrolling
      setTimeout(() => {
        lightboxImg.src = '';
      }, 350); // clear source after transition ends
    }
  }

});

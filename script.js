/* ========================================
   CLEANSWEEP CLONE - JavaScript
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      // Close all
      faqItems.forEach((i) => i.classList.remove("active"));
      // Toggle clicked
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // ---- Hide/Show Header on Scroll Direction ----
  const header = document.getElementById("header");
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling DOWN — hide
          header.classList.add("header-hidden");
        } else {
          // Scrolling UP — show
          header.classList.remove("header-hidden");
        }
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- Download Banner Visibility ----
  const banner = document.getElementById("download-banner");
  let bannerTimeout;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 600) {
      banner.classList.add("visible");
    } else {
      banner.classList.remove("visible");
    }
  });

  // ---- Scroll-Driven Hero Animations ----
  // Phone is now CSS sticky — no JS needed for phone position.
  // JS handles: content fade, cleaner parallax, scroll indicator, maroon hint, phone bounds.
  const heroContent = document.querySelector(".hero-content");
  const heroCleanerLeft = document.querySelector(".hero-cleaner-left");
  const heroCleanerRight = document.querySelector(".hero-cleaner-right");
  const heroScrollIndicator = document.getElementById("hero-scroll-indicator");
  const heroMaroonHint = document.querySelector(".hero-maroon-hint");
  const heroSection = document.getElementById("hero");
  const heroPhone = document.getElementById("hero-phone");
  const servicesSection = document.getElementById("services");

  if (heroSection) {
    let rafId = null;

    function updateHeroScroll() {
      const scrollY = window.scrollY;
      const heroH = heroSection.offsetHeight;
      // progress: 0 at top, 1 when hero is fully scrolled past
      const progress = Math.min(Math.max(scrollY / (heroH * 0.6), 0), 1);

      // Cleaners parallax: move slower (0.15× scroll speed)
      const parallaxOffset = scrollY * 0.15;
      if (heroCleanerLeft) {
        heroCleanerLeft.style.transform = `translateY(-${parallaxOffset}px)`;
      }
      if (heroCleanerRight) {
        heroCleanerRight.style.transform = `translateY(-${parallaxOffset}px)`;
      }

      // Hero content: fade out + slight upward shift
      const contentOpacity = Math.max(1 - progress * 2, 0);
      const contentShift = progress * 30;
      if (heroContent) {
        heroContent.style.opacity = contentOpacity;
        heroContent.style.transform = `translateY(-${contentShift}px)`;
      }

      // Scroll indicator: fade out quickly
      if (heroScrollIndicator) {
        heroScrollIndicator.style.opacity = Math.max(1 - progress * 5, 0);
      }

      // Maroon hint: intensify
      if (heroMaroonHint) {
        heroMaroonHint.style.opacity = Math.min(0.5 + progress * 1.5, 1);
      }

      rafId = null;
    }

    window.addEventListener("scroll", () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateHeroScroll);
      }
    });

    // Initial call
    updateHeroScroll();
  }

  // ---- Scroll Animations (Intersection Observer) ----
  const animateElements = document.querySelectorAll(
    ".service-card, .step-card, .why-card, .testimonial-card, .spotlight-logo, .faq-item",
  );

  animateElements.forEach((el) => {
    el.classList.add("fade-in");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animateElements.forEach((el) => observer.observe(el));

  // ---- Smooth Scroll for Nav Links ----
  document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---- Staggered fade-in for service cards ----
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // ---- Staggered fade-in for step cards ----
  const stepCards = document.querySelectorAll(".step-card");
  stepCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });

  // ---- Staggered fade-in for why cards ----
  const whyCards = document.querySelectorAll(".why-card");
  whyCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

  // ---- Staggered fade-in for testimonials ----
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  testimonialCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // ---- Counter Animation for 6000+ ----
  const familiesNumber = document.querySelector(".families-number");
  if (familiesNumber) {
    const familiesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(familiesNumber, 0, 6000, 2000);
            familiesObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    familiesObserver.observe(familiesNumber);
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const plus = element.querySelector(".plus");

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const value = Math.floor(start + (end - start) * eased);

      element.textContent = value.toLocaleString();
      if (plus) {
        element.appendChild(plus);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Parallax sparkles ----
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    document.querySelectorAll(".sparkle").forEach((sparkle) => {
      sparkle.style.transform = `translateY(${scrollY * 0.1}px)`;
    });
  });

  // ---- Hide Download Banner on Footer Scroll ----
  const footerElement = document.querySelector(".footer");
  const downloadBanner = document.getElementById("download-banner");

  if (footerElement && downloadBanner) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Footer is visible, hide banner
          downloadBanner.style.opacity = '0';
          downloadBanner.style.pointerEvents = 'none';
        } else {
          // Footer is not visible, show banner
          downloadBanner.style.opacity = '1';
          downloadBanner.style.pointerEvents = 'auto';
        }
      });
    }, {
      root: null,
      threshold: 0.1 // Trigger when 10% of footer is visible
    });

    // Add CSS transition for smooth hide/show
    downloadBanner.style.transition = 'opacity 0.3s ease-in-out';

    observer.observe(footerElement);
  }
});

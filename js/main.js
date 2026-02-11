/* ============================================
   THIS IS HAVANA - Main JavaScript
   Navigation, Animations, Interactions
   ============================================ */

(function () {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initScrollAnimations();
    initFAQAccordion();
    initSmoothScroll();
    initPhotoStrip();
  }

  // =============================================
  // NAVIGATION
  // =============================================
  function initNavigation() {
    var nav = document.getElementById('nav');
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (!nav) return;

    // Scroll behavior - add scrolled class
    var lastScroll = 0;
    var scrollThreshold = 50;

    function handleScroll() {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on init

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        var isActive = hamburger.classList.contains('active');
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isActive);
        document.body.style.overflow = isActive ? '' : 'hidden';
      });

      // Close mobile menu on link click
      var mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close on escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // =============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // =============================================
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if (!animatedElements.length) return;

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      animatedElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =============================================
  // FAQ ACCORDION
  // =============================================
  function initFAQAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var questionBtn = item.querySelector('.faq-item__question');
      var answer = item.querySelector('.faq-item__answer');

      if (!questionBtn || !answer) return;

      questionBtn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            var otherAnswer = otherItem.querySelector('.faq-item__answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0';
            }
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // =============================================
  // SMOOTH SCROLL for anchor links
  // =============================================
  function initSmoothScroll() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = 80;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  // =============================================
  // PHOTO STRIP - Pause on hover
  // =============================================
  function initPhotoStrip() {
    var tracks = document.querySelectorAll('.photo-strip__track');

    tracks.forEach(function (track) {
      track.addEventListener('mouseenter', function () {
        track.style.animationPlayState = 'paused';
      });

      track.addEventListener('mouseleave', function () {
        track.style.animationPlayState = 'running';
      });
    });
  }

})();

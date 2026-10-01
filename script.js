document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Navbar scrolled state ---------- */
  const navbar = document.getElementById('navbar');
  function updateNavbarState() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNavbarState();
  }, { passive: true });

  updateProgress();
  updateNavbarState();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Fade-in on scroll ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
    fadeObserver.observe(el);
  });

  /* ---------- Before/after toggle comparisons (scoped per widget) ---------- */
  document.querySelectorAll('.toggle-compare').forEach(group => {
    const tabsWrap = group.querySelector('.toggle-tabs');
    const tabs = group.querySelectorAll('.toggle-tab');
    const panels = group.querySelectorAll('.permission-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const state = tab.getAttribute('data-state');
        if (tabsWrap.getAttribute('data-active') === state) return;
        tabsWrap.setAttribute('data-active', state);
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        panels.forEach(panel => {
          panel.classList.toggle('is-active', panel.getAttribute('data-panel') === state);
        });
      });
    });
  });

  /* ---------- Expandable challenge (CAO) cards — tap/click to expand ---------- */
  const caoCards = document.querySelectorAll('.cao-card');
  caoCards.forEach(card => {
    const body = card.querySelector('.cao-body');

    const open = () => {
      card.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    };

    const close = () => {
      card.classList.remove('open');
      body.style.maxHeight = '0';
    };

    const toggle = () => card.classList.contains('open') ? close() : open();

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

});

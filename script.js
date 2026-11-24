/**
 * Humayon Kabir — Portfolio Interactive Script (Vanilla JS)
 */

const THEME_KEY = 'hk-portfolio-theme';
const ROLE_PHRASES = [
  'digital operations',
  'web interfaces',
  'IT & security systems',
];

function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggleBtn');
  const label = document.getElementById('themeToggleLabel');
  const sunIcon = document.getElementById('themeIconSun');
  const moonIcon = document.getElementById('themeIconMoon');

  const savedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    if (label && sunIcon && moonIcon) {
      if (theme === 'dark') {
        label.textContent = 'Light Mode';
        sunIcon.hidden = false;
        moonIcon.hidden = true;
      } else {
        label.textContent = 'Dark Mode';
        sunIcon.hidden = true;
        moonIcon.hidden = false;
      }
    }
  };

  applyTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

function initScrollProgressAndNav() {
  const progressBar = document.getElementById('scrollProgress');
  const navLinks = Array.from(document.querySelectorAll('.primary-nav .nav-link'));
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute('href');
      return href ? document.querySelector(href) : null;
    })
    .filter((el) => el instanceof HTMLElement);

  const updateOnScroll = () => {
    if (progressBar) {
      const doc = document.documentElement;
      const scrollMax = doc.scrollHeight - window.innerHeight;
      const ratio = scrollMax > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollMax)) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    const scrollPosition = window.scrollY + 140;
    let currentId = sections[0] ? sections[0].id : '';
    for (const section of sections) {
      if (section.offsetTop <= scrollPosition) {
        currentId = section.id;
      }
    }

    navLinks.forEach((link) => {
      const targetId = (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', targetId === currentId);
    });
  };

  window.addEventListener('scroll', updateOnScroll, {passive: true});
  updateOnScroll();
}

function initMobileDrawer() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (!menuBtn || !drawer) {
    return;
  }

  const closeDrawer = () => {
    drawer.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', () => {
    const isHidden = drawer.hidden;
    drawer.hidden = !isHidden;
    menuBtn.setAttribute('aria-expanded', String(isHidden));
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) {
      closeDrawer();
    }
  });
}

function initRoleRotator() {
  const rotator = document.getElementById('roleRotator');
  if (!rotator) {
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % ROLE_PHRASES.length;
    const nextPhrase = ROLE_PHRASES[index];

    if (prefersReduced) {
      rotator.textContent = nextPhrase;
      return;
    }

    rotator.classList.remove('is-entering');
    rotator.classList.add('is-leaving');

    window.setTimeout(() => {
      rotator.textContent = nextPhrase;
      rotator.classList.remove('is-leaving');
      // Force reflow so the CSS keyframe animation restarts cleanly
      void rotator.offsetWidth;
      rotator.classList.add('is-entering');
    }, 240);
  }, 2900);
}

function initHeroTiltCard() {
  const card = document.getElementById('heroTiltCard');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!card || prefersReduced || !supportsHover) {
    return;
  }

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    card.style.setProperty('--mx', `${percentX}%`);
    card.style.setProperty('--my', `${percentY}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

function initScrollReveal() {
  const targets = Array.from(document.querySelectorAll('.reveal'));
  if (!targets.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {threshold: 0.1}
  );

  targets.forEach((el) => observer.observe(el));
}

function initFilterGroup(buttonSelector, itemSelector, btnAttr, itemAttr) {
  const buttons = Array.from(document.querySelectorAll(buttonSelector));
  const items = Array.from(document.querySelectorAll(itemSelector));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.getAttribute(btnAttr) || 'all';

      buttons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      items.forEach((item) => {
        const category = item.getAttribute(itemAttr);
        const matches = selected === 'all' || category === selected;
        item.classList.toggle('is-hidden', !matches);
        if (matches) {
          item.classList.add('is-visible');
        }
      });
    });
  });
}

function initCopyButtons() {
  const copyButtons = Array.from(document.querySelectorAll('.copy-btn'));
  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      if (!value) {
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        const originalText = button.textContent || 'Copy';
        button.textContent = 'Copied';
        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1600);
      } catch {
        button.textContent = 'Unavailable';
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!(form instanceof HTMLFormElement) || !feedback) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('senderName') || '').trim();
    const email = String(formData.get('senderEmail') || '').trim();
    const subject = String(formData.get('senderSubject') || '').trim();
    const message = String(formData.get('senderMessage') || '').trim();

    feedback.hidden = false;
    feedback.classList.remove('is-error', 'is-success');

    if (!name || !email || !message) {
      feedback.classList.add('is-error');
      feedback.textContent = 'Please complete your name, email address, and message.';
      return;
    }

    const encodedSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
    const encodedBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    feedback.classList.add('is-success');
    feedback.textContent = 'Opening your email app to send the message to humayonkabir.cse50@gmail.com.';

    window.location.href = `mailto:humayonkabir.cse50@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
  });
}

function initPrintButton() {
  const printBtn = document.getElementById('printCvBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function initApp() {
  initThemeToggle();
  initScrollProgressAndNav();
  initMobileDrawer();
  initRoleRotator();
  initHeroTiltCard();
  initScrollReveal();
  initFilterGroup('[data-exp-filter]', '[data-exp-category]', 'data-exp-filter', 'data-exp-category');
  initFilterGroup('[data-skill-filter]', '[data-skill-category]', 'data-skill-filter', 'data-skill-category');
  initCopyButtons();
  initContactForm();
  initPrintButton();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

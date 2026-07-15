const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const typewriter = document.getElementById('typewriter');
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const glow = document.querySelector('.background-glow');

const phrases = [
  'Neural interfaces tuned for velocity.',
  'Cognition accelerated, visuals elevated.',
  'Human instinct, machine precision.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (!typewriter) return;

  if (!isDeleting) {
    typewriter.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    typewriter.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex -= 1;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 60 : 90);
}

function toggleNav() {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeNav() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}

function handleScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}

function animateCounter(entry) {
  const stat = entry.target;
  const target = Number(stat.querySelector('strong')?.dataset.target || 0);
  const bar = stat.querySelector('.progress-bar span');
  const value = stat.querySelector('strong');

  if (!value || !bar) return;

  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(target * eased);
    value.textContent = `${currentValue}%`;
    bar.style.width = `${currentValue}%`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('stat-card')) {
          animateCounter(entry);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

document.querySelectorAll('.stat-card').forEach((item) => revealObserver.observe(item));

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeNav();
  }
});

navToggle?.addEventListener('click', toggleNav);
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNav);
});

window.addEventListener('mousemove', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  glow.style.left = `${x}px`;
  glow.style.top = `${y}px`;
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name');
  formMessage.textContent = `Signal received, ${name || 'agent'}. The protocol is ready.`;
  form.reset();
});

typeLoop();
handleScroll();

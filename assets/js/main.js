// Utility: select
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Theme toggle with persistence
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.classList.add('light');
  updateThemeIcon();
  $('#themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
  });
}
function updateThemeIcon() {
  const icon = $('#themeIcon');
  const light = document.documentElement.classList.contains('light');
  icon.className = light ? 'ri-moon-line' : 'ri-sun-line';
}

// Header active links on scroll
function initScrollSpy() {
  const links = $$('.nav-link');
  const sections = links.map(l => $(l.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = links.find(l => l.getAttribute('href') === id);
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(sec => observer.observe(sec));
}

// Particles background
async function initParticles() {
  if (!window.tsParticles) return;
  await tsParticles.load({ id: 'tsparticles', options: {
    background: { color: 'transparent' },
    fpsLimit: 60,
    particles: {
      number: { value: 70, density: { enable: true, area: 800 } },
      color: { value: ['#5ad1ff', '#a88bff', '#ffffff'] },
      links: { enable: true, color: '#4aa8d1', opacity: 0.3, width: 1 },
      move: { enable: true, speed: 0.6, outModes: { default: 'bounce' } },
      opacity: { value: 0.4 },
      size: { value: { min: 0.8, max: 2.2 } },
    },
    interactivity: {
      detectsOn: 'window',
      events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.3 } }
    }
  }});
}

// Typing animation
function initTyping() {
  if (!window.Typed) return;
  new Typed('#typing', {
    strings: ['Inovação, Criatividade & Estratégia', 'Soluções em IA de ponta', 'Experiências digitais imersivas'],
    typeSpeed: 40,
    backSpeed: 20,
    backDelay: 1800,
    loop: true,
    smartBackspace: true,
    showCursor: true,
    cursorChar: '▍'
  });
}

// Scroll indicator
function initScrollIndicator() {
  const btn = $('.scroll-indicator');
  btn?.addEventListener('click', () => {
    document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// 3D tilt cards
function initCards3D() {
  const cards = $$('.card3d');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 10;
      const rotateX = (0.5 - y / rect.height) * 10;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// Portfolio filter and lightbox
let iso;
let lightbox;
function initPortfolio() {
  if (window.Isotope) {
    iso = new Isotope('#portfolioGrid', {
      itemSelector: '.grid-item',
      layoutMode: 'masonry',
      masonry: { columnWidth: '.grid-item', fitWidth: false }
    });
  }
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      iso?.arrange({ filter });
    });
  });

  lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    selector: '.grid-item',
  });

  // AI suggestions based on tags overlap
  const items = $$('.grid-item').map(el => ({
    el,
    title: el.dataset.title || el.getAttribute('data-title') || 'Projeto',
    tags: (el.dataset.tags || '').split(',').map(s => s.trim()).filter(Boolean),
    filter: Array.from(el.classList).find(c => ['design', 'ia', 'software', 'estrategia'].includes(c)) || '*',
    href: el.getAttribute('href'),
    img: $('img', el)?.getAttribute('src')
  }));

  function renderSuggestions(seedEl) {
    const seed = items.find(i => i.el === seedEl);
    if (!seed) return;
    const scored = items
      .filter(i => i !== seed)
      .map(i => ({ ...i, score: i.tags.filter(t => seed.tags.includes(t)).length }))
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    const list = $('#aiList');
    list.innerHTML = '';
    if (scored.length === 0) {
      list.innerHTML = '<span class="ai-chip">Sem sugestões no momento</span>';
      return;
    }
    scored.forEach(s => {
      const a = document.createElement('a');
      a.href = s.href; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'ai-chip';
      a.textContent = `${s.title} · ${s.tags.slice(0,2).join(' / ')}`;
      list.appendChild(a);
    });
  }

  $$('#portfolioGrid .grid-item').forEach(el => {
    el.addEventListener('click', () => renderSuggestions(el));
  });
}

// AOS
function initAOS() { AOS?.init({ duration: 700, once: true, offset: 60, easing: 'ease-out' }); }

// Globe (Meu Universo IA)
function initGlobe() {
  if (!window.Globe) return;
  const container = document.getElementById('globeContainer');
  const globe = Globe()(container)
    .height(container.clientHeight)
    .width(container.clientWidth)
    .backgroundColor('rgba(0,0,0,0)')
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .pointsData([
      { lat: -23.55, lng: -46.63, name: 'São Paulo', info: 'Mini-case: Pipeline de IA em produção', href: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
      { lat: 37.77, lng: -122.42, name: 'San Francisco', info: 'Mini-case: Agentes Autônomos', href: 'https://vimeo.com/193734241' },
      { lat: 51.50, lng: -0.12, name: 'London', info: 'Mini-case: Branding Tech', href: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }
    ])
    .pointAltitude(0.02)
    .pointColor(() => '#5ad1ff')
    .pointLabel(d => `${d.name}: ${d.info}`)
    .onPointClick(d => {
      // Open mini-case in lightbox
      GLightbox({ elements: [{ href: d.href, type: 'video' }] }).open();
      // start audio once user interacts
      tryStartAudio();
    });

  window.addEventListener('resize', () => {
    globe.width(container.clientWidth).height(container.clientHeight);
  });
}

// Ambient audio toggle
function initAudio() {
  const audio = $('#ambientAudio');
  const btn = $('#audioToggle');
  const icon = $('#audioIcon');
  btn.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); icon.className = 'ri-volume-up-line'; } catch { /* ignore */ }
    } else { audio.pause(); icon.className = 'ri-volume-mute-line'; }
  });
}
function tryStartAudio() {
  const audio = $('#ambientAudio');
  if (audio && audio.paused) {
    audio.volume = 0.25;
    audio.play().catch(() => {});
  }
}

// IA Escola background code rain
function initCodeCanvas() {
  const canvas = document.getElementById('codeCanvas');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() {
    w = canvas.width = canvas.offsetWidth = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.offsetHeight = 260;
  }
  resize();
  window.addEventListener('resize', resize);
  const chars = '01 AI <> {} [] () |=+*#';
  const fontSize = 14;
  let columns = Math.floor(w / fontSize);
  let drops = new Array(columns).fill(1);
  function draw() {
    ctx.fillStyle = 'rgba(10,12,16,0.15)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#5ad1ff';
    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Contact form validation
function initForm() {
  const form = $('#contactForm');
  const success = $('#formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const name = $('#name'); const email = $('#email'); const message = $('#message');
    $('#errorName').textContent = name.value.trim().length >= 2 ? '' : 'Informe seu nome.';
    ok = ok && (name.value.trim().length >= 2);
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $('#errorEmail').textContent = re.test(email.value) ? '' : 'Email inválido.';
    ok = ok && re.test(email.value);
    $('#errorMessage').textContent = message.value.trim().length >= 10 ? '' : 'Mensagem muito curta.';
    ok = ok && (message.value.trim().length >= 10);
    if (ok) {
      success.textContent = 'Mensagem enviada! Retornarei em breve.';
      form.reset();
      setTimeout(() => success.textContent = '', 4000);
    }
  });
}

// Footer year
function setYear() { const y = new Date().getFullYear(); $('#year').textContent = y; }

// AOS safety for dynamic heights
function refreshAOSOnLoad() { setTimeout(() => AOS?.refreshHard(), 800); }

// Init
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollSpy();
  initParticles();
  initTyping();
  initScrollIndicator();
  initCards3D();
  initPortfolio();
  initAOS();
  initGlobe();
  initAudio();
  initCodeCanvas();
  initForm();
  setYear();
  refreshAOSOnLoad();
});


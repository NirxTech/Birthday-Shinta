// Birthday Gift Website — Consolidated JavaScript

// ─────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────
const ANNIVERSARY_DATE = new Date('2025-08-22T00:00:00');
const PASSCODE = '1605';
const BIRTH_MONTH = 3; // April (0-indexed)
const BIRTH_DAY = 16;

const TRACKS = [
  { title: 'Shape of My Heart', artist: 'Backstreet Boys', duration: '4:35', src: 'Audio/Backstreet%20Boys%20-%20Shape%20of%20My%20Heart.mp3' },
  { title: 'Semenjak Ada Dirimu', artist: 'Yovie Widianto, HIVI!', duration: '4:04', src: 'Audio/Semenjak%20Ada%20Dirimu%20-%20Yovie%20Widianto,%20HIVI.mp3' },
  { title: 'One Call Away', artist: 'Charlie Puth', duration: '3:15', src: 'Audio/Charlie%20Puth%20-%20One%20Call%20Away.mp3' },
  { title: 'Perempuanku', artist: 'Irwansyah', duration: '4:22', src: 'Audio/Irwansyah%20-%20Perempuanku.mp3' },
  { title: 'Surat Cinta Untuk Starla', artist: 'Virgoun', duration: '4:44', src: 'Audio/Virgoun%20-%20Surat%20Cinta%20Untuk%20Starla.mp3' },
  { title: 'Bergema Sampai Selamanya', artist: 'Nadhif Basalamah', duration: '3:58', src: 'Audio/Nadhif%20Basalamah%20-%20bergema%20sampai%20selamanya.mp3' },
  { title: 'Out of My League', artist: 'LANY', duration: '3:17', src: 'Audio/LANY%20-%20Out%20Of%20My%20League.mp3' },
  { title: 'Will U?', artist: 'Glenn Samuel', duration: '3:48', src: 'Audio/Glenn%20Samuel%20-%20Will%20U.mp3' },
  { title: "It's You", artist: 'Sezairi', duration: '3:40', src: 'Audio/Its%20You%20-%20Sezairi.mp3' },
  { title: 'Cantik', artist: 'Kahitna', duration: '3:54', src: 'Audio/Kahitna%20-%20Cantik.mp3' },
];

// ─────────────────────────────────────────────
//  SECURITY GATE + HERO ENVELOPE
// ─────────────────────────────────────────────
let typedPin = '';
const pinDots = document.querySelectorAll('.pin-dot');
const pinError = document.getElementById('pin-error');

function updatePinDots() {
  pinDots.forEach((dot, i) => dot.classList.toggle('filled', i < typedPin.length));
}

function unlockPage() {
  document.body.classList.remove('locked');
  document.getElementById('security-gate').classList.add('hidden');
}

function checkPin() {
  if (typedPin === PASSCODE) {
    unlockPage();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 110, spread: 92, origin: { y: 0.48 }, colors: ['#E8956D', '#C97B4B', '#F2C4A0', '#ffffff'] });
    }
    return;
  }
  pinError.textContent = 'Kode belum tepat, coba lagi ya.';
  typedPin = '';
  updatePinDots();
  setTimeout(() => { pinError.textContent = ''; }, 1500);
}

document.getElementById('pin-pad')?.addEventListener('click', (e) => {
  const key = e.target.closest('.pin-key');
  if (!key) return;
  const action = key.dataset.action;
  if (action === 'clear') {
    typedPin = typedPin.slice(0, -1);
    updatePinDots();
    return;
  }
  if (action === 'reset') {
    typedPin = '';
    updatePinDots();
    return;
  }
  if (typedPin.length >= 4) return;
  typedPin += key.textContent.trim();
  updatePinDots();
  if (typedPin.length === 4) setTimeout(checkPin, 180);
});

document.addEventListener('keydown', (e) => {
  if (!document.body.classList.contains('locked')) return;
  if (e.key >= '0' && e.key <= '9' && typedPin.length < 4) {
    typedPin += e.key;
    updatePinDots();
    if (typedPin.length === 4) setTimeout(checkPin, 180);
  }
  if (e.key === 'Backspace') {
    typedPin = typedPin.slice(0, -1);
    updatePinDots();
  }
});

document.getElementById('hero-envelope')?.addEventListener('click', () => {
  const hero = document.getElementById('hero');
  if (hero.classList.contains('hero-opened')) return;
  hero.classList.add('hero-opened');
  if (typeof confetti === 'function') {
    confetti({ particleCount: 160, spread: 120, origin: { y: 0.58 }, colors: ['#E8956D', '#C97B4B', '#F2C4A0', '#ffffff'] });
  }
});

// ─────────────────────────────────────────────
//  PETAL / HEART CANVAS
// ─────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let petals = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(232,149,109,.55)', 'rgba(242,196,160,.5)', 'rgba(201,123,75,.4)', 'rgba(253,220,190,.6)'];

  function Petal() {
    this.reset();
  }
  Petal.prototype.reset = function() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = 5 + Math.random() * 9;
    this.speed = .4 + Math.random() * .7;
    this.drift = (Math.random() - .5) * .6;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - .5) * .04;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = .3 + Math.random() * .5;
  };
  Petal.prototype.update = function() {
    this.y += this.speed;
    this.x += this.drift + Math.sin(this.y * .02) * .5;
    this.angle += this.spin;
    if (this.y > canvas.height + 20) this.reset();
  };
  Petal.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, s * .35);
    ctx.bezierCurveTo(s * .5, -s * .1, s, s * .3, 0, s);
    ctx.bezierCurveTo(-s, s * .3, -s * .5, -s * .1, 0, s * .35);
    ctx.fill();
    ctx.restore();
  };

  for (let i = 0; i < 22; i++) {
    const p = new Petal();
    p.y = Math.random() * canvas.height;
    petals.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─────────────────────────────────────────────
//  RELATIONSHIP COUNTER
// ─────────────────────────────────────────────
function updateCounter() {
  const now = new Date();
  const diff = now - ANNIVERSARY_DATE;
  const totalMinutes = Math.floor(diff / 60000);
  const totalHours = Math.floor(diff / 3600000);
  const totalDays = Math.floor(diff / 86400000);
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;

  const daysEl = document.getElementById('cnt-days');
  const hoursEl = document.getElementById('cnt-hours');
  const minutesEl = document.getElementById('cnt-minutes');
  const secondsEl = document.getElementById('cnt-seconds');

  if (daysEl) daysEl.textContent = totalDays.toLocaleString('id-ID');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}
updateCounter();
setInterval(updateCounter, 1000);

// ─────────────────────────────────────────────
//  SCROLL REVEAL
// ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, idx) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add('visible'), idx * 130);
    timelineObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });
timelineItems.forEach(item => timelineObserver.observe(item));

// ─────────────────────────────────────────────
//  SCRATCH CARD
// ─────────────────────────────────────────────
(function initScratchCard() {
  const shell = document.getElementById('scratch-shell');
  const canvas = document.getElementById('scratch-canvas');
  const fill = document.getElementById('scratch-meter-fill');
  if (!shell || !canvas || !fill) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let totalPixels = 0;
  let revealed = false;

  function resize() {
    canvas.width = shell.clientWidth;
    canvas.height = shell.clientHeight;
    totalPixels = canvas.width * canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#B88A70');
    gradient.addColorStop(.5, '#D4A282');
    gradient.addColorStop(1, '#A77457');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,.72)';
    ctx.font = `600 ${Math.floor(canvas.width / 16)}px Jost, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('GOSOK DI SINI', canvas.width / 2, canvas.height / 2);
    fill.style.width = '0%';
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function erase(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function updateReveal() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparentPixels++;
    }
    const pct = (transparentPixels / totalPixels) * 100;
    fill.style.width = `${Math.min(100, pct)}%`;
    if (!revealed && pct >= 52) {
      revealed = true;
      canvas.style.transition = 'opacity .7s ease';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 84, origin: { y: .7 }, colors: ['#E8956D', '#C97B4B', '#F2C4A0'] });
      }
    }
  }

  canvas.addEventListener('mousedown', (e) => { drawing = true; const p = getPos(e); erase(p.x, p.y); updateReveal(); });
  canvas.addEventListener('mousemove', (e) => { if (!drawing) return; const p = getPos(e); erase(p.x, p.y); updateReveal(); });
  window.addEventListener('mouseup', () => { drawing = false; });
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; const p = getPos(e); erase(p.x, p.y); updateReveal(); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (!drawing) return; const p = getPos(e); erase(p.x, p.y); updateReveal(); }, { passive: false });
  window.addEventListener('touchend', () => { drawing = false; });

  resize();
  window.addEventListener('resize', resize);
})();

// ─────────────────────────────────────────────
//  WISH JAR
// ─────────────────────────────────────────────
const wishKey = 'shintaWishJar';
function renderWishes() {
  const list = document.getElementById('wish-list');
  if (!list) return;
  const wishes = JSON.parse(localStorage.getItem(wishKey) || '[]');
  list.innerHTML = wishes.length
    ? wishes.map((w) => `<div class="wish-item">${w}</div>`).join('')
    : '<div class="wish-item">Belum ada wish. Tulis satu yang paling manis.</div>';
}

document.getElementById('wish-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('wish-input');
  const value = input.value.trim();
  if (!value) return;
  const wishes = JSON.parse(localStorage.getItem(wishKey) || '[]');
  wishes.unshift(value);
  localStorage.setItem(wishKey, JSON.stringify(wishes.slice(0, 8)));
  input.value = '';
  renderWishes();
});

renderWishes();

// ─────────────────────────────────────────────
//  PLAYLIST PLAYER
// ─────────────────────────────────────────────
let currentIdx = -1;
let isPlaying = false;
const audio = document.getElementById('audio-player');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

function renderTracks() {
  const list = document.getElementById('track-list');
  if (!list) return;
  list.innerHTML = TRACKS.map((t, i) => `
    <div class="track-card ${i === currentIdx ? 'active' : ''}" onclick="selectTrack(${i})">
      <span class="track-num">${i + 1}</span>
      <div class="flex-1 min-w-0">
        <div class="track-title truncate">${t.title}</div>
        <div class="track-artist truncate">${t.artist}</div>
      </div>
      <span class="track-duration">${t.duration}</span>
    </div>
  `).join('');
}

function selectTrack(idx) {
  currentIdx = idx;
  const t = TRACKS[idx];
  const titleEl = document.getElementById('now-playing-title');
  const artistEl = document.getElementById('now-playing-artist');
  if (titleEl) titleEl.textContent = t.title;
  if (artistEl) artistEl.textContent = t.artist;

  if (t.src) {
    audio.src = t.src;
    audio.play().then(() => { isPlaying = true; updatePlayBtn(); }).catch(() => { });
  } else {
    isPlaying = true;
    updatePlayBtn();
    simulateProgress(t.duration);
  }
  renderTracks();
}

let simInterval = null;
let simSec = 0;

function simulateProgress(durationStr) {
  clearInterval(simInterval);
  simSec = 0;
  const parts = durationStr.split(':');
  const totalSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);

  simInterval = setInterval(() => {
    if (!isPlaying) return;
    simSec++;
    const pct = Math.min((simSec / totalSec) * 100, 100);
    const fillEl = document.getElementById('progress-fill');
    if (fillEl) fillEl.style.width = pct + '%';
    const timeEl = document.getElementById('time-display');
    if (timeEl) timeEl.textContent = formatTime(simSec);
    if (simSec >= totalSec) { clearInterval(simInterval); nextTrack(); }
  }, 1000);
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function togglePlay() {
  if (currentIdx < 0) { selectTrack(0); return; }
  isPlaying = !isPlaying;
  if (audio.src) { isPlaying ? audio.play() : audio.pause(); }
  updatePlayBtn();
}

function updatePlayBtn() {
  if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
  if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
}

function nextTrack() { selectTrack((currentIdx + 1) % TRACKS.length); }
function prevTrack() { selectTrack((currentIdx - 1 + TRACKS.length) % TRACKS.length); }

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const fillEl = document.getElementById('progress-fill');
  if (fillEl) fillEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
  const timeEl = document.getElementById('time-display');
  if (timeEl) timeEl.textContent = formatTime(Math.floor(audio.currentTime));
});
audio.addEventListener('ended', nextTrack);

document.getElementById('progress-bar')?.addEventListener('click', function (e) {
  const rect = this.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  if (audio.duration) { audio.currentTime = pct * audio.duration; }
});

renderTracks();

// ─────────────────────────────────────────────
//  OCCASIONAL HEART BURST on scroll
// ─────────────────────────────────────────────
let lastBurst = 0;
window.addEventListener('scroll', () => {
  if (Date.now() - lastBurst < 2500) return;
  lastBurst = Date.now();
  spawnHeartBurst();
});

function spawnHeartBurst() {
  const emojis = ['*', '+', 'x', 'o', '.'];
  for (let i = 0; i < 5; i++) {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const size = 14 + Math.random() * 14;
    const dur = 3 + Math.random() * 3;
    const rot = (Math.random() - .5) * 30 + 'deg';
    el.style.cssText = `
      left: ${5 + Math.random() * 90}%;
      bottom: 5%;
      --dur: ${dur}s;
      --size: ${size}px;
      --rot: ${rot};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 200);
  }
}

// ─────────────────────────────────────────────
//  SWEET & SIMPLE
// ─────────────────────────────────────────────
const reasons = [
  'Kamu selalu bikin rumah terasa hangat, bahkan dari jauh.',
  'Caramu mendengar membuat semua cerita terasa layak diperjuangkan.',
  'Tawamu jatuh pelan dan selalu menenangkan hari yang ramai.',
  'Kamu tetap lembut, bahkan saat dunia sedang keras.',
  'Kamu membuat hal sederhana jadi penuh makna dan hangat diingat.',
  'Kamu memberi ruang untuk aku tumbuh tanpa kehilangan aku.',
  'Matamu menyimpan rasa ingin tahu yang selalu bikin aku kagum.',
  'Bersamamu, aku seperti pulang ke tempat yang paling aku rindukan.'
];

const reasonsTrack = document.getElementById('reasons-track');
const reasonsDots = document.getElementById('reasons-dots');
const prevReasonBtn = document.getElementById('reason-prev');
const nextReasonBtn = document.getElementById('reason-next');
let reasonIndex = 0;

function renderReasonSlides() {
  if (!reasonsTrack || !reasonsDots) return;
  reasonsTrack.innerHTML = reasons.map((text, i) => (
    `<div class="reason-slide">
      <span class="reason-tag">Alasan ${String(i + 1).padStart(2, '0')}</span>
      <p class="reason-line">${text}</p>
    </div>`
  )).join('');

  reasonsDots.innerHTML = reasons.map((_, i) => (
    `<span class="reasons-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
  )).join('');
}

function updateReasonSlider(index) {
  if (!reasonsTrack || !reasonsDots) return;
  reasonIndex = (index + reasons.length) % reasons.length;
  reasonsTrack.style.transform = `translateX(-${reasonIndex * 100}%)`;
  const dots = reasonsDots.querySelectorAll('.reasons-dot');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === reasonIndex));
}

renderReasonSlides();
updateReasonSlider(0);

prevReasonBtn?.addEventListener('click', () => updateReasonSlider(reasonIndex - 1));
nextReasonBtn?.addEventListener('click', () => updateReasonSlider(reasonIndex + 1));
reasonsDots?.addEventListener('click', (e) => {
  const dot = e.target.closest('.reasons-dot');
  if (!dot) return;
  updateReasonSlider(Number(dot.dataset.index));
});

// ─────────────────────────────────────────────
//  PORTRAITS
// ─────────────────────────────────────────────
const portraitImages = [
  'Foto%20Shinta/Foto%201.jpg',
  'Foto%20Shinta/Foto%202.jpg',
  'Foto%20Shinta/Foto%203.jpg',
  'Foto%20Shinta/Foto%204.jpg',
  'Foto%20Shinta/Foto%205.jpg',
  'Foto%20Shinta/Foto%206.jpg',
  'Foto%20Shinta/Foto%207.jpg',
  'Foto%20Shinta/Foto%209.jpg',
  'Foto%20Shinta/Foto%2010.jpg',
  'Foto%20Shinta/Foto%2011.jpg',
  'Foto%20Shinta/Foto%2012.jpg'
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const portraitTrack = document.getElementById('portrait-track');
const portraitDots = document.getElementById('portrait-dots');
const prevPortraitBtn = document.getElementById('portrait-prev');
const nextPortraitBtn = document.getElementById('portrait-next');
let portraitIndex = 0;

function renderPortraits() {
  if (!portraitTrack || !portraitDots) return;
  const shuffled = shuffleArray([...portraitImages]);
  portraitTrack.innerHTML = shuffled.map((src, i) => (
    `<div class="portrait-slide">
      <div class="portrait-frame">
        <img src="${src}" alt="Potret Shinta ${i + 1}" loading="lazy" />
      </div>
      <div class="portrait-caption">Potret ${String(i + 1).padStart(2, '0')}</div>
    </div>`
  )).join('');

  portraitDots.innerHTML = shuffled.map((_, i) => (
    `<span class="portrait-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
  )).join('');
}

function updatePortraitSlider(index) {
  if (!portraitTrack || !portraitDots) return;
  const total = portraitTrack.children.length;
  portraitIndex = (index + total) % total;
  portraitTrack.style.transform = `translateX(-${portraitIndex * 100}%)`;
  const dots = portraitDots.querySelectorAll('.portrait-dot');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === portraitIndex));
}

renderPortraits();
updatePortraitSlider(0);

prevPortraitBtn?.addEventListener('click', () => updatePortraitSlider(portraitIndex - 1));
nextPortraitBtn?.addEventListener('click', () => updatePortraitSlider(portraitIndex + 1));
portraitDots?.addEventListener('click', (e) => {
  const dot = e.target.closest('.portrait-dot');
  if (!dot) return;
  updatePortraitSlider(Number(dot.dataset.index));
});

// ─────────────────────────────────────────────
//  GALLERY SHUFFLE
// ─────────────────────────────────────────────
const galleryGrid = document.querySelector('#gallery .gallery-grid');
if (galleryGrid) {
  const items = Array.from(galleryGrid.children);
  const shuffled = shuffleArray(items);
  shuffled.forEach((item) => galleryGrid.appendChild(item));
}

/**
 * Neneng Fatmah (NEFA) — Live Streaming Host & Content Creator Portfolio
 * Interactive Application & 19-Slide Controller
 * Matching Canva Y2K Pink & Checkered Aesthetic
 */

// Application State
let currentMode = 'slide'; // 'slide' (presentation mode) or 'scroll' (vertical web scroll)
let currentSlideIndex = 1;
const totalSlides = 19;

// DOM Elements
const body = document.body;
const btnSlideMode = document.getElementById('btnSlideMode');
const btnScrollMode = document.getElementById('btnScrollMode');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const slideCounterText = document.getElementById('slideCounterText');
const slideDotsContainer = document.getElementById('slideDotsContainer');
const prevSlideBtn = document.getElementById('prevSlideBtn');
const nextSlideBtn = document.getElementById('nextSlideBtn');
const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSlideDots();
  initNavListeners();
  initKeyboardNav();
  initTouchSwipe();
  initVideoControls();

  // Set default mode to slide presentation (matching Canva presentation)
  setMode('slide');
});

// Subtle tactile sound effect (Web Audio API)
function playTactileSound(freq = 600) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Silently ignore if browser restricts audio autoplay
  }
}

/* ==========================================================================
   MODE SWITCHER: SLIDE PRESENTATION vs VERTICAL SCROLL
   ========================================================================== */
function setMode(mode) {
  currentMode = mode;
  playTactileSound(750);

  if (mode === 'slide') {
    body.classList.add('mode-slide-deck');
    if (btnSlideMode) btnSlideMode.classList.add('active');
    if (btnScrollMode) btnScrollMode.classList.remove('active');
    showSlide(currentSlideIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    body.classList.remove('mode-slide-deck');
    if (btnScrollMode) btnScrollMode.classList.add('active');
    if (btnSlideMode) btnSlideMode.classList.remove('active');
    // Display all slides in vertical scroll mode
    document.querySelectorAll('.deck-slide').forEach(slide => {
      slide.style.display = 'block';
      slide.style.opacity = '1';
      slide.style.transform = 'none';
    });
  }

  // Close mobile drawer if open
  if (mobileDrawer && mobileDrawer.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
  }
}

if (btnScrollMode) btnScrollMode.addEventListener('click', () => setMode('scroll'));
if (btnSlideMode) btnSlideMode.addEventListener('click', () => setMode('slide'));

/* ==========================================================================
   SLIDE DECK NAVIGATION (1 to 19)
   ========================================================================== */
function initSlideDots() {
  if (!slideDotsContainer) return;
  slideDotsContainer.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `slide-dot ${i === currentSlideIndex ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Pindah ke slide ${i}`);
    dot.setAttribute('title', `Slide ${i}`);
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
    slideDotsContainer.appendChild(dot);
  }
}

function updateSlideDots() {
  if (!slideDotsContainer) return;
  const dots = slideDotsContainer.querySelectorAll('.slide-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx + 1 === currentSlideIndex);
  });
}

function showSlide(index) {
  if (currentMode !== 'slide') return;

  const slides = document.querySelectorAll('.deck-slide');
  slides.forEach(slide => {
    const sIndex = parseInt(slide.getAttribute('data-slide-index'), 10);
    if (sIndex === index) {
      slide.classList.add('active-slide');
      slide.style.display = 'block';
      // Trigger smooth fade in
      requestAnimationFrame(() => {
        slide.style.opacity = '1';
      });
    } else {
      slide.classList.remove('active-slide');
      slide.style.display = 'none';
      slide.style.opacity = '0';
    }
  });

  if (slideCounterText) {
    slideCounterText.textContent = `Slide ${index} dari ${totalSlides}`;
  }
  updateSlideDots();
}

function goToSlide(index) {
  if (index < 1) index = 1;
  if (index > totalSlides) index = totalSlides;
  currentSlideIndex = index;
  playTactileSound(550);
  showSlide(currentSlideIndex);

  // Pause videos when navigating away from video slides
  document.querySelectorAll('video').forEach(vid => {
    if (!vid.paused) {
      vid.pause();
      const overlay = vid.parentElement ? vid.parentElement.querySelector('.video-overlay-ctrl') : null;
      if (overlay) overlay.classList.remove('playing');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (prevSlideBtn) {
  prevSlideBtn.addEventListener('click', () => {
    if (currentSlideIndex > 1) {
      goToSlide(currentSlideIndex - 1);
    } else {
      goToSlide(totalSlides);
    }
  });
}

if (nextSlideBtn) {
  nextSlideBtn.addEventListener('click', () => {
    if (currentSlideIndex < totalSlides) {
      goToSlide(currentSlideIndex + 1);
    } else {
      goToSlide(1);
    }
  });
}

// Keyboard Navigation
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Avoid hijacking when typing inside form inputs
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (currentMode === 'slide') {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (nextSlideBtn) nextSlideBtn.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (prevSlideBtn) prevSlideBtn.click();
      }
    }
  });
}

// Mobile Touch Swipe Navigation
function initTouchSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (currentMode !== 'slide') return;
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Only swipe if horizontal move is significantly greater than vertical move
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX < 0) {
        // Swiped left -> next slide
        if (nextSlideBtn) nextSlideBtn.click();
      } else {
        // Swiped right -> prev slide
        if (prevSlideBtn) prevSlideBtn.click();
      }
    }
  }
}

// Fullscreen Toggle
if (toggleFullscreenBtn) {
  toggleFullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

/* ==========================================================================
   NAVIGATION & DRAWER LISTENERS
   ========================================================================== */
function initNavListeners() {
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
  }

  // Smooth links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        if (currentMode === 'slide') {
          const sIndex = parseInt(targetEl.getAttribute('data-slide-index'), 10);
          if (sIndex) goToSlide(sIndex);
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
        }
      }
    });
  });
}

/* ==========================================================================
   INTERACTIVE PHONE VIDEO PLAYER
   ========================================================================== */
function initVideoControls() {
  document.querySelectorAll('.phone-screen-frame video').forEach(video => {
    video.addEventListener('ended', () => {
      const overlay = video.parentElement.querySelector('.video-overlay-ctrl');
      if (overlay) overlay.classList.remove('playing');
    });

    video.addEventListener('click', () => {
      const overlay = video.parentElement.querySelector('.video-overlay-ctrl');
      if (overlay) togglePlayVideo(video.id, overlay);
    });
  });
}

function togglePlayVideo(videoId, overlayEl) {
  const video = document.getElementById(videoId);
  if (!video) return;

  playTactileSound(650);

  if (video.paused) {
    // Pause other videos if any
    document.querySelectorAll('video').forEach(v => {
      if (v !== video) {
        v.pause();
        const otherOverlay = v.parentElement ? v.parentElement.querySelector('.video-overlay-ctrl') : null;
        if (otherOverlay) otherOverlay.classList.remove('playing');
      }
    });

    video.play();
    if (overlayEl) overlayEl.classList.add('playing');
  } else {
    video.pause();
    if (overlayEl) overlayEl.classList.remove('playing');
  }
}

/* ==========================================================================
   WHATSAPP DIRECT INQUIRY SUBMISSION
   ========================================================================== */
function handleInquirySubmit(event) {
  event.preventDefault();
  playTactileSound(900);

  const brand = document.getElementById('brandNameInput') ? document.getElementById('brandNameInput').value.trim() : '';
  const pic = document.getElementById('contactPersonInput') ? document.getElementById('contactPersonInput').value.trim() : '';
  const service = document.getElementById('serviceSelect') ? document.getElementById('serviceSelect').value : 'Live Streaming Host';
  const phone = document.getElementById('phoneInput') ? document.getElementById('phoneInput').value.trim() : '';
  const message = document.getElementById('messageInput') ? document.getElementById('messageInput').value.trim() : '';

  const formattedMsg = `Halo Kak Neneng Fatmah (NEFA)! 💖%0A%0A` +
    `Salam kenal, saya *${pic}* dari *${brand}*.%0A` +
    `Saya melihat portofolio Canva Kakak dan tertarik untuk bekerja sama di bidang:%0A` +
    `📌 *${service}*%0A%0A` +
    `*Catatan Kebutuhan / Rencana Jadwal Live:*%0A${encodeURIComponent(message)}%0A%0A` +
    `Nomor WhatsApp PIC: ${phone}%0A%0A` +
    `Kira-kira kapan ada waktu untuk berdiskusi lebih lanjut? Terima kasih banyak Kak Neneng!`;

  const waUrl = `https://wa.me/6285926090441?text=${formattedMsg}`;
  window.open(waUrl, '_blank');
}

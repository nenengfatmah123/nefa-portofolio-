/**
 * Neneng Fatmah (NEFA) — Live Streaming Host & Content Creator Portfolio
 * Official 19-Slide Presentation Application & Controller
 * Matching Canva Y2K Pink & Checkered Aesthetic
 */

// Application State
let currentMode = 'slide'; // 'slide' (16:9 presentation) or 'scroll' (vertical web scroll)
let currentSlideIndex = 1;
const totalSlides = 19;
let autoPlayTimer = null;
let isSoundEnabled = true;

// Slide Titles for 19 Slides
const slideTitles = [
  "01 · Cover Portfolio",
  "02 · Introduction (5 Tahun Pengalaman)",
  "03 · Passion for Makeup Artistry",
  "04 · Rekor Absensi & Disiplin Kerja",
  "05 · Favorite Makeup Creations (Live Selling)",
  "06 · Produksi Konten Harian TikTok (40k & 68k Views)",
  "07 · Divider: Social Media Strategy",
  "08 · 4-Pillar Content Playbook (Stop the Scroll)",
  "09 · Studi Kasus Beauty (@cantikcuan.id)",
  "10 · Studi Kasus Fashion (Video Interaktif Bocil)",
  "11 · Funnel From Scroll to Sale",
  "12 · Divider: Portfolio Achievements",
  "13 · Juara 1 Best GMV Rp 191 Juta (Neneng Fatmah)",
  "14 · Top 3 Selling Focallure Shopee",
  "15 · Top 5 Selling Pinkflash Beauty TikTok",
  "16 · Top 5 Selling Focallure Indonesia Live TikTok",
  "17 · Best Makeup Points (+2 Point Audit)",
  "18 · What I Bring to Your Team (Specialist & Creator)",
  "19 · Thank You & Kontak Kolaborasi"
];

// DOM Elements
const body = document.body;
const btnSlideMode = document.getElementById('btnSlideMode');
const btnScrollMode = document.getElementById('btnScrollMode');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const slideCounterText = document.getElementById('slideCounterText');
const slideBadgeTitle = document.getElementById('slideBadgeTitle');
const slideDotsContainer = document.getElementById('slideDotsContainer');
const slideProgressFill = document.getElementById('slideProgressFill');
const prevSlideBtn = document.getElementById('prevSlideBtn');
const nextSlideBtn = document.getElementById('nextSlideBtn');
const toggleAutoPlayBtn = document.getElementById('toggleAutoPlayBtn');
const toggleSoundBtn = document.getElementById('toggleSoundBtn');
const soundIcon = document.getElementById('soundIcon');
const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSlideDots();
  initKeyboardNav();
  initTouchSwipe();
  initVideoInline();

  // Set default mode to slide presentation (matching Canva presentation)
  setMode('slide');
});

// Tactile Sound Effect (Web Audio API)
function playTactileSound(freq = 600) {
  if (!isSoundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Silently ignore if audio blocked by autoplay policy
  }
}

/* ==========================================================================
   MODE SWITCHER: SLIDE PRESENTATION (16:9) vs VERTICAL SCROLL
   ========================================================================== */
function setMode(mode) {
  currentMode = mode;
  playTactileSound(700);

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
    
    // Stop autoplay when in scroll mode
    stopAutoPlay();

    // Show all slides sequentially
    document.querySelectorAll('.deck-slide').forEach(slide => {
      slide.style.display = 'block';
      slide.style.opacity = '1';
    });
  }

  // Close mobile drawer if open
  if (mobileDrawer && mobileDrawer.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
  }
}

if (btnScrollMode) btnScrollMode.addEventListener('click', () => setMode('scroll'));
if (btnSlideMode) btnSlideMode.addEventListener('click', () => setMode('slide'));

if (mobileMenuBtn && mobileDrawer) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });
}

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
    dot.setAttribute('title', slideTitles[i - 1] || `Slide ${i}`);
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
      requestAnimationFrame(() => {
        slide.style.opacity = '1';
      });
    } else {
      slide.classList.remove('active-slide');
      slide.style.display = 'none';
      slide.style.opacity = '0';
    }
  });

  // Update header text, badge and progress
  if (slideCounterText) {
    slideCounterText.textContent = `Slide ${index} dari ${totalSlides}`;
  }
  if (slideBadgeTitle) {
    slideBadgeTitle.textContent = `🌸 ${slideTitles[index - 1] || 'NENENG FATMAH PORTFOLIO'}`;
  }
  if (slideProgressFill) {
    const pct = ((index / totalSlides) * 100).toFixed(2);
    slideProgressFill.style.width = `${pct}%`;
  }

  updateSlideDots();
}

function goToSlide(index) {
  if (index < 1) index = 1;
  if (index > totalSlides) index = totalSlides;
  currentSlideIndex = index;
  playTactileSound(550);

  // If in scroll mode, switch to slide mode or scroll into view
  if (currentMode === 'scroll') {
    const target = document.getElementById(`slide-${index}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    showSlide(currentSlideIndex);
  }

  // Pause videos when navigating away from Slide 10
  if (index !== 10) {
    const vid = document.getElementById('vidFashionBocil');
    if (vid && !vid.paused) {
      vid.pause();
      const overlay = document.getElementById('videoHotspotOverlay');
      if (overlay) overlay.classList.remove('hidden');
    }
  }

  // Close mobile drawer if open
  if (mobileDrawer && mobileDrawer.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
  }

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
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.key === 'Escape') {
      closeVideoModal();
      closeImageModal();
      closeInquiryModal();
      return;
    }

    if (currentMode === 'slide') {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (nextSlideBtn) nextSlideBtn.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (prevSlideBtn) prevSlideBtn.click();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
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
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX < 0) {
        if (nextSlideBtn) nextSlideBtn.click();
      } else {
        if (prevSlideBtn) prevSlideBtn.click();
      }
    }
  }
}

// Slideshow Auto-Play Feature
function toggleAutoPlay() {
  if (autoPlayTimer) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

function startAutoPlay() {
  if (toggleAutoPlayBtn) toggleAutoPlayBtn.classList.add('active');
  playTactileSound(800);
  autoPlayTimer = setInterval(() => {
    if (currentSlideIndex < totalSlides) {
      goToSlide(currentSlideIndex + 1);
    } else {
      goToSlide(1);
    }
  }, 6000); // 6 seconds per slide
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
  if (toggleAutoPlayBtn) toggleAutoPlayBtn.classList.remove('active');
}

if (toggleAutoPlayBtn) {
  toggleAutoPlayBtn.addEventListener('click', toggleAutoPlay);
}

// Sound Toggle Feature
if (toggleSoundBtn) {
  toggleSoundBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    if (soundIcon) soundIcon.textContent = isSoundEnabled ? '🔔' : '🔕';
    if (isSoundEnabled) playTactileSound(900);
  });
}

// Fullscreen Presentation Mode
function toggleFullscreen() {
  playTactileSound(750);
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

if (toggleFullscreenBtn) {
  toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
}

/* ==========================================================================
   INTERACTIVE INLINE VIDEO PLAYER (SLIDE 10)
   ========================================================================== */
function initVideoInline() {
  const video = document.getElementById('vidFashionBocil');
  const hotspot = document.getElementById('videoPhoneHotspot');
  const overlay = document.getElementById('videoHotspotOverlay');

  if (!video) return;

  video.addEventListener('ended', () => {
    if (overlay) overlay.classList.remove('hidden');
    if (hotspot) hotspot.classList.remove('playing');
  });

  video.addEventListener('play', () => {
    if (overlay) overlay.classList.add('hidden');
    if (hotspot) hotspot.classList.add('playing');
  });

  video.addEventListener('pause', () => {
    if (overlay) overlay.classList.remove('hidden');
    if (hotspot) hotspot.classList.remove('playing');
  });
}

function togglePlayVideo(videoId) {
  const video = document.getElementById(videoId);
  const overlay = document.getElementById('videoHotspotOverlay');
  const hotspot = document.getElementById('videoPhoneHotspot');
  if (!video) return;

  playTactileSound(650);

  if (video.paused) {
    video.play().then(() => {
      if (overlay) overlay.classList.add('hidden');
      if (hotspot) hotspot.classList.add('playing');
    }).catch(() => {
      // If unmuted autoplay blocked, mute and play
      video.muted = true;
      video.play();
      if (overlay) overlay.classList.add('hidden');
    });
  } else {
    video.pause();
    if (overlay) overlay.classList.remove('hidden');
    if (hotspot) hotspot.classList.remove('playing');
  }
}

function toggleMuteVideo(videoId, event) {
  if (event) event.stopPropagation();
  const video = document.getElementById(videoId);
  const btn = document.getElementById('videoMuteBtn');
  if (!video) return;

  video.muted = !video.muted;
  playTactileSound(500);
  if (btn) {
    btn.textContent = video.muted ? '🔇' : '🔊';
  }
}

/* ==========================================================================
   MODAL DIALOGS: VIDEO, LIGHTBOX, INQUIRY
   ========================================================================== */
// 1. Video Modal
function openVideoModal(event) {
  if (event) event.stopPropagation();
  const inlineVid = document.getElementById('vidFashionBocil');
  if (inlineVid && !inlineVid.paused) {
    inlineVid.pause();
  }

  const modal = document.getElementById('videoModalBackdrop');
  const modalVid = document.getElementById('modalVideoPlayer');
  if (modal) {
    modal.classList.add('open');
    if (modalVid) {
      modalVid.currentTime = inlineVid ? inlineVid.currentTime : 0;
      modalVid.play().catch(() => {});
    }
  }
}

function closeVideoModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('videoModalBackdrop');
  const modalVid = document.getElementById('modalVideoPlayer');
  if (modalVid) modalVid.pause();
  if (modal) modal.classList.remove('open');
}

// 2. Image Lightbox Modal
function openImageModal(imgSrc, title) {
  playTactileSound(650);
  const modal = document.getElementById('imageModalBackdrop');
  const modalImg = document.getElementById('imageModalSrc');
  const modalTitle = document.getElementById('imageModalTitle');

  if (modal && modalImg) {
    modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title || 'Dokumen Portofolio Neneng Fatmah';
    modal.classList.add('open');
  }
}

function closeImageModal() {
  const modal = document.getElementById('imageModalBackdrop');
  if (modal) modal.classList.remove('open');
}

// 3. Quick WhatsApp Inquiry Modal
function openInquiryModal() {
  playTactileSound(750);
  const modal = document.getElementById('inquiryModalBackdrop');
  if (modal) modal.classList.add('open');
}

function closeInquiryModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('inquiryModalBackdrop');
  if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   WHATSAPP DIRECT INQUIRY SUBMISSION
   ========================================================================== */
function handleInquirySubmit(event) {
  event.preventDefault();
  playTactileSound(950);

  const brand = document.getElementById('brandNameInput') ? document.getElementById('brandNameInput').value.trim() : '';
  const pic = document.getElementById('contactPersonInput') ? document.getElementById('contactPersonInput').value.trim() : '';
  const service = document.getElementById('serviceSelect') ? document.getElementById('serviceSelect').value : 'Live Streaming Host';
  const phone = document.getElementById('phoneInput') ? document.getElementById('phoneInput').value.trim() : '';
  const message = document.getElementById('messageInput') ? document.getElementById('messageInput').value.trim() : '';

  const formattedMsg = `Halo Kak Neneng Fatmah (NEFA)! 💖%0A%0A` +
    `Salam kenal, saya *${pic}* dari *${brand}*.%0A` +
    `Saya melihat portofolio Canva 19 Slide Kakak dan tertarik untuk bekerja sama:%0A` +
    `📌 *Kebutuhan:* ${service}%0A` +
    `📱 *No. WhatsApp:* ${phone}%0A%0A` +
    `*Catatan Brief / Rencana Jadwal:*%0A${encodeURIComponent(message)}%0A%0A` +
    `Kira-kira kapan Kak Neneng ada waktu untuk berdiskusi lebih lanjut? Terima kasih!`;

  const waUrl = `https://wa.me/6285926090441?text=${formattedMsg}`;
  window.open(waUrl, '_blank');

  closeInquiryModal();
}

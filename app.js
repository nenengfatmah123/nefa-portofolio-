/**
 * Neneng Patmah — Portofolio Host Live Streaming & Kreator Konten UGC
 * Logika Aplikasi Interaktif & Kontroler Presentasi Slide
 */

// Data Portofolio untuk Galeri & Lightbox
const portfolioItems = [
  {
    type: 'video',
    category: 'beauty',
    title: 'Ulasan Pinkflash Lipgloss Shade G05',
    tag: 'Kecantikan & Live Selling',
    src: 'web_assets/videos/video_1.mp4',
    poster: 'web_assets/images/video_1.jpg'
  },
  {
    type: 'video',
    category: 'beauty',
    title: 'Rekomendasi Blush On Pinkflash untuk Semua Warna Kulit',
    tag: 'Kosmetik & Swatch Asli',
    src: 'web_assets/videos/video_2.mp4',
    poster: 'web_assets/images/video_2.jpg'
  },
  {
    type: 'video',
    category: 'beauty',
    title: 'Tutorial Aplikasi Highlighter Praktis dengan Jari Tangan',
    tag: 'Tutorial Riasan Praktis',
    src: 'web_assets/videos/video_3.mp4',
    poster: 'web_assets/images/video_3.jpg'
  },
  {
    type: 'video',
    category: 'beauty',
    title: 'Uji Kilau Lip Tint Watery Glam Tahan Lama',
    tag: 'Bibir & Uji Kilau',
    src: 'web_assets/videos/video_4.mp4',
    poster: 'web_assets/images/video_4.jpg'
  },
  {
    type: 'video',
    category: 'skincare',
    title: 'Peluncuran Produk Baru Focallure Juicy Tint',
    tag: 'Kampanye Produk Baru',
    src: 'web_assets/videos/video_5.mp4',
    poster: 'web_assets/images/video_5.jpg'
  },
  {
    type: 'video',
    category: 'fashion',
    title: 'Unboxing & Ulasan Merchandise Pinkflash Pop-Socket',
    tag: 'Unboxing & Merchandise',
    src: 'web_assets/videos/video_6.mp4',
    poster: 'web_assets/images/video_6.jpg'
  },
  {
    type: 'video',
    category: 'beauty',
    title: 'Tutorial Riasan Bibir Ombre Focallure',
    tag: 'Tutorial Kreasi Bibir',
    src: 'web_assets/videos/video_creator_1.mp4',
    poster: 'web_assets/images/video_creator_1.jpg'
  },
  {
    type: 'video',
    category: 'beauty',
    title: 'Tutorial Kontur Wajah & Highlighter Krim Natural',
    tag: 'Kontur & Riasan Sehari-hari',
    src: 'web_assets/videos/video_creator_2.mp4',
    poster: 'web_assets/images/video_creator_2.jpg'
  },
  {
    type: 'photo',
    category: 'beauty',
    title: 'Model Riasan Bibir Ombre Focallure',
    tag: 'Fotografi Model Riasan',
    src: 'web_assets/images/portrait_main.jpg'
  },
  {
    type: 'photo',
    category: 'beauty',
    title: 'Sesi Riasan Natural Kontur & Kilau Wajah',
    tag: 'Riasan Wajah & Kulit',
    src: 'web_assets/images/portrait_natural.jpg'
  },
  {
    type: 'photo',
    category: 'beauty',
    title: 'Koleksi Pinkflash Lasting Glossy Lipgloss Produk Terlaris',
    tag: 'Foto Produk Still',
    src: 'web_assets/images/beauty_1.jpg'
  },
  {
    type: 'photo',
    category: 'skincare',
    title: 'Aplikasi & Swatch Foundation Matte Pinkflash',
    tag: 'Swatch Foundation & Kulit',
    src: 'web_assets/images/product_foundation.jpg'
  },
  {
    type: 'photo',
    category: 'beauty',
    title: 'Kemasan Eksklusif Focallure Pro-Blur Velvety Tint',
    tag: 'Detail Kemasan Produk',
    src: 'web_assets/images/product_velvet.jpg'
  },
  {
    type: 'photo',
    category: 'fashion',
    title: 'Aksesoris Tren Fesyen Twisty.boo Kekinian',
    tag: 'Fesyen & Penataan Gaya',
    src: 'web_assets/images/fashion_accessories.jpg'
  }
];

// Variabel Status Aplikasi
let currentMode = 'scroll'; // 'scroll' (mode web) atau 'slide' (mode presentasi)
let currentSlideIndex = 1;
const totalSlides = 9;

// Elemen DOM
const body = document.body;
const btnScrollMode = document.getElementById('btnScrollMode');
const btnSlideMode = document.getElementById('btnSlideMode');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const slideCounterText = document.getElementById('slideCounterText');
const slideDotsContainer = document.getElementById('slideDotsContainer');
const prevSlideBtn = document.getElementById('prevSlideBtn');
const nextSlideBtn = document.getElementById('nextSlideBtn');
const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');

// Elemen Modal Lightbox
const videoModal = document.getElementById('videoModal');
const modalVideoPlayer = document.getElementById('modalVideoPlayer');
const modalVideoCategory = document.getElementById('modalVideoCategory');
const modalVideoTitle = document.getElementById('modalVideoTitle');

const photoModal = document.getElementById('photoModal');
const modalPhotoImg = document.getElementById('modalPhotoImg');
const modalPhotoCategory = document.getElementById('modalPhotoCategory');
const modalPhotoTitle = document.getElementById('modalPhotoTitle');

const galleryModal = document.getElementById('galleryModal');
const galleryCardsGrid = document.getElementById('galleryCardsGrid');

/* ==========================================================================
   INISIALISASI APLIKASI
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSlideDots();
  initNavListeners();
  renderGalleryGrid('all');
  initKeyboardNav();
});

// Efek Audio Taktil Halus (Web Audio API)
function playTactileSound(freq = 600) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Abaikan jika browser membatasi autoplay audio
  }
}

/* ==========================================================================
   PENGALIH MODE: MODE WEB vs MODE SLIDE CANVA
   ========================================================================== */
function setMode(mode) {
  currentMode = mode;
  playTactileSound(750);

  if (mode === 'slide') {
    body.classList.add('mode-slide-deck');
    btnSlideMode.classList.add('active');
    btnScrollMode.classList.remove('active');
    showSlide(currentSlideIndex);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  } else {
    body.classList.remove('mode-slide-deck');
    btnScrollMode.classList.add('active');
    btnSlideMode.classList.remove('active');
    // Tampilkan kembali seluruh slide untuk mode scroll web
    document.querySelectorAll('.deck-slide').forEach(slide => {
      slide.style.display = 'block';
      slide.style.opacity = '1';
      slide.style.transform = 'none';
    });
  }

  // Tutup menu drawer mobile bila terbuka
  if (mobileDrawer.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
  }
}

btnScrollMode.addEventListener('click', () => setMode('scroll'));
btnSlideMode.addEventListener('click', () => setMode('slide'));

/* ==========================================================================
   NAVIGASI SLIDE DECK (1 SAMPAI 10 SESUAI TEMPLATE CANVA)
   ========================================================================== */
function initSlideDots() {
  slideDotsContainer.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `slide-dot ${i === currentSlideIndex ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Pindah ke slide ${i}`);
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
    slideDotsContainer.appendChild(dot);
  }
}

function updateSlideDots() {
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
    } else {
      slide.classList.remove('active-slide');
    }
  });

  slideCounterText.textContent = `Slide ${index} dari ${totalSlides}`;
  updateSlideDots();
}

function goToSlide(index) {
  if (index < 1) index = 1;
  if (index > totalSlides) index = totalSlides;
  currentSlideIndex = index;
  playTactileSound(550);
  showSlide(currentSlideIndex);
}

prevSlideBtn.addEventListener('click', () => {
  if (currentSlideIndex > 1) {
    goToSlide(currentSlideIndex - 1);
  } else {
    goToSlide(totalSlides);
  }
});

nextSlideBtn.addEventListener('click', () => {
  if (currentSlideIndex < totalSlides) {
    goToSlide(currentSlideIndex + 1);
  } else {
    goToSlide(1);
  }
});

// Navigasi Keyboard (Panah Kiri, Kanan, Spasi, Escape)
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (currentMode === 'slide') {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlideBtn.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlideBtn.click();
      }
    }
    if (e.key === 'Escape') {
      closeVideoModal();
      closePhotoModal();
      closeGalleryModal();
    }
  });
}

// Beralih Layar Penuh (Fullscreen)
toggleFullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

/* ==========================================================================
   NAVIGASI MENU UTAMA & MOBILE
   ========================================================================== */
function initNavListeners() {
  mobileMenuBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });

  // Tautan Gulir Halus
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
        if (mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
        }
      }
    });
  });
}

/* ==========================================================================
   PEMUTAR VIDEO INTERAKTIF DI DALAM LAYAR PONSEL (IPHONE)
   ========================================================================== */
function togglePlayVideo(videoId, overlayEl) {
  const video = document.getElementById(videoId);
  if (!video) return;

  playTactileSound(650);

  if (video.paused) {
    // Hentikan video lain yang sedang diputar di ponsel lain
    document.querySelectorAll('.iphone-screen video').forEach(v => {
      if (v !== video) {
        v.pause();
        const otherOverlay = v.parentElement.querySelector('.video-overlay-ctrl');
        if (otherOverlay) otherOverlay.classList.remove('playing');
      }
    });

    video.play();
    overlayEl.classList.add('playing');
  } else {
    video.pause();
    overlayEl.classList.remove('playing');
  }
}

// Kembalikan tampilan tombol putar saat video selesai
document.querySelectorAll('.iphone-screen video').forEach(video => {
  video.addEventListener('ended', () => {
    const overlay = video.parentElement.querySelector('.video-overlay-ctrl');
    if (overlay) overlay.classList.remove('playing');
  });
  // Klik langsung pada video untuk menjeda
  video.addEventListener('click', () => {
    const overlay = video.parentElement.querySelector('.video-overlay-ctrl');
    if (overlay) togglePlayVideo(video.id, overlay);
  });
});

/* ==========================================================================
   MODAL LIGHTBOX: PEMUTAR VIDEO FULL HD
   ========================================================================== */
function openVideoModal(videoSrc, title, category) {
  playTactileSound(800);
  modalVideoPlayer.src = videoSrc;
  modalVideoTitle.textContent = title;
  modalVideoCategory.textContent = category;
  videoModal.classList.add('open');
  modalVideoPlayer.play().catch(() => {});
}

function closeVideoModal() {
  if (videoModal.classList.contains('open')) {
    modalVideoPlayer.pause();
    modalVideoPlayer.src = '';
    videoModal.classList.remove('open');
  }
}

/* ==========================================================================
   MODAL LIGHTBOX: PENAMPIL FOTO RESOLUSI TINGGI
   ========================================================================== */
function openPhotoModal(imgSrc, category, title) {
  playTactileSound(700);
  modalPhotoImg.src = imgSrc;
  modalPhotoCategory.textContent = category;
  modalPhotoTitle.textContent = title;
  photoModal.classList.add('open');
}

function closePhotoModal() {
  photoModal.classList.remove('open');
}

/* ==========================================================================
   MODAL GALERI PORTOFOLIO LENGKAP & FILTER KATEGORI
   ========================================================================== */
function openGalleryModal(initialFilter = 'all') {
  playTactileSound(750);
  renderGalleryGrid(initialFilter);
  galleryModal.classList.add('open');
}

function closeGalleryModal() {
  galleryModal.classList.remove('open');
}

function filterGallery(category, btnElement) {
  playTactileSound(600);
  const buttons = document.querySelectorAll('.gallery-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  renderGalleryGrid(category);
}

function renderGalleryGrid(category) {
  galleryCardsGrid.innerHTML = '';

  const filtered = category === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === category || item.type === category);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-card-item';
    
    const thumb = item.type === 'video' ? item.poster : item.src;
    
    card.innerHTML = `
      <img src="${thumb}" alt="${item.title}" class="gallery-card-thumb" loading="lazy">
      <div class="gallery-card-caption">
        <span class="gallery-card-tag">${item.tag}</span>
        <h4 class="gallery-card-title">${item.title}</h4>
      </div>
    `;

    card.addEventListener('click', () => {
      if (item.type === 'video') {
        openVideoModal(item.src, item.title, item.tag);
      } else {
        openPhotoModal(item.src, item.tag, item.title);
      }
    });

    galleryCardsGrid.appendChild(card);
  });
}

function closeModalOnBackdrop(event, modalId) {
  if (event.target.id === modalId) {
    if (modalId === 'videoModal') closeVideoModal();
    if (modalId === 'photoModal') closePhotoModal();
    if (modalId === 'galleryModal') closeGalleryModal();
  }
}

/* ==========================================================================
   PENGATUR PAKET TARIF & FORMULIR WHATSAPP
   ========================================================================== */
function selectRatePackage(packageName) {
  playTactileSound(850);
  
  if (currentMode === 'slide') {
    goToSlide(9); // Slide 9 adalah seksi Kontak
  } else {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Pilih otomatis opsi pada dropdown layanan
  const serviceSelect = document.getElementById('serviceSelect');
  if (serviceSelect) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(packageName.toLowerCase()) ||
          packageName.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Fokuskan kursor ke input nama brand
  setTimeout(() => {
    const brandInput = document.getElementById('brandNameInput');
    if (brandInput) brandInput.focus();
  }, 400);
}

function handleInquirySubmit(event) {
  event.preventDefault();
  playTactileSound(900);

  const brand = document.getElementById('brandNameInput').value.trim();
  const pic = document.getElementById('contactPersonInput').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const phone = document.getElementById('phoneInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();

  const formattedMsg = `Halo Kak Neneng Patmah! 🌸%0A%0A` +
    `Salam kenal, saya *${pic}* dari *${brand}*.%0A` +
    `Saya melihat portofolio Kakak dan tertarik untuk bekerja sama di bidang:%0A` +
    `📌 *${service}*%0A%0A` +
    `*Catatan Kebutuhan / Rencana Kampanye:*%0A${encodeURIComponent(message)}%0A%0A` +
    `Nomor Kontak PIC: ${phone}%0A%0A` +
    `Kira-kira kapan ada waktu luang untuk berdiskusi lebih lanjut? Terima kasih banyak Kak Neneng!`;

  const waUrl = `https://wa.me/6285926090441?text=${formattedMsg}`;
  window.open(waUrl, '_blank');
}

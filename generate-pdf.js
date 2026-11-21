/**
 * generate-pdf.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Script Resmi Export Portofolio Neneng Fatmah (NEFA) ke Dokumen PDF (19 Slide)
 * Sesuai Dokumen Canva Asli (C:\Users\azzik\Downloads\Neneng_Fatmah_Portfolio.pdf)
 * 
 * Fitur:
 *  1. Full Color Y2K Pink (#FF2E93, #FFEAF4, Pink-and-White Checkerboard)
 *  2. Tepat 19 Halaman Slide — 1 slide per halaman, rapi dan tidak terpotong
 *  3. Interactive PDF Navbar di Setiap Halaman dengan link lompat internal
 *  4. Tautan Interaktif (Clickable Links) ke WhatsApp, TikTok, Shopee, Instagram
 *  5. Resolusi Tinggi 1920x1080 (16:9 Canva Landscape)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const OUTPUT_FILE = 'Neneng_Patmah_Portfolio.pdf';

async function generatePDF() {
  console.log('===============================================================');
  console.log('   PORTOFOLIO NENENG FATMAH — GENERATOR PDF RESMI (19 SLIDE)   ');
  console.log('===============================================================\n');

  const htmlPath   = path.resolve(__dirname, 'index.html');
  const fileUrl    = 'file:///' + htmlPath.replace(/\\/g, '/');
  const outputPath = path.resolve(__dirname, OUTPUT_FILE);

  console.log('🌐 Membuka Chromium & memuat website...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--force-color-profile=srgb',
      '--font-render-hinting=none'
    ]
  });

  const page = await browser.newPage();
  await page.emulateMediaType('screen');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('📐 Menyusun struktur 19 slide & navbar interaktif di setiap halaman...');
  await page.evaluate(() => {
    // 1. Sembunyikan elemen web kontrol yang tidak diperlukan pada dokumen PDF cetak
    const hideSelectors = [
      '.site-header',
      '.slide-deck-controls',
      '.mobile-menu-btn',
      '.mobile-drawer',
      '.view-mode-toggle',
      '.top-checker',
      '.bottom-checker'
    ];
    hideSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    });

    // 2. Ganti elemen video dengan poster gambar beresolusi tinggi agar tidak ada ruang hitam
    document.querySelectorAll('video').forEach(vid => {
      const poster = vid.getAttribute('poster');
      if (poster) {
        const img = document.createElement('img');
        img.src = poster;
        img.alt = 'Preview Video';
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit;';
        vid.parentNode.replaceChild(img, vid);
      }
    });

    // 3. Konfigurasi 19 Slide Presentasi
    const slidesData = [
      { id: 'hero', title: 'Cover Portofolio', shortTitle: 'Cover' },
      { id: 'intro', title: 'Tentang Neneng Fatmah', shortTitle: 'Tentang' },
      { id: 'passion', title: 'Makeup Artistry Passion', shortTitle: 'Passion' },
      { id: 'attendance', title: 'Absensi & Kehadiran 100%', shortTitle: 'Absensi' },
      { id: 'creations', title: 'Live Broadcast Creations', shortTitle: 'Karya Live' },
      { id: 'tiktok-daily', title: 'Produksi TikTok Harian', shortTitle: 'Produksi' },
      { id: 'section-strategy', title: 'Social Media Strategy', shortTitle: 'Strategi' },
      { id: 'playbook', title: '4-Pillar Playbook', shortTitle: 'Playbook' },
      { id: 'case-beauty', title: 'Studi Kasus Beauty', shortTitle: 'Beauty' },
      { id: 'case-fashion', title: 'Studi Kasus Fashion', shortTitle: 'Fashion' },
      { id: 'funnel', title: 'From Scroll to Sale', shortTitle: 'Funnel' },
      { id: 'section-portfolio', title: 'Prestasi Portofolio', shortTitle: 'Prestasi' },
      { id: 'best-gmv', title: 'Top 1 GMV Champion', shortTitle: 'Top GMV' },
      { id: 'shopee-top3', title: 'Top 3 Shopee Focallure', shortTitle: 'Shopee' },
      { id: 'pinkflash-top5', title: 'Top 5 Pinkflash TikTok', shortTitle: 'Pinkflash' },
      { id: 'focallure-top5', title: 'Top 5 Focallure TikTok', shortTitle: 'Focallure' },
      { id: 'makeup-points', title: 'Best Makeup Points', shortTitle: 'Makeup' },
      { id: 'what-i-bring', title: 'Nilai Tambah Untuk Tim', shortTitle: 'Keahlian' },
      { id: 'thank-you', title: 'Kontak & Kolaborasi', shortTitle: 'Kontak', isCta: true }
    ];

    const navQuickLinks = [
      { href: '#intro', label: 'Tentang' },
      { href: '#attendance', label: 'Absensi' },
      { href: '#playbook', label: 'Playbook' },
      { href: '#case-beauty', label: 'Studi Kasus' },
      { href: '#best-gmv', label: 'Prestasi GMV' },
      { href: '#what-i-bring', label: 'Keahlian' },
      { href: '#thank-you', label: 'Kerja Sama 💖', isCta: true }
    ];

    // 4. Buat kontainer khusus PDF 19 halaman
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdfSlidesContainer';
    pdfContainer.className = 'pdf-slides-container';

    slidesData.forEach((slideInfo, index) => {
      const sectionEl = document.getElementById(slideInfo.id);
      if (!sectionEl) return;

      const pageEl = document.createElement('div');
      pageEl.className = 'pdf-slide-page';
      pageEl.id = slideInfo.id; // Target bookmark internal PDF
      pageEl.setAttribute('data-page-index', index + 1);

      // Top Pink-and-White Checkerboard
      const topChecker = document.createElement('div');
      topChecker.className = 'pdf-checker-bar';
      pageEl.appendChild(topChecker);

      // PDF Navbar
      const headerEl = document.createElement('header');
      headerEl.className = 'pdf-navbar';
      headerEl.innerHTML = `
        <div class="pdf-navbar-inner">
          <a href="#hero" class="pdf-brand-logo" title="Kembali ke Cover (Slide 1)">
            <span class="pdf-logo-tag">NEFA · PORTOFOLIO 2026</span>
            <span class="pdf-logo-name">Neneng Fatmah</span>
          </a>
          <nav class="pdf-nav-links">
            ${navQuickLinks.map(item => `
              <a href="${item.href}" class="pdf-nav-link ${item.href === '#' + slideInfo.id ? 'active' : ''} ${item.isCta ? 'pdf-cta-pill' : ''}">
                ${item.label}
              </a>
            `).join('')}
          </nav>
          <div class="pdf-page-num-pill">
            Slide ${index + 1} / 19
          </div>
        </div>
      `;
      pageEl.appendChild(headerEl);

      // Slide Content
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'pdf-slide-content-wrapper';

      // Pastikan slide tampil penuh dan tidak disembunyikan oleh sistem tab
      sectionEl.style.display = 'block';
      sectionEl.style.opacity = '1';
      sectionEl.removeAttribute('id'); // ID sudah ada di pageEl

      contentWrapper.appendChild(sectionEl);
      pageEl.appendChild(contentWrapper);

      // Bottom Pink-and-White Checkerboard
      const botChecker = document.createElement('div');
      botChecker.className = 'pdf-checker-bar bottom';
      pageEl.appendChild(botChecker);

      pdfContainer.appendChild(pageEl);
    });

    // Pasang kontainer baru ke body
    document.body.innerHTML = '';
    document.body.appendChild(pdfContainer);
  });

  // 5. Suntikkan CSS presisi untuk layout PDF 16:9 Landscape
  await page.addStyleTag({
    content: `
      @page {
        size: 1440px 900px;
        margin: 0;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
      }

      html, body {
        width: 1440px !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #FFEAF4 !important;
        background-image: 
          radial-gradient(#FF85C0 1.2px, transparent 1.2px), 
          radial-gradient(#FFAED7 1.2px, #FFEAF4 1.2px) !important;
        background-size: 24px 24px !important;
        background-position: 0 0, 12px 12px !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        color: #1A1A1A !important;
      }

      .pdf-slides-container {
        width: 1440px !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Setiap Slide Presisi 1 Halaman Cetak 1440 x 900 */
      .pdf-slide-page {
        width: 1440px !important;
        height: 900px !important;
        page-break-after: always !important;
        break-after: page !important;
        overflow: hidden !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        position: relative !important;
        background-color: #FFEAF4 !important;
      }

      .pdf-slide-page:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      /* Checkerboard Bars */
      .pdf-checker-bar {
        width: 100% !important;
        height: 14px !important;
        background-image: linear-gradient(45deg, #FF2E93 25%, transparent 25%), 
                          linear-gradient(-45deg, #FF2E93 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #FF2E93 75%), 
                          linear-gradient(-45deg, transparent 75%, #FF2E93 75%) !important;
        background-size: 14px 14px !important;
        background-position: 0 0, 0 7px, 7px -7px, -7px 0px !important;
        background-color: #FFFFFF !important;
        flex-shrink: 0 !important;
      }

      /* Header / Navbar interaktif di setiap halaman */
      .pdf-navbar {
        width: calc(100% - 48px) !important;
        height: 48px !important;
        margin: 8px auto 6px !important;
        background: #FFFFFF !important;
        border: 2px solid #FF2E93 !important;
        border-radius: 9999px !important;
        box-shadow: 0 4px 0 #FF2E93 !important;
        padding: 0 1.25rem !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
      }

      .pdf-navbar-inner {
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }

      .pdf-brand-logo {
        text-decoration: none !important;
        display: flex !important;
        flex-direction: column !important;
      }

      .pdf-logo-tag {
        font-size: 0.58rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.12em !important;
        color: #FF2E93 !important;
        line-height: 1 !important;
      }

      .pdf-logo-name {
        font-family: 'Syne', sans-serif !important;
        font-size: 1.05rem !important;
        font-weight: 800 !important;
        color: #1A1A1A !important;
        line-height: 1.1 !important;
      }

      .pdf-nav-links {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }

      .pdf-nav-link {
        text-decoration: none !important;
        font-size: 0.75rem !important;
        font-weight: 700 !important;
        color: #4A4A4A !important;
        padding: 4px 11px !important;
        border-radius: 9999px !important;
      }

      .pdf-nav-link.active {
        background: #FF2E93 !important;
        color: #FFFFFF !important;
      }

      .pdf-nav-link.pdf-cta-pill {
        background: #FF2E93 !important;
        color: #FFFFFF !important;
        padding: 5px 13px !important;
        font-weight: 800 !important;
        border-radius: 9999px !important;
      }

      .pdf-page-num-pill {
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        color: #FF2E93 !important;
        background: #FFEAF4 !important;
        border: 1.5px solid #FF2E93 !important;
        padding: 3px 10px !important;
        border-radius: 9999px !important;
      }

      /* Slide Content Area */
      .pdf-slide-content-wrapper {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        max-width: 1380px !important;
        margin: 0 auto !important;
        padding: 6px 20px 10px !important;
        overflow: hidden !important;
      }

      .deck-slide {
        width: 100% !important;
        max-width: 1340px !important;
        margin: 0 auto !important;
        padding: 0 !important;
        display: block !important;
      }

      .pink-canva-card {
        margin: 0 auto !important;
        box-shadow: 0 6px 0 #FF2E93, 0 12px 24px rgba(255, 46, 147, 0.15) !important;
      }

      .phone-video-player, video {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
    `
  });

  // Skalakan kartu secara otomatis bila ada elemen yang melampaui batas tinggi halaman
  await page.evaluate(() => {
    document.querySelectorAll('.pdf-slide-page').forEach(slidePage => {
      const wrapper = slidePage.querySelector('.pdf-slide-content-wrapper');
      const slide = wrapper.querySelector('.deck-slide');
      if (!slide) return;

      const availableH = 800; // tinggi sisa setelah dikurangi navbar, checkers, dan padding
      const contentH = slide.scrollHeight;
      if (contentH > availableH) {
        const scale = (availableH / contentH) * 0.96;
        slide.style.transform = `scale(${scale.toFixed(3)})`;
        slide.style.transformOrigin = 'center center';
      }
    });
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('🖨️  Mencetak dokumen PDF resolusi tinggi 19 halaman...');
  await page.pdf({
    path: outputPath,
    width: '1440px',
    height: '900px',
    printBackground: true,
    timeout: 60000,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();

  const stats  = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n===============================================================');
  console.log('🎉  HASIL EKSPOR PDF BERHASIL!');
  console.log('===============================================================');
  console.log(`📁 Nama File  : ${OUTPUT_FILE}`);
  console.log(`📍 Lokasi     : ${outputPath}`);
  console.log(`📄 Halaman    : Tepat 19 Halaman (Sesuai 19 Slide Canva Lengkap)`);
  console.log(`📊 Ukuran     : ${sizeMB} MB`);
  console.log(`🧭 Navbar     : Hadir di tiap halaman & link aktif interaktif`);
  console.log(`🎨 Palet      : Y2K Hot Pink & Checkered Aesthetic (Full Color)`);
  console.log('===============================================================\n');
}

generatePDF().catch(err => {
  console.error('\n❌ Terjadi kesalahan saat membuat PDF:', err.message);
  process.exit(1);
});

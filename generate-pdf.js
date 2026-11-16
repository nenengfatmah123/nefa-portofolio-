/**
 * generate-pdf.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Script Resmi Export Portofolio Neneng Patmah (Nefa) ke Dokumen PDF
 * 
 * Fitur Utama:
 *  1. Full Color — Menjaga palet Warm Beige (#C7B8A1, #FAF6F0, #181614)
 *  2. Tepat 9 Halaman Slide — 1 slide per halaman, tidak ada yang terpotong
 *  3. Navbar Aktif di Setiap Halaman — Logo & tautan (Tentang, Konten, UGC,
 *     Fotografi, Video, Karya, Ulasan, Kerja Sama) tampil rapi di bagian atas
 *  4. Tautan Interaktif (Clickable Links) — Klik navbar langsung loncat ke slide
 *     tujuan di dalam PDF; klik WhatsApp, Email, & Medsos membuka URL asli
 *  5. File website (index.html, style.css, app.js) 100% TIDAK DIUBAH
 * 
 * Jalankan di terminal:
 *   node generate-pdf.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const OUTPUT_FILE = 'Neneng_Patmah_Portfolio.pdf';

async function generatePDF() {
  console.log('===============================================================');
  console.log('   PORTOFOLIO NENENG PATMAH — GENERATOR PDF RESMI (9 SLIDE)    ');
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
  await page.setViewport({ width: 1240, height: 877, deviceScaleFactor: 2 });

  await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('📐 Menyusun struktur 9 slide & navbar interaktif di setiap halaman...');
  await page.evaluate(() => {
    // 1. Sembunyikan elemen web interaktif yang tidak diperlukan pada dokumen PDF cetak
    const hideSelectors = [
      '.announcement-bar',
      '.floating-wa-btn',
      '#videoModal',
      '#photoModal',
      '#galleryModal',
      '.mobile-menu-btn',
      '.mobile-drawer',
      '.view-mode-toggle',
      '.slide-deck-controls',
      '#siteHeader' // digantikan oleh navbar khusus per halaman
    ];
    hideSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    });

    // 2. Ganti elemen video dengan gambar poster resolusi tinggi agar tidak ada ruang hitam
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

    // 3. Konfigurasi 9 Slide Presentasi
    const slidesData = [
      { id: 'hero', title: 'Beranda' },
      { id: 'about', title: 'Tentang' },
      { id: 'creator', title: 'Konten' },
      { id: 'why-ugc', title: 'UGC' },
      { id: 'photography', title: 'Fotografi' },
      { id: 'recent-work', title: 'Karya' },
      { id: 'videography', title: 'Video' },
      { id: 'reviews', title: 'Ulasan' },
      { id: 'contact', title: 'Kerja Sama' }
    ];

    const navItems = [
      { href: '#about', label: 'Tentang', id: 'about' },
      { href: '#creator', label: 'Konten', id: 'creator' },
      { href: '#why-ugc', label: 'UGC', id: 'why-ugc' },
      { href: '#photography', label: 'Fotografi', id: 'photography' },
      { href: '#videography', label: 'Video', id: 'videography' },
      { href: '#recent-work', label: 'Karya', id: 'recent-work' },
      { href: '#reviews', label: 'Ulasan', id: 'reviews' },
      { href: '#contact', label: 'Kerja Sama', id: 'contact', isCta: true }
    ];

    // 4. Buat kontainer khusus dokumen PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdfSlidesContainer';
    pdfContainer.className = 'pdf-slides-container';

    slidesData.forEach((slideInfo, index) => {
      const sectionEl = document.getElementById(slideInfo.id);
      if (!sectionEl) return;

      const pageEl = document.createElement('div');
      pageEl.className = 'pdf-slide-page';
      pageEl.id = slideInfo.id; // ID unik untuk target jump bookmark internal PDF
      pageEl.setAttribute('data-page-index', index + 1);

      // --- Header / Navbar interaktif pada tiap halaman ---
      const headerEl = document.createElement('header');
      headerEl.className = 'pdf-navbar';
      headerEl.innerHTML = `
        <div class="pdf-navbar-inner">
          <a href="#hero" class="pdf-brand-logo" title="Kembali ke Beranda (Slide 1)">
            <span class="pdf-logo-name">Neneng Patmah</span>
            <span class="pdf-logo-sub">LIVE HOST & KREATOR KONTEN</span>
          </a>
          <nav class="pdf-nav-links">
            ${navItems.map(item => `
              <a href="${item.href}" class="pdf-nav-link ${item.id === slideInfo.id ? 'active' : ''} ${item.isCta ? 'pdf-cta-pill' : ''}">
                ${item.label}
              </a>
            `).join('')}
          </nav>
        </div>
      `;
      pageEl.appendChild(headerEl);

      // --- Isi Kartu Slide ---
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'pdf-slide-content-wrapper';

      sectionEl.removeAttribute('id');
      const canvaCard = sectionEl.querySelector('.canva-card') || sectionEl;

      // Optimasi tata letak Mosaik Karya (Slide 6)
      if (slideInfo.id === 'recent-work') {
        const inner = canvaCard.querySelector('.card-inner');
        if (inner && !inner.querySelector('.slide-recent-work-top-bar')) {
          const topBar = document.createElement('div');
          topBar.className = 'section-top-bar slide-recent-work-top-bar';
          topBar.innerHTML = `
            <div class="pill-heading">
              <h2>KARYA PILIHAN</h2>
            </div>
            <p class="section-sub-desc">
              Koleksi visual kampanye komersial, demonstrasi produk kosmetik terlaris, dan dokumentasi siaran langsung bersama brand dan artis.
            </p>
          `;
          inner.insertBefore(topBar, inner.firstChild);
        }
      }

      contentWrapper.appendChild(canvaCard);

      // Pada slide terakhir (Kontak), sematkan catatan kaki / footer secara rapi
      if (slideInfo.id === 'contact') {
        const footer = document.querySelector('.canva-footer-decor');
        if (footer) {
          contentWrapper.appendChild(footer);
        }
      }

      pageEl.appendChild(contentWrapper);
      pdfContainer.appendChild(pageEl);
    });

    // Terapkan ke tampilan dokumen
    document.body.innerHTML = '';
    document.body.appendChild(pdfContainer);
  });

  // 5. Suntikkan CSS presisi untuk layout PDF
  await page.addStyleTag({
    content: `
      @page {
        size: 1240px 877px;
        margin: 0;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
      }

      html, body {
        width: 1240px !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #C7B8A1 !important;
        background-image: 
          radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.18) 0%, transparent 28%),
          radial-gradient(circle at 88% 82%, rgba(45, 30, 15, 0.06) 0%, transparent 30%),
          linear-gradient(135deg, #CAB9A1 0%, #BEAD94 100%) !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        color: #22201D !important;
      }

      .pdf-slides-container {
        width: 1240px !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Setiap Slide Presisi 1 Halaman Cetak */
      .pdf-slide-page {
        width: 1240px !important;
        height: 877px !important;
        page-break-after: always !important;
        break-after: page !important;
        overflow: hidden !important;
        padding: 18px 32px 20px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        position: relative !important;
      }

      .pdf-slide-page:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      /* Navbar di Bagian Atas Tiap Halaman */
      .pdf-navbar {
        width: 100% !important;
        height: 52px !important;
        background: rgba(199, 184, 161, 0.95) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.45) !important;
        border-radius: 14px !important;
        box-shadow: 0 4px 16px rgba(50, 35, 20, 0.08) !important;
        margin-bottom: 14px !important;
        padding: 0 1.5rem !important;
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

      .pdf-logo-name {
        font-family: 'Playfair Display', Georgia, serif !important;
        font-size: 1.15rem !important;
        font-weight: 700 !important;
        color: #181614 !important;
        line-height: 1.1 !important;
      }

      .pdf-logo-sub {
        font-size: 0.62rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.12em !important;
        color: #6A5844 !important;
      }

      .pdf-nav-links {
        display: flex !important;
        align-items: center !important;
        gap: 0.65rem !important;
      }

      .pdf-nav-link {
        text-decoration: none !important;
        font-size: 0.78rem !important;
        font-weight: 600 !important;
        color: #38322A !important;
        padding: 5px 12px !important;
        border-radius: 9999px !important;
      }

      .pdf-nav-link.active {
        background: rgba(24, 22, 20, 0.12) !important;
        color: #181614 !important;
        font-weight: 800 !important;
      }

      .pdf-nav-link.pdf-cta-pill {
        background: #181614 !important;
        color: #FFFFFF !important;
        padding: 6px 14px !important;
        font-weight: 700 !important;
      }

      /* Slide Content Wrapper */
      .pdf-slide-content-wrapper {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        overflow: hidden !important;
      }

      .canva-card {
        width: 100% !important;
        max-width: 1180px !important;
        margin: 0 auto !important;
        box-shadow: 0 10px 32px rgba(65, 48, 30, 0.12) !important;
      }

      .card-inner {
        padding: 2rem 2.5rem !important;
      }

      /* Slide 3: Kreator Konten Compact */
      .creator-main-grid {
        grid-template-columns: 1.25fr 0.75fr !important;
        gap: 1.75rem !important;
      }
      .creator-pillar-cards {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 0.65rem !important;
        margin-bottom: 0.85rem !important;
      }
      .creator-pillar-item {
        padding: 0.75rem 0.85rem !important;
        gap: 0.65rem !important;
      }
      .pillar-icon-box {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
      }
      .pillar-info h4 {
        font-size: 0.82rem !important;
      }
      .pillar-info p {
        font-size: 0.72rem !important;
        line-height: 1.4 !important;
      }
      .creator-workflow-container {
        padding: 0.75rem 1rem !important;
        margin-top: 0.5rem !important;
      }
      .workflow-title {
        font-size: 0.75rem !important;
      }
      .workflow-steps-flex {
        font-size: 0.72rem !important;
        gap: 6px !important;
      }
      .creator-phones-pair {
        margin-bottom: 0.75rem !important;
      }
      .creator-phone .iphone-frame {
        max-width: 135px !important;
      }

      /* Slide 6: Mosaik Karya Pilihan */
      .slide-recent-work-top-bar {
        margin-bottom: 1.25rem !important;
      }
      .recent-work-mosaic {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        grid-template-rows: repeat(2, 155px) !important;
        gap: 1.15rem !important;
      }
      .mosaic-center-badge {
        display: none !important;
      }
      .mosaic-tile {
        height: 155px !important;
        border-radius: 16px !important;
        overflow: hidden !important;
      }
      .mosaic-tile img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }

      /* Slide 7: Mockup Video */
      .iphone-mockup-row {
        gap: 1.2rem !important;
        padding: 0.5rem 0 !important;
      }
      .iphone-mockup-row .iphone-frame {
        max-width: 170px !important;
      }

      /* Slide 9: Kontak & Kolaborasi */
      .contact-layout {
        gap: 2.25rem !important;
      }
      .arch-portrait-wrapper {
        width: 240px !important;
      }
      .contact-panel-inner {
        padding: 1.6rem 2rem !important;
      }
      .contact-lead-title {
        font-size: 1.35rem !important;
        margin-bottom: 0.25rem !important;
      }
      .contact-sub-lead {
        font-size: 0.82rem !important;
        margin-bottom: 1.1rem !important;
      }
      .contact-links-list {
        margin-bottom: 1.1rem !important;
        gap: 0.65rem !important;
      }
      .contact-link-row {
        padding: 0.65rem 1rem !important;
      }
      .contact-icon-bubble {
        width: 36px !important;
        height: 36px !important;
      }
      .canva-footer-decor {
        padding: 0.6rem 0 0 !important;
        margin-top: 0.75rem !important;
      }
      .huge-monogram {
        font-size: 1.8rem !important;
      }

      /* Tampilan Input Form Pada PDF */
      input, select, textarea {
        background: #FAF6F0 !important;
        border: 1px solid #D0C0A8 !important;
        font-size: 0.8rem !important;
        padding: 6px 10px !important;
      }
    `
  });

  // Skalakan kartu secara otomatis bila ada elemen yang melampaui batas tinggi halaman
  await page.evaluate(() => {
    document.querySelectorAll('.pdf-slide-page').forEach(slidePage => {
      const wrapper = slidePage.querySelector('.pdf-slide-content-wrapper');
      const card = wrapper.querySelector('.canva-card');
      if (!card) return;

      const availableH = 780; // tinggi sisa setelah dikurangi navbar dan padding
      const contentH = card.scrollHeight;
      if (contentH > availableH) {
        const scale = (availableH / contentH) * 0.98;
        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.transformOrigin = 'top center';
      }
    });
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('🖨️  Mencetak dokumen PDF resolusi tinggi (dengan link aktif & bookmark)...');
  await page.pdf({
    path: outputPath,
    width: '1240px',
    height: '877px',
    printBackground: true,
    tagged: true,
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
  console.log(`📄 Halaman    : Tepat 9 Halaman (1 slide = 1 halaman rapi)`);
  console.log(`📊 Ukuran     : ${sizeMB} MB`);
  console.log(`🧭 Navbar     : Hadir di tiap halaman & link aktif interaktif`);
  console.log(`🎨 Palet      : Warm Beige Editorial (Full Color Asli)`);
  console.log('===============================================================\n');
}

generatePDF().catch(err => {
  console.error('\n❌ Terjadi kesalahan saat membuat PDF:', err.message);
  process.exit(1);
});

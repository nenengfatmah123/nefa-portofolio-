const sharp = require('sharp');

async function analyzeY() {
  const meta = await sharp('web_assets/images/canva_slides/page_10.png').metadata();
  const raw = await sharp('web_assets/images/canva_slides/page_10.png').raw().toBuffer();

  const getPixel = (x, y) => {
    const idx = (y * meta.width + x) * meta.channels;
    return [raw[idx], raw[idx+1], raw[idx+2]];
  };

  console.log('--- Top scan along x=680 ---');
  for (let y = 230; y <= 310; y += 5) {
    console.log(`y=${y}:`, getPixel(680, y));
  }

  console.log('--- Bottom scan along x=680 ---');
  for (let y = 1010; y <= 1080; y += 5) {
    console.log(`y=${y}:`, getPixel(680, y));
  }
}

analyzeY().catch(console.error);

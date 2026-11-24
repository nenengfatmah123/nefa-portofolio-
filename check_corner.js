const sharp = require('sharp');

async function checkCorner() {
  const meta = await sharp('web_assets/images/canva_slides/page_10.png').metadata();
  const raw = await sharp('web_assets/images/canva_slides/page_10.png').raw().toBuffer();

  const getPixel = (x, y) => {
    const idx = (y * meta.width + x) * meta.channels;
    return [raw[idx], raw[idx+1], raw[idx+2]];
  };

  // Check top-left corner around x=510-550, y=264-300
  // Find where the corner curve transitions from border to screen
  console.log('Sampling corner curve:');
  for (let y = 264; y <= 290; y += 4) {
    for (let x = 510; x <= 540; x += 6) {
      const p = getPixel(x, y);
      const isPink = (p[0] > 200 && p[1] > 100 && p[2] > 150);
      process.stdout.write(isPink ? '#' : '.');
    }
    console.log(` (y=${y})`);
  }
}

checkCorner().catch(console.error);

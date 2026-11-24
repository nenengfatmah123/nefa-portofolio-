const sharp = require('sharp');

async function findPill() {
  const meta = await sharp('web_assets/images/canva_slides/page_10.png').metadata();
  const raw = await sharp('web_assets/images/canva_slides/page_10.png').raw().toBuffer();

  const getPixel = (x, y) => {
    const idx = (y * meta.width + x) * meta.channels;
    return [raw[idx], raw[idx+1], raw[idx+2]];
  };

  // Find the pink pill "WarnawarniKids · Gamis & family fashion"
  // It has hot pink background [255, 46, 147] or [255, 20, 147]
  let pillX1 = 0, pillX2 = 0, pillY1 = 0, pillY2 = 0;
  for (let x = 900; x < 1800; x += 10) {
    for (let y = 240; y < 330; y += 5) {
      const [r, g, b] = getPixel(x, y);
      if (r > 240 && g < 50 && b > 100) {
        if (!pillX1 || x < pillX1) pillX1 = x;
        if (!pillX2 || x > pillX2) pillX2 = x;
        if (!pillY1 || y < pillY1) pillY1 = y;
        if (!pillY2 || y > pillY2) pillY2 = y;
      }
    }
  }

  console.log(`Pink Pill range: X: ${pillX1} to ${pillX2} (${(pillX1/2160*100).toFixed(1)}% - ${(pillX2/2160*100).toFixed(1)}%), Y: ${pillY1} to ${pillY2} (${(pillY1/1215*100).toFixed(1)}% - ${(pillY2/1215*100).toFixed(1)}%)`);
}

findPill().catch(console.error);

const sharp = require('sharp');

async function analyze() {
  const meta = await sharp('web_assets/images/canva_slides/page_10.png').metadata();
  console.log('Page 10 dimensions:', meta.width, meta.height);
  const raw = await sharp('web_assets/images/canva_slides/page_10.png').raw().toBuffer();

  const getPixel = (x, y) => {
    if (x < 0 || x >= meta.width || y < 0 || y >= meta.height) return [0,0,0];
    const idx = (y * meta.width + x) * meta.channels;
    return [raw[idx], raw[idx+1], raw[idx+2]];
  };

  // On page_10.png:
  // There is Phone 1 and Phone 2.
  // Phone 2 has a thick pink outline border.
  // Inside Phone 2 is the picture of the girl in hijab (Bocil Warna Warni).
  // Let's find the exact bounding box of Phone 2's outer pink frame AND inner screen!

  // Let's sample along horizontal line y = 700 (middle of screen)
  // Let's look at colors from x = 400 to 1000
  console.log('--- Horizontal scan at y=700 ---');
  let inPhone1 = false, phone1End = 0;
  let phone2FrameStart = 0, phone2ScreenStart = 0, phone2ScreenEnd = 0, phone2FrameEnd = 0;

  for (let x = 400; x < 1000; x++) {
    const [r, g, b] = getPixel(x, 700);
    // Is it pink border? (r is high > 230, g is low < 120, b is around 130-180)
    const isPinkBorder = (r > 220 && g < 120 && b > 120);
    // Inside Phone 2 at y=700 is the girl's grey/patterned baju: r~150, g~130, b~120
  }

  // Let's print out x values and colors around Phone 2
  for (let x = 460; x <= 550; x += 5) {
    console.log(`x=${x}:`, getPixel(x, 700));
  }
  for (let x = 800; x <= 900; x += 5) {
    console.log(`x=${x}:`, getPixel(x, 700));
  }
}

analyze().catch(console.error);

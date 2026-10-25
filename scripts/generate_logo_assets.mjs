import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("client/public");
const SVG_PATH = path.join(PUBLIC_DIR, "favicon.svg");

// Helper to create a valid multi-size ICO from PNG buffers
function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // number of images

  const entries = [];
  const datas = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset

    offset += img.buffer.length;
    entries.push(entry);
    datas.push(img.buffer);
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

async function run() {
  console.log("🎨 Starting LogoAnywhere asset generation for Immigratiepunt...");

  if (!fs.existsSync(SVG_PATH)) {
    throw new Error(`SVG source not found at: ${SVG_PATH}`);
  }

  const svgContent = fs.readFileSync(SVG_PATH, "utf-8");
  console.log("✓ Loaded master vector favicon.svg");

  // High-res master raster buffer (2048x2048) with transparent background
  const master2048 = await sharp(Buffer.from(svgContent), { density: 1200 })
    .resize(2048, 2048, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 1. Generate Favicon ICO (16x16, 32x32, 48x48)
  console.log("Generating favicon.ico (16x16, 32x32, 48x48)...");
  const p16 = await sharp(master2048).resize(16, 16).png().toBuffer();
  const p32 = await sharp(master2048).resize(32, 32).png().toBuffer();
  const p48 = await sharp(master2048).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 },
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  console.log("  ✓ client/public/favicon.ico created");

  // 2. Apple Touch Icon (180x180 - solid warm brand background #faf9f5)
  console.log("Generating apple-touch-icon.png (180x180)...");
  const appleLogo = await sharp(master2048).resize(135, 135, { fit: "contain" }).toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 250, g: 249, b: 245, alpha: 1 }, // #faf9f5
    },
  })
    .composite([{ input: appleLogo, gravity: "center" }])
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("  ✓ client/public/apple-touch-icon.png created");

  // 3. Android Chrome 192x192 & 512x512 (PWA Icons)
  console.log("Generating android-chrome-192x192.png & 512x512.png...");
  const pwa192Logo = await sharp(master2048).resize(150, 150, { fit: "contain" }).toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: pwa192Logo, gravity: "center" }])
    .png()
    .toFile(path.join(PUBLIC_DIR, "android-chrome-192x192.png"));
  console.log("  ✓ client/public/android-chrome-192x192.png created");

  const pwa512Logo = await sharp(master2048).resize(410, 410, { fit: "contain" }).toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: pwa512Logo, gravity: "center" }])
    .png()
    .toFile(path.join(PUBLIC_DIR, "android-chrome-512x512.png"));
  console.log("  ✓ client/public/android-chrome-512x512.png created");

  // 4. Social Avatar (1000x1000, 20% safe zone margin for circular crops)
  console.log("Generating social-avatar.png (1000x1000)...");
  const avatarLogo = await sharp(master2048).resize(660, 660, { fit: "contain" }).toBuffer();
  await sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4,
      background: { r: 250, g: 249, b: 245, alpha: 1 }, // #faf9f5
    },
  })
    .composite([{ input: avatarLogo, gravity: "center" }])
    .png()
    .toFile(path.join(PUBLIC_DIR, "social-avatar.png"));
  console.log("  ✓ client/public/social-avatar.png created");

  // 5. Open Graph Image (1200x630 - Social Share Card with Wordmark & Tagline)
  console.log("Generating og-image.png (1200x630)...");
  // Create SVG layout for the OG card that incorporates the LogoMark, typography, and badges
  const ogSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="#faf9f5"/>
          <stop offset="100%" stop-color="#f2ece3"/>
        </linearGradient>
        <radialGradient id="ogGlow" cx="20%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#cc785c" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#cc785c" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background with warm brand gradient and border -->
      <rect width="1200" height="630" fill="url(#ogBg)"/>
      <rect width="1200" height="630" fill="url(#ogGlow)"/>
      <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#e6dfd8" stroke-width="2"/>

      <!-- Top Badge -->
      <g transform="translate(100, 110)">
        <rect width="270" height="36" rx="18" fill="#efe9de" stroke="#e6dfd8" stroke-width="1"/>
        <text x="20" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#a9583e" letter-spacing="1.5">OFFICIEEL PLATFORM</text>
      </g>

      <!-- Main Brand Wordmark & Headline -->
      <g transform="translate(100, 220)">
        <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" fill="#141413" letter-spacing="-1">
          Immigratie<tspan fill="#cc785c">punt</tspan>
        </text>
        <text x="5" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#6c6a64" letter-spacing="4">
          NEDERLAND
        </text>
      </g>

      <text x="100" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="700" fill="#141413" letter-spacing="-0.5">
        Start je leven in Nederland
      </text>

      <text x="100" y="390" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#6c6a64">
        Veilig briefadres, BSN registratie, bankrekening, huisvesting &amp; werk onder één dak.
      </text>

      <!-- 4 Pillars Pills -->
      <g transform="translate(100, 450)">
        <!-- Pill 1 -->
        <rect x="0" y="0" width="190" height="42" rx="12" fill="#ffffff" stroke="#e6dfd8"/>
        <text x="18" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#141413">📮 Postadres &amp; BSN</text>

        <!-- Pill 2 -->
        <rect x="205" y="0" width="180" height="42" rx="12" fill="#ffffff" stroke="#e6dfd8"/>
        <text x="18" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#141413">🏦 Bankrekening</text>

        <!-- Pill 3 -->
        <rect x="400" y="0" width="170" height="42" rx="12" fill="#ffffff" stroke="#e6dfd8"/>
        <text x="18" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#141413">🏠 Huisvesting</text>

        <!-- Pill 4 -->
        <rect x="585" y="0" width="140" height="42" rx="12" fill="#ffffff" stroke="#e6dfd8"/>
        <text x="18" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#141413">💼 Werk</text>
      </g>

      <!-- URL footer -->
      <text x="100" y="550" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#cc785c">
        https://immigratiepunt.nl
      </text>
    </svg>
  `;

  // Render SVG base to PNG
  const ogBase = await sharp(Buffer.from(ogSvg)).png().toBuffer();

  // Overlay large high-res LogoMark on right side (centered at x=950, y=315)
  const ogLogoMark = await sharp(master2048).resize(360, 360, { fit: "contain" }).toBuffer();

  await sharp(ogBase)
    .composite([
      {
        input: ogLogoMark,
        top: 135,
        left: 760,
      },
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, "og-image.png"));
  console.log("  ✓ client/public/og-image.png created (1200x630, safe-zone optimized)");

  // 6. Web Manifest (site.webmanifest)
  const webManifest = {
    name: "Immigratiepunt",
    short_name: "Immigratiepunt",
    description: "Start je leven in Nederland — Postadres, BSN, Bankzaken, Huisvesting & Werk",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#faf9f5",
    theme_color: "#cc785c",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, "site.webmanifest"),
    JSON.stringify(webManifest, null, 2)
  );
  console.log("  ✓ client/public/site.webmanifest created");

  console.log("\n🎉 All digital brand assets successfully generated!");
}

run().catch((err) => {
  console.error("❌ Error generating assets:", err);
  process.exit(1);
});

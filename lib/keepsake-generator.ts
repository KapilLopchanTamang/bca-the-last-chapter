// FAREWELL KEEPSAKE CARD GENERATOR
// Renders an archival graduation keepsake souvenir certificate onto a 2D canvas
// and triggers an instant PNG download for graduates to share on social media.

import { MEMORY_CONFIG } from "./memory-config";

export function generateKeepsakeCard(): void {
  if (typeof document === "undefined") return;

  const width = 1200;
  const height = 675; // 16:9 widescreen keepsake

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. Deep Midnight Charcoal Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#090c14");
  bgGrad.addColorStop(0.5, "#141c2e");
  bgGrad.addColorStop(1, "#090c14");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornate Golden Outer and Inner Border
  ctx.strokeStyle = "rgba(223, 168, 87, 0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = "rgba(223, 168, 87, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // Corner Accents
  const cornerSize = 25;
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = "#dfa857";
    ctx.fillRect(x - 3, y - 3, 6, 6);
  };
  drawCorner(45, 45);
  drawCorner(width - 45, 45);
  drawCorner(45, height - 45);
  drawCorner(width - 45, height - 45);

  // 3. Header Badge
  ctx.textAlign = "center";
  ctx.fillStyle = "#dfa857";
  ctx.font = "bold 15px sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(
    `${MEMORY_CONFIG.collegeName.toUpperCase()} • ${MEMORY_CONFIG.graduationYear}`,
    width / 2,
    110
  );

  // 4. Main Title
  ctx.fillStyle = "#fbf8f1";
  ctx.font = "bold 52px serif";
  ctx.fillText(MEMORY_CONFIG.opening.title, width / 2, 185);

  // Divider Line with diamond
  ctx.strokeStyle = "rgba(223, 168, 87, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 160, 215);
  ctx.lineTo(width / 2 + 160, 215);
  ctx.stroke();

  ctx.fillStyle = "#dfa857";
  ctx.beginPath();
  ctx.arc(width / 2, 215, 4, 0, Math.PI * 2);
  ctx.fill();

  // 5. Subtitle & Quote
  ctx.fillStyle = "#f5d48d";
  ctx.font = "italic 24px serif";
  ctx.fillText(`“${MEMORY_CONFIG.opening.subtitle}”`, width / 2, 270);

  ctx.fillStyle = "#d8d0c2";
  ctx.font = "20px sans-serif";
  ctx.fillText(
    "Some places become memories. Some people become family.",
    width / 2,
    330
  );
  ctx.fillText(
    "Like clouds that drifted together, now we journey to new skies.",
    width / 2,
    365
  );

  // 6. Farewell Poem / Message
  ctx.fillStyle = "#a49d8f";
  ctx.font = "italic 16px serif";
  ctx.fillText(
    "To the friendships, late nights, laughter, and lessons that shaped our journey.",
    width / 2,
    425
  );
  ctx.fillText(
    "No matter where life takes each of us, a part of our hearts will always belong here.",
    width / 2,
    455
  );

  // 7. Golden Stamp / Seal on Bottom
  const sealY = 540;
  ctx.fillStyle = "rgba(223, 168, 87, 0.15)";
  ctx.beginPath();
  ctx.arc(width / 2, sealY, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#dfa857";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, sealY, 40, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#dfa857";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("CLASS OF", width / 2, sealY - 6);
  ctx.font = "bold 18px serif";
  ctx.fillText(MEMORY_CONFIG.graduationYear, width / 2, sealY + 16);

  // 8. Signatures
  ctx.fillStyle = "#f5d48d";
  ctx.font = "20px serif";
  ctx.fillText(MEMORY_CONFIG.finalMessage.signatureTitle, width / 2, 615);

  ctx.fillStyle = "#8f897e";
  ctx.font = "italic 13px sans-serif";
  ctx.fillText(MEMORY_CONFIG.finalMessage.signatureSub, width / 2, 638);

  // Trigger Download
  const link = document.createElement("a");
  link.download = `BCA-Farewell-Keepsake-${MEMORY_CONFIG.graduationYear}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

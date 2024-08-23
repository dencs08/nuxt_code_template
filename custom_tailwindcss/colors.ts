import fs from "fs";
import path from "path";

interface ColorDefinition {
  colorName: string;
  mainHex: string;
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function generateColorVariants(colorDefinitions: ColorDefinition[]) {
  const variants: Record<string, string> = {};
  let cssContent = ":root {\n";

  let initialBlackFactor = 0.1;
  let slowDownFactor = 0.9;
  const maxDarkening = 0.9;
  const maxWhitening = 0.95;
  let blackFactorStep = (1 - initialBlackFactor) / ((950 - 500) / 50 - 1);

  colorDefinitions.forEach(({ colorName, mainHex }) => {
    const baseRgb = hexToRgb(mainHex);
    for (let i = 0; i <= 950; i += 50) {
      if (i % 100 !== 0 && i !== 50 && i !== 950) continue;
      let r, g, b;
      if (i <= 500) {
        let whiteFactor = 1 - (0.05 + 0.95 * (i / 500));
        if (whiteFactor > maxWhitening) whiteFactor *= maxWhitening;
        r = Math.round(baseRgb[0] * (1 - whiteFactor) + 255 * whiteFactor);
        g = Math.round(baseRgb[1] * (1 - whiteFactor) + 255 * whiteFactor);
        b = Math.round(baseRgb[2] * (1 - whiteFactor) + 255 * whiteFactor);
      } else {
        let blackFactor =
          initialBlackFactor +
          blackFactorStep * Math.pow((i - 550) / 50, slowDownFactor);
        if (blackFactor > maxDarkening) blackFactor *= maxDarkening;
        r = Math.round(baseRgb[0] * (1 - blackFactor));
        g = Math.round(baseRgb[1] * (1 - blackFactor));
        b = Math.round(baseRgb[2] * (1 - blackFactor));
      }
      const hexColor = rgbToHex(r, g, b);
      variants[`${colorName}-${i}`] = hexColor;
      cssContent += `  --p-${colorName}-${i}: ${hexColor};\n`;
    }
  });

  cssContent += "}\n";

  // Write the CSS content to a file
  const filePath = path.resolve(
    __dirname,
    "../app/assets/css/generated-colors.css"
  );
  fs.writeFileSync(filePath, cssContent);

  console.log(`CSS file generated at: ${filePath}`);

  return variants;
}

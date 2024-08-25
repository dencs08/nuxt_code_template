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
  const tailwindVariants: Record<string, string> = {};
  const primeVueVariants: Record<string, Record<string, string>> = {};
  let cssContent = ":root {\n";

  let initialBlackFactor = 0.1;
  let slowDownFactor = 0.9;
  const maxDarkening = 0.9;
  const maxWhitening = 0.95;
  let blackFactorStep = (1 - initialBlackFactor) / ((950 - 500) / 50 - 1);

  colorDefinitions.forEach(({ colorName, mainHex }) => {
    const baseRgb = hexToRgb(mainHex);
    primeVueVariants[`my.${colorName}`] = {};

    for (let i = 0; i <= 950; i += 50) {
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

      // For Tailwind (preserving original naming)
      tailwindVariants[`${colorName}-${i}`] = hexColor;

      // For PrimeVue
      primeVueVariants[`my.${colorName}`][i] = hexColor;

      // For CSS variables
      cssContent += `  --p-${colorName}-${i}: ${hexColor};\n`;
    }
  });

  cssContent += "}\n";

  // Write the CSS content to a file
  const cssFilePath = path.resolve(
    __dirname,
    "../app/assets/css/generated-colors.css"
  );
  fs.writeFileSync(cssFilePath, cssContent);
  console.log(`CSS file generated at: ${cssFilePath}`);

  // Generate color definitions file for PrimeVue
  const colorDefinitionsContent = `export const generatedColors = ${JSON.stringify(primeVueVariants, null, 2)};`;
  const colorDefinitionsFilePath = path.resolve(
    __dirname,
    "../app/assets/primevue/generated-colors.js"
  );
  fs.writeFileSync(colorDefinitionsFilePath, colorDefinitionsContent);
  console.log(
    `Color definitions file generated at: ${colorDefinitionsFilePath}`
  );

  return tailwindVariants; // Return the Tailwind variants for use in Tailwind config
}

// Function to update app-theme.js
export function updateAppTheme() {
  const appThemeFilePath = path.resolve(
    __dirname,
    "../app/assets/primvue/app-theme.js"
  );
  let appThemeContent = fs.readFileSync(appThemeFilePath, "utf8");

  // Add import statement if it doesn't exist
  if (!appThemeContent.includes("import { generatedColors }")) {
    appThemeContent = `import { generatedColors } from './generated-colors.js';\n${appThemeContent}`;
  }

  // Update primitive object
  const primitiveRegex = /primitive:\s*{[^}]*}/;
  const newPrimitiveContent = `primitive: {
    ...Noir.primitive,
    ...generatedColors
  }`;

  if (primitiveRegex.test(appThemeContent)) {
    appThemeContent = appThemeContent.replace(
      primitiveRegex,
      newPrimitiveContent
    );
  } else {
    // If primitive section doesn't exist, add it after the definePreset line
    appThemeContent = appThemeContent.replace(
      /(const\s+AppTheme\s*=\s*definePreset\([^)]+\),\s*{)/,
      `$1\n  ${newPrimitiveContent},`
    );
  }

  fs.writeFileSync(appThemeFilePath, appThemeContent);
  console.log(`App theme file updated at: ${appThemeFilePath}`);
}

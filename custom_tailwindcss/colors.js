function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function generateColorVariants(colorDefinitions) {
    const variants = {};

    let initialBlackFactor = 0.1;
    let slowDownFactor = 0.9; //smaller the slowDownFactor, the slower the growth of blackFactor.
    const maxDarkening = 0.9; //how dark the last 'black - colorVariant-950' variant will be (higher values = darker)
    const maxWhitening = 0.95; //how white the first 'white - colorVariant-0' variant will be (higher values = lighter)

    let blackFactorStep = (1 - initialBlackFactor) / ((950 - 500) / 50 - 1);

    colorDefinitions.forEach(({ colorName, mainHex }) => {
        const baseRgb = hexToRgb(mainHex);

        for (let i = 0; i <= 950; i += 50) {
            if (i % 100 !== 0 && i !== 50 && i !== 950) continue;

            let r, g, b;
            if (i <= 500) {
                let whiteFactor = 1 - (0.05 + 0.95 * (i / 500));
                if (whiteFactor > maxWhitening) whiteFactor *= maxWhitening;
                // console.log(`whiteFactor: ${whiteFactor}`);

                r = Math.round(baseRgb[0] * (1 - whiteFactor) + 255 * whiteFactor);
                g = Math.round(baseRgb[1] * (1 - whiteFactor) + 255 * whiteFactor);
                b = Math.round(baseRgb[2] * (1 - whiteFactor) + 255 * whiteFactor);
            } else {
                let blackFactor;
                blackFactor = initialBlackFactor + blackFactorStep * Math.pow((i - 550) / 50, slowDownFactor);
                if (blackFactor > maxDarkening) blackFactor *= maxDarkening;
                // console.log(`blackFactor: ${blackFactor}`);

                r = Math.round(baseRgb[0] * (1 - blackFactor));
                g = Math.round(baseRgb[1] * (1 - blackFactor));
                b = Math.round(baseRgb[2] * (1 - blackFactor));
            }

            variants[`${colorName}-${i}`] = rgbToHex(r, g, b);
        }
    });

    return variants;
}

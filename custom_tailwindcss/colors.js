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

    colorDefinitions.forEach(({ colorName, mainHex }) => {
        const baseRgb = hexToRgb(mainHex);

        // Start from 0, end at 950, increment by 50
        for (let i = 0; i <= 950; i += 50) {
            // Skip the iteration if i is not a multiple of 100, except for 0, 50 and 950
            if (i % 100 !== 0 && i !== 50 && i !== 950) continue;

            let r, g, b;
            if (i <= 500) {
                // Interpolate the base color with white for variants 0 to 500
                const whiteFactor = (500 - i) / 500 * 0.85; // limit to 80% white
                r = Math.round(baseRgb[0] * (1 - whiteFactor) + 255 * whiteFactor);
                g = Math.round(baseRgb[1] * (1 - whiteFactor) + 255 * whiteFactor);
                b = Math.round(baseRgb[2] * (1 - whiteFactor) + 255 * whiteFactor);
            } else {
                // Interpolate the base color with black for variants 500 to 950
                const blackFactor = (i - 500) / 450 * 0.85; // limit to 80% black
                r = Math.round(baseRgb[0] * (1 - blackFactor));
                g = Math.round(baseRgb[1] * (1 - blackFactor));
                b = Math.round(baseRgb[2] * (1 - blackFactor));
            }

            variants[`${colorName}-${i}`] = rgbToHex(r, g, b);
        }
    });

    return variants;
}
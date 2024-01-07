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

            // Adjust the factor calculation to take into account the new range of variant numbers
            const factor = (500 - i) / 1000;
            const r = Math.max(Math.min(Math.round(baseRgb[0] + 255 * factor), 255), 0);
            const g = Math.max(Math.min(Math.round(baseRgb[1] + 255 * factor), 255), 0);
            const b = Math.max(Math.min(Math.round(baseRgb[2] + 255 * factor), 255), 0);

            variants[`${colorName}-${i}`] = rgbToHex(r, g, b);
        }
    });

    return variants;
}

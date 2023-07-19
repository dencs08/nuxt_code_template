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

        for (let i = 100; i <= 900; i += 100) {
            const factor = (500 - i) / 800;
            const r = Math.max(Math.min(Math.round(baseRgb[0] + 255 * factor), 255), 0);
            const g = Math.max(Math.min(Math.round(baseRgb[1] + 255 * factor), 255), 0);
            const b = Math.max(Math.min(Math.round(baseRgb[2] + 255 * factor), 255), 0);

            variants[`${colorName}-${i}`] = rgbToHex(r, g, b);
        }
    });

    return variants;
}

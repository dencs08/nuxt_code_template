// fontSizes.js

type ScaleKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';

function generateFontSizeVariants(baseFontSize = 1, dividerNumber = 1.618) {
    const variants: Record<string, string> = {};
    const scales: Record<ScaleKey, { factor: number, vwFactor: number }> = {
        'xs': { factor: 0.75, vwFactor: 0.5 },
        'sm': { factor: 0.875, vwFactor: 0.75 },
        'md': { factor: baseFontSize, vwFactor: 0.85 },
        'lg': { factor: 1.125, vwFactor: 1 },
        'xl': { factor: 1.25, vwFactor: 1.35 },
        '2xl': { factor: 1.75, vwFactor: 2 },
        '3xl': { factor: 2.5, vwFactor: 3.5 },
        '4xl': { factor: 3, vwFactor: 5 },
        '5xl': { factor: 4.25, vwFactor: 6.5 },
        '6xl': { factor: 5, vwFactor: 8 },
        '7xl': { factor: 5.5, vwFactor: 9.5 },
        '8xl': { factor: 7.5, vwFactor: 11 },
    };

    for (let key in scales) {
        const scaleKey = key as ScaleKey;
        const minValue = `${scales[scaleKey].factor / dividerNumber}rem`;
        const preferredSize = `calc(0.85rem + ${scales[scaleKey].vwFactor}vw)`;
        const maxValue = `${scales[scaleKey].factor * dividerNumber}rem`;

        variants[`clamp-${key}`] = `clamp(${minValue}, ${preferredSize}, ${maxValue})`;
    }

    return variants;
}

export default generateFontSizeVariants;

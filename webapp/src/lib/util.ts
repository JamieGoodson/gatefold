import type { RGBColor } from 'colorthief';

export function getGradientColors(palette: RGBColor[]): {
	brighterColor: RGBColor | null;
	darkerColor: RGBColor | null;
} {
	let brighterColor = null;
	let darkerColor = null;

	for (const color of palette) {
		if (!brighterColor) {
			if (color.some((value) => value <= 160 && value >= 70)) {
				brighterColor = color;
				continue;
			}
		}

		if (!darkerColor) {
			if (color.every((value) => value < 70)) {
				darkerColor = color;
				continue;
			}
		}
	}

	return {
		brighterColor,
		darkerColor
	};
}

export function rgbColorToString(color: RGBColor) {
	return `rgb(${color.join(',')})`;
}

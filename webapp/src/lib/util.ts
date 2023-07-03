import type { RGBColor } from 'colorthief';

export function getFirstDarkColor(palette: RGBColor[]): RGBColor | null {
	for (const color of palette) {
		const [r, g, b] = color;
		if (r <= 80 && g <= 80 && b <= 80) return color;
	}

	return null;
}

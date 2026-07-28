import { PNG } from 'pngjs';
import { writeFileSync } from 'fs';

const SIZE = 128;

// Porcentaje de píxeles completamente invisibles (aporta dispersión)
const TRANSPARENCY = 0.4;

// Máxima opacidad que alcanzará un grano (0.0 a 1.0)
const MAX_GRAIN_OPACITY = 0.15;

const png = new PNG({
  width: SIZE,
  height: SIZE,
});

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const idx = (SIZE * y + x) * 4;

    // Píxeles negros puros (0, 0, 0). Su "color" lo dará el fondo de CSS.
    png.data[idx] = 0; // R
    png.data[idx + 1] = 0; // G
    png.data[idx + 2] = 0; // B

    // Control dinámico de la arenilla mediante transparencia aleatoria
    if (Math.random() < TRANSPARENCY) {
      png.data[idx + 3] = 0; // Píxel invisible vacío
    } else {
      // Variación aleatoria de opacidad para dar profundidad granular
      const randomAlpha = Math.random() * MAX_GRAIN_OPACITY * 255;
      png.data[idx + 3] = Math.round(randomAlpha);
    }
  }
}

writeFileSync('public/cc/noise.png', PNG.sync.write(png));
console.log('noise.png monocromático generado');

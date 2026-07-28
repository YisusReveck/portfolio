// utiliza: bun run src/theme/generate-theme-file.ts

import { hexFromArgb } from '@material/material-color-utilities';
import { generateRoles, palettes } from './generate-theme';
import * as fs from 'fs';
import * as path from 'path';

function generatePaletteFile() {
  const cssVariables = generateRoles();

  const tonos = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 100];

  const paletteNames = [
    'primary',
    'secondary',
    'tertiary',
    'neutral',
    'neutralVariant',
    'error',
  ] as const;

  let scssContent = '/* ── Paletas Tonales Completas (Visualización en Editor) ── */\n';

  paletteNames.forEach((name) => {
    const paletteKey = name === 'neutralVariant' ? 'neutral-variant' : name;
    scssContent += `$palette-${paletteKey}: (\n`;
    tonos.forEach((t) => {
      scssContent += `  ${t}: ${hexFromArgb(palettes[name].tone(t))},\n`;
    });
    scssContent += ');\n\n';
  });

  try {
    const outputPath = path.join(__dirname, 'palette.scss');
    fs.writeFileSync(outputPath, cssVariables + scssContent, 'utf-8');
    console.log(`\x1b[32m[Theme] ¡Archivo palette.scss creado con éxito en: ${outputPath}!\x1b[0m`);
  } catch (error) {
    console.error('[Theme] Error escribiendo el archivo:', error);
  }
}

generatePaletteFile();

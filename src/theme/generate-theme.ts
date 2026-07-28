import { argbFromHex, hexFromArgb, Hct, TonalPalette } from '@material/material-color-utilities';
import { type RolesMap, rolesDefault, type RoleName } from './material.types';

// Semillas de color Vintage
export const colors = {
  primary: argbFromHex('#FFBF00'),
  secondary: argbFromHex('#1A1E29'),
  tertiary: argbFromHex('#593825'),
  neutral: argbFromHex('#F4ECD8'),
  error: argbFromHex('#B3261E'), // seed estándar de error M3
};

function paletteFrom(argb: number, chromaOverride?: number): TonalPalette {
  const hct = Hct.fromInt(argb);
  const chroma = chromaOverride ?? hct.chroma;
  return TonalPalette.fromHueAndChroma(hct.hue, chroma);
}

export const palettes = {
  primary: paletteFrom(colors.primary),
  secondary: paletteFrom(colors.secondary),
  tertiary: paletteFrom(colors.tertiary),
  neutral: paletteFrom(colors.neutral, 4), // chroma baja, típico de "neutral"
  neutralVariant: paletteFrom(colors.neutral, 6), // mismo hue, chroma un poco mayor
  error: paletteFrom(colors.error),
};

const rolesOverrides: Partial<RolesMap> = {
  surface: { ...rolesDefault.surface, light: 90, dark: 6 },
  surfaceVariant: { ...rolesDefault.surfaceVariant, light: 88, dark: 9 },
  onSurfaceVariant: { ...rolesDefault.onSurfaceVariant, light: 20 },
  primary: { ...rolesDefault.primary, dark: 70 },
};

const roles: RolesMap = { ...rolesDefault, ...rolesOverrides };

// Función para aplicar los roles al HTML
export function applyGeneratedTheme() {
  const cssVariables = generateRoles();

  // Inyección dinámica en el Navegador (Tiempo de ejecución)
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.innerText = cssVariables;
    document.head.appendChild(styleElement);
  }
}

function buildBlock(roles: RolesMap, mode: 'light' | 'dark'): string {
  return Object.entries(roles)
    .map(([roleName, { palette, light, dark }]) => {
      const tone = mode === 'light' ? light : dark;
      const hex = hexFromArgb(palettes[palette].tone(tone));
      return `  --${kebabCase(roleName as RoleName)}: ${hex};`;
    })
    .join('\n');
}

export function generateRoles(): string {
  return (
    `:root {\n${buildBlock(roles, 'light')}\n}\n\n` +
    `html[data-theme="dark"] {\n${buildBlock(roles, 'dark')}\n}\n`
  );
}

export function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

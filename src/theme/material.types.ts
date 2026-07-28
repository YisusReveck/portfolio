export type PaletteName =
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralVariant' | 'error';

export type RoleName =
  | 'surface'
  | 'onSurface'
  | 'surfaceVariant'
  | 'onSurfaceVariant'
  | 'surfaceTint'
  | 'primary'
  | 'onPrimary'
  | 'secondary'
  | 'onSecondary'
  | 'tertiary'
  | 'onTertiary'
  | 'outline'
  | 'outlineVariant'
  | 'error'
  | 'onError';

export interface RoleDefinition {
  palette: PaletteName;
  light: number;
  dark: number;
}

export type RolesMap = Record<RoleName, RoleDefinition>;

export const rolesDefault: RolesMap = {
  surface: { palette: 'neutral', light: 98, dark: 6 },
  onSurface: { palette: 'neutral', light: 10, dark: 90 },
  surfaceVariant: { palette: 'neutralVariant', light: 90, dark: 30 },
  onSurfaceVariant: { palette: 'neutralVariant', light: 30, dark: 80 },
  surfaceTint: { palette: 'primary', light: 60, dark: 70 },

  primary: { palette: 'primary', light: 40, dark: 80 },
  onPrimary: { palette: 'primary', light: 100, dark: 20 },
  secondary: { palette: 'secondary', light: 40, dark: 80 },
  onSecondary: { palette: 'secondary', light: 100, dark: 20 },
  tertiary: { palette: 'tertiary', light: 40, dark: 80 },
  onTertiary: { palette: 'tertiary', light: 100, dark: 20 },

  outline: { palette: 'neutralVariant', light: 50, dark: 60 },
  outlineVariant: { palette: 'neutralVariant', light: 80, dark: 30 },
  error: { palette: 'error', light: 40, dark: 80 },
  onError: { palette: 'error', light: 100, dark: 20 },
};

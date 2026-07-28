import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<Theme>(
    isPlatformBrowser(this.platformId)
      ? ((localStorage.getItem('theme') as Theme) ?? 'dark')
      : 'dark',
  );

  constructor() {
    // Al cargar el portafolio, aplicamos el tema guardado
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
  }

  private applyTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);

      // Seteamos el atributo en el HTML para que el CSS reaccione
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}

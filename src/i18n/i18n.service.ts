import { Injectable, computed, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { es } from './es';
import { en } from './en';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly language = signal<'es' | 'en'>(
    isPlatformBrowser(this.platformId)
      ? ((localStorage.getItem('language') as 'es' | 'en') ?? 'es')
      : 'es',
  );

  readonly buttonLabel = computed<Language>(() => (this.language() === 'es' ? 'en' : 'es'));

  readonly isTransitioning = signal<boolean>(false);

  readonly translations = computed(() => (this.language() === 'es' ? es : en));

  readonly locale = computed(() => (this.language() === 'es' ? 'es-MX' : 'en-US'));

  readonly htmlLang = computed(() => (this.language() === 'es' ? 'es' : 'en'));

  changeLanguage(): void {
    this.isTransitioning.set(true);

    setTimeout(() => {
      const nextLanguage: Language = this.language() === 'es' ? 'en' : 'es';
      this.language.set(nextLanguage);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('language', nextLanguage);
      }

      this.isTransitioning.set(false);
    }, 300); // Mismo tiempo CSS
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', language);
    }
  }
}

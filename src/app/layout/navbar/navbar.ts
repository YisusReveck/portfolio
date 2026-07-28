import { AfterViewInit, Component, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from '@i18n/i18n.service';
import { ThemeService } from '@theme/theme.service';

type SectionId = 'hero' | 'experience' | 'projects' | 'contact';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit, OnDestroy {
  readonly i18n = inject(I18nService);
  readonly themeService = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentSection = signal<SectionId>('hero');

  private readonly sectionIds: SectionId[] = ['hero', 'experience', 'projects', 'contact'];
  private observer?: IntersectionObserver;
  private activeSections = new Set<string>();

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSections.add(entry.target.id);
          } else {
            this.activeSections.delete(entry.target.id);
          }
        }
        // Evaluamos inmediatamente al entrar/salir una sección
        this.updateActiveSection();
      },
      {
        rootMargin: '-49px 0px -50% 0px',
        threshold: 0, // Con 0, se dispara en cuanto 1 solo píxel cruce la franja
      },
    );

    for (const id of this.sectionIds) {
      const section = document.getElementById(id);
      if (section) {
        this.observer.observe(section);
      }
    }
  }

  // 2. Escuchador de Scroll: Se ejecuta en cada frame, pero SOLO evalúa las secciones visibles
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.activeSections.size > 0) {
      this.updateActiveSection();
    }
  }

  private updateActiveSection(): void {
    // Obtenemos las referencias DOM de las secciones que el observer dice que están visibles
    const visibleElements: HTMLElement[] = [];
    for (const id of this.activeSections) {
      const el = document.getElementById(id);
      if (el) visibleElements.push(el);
    }

    if (visibleElements.length === 0) return;

    // Ordenamos por posición actual en pantalla (de arriba a abajo)
    const sorted = visibleElements.sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );

    if (sorted.length === 1) {
      this.currentSection.set(sorted[0].id as SectionId);
      return;
    }

    // Punto Y de comparación: Navbar + la mitad del espacio util
    const navOffset = 48;
    const observerCenterY = navOffset + (window.innerHeight * 0.5 - navOffset) / 2;

    // Comprobamos la posición real de la segunda sección en este píxel exacto
    const secondSectionTop = sorted[1].getBoundingClientRect().top;

    if (secondSectionTop <= observerCenterY) {
      this.currentSection.set(sorted[1].id as SectionId);
    } else {
      this.currentSection.set(sorted[0].id as SectionId);
    }
  }

  scrollToSection(id: SectionId): void {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    this.closeMenu();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

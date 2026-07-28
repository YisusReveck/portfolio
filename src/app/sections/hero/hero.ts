import { Component, DestroyRef, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { I18nService } from '@i18n/i18n.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements OnInit {
  public readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private paperSlide?: HTMLAudioElement;

  readonly activePhoto = signal<'me' | 'cat'>('me');

  changeActivePhoto(photo: 'me' | 'cat') {
    if (this.activePhoto() === photo) return;

    this.activePhoto.set(photo);

    if (this.paperSlide) {
      this.paperSlide.currentTime = 0;
      void this.paperSlide?.play();
    }
  }

  public readonly typewriter = {
    visibleText: signal(''),
  };

  private readonly _typewriter = {
    fullText: ['JESÚS', 'MIRANDA'],
    config: {
      speed: 120, // ms por carácter
    },
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.paperSlide = new Audio('pixabay/paper-2.mp3');
      this.paperSlide.volume = 0.07;
      this.paperSlide.preload = 'auto';
    }

    this.typewriterEffectInit();
  }

  private typewriterEffectInit(): void {
    const { visibleText } = this.typewriter;
    const { fullText, config } = this._typewriter;

    const fullString = fullText.join('\n'); // "Jesús\nMiranda"
    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex++;
      visibleText.set(fullString.slice(0, charIndex));

      if (charIndex >= fullString.length) {
        clearInterval(interval);
      }
    }, config.speed);

    // limpieza si el componente se destruye antes de terminar
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}

import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { I18nService } from '@i18n/i18n.service';
import { DatePipe, TitleCasePipe, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_k07szwl';
const EMAILJS_TEMPLATE_ID = 'template_qotlb3j';
const EMAILJS_PUBLIC_KEY = 'MsCat9QRNOB4llWTC';

type SendState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, DatePipe, TitleCasePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  public readonly i18n = inject(I18nService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  private lastTypingSoundTime = 0;
  private readonly TYPING_SOUND_THROTTLE_MS = 60;
  private readonly IGNORED_KEYS = new Set([
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'CapsLock',
    'Tab',
    'Escape',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ]);

  private sello?: HTMLAudioElement;
  private teclado?: HTMLAudioElement;

  readonly sendState = signal<SendState>('idle');
  readonly today = new Date();

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sello = new Audio('pixabay/sello.mp3');
      this.sello.volume = 0.12;
      this.sello.preload = 'auto';

      this.teclado = new Audio('pixabay/typewriter-1.mp3');
      this.teclado.volume = 0.15;
      this.teclado.preload = 'auto';

      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  }

  // Se llama en (keydown) de cada input/textarea
  playTypingSound(event: KeyboardEvent): void {
    if (!this.teclado) return;
    if (this.IGNORED_KEYS.has(event.key)) return;

    const now = performance.now();
    if (now - this.lastTypingSoundTime < this.TYPING_SOUND_THROTTLE_MS) {
      return; // muy pronto desde el último sonido, se ignora esta pulsación
    }
    this.lastTypingSoundTime = now;

    this.teclado.currentTime = 0;
    void this.teclado.play().catch(() => {
      // Algunos navegadores bloquean audio sin interacción previa; se ignora
    });
  }

  async sendData(): Promise<void> {
    // this.sendState.set('success');

    // if (this.sello) {
    //   this.sello.currentTime = 0;
    //   void this.sello.play();
    // }

    if (this.sendState() === 'sending' || this.sendState() === 'success') {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sendState.set('sending');

    const { nombre, email, mensaje } = this.form.getRawValue();

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: nombre,
        from_email: email,
        message: mensaje,
        to_email: 'miranda.jfmo@gmail.com',
      });

      this.sendState.set('success');

      if (this.sello) {
        this.sello.currentTime = 0;
        void this.sello.play();
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      this.sendState.set('error');
    }
  }

  // Helpers para el template: saber si mostrar error en un campo específico
  hasError(controlName: 'nombre' | 'email' | 'mensaje'): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  errorMessage(controlName: 'nombre' | 'email' | 'mensaje'): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    const t = this.i18n.translations();

    if (control.errors['required']) {
      return t.contact.errormessage_required;
    }

    if (control.errors['email']) {
      return t.contact.errormessage_email;
    }

    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return t.contact.errormessage_maxlength.replace('{max}', String(max));
    }

    return t.contact.errormessage_default;
  }
}

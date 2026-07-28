import { Component, inject } from '@angular/core';
import { FadeInOnScrollDirective } from './../../utils/appFadeInOnScroll';
import { I18nService } from '@i18n/i18n.service';

@Component({
  selector: 'app-experience',
  imports: [FadeInOnScrollDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  public readonly i18n = inject(I18nService);
}

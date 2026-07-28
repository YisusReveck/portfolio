import { Component, inject } from '@angular/core';
import { FadeInOnScrollDirective } from './../../utils/appFadeInOnScroll';
import { I18nService } from '@i18n/i18n.service';

@Component({
  selector: 'app-projects',
  imports: [FadeInOnScrollDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  public readonly i18n = inject(I18nService);
}

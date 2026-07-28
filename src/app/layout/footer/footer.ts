import { Component, inject } from '@angular/core';
import { I18nService } from '@i18n/i18n.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly i18n = inject(I18nService);
}

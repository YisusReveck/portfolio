import { Component, inject, signal } from '@angular/core';
import { I18nService } from '@i18n/i18n.service';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Hero } from '@sections/hero/hero';
import { Experience } from '@sections/experience/experience';
import { Projects } from '@sections/projects/projects';
import { Contact } from '@sections/contact/contact';

@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, Experience, Projects, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('portfolio');
  readonly i18n = inject(I18nService);
}

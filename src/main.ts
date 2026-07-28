import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { applyGeneratedTheme } from '@theme/generate-theme';

applyGeneratedTheme();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

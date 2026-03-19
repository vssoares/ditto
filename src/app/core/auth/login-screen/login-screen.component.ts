import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../ui/button/button.component';
import { TextInputComponent } from '../../../ui/text-input/text-input.component';
import { ErrorBannerComponent } from '../../../ui/error-banner/error-banner.component';
import { AuthApiService } from '../../../services/auth-api.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-login-screen',
  host: { class: 'flex flex-1 min-h-0' },
  imports: [ButtonComponent, TextInputComponent, ErrorBannerComponent],
  templateUrl: './login-screen.component.html',
})
export class LoginScreenComponent {
  readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly storage = inject(StorageService);

  readonly email = signal(this.storage.getAuthEmail());
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  async handleLogin(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      const res = await this.authApi.login(this.email(), this.password());
      this.storage.setSession(res.token, res.user);
      this.router.navigate(['/app/generate'], { replaceUrl: true });
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      this.loading.set(false);
    }
  }
}


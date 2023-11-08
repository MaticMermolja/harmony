import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  errors: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  async onSubmit() {
    try {
      const response = await firstValueFrom(
        this.authService.register(
          this.user.firstName,
          this.user.lastName,
          this.user.email,
          this.user.password
        )
      );
  
      console.log(response);
  
      if ('errors' in response) {
        this.errors = response.errors;
      } else {
        localStorage.setItem('accessToken', response.accessToken);
        this.router.navigateByUrl('/boarding');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        this.errors.general = error.message;
      } else {
        console.error('An unexpected error occurred', error);
        this.errors.general = 'An unexpected error occurred during registration.';
      }
    }
  }
}

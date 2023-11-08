import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  onSubmit() {
    this.authService.login(this.user.email, this.user.password).subscribe({
      next: (response: LoginResponse) => {
        console.log(response);
        localStorage.setItem('accessToken', response.accessToken);
        if (response.boardingLevel === 5) {
          this.router.navigateByUrl('/');
        } else {
          this.router.navigateByUrl('/boarding');
        }
      },
      error: (error) => {
        console.error('Login failed.', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
        // Here, you could update the view to show the error message to the user
      }
    });
  }
}

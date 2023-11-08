import { Component, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnDestroy {
  loggedIn: boolean = false;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private connectionService: ConnectionService,
    private router: Router) {
    // Subscribe to the isLoggedIn getter
    this.subscription = this.authService.isLoggedIn.subscribe(isAuthenticated => {
      this.loggedIn = isAuthenticated;
    });
    
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

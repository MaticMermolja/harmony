import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree,
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map((user: User | null) => {
        if (!user) {
          // Not logged in
          return this.router.createUrlTree(['/auth/login']);
        } else if (route.data['permissionLevel'] && user.permissionLevel < route.data['permissionLevel']) {
          // Insufficient permissions
          return this.router.createUrlTree(['/forbidden']);
        }
        return true;
      })
    );
  }
}

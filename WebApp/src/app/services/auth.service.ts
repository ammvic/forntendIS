import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@app/services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements CanActivate {

  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Dohvati ID ulogovanog korisnika iz JWT tokena
  getUserId(): string | null {
    const token = this.userService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // sub je standardni claim za user id
    } catch (e) {
      console.error('Greška pri dekodiranju tokena', e);
      return null;
    }
  }
}

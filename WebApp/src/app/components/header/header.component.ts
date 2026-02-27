import {Component, OnInit} from '@angular/core';
import {UserService} from '@app/services/user.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HostListener } from '@angular/core';



const helper = new JwtHelperService();
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) {
  }


  ngOnInit(): void {
  }
 isAdmin(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = helper.decodeToken(token);

  // Za JWT iz .NET-a claim za ulogu ima ovaj ključ:
  const roleClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return roleClaim === 'Admin';
}

 isKorisnik(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = helper.decodeToken(token);

  // Za JWT iz .NET-a claim za ulogu ima ovaj ključ:
  const roleClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return roleClaim === 'Volonter';
}

 isVeterinar(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = helper.decodeToken(token);

  // Za JWT iz .NET-a claim za ulogu ima ovaj ključ:
  const roleClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return roleClaim === 'Veterinar';
}

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/'])
  }
  checkLogin(): boolean {
    return this.userService.isLoggedIn();
  }

  isScrolled = false;

@HostListener('window:scroll', [])
onScroll() {
  this.isScrolled = window.scrollY > 20;
}


}

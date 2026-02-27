import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss']
})
export class RemindPasswordComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.userService.isLoggedIn())
    {
      this.router.navigate(['/'])
    }
  }

  onSubmit(): void {
  }

}

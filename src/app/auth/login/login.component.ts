import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Auth} from '../../models/auth';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {MessageDialogComponent} from '../../utilities/message-dialog/message-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;

  constructor(private authService: AuthService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  attemptLogin() {
    let auth = new Auth();

    auth.user = this.username;
    auth.password = this.password;

    this.authService.checkAuth(auth).subscribe((response) => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', response.token);

      this.authService.setToken(response.token);

      let returnPath = localStorage.getItem('returnPath');

      localStorage.setItem('returnPath', '');

      if (returnPath && returnPath.length) {
        this.router.navigate([returnPath]).then();
      } else {
        this.router.navigate(['/timelines']).then();
      }
    }, error => {
      this.dialog.open(MessageDialogComponent, {
        width: '250px',
        data: {
          title: 'Login Failed',
          message: 'Keep trying.'
        }
      });
    });
  }
}

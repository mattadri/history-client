import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public storedToken: string;
  public serviceToken: string;
  public loginState: string;

  public userIsLoggedIn: boolean;
  public userIsSelected: boolean;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.userIsLoggedIn = false;
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    this.userService.setPreviousPage(localStorage.getItem('returnPath'));
    localStorage.setItem('returnPath', state.url);

    await this.isLoggedIn();

    if (this.userIsLoggedIn) {
      this.checkUserSelected();

      if (!this.userIsSelected) {
        this.router.navigate(['/user']).then();
      }

      return true;

    } else {
      localStorage.setItem('returnPath', state.url);

      this.router.navigate(['/login']).then();
    }
  }

  async isLoggedIn(): Promise<boolean> {
    this.storedToken = localStorage.getItem('token');
    this.serviceToken = this.authService.getToken();
    this.loginState = localStorage.getItem('isLoggedIn');

    if (!this.serviceToken) {
      await this.authService.getApiMasterUser().then((response) => {
        if (response.data.length) {
          this.serviceToken = response.data[0].attributes.token;

          this.authService.setToken(this.serviceToken);
        }

        this.userIsLoggedIn = this.getLoginState();
      });

    } else {
      this.userIsLoggedIn = this.getLoginState();
    }

    return true;
  }

  checkUserSelected() {
    let user = this.userService.getUser();

    if (user) {
      this.userIsSelected = true;
    } else {
      let userId = localStorage.getItem('user.id');
      let userFirstName = localStorage.getItem('user.firstName');
      let userLastName = localStorage.getItem('user.lastName');

      if (userId != null && userFirstName != null && userLastName != null) {
        let user = new User();
        user.initializeNewUser();

        user.id = userId;
        user.firstName = userFirstName;
        user.lastName = userLastName;

        this.userService.setSingleUser(user);

        this.userIsSelected = true;
      }
    }
  }

  private getLoginState() {
    if (this.storedToken !== this.serviceToken) {
      return false;
    }

    return this.loginState === 'true';
  }
}

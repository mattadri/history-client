import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users: User[];
  public user: User;

  constructor(private userService: UserService) {
    if (!this.userService.getUsers().length) {
      this.userService.getApiUsers(null).subscribe((response) => {
        for (const user of response.users) {
          this.userService.setUser(user);
        }

        this.users = this.userService.getUsers();
      });
    }
  }

  ngOnInit() {
  }

  selectUser(user) {
    this.userService.setSingleUser(user);

    this.user = this.userService.getUser();

    localStorage.setItem('user.id', user.id);
    localStorage.setItem('user.firstName', user.firstName);
    localStorage.setItem('user.lastName', user.lastName);
  }
}

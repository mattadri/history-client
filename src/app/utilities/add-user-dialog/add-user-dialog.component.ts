import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {
  public currentUser: User;

  public users: User[];
  public user: User;

  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
              private userService: UserService) {
    this.currentUser = this.userService.getLoggedInUser();

    this.users = this.userService.getUsers();

    if (!this.users.length) {
      this.userService.getApiUsers(null).subscribe((response) => {
        for (const user of response.users) {
          this.userService.setUser(user);
        }

        this.users = this.userService.getUsers();

        this.filterCurrentUserOut();
      });
    } else {
      this.filterCurrentUserOut();
    }
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  filterCurrentUserOut() {
    // remove the current user from the list
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === this.currentUser.id) {
        this.users.splice(i, 1);
      }
    }
  }
}

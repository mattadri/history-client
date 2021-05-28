import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Project} from '../../models/projects/project';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss']
})
export class AddProjectDialogComponent implements OnInit {
  public project: Project;

  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>) {
    this.project = new Project();
    this.project.initializeNewProject();
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('new_project_label').focus();
  }
}

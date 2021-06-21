import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../services/project.service';
import {Project} from '../models/projects/project';
import {AddProjectDialogComponent} from '../utilities/add-project-dialog/add-project-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmRemovalComponent} from '../utilities/confirm-removal/confirm-removal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];

  public userId: string;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private projectService: ProjectService, public dialog: MatDialog) {
    this.userId = localStorage.getItem('user.id');

    this.getProjects(null, this.userId);
  }

  ngOnInit() {
  }

  getProjects(path, userId) {
    this.projectService.getApiProjects(path, userId, null, null, ['project_rel'], ['label'], null, false, null, false).subscribe((response) => {
      this.projects = response.projects;
    });
  }

  addProject() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(project => {
      this.projectService.createApiProject(project).subscribe((response) => {
        project.id = response.data.id;

        this.projectService.addUserToProject(project, this.userId).subscribe(() => { });

        this.projects.unshift(project);
      });
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the project '
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.projectService.deleteApiProject(project).subscribe(() => {
          for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].id === project.id) {
              this.projects.splice(i, 1);
            }
          }
        });
      }
    });
  }

  turnPage(project) {
    if (project.pageIndex < project.previousPageIndex) {
      this.getProjects(this.previousPage, this.userId);
    } else if (project.pageIndex > project.previousPageIndex) {
      this.getProjects(this.nextPage, this.userId);
    }
  }
}

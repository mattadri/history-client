import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

import { Observable } from 'rxjs';

import {Project} from '../../models/projects/project';

@Injectable()
export class ProjectInterceptor implements HttpInterceptor {
  private projects: Project[];
  private project: Project;

  private body = {
    projects: [],
    total: 0,
    links: {}
  };

  constructor() {
    this.projects = [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        this.handleResponse(req, evt);
      })
    );
  }

  handleResponse(req: HttpRequest<any>, event) {
    if (event.body) {
      if (req.headers.get('type')) {
        if (req.headers.get('type') === 'projects') {
          this.projects = [];

          for (const data of event.body.data) {
            this.project = new Project();
            this.project.initializeNewProject();
            this.project.mapProject(data);

            this.projects.push(this.project);
          }

          this.body.projects = this.projects;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if (req.headers.get('type') === 'user_projects') {
          this.projects = [];

          for (const data of event.body.data) {
            this.project = new Project();
            this.project.initializeNewProject();
            this.project.mapProject(data.attributes.project.data);

            this.projects.push(this.project);
          }

          this.body.projects = this.projects;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if ((req.headers.get('type') === 'project')) {
          this.project = new Project();
          this.project.initializeNewProject();
          this.project.mapProject(event.body.data);

          event.body = this.project;
        }
      }
    }
  }
}

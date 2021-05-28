import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../models/projects/project';
import {ProjectResponse} from '../models/projects/responses/project-response';

import { environment } from '../../environments/environment';
import {Observable} from 'rxjs';
import {Person} from '../models/persons/person';
import {ProjectPersonPost} from '../models/projects/posts/project-person-post';
import {Essay} from '../models/essays/essay';
import {ProjectEssayPost} from '../models/projects/posts/project-essay-post';
import {ProjectEssay} from '../models/projects/project-essay';
import {Timeline} from '../models/timelines/timeline';
import {ProjectTimelinePost} from '../models/projects/posts/project-timeline-post';
import {ProjectTimeline} from '../models/projects/project-timeline';
import {ProjectPerson} from '../models/projects/project-person';
import {ProjectEvent} from '../models/projects/project-event';
import {ProjectChart} from '../models/projects/project-chart';
import {ProjectBrainstorm} from '../models/projects/project-brainstorm';
import {Chart} from '../models/chart';
import {Brainstorm} from '../models/brainstorm';
import {ProjectEventPost} from '../models/projects/posts/project-event-post';
import {ProjectChartPost} from '../models/projects/posts/project-chart-post';
import {ProjectBrainstormPost} from '../models/projects/posts/project-brainstorm-post';
import {Event} from '../models/events/event';
import {ProjectPost} from '../models/projects/posts/project-post';
import {User} from '../models/user';
import {ProjectUserPost} from '../models/projects/posts/project-user-post';
import {UserResponse} from '../models/users/responses/user-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[];
  private project: Project;

  private users: User[];

  private projectPost: ProjectPost;
  private projectPersonPost: ProjectPersonPost;
  private projectEssayPost: ProjectEssayPost;
  private projectTimelinePost: ProjectTimelinePost;
  private projectBrainstormPost: ProjectBrainstormPost;
  private projectEventPost: ProjectEventPost;
  private projectChartPost: ProjectChartPost;
  private projectUserPost: ProjectUserPost;

  constructor(private http: HttpClient) {
    this.projects = [];
  }

  setProject(project: Project) {
    this.projects.push(project);
  }

  getProjects(): Project[] {
    return this.projects;
  }

  createApiProject(project: Project): Observable<any> {
    this.projectPost = new ProjectPost();
    this.projectPost.mapToPost(project, false);

    return this.http.post(environment.apiUrl + '/projects', this.projectPost, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json').set('Content-Type', 'application/vnd.api+json')
    });
  }

  deleteApiProject(project: Project): Observable<any> {
    return this.http.delete(environment.apiUrl + '/projects/' + project.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  getApiProjects(path, userId): Observable<ProjectResponse> {
    this.projects = [];

    if (!path) {
      path = '/projects';
    }

    let type = 'projects';
    let filter = [];

    if (userId) {
      let userFilter = {
        name: 'user_rel',
        op: 'has',
        val: {
          name: 'id',
          op: 'eq',
          val: userId
        }
      };

      filter.push(userFilter);

      path = '/project_users?filter=' + JSON.stringify(filter);

      type = 'user_projects';
    }

    return this.http.get<ProjectResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
    });
  }

  getApiProjectUsers(path, project: Project): Observable<UserResponse> {
    this.users = [];

    if (!path) {
      path = '/project_users';
    }

    let filter = [];

    let projectFilter = {
      name: 'project_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: project.id
      }
    };

    filter.push(projectFilter);

    path = path + '?filter=' + JSON.stringify(filter);

    return this.http.get<UserResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'item_user')
    });
  }

  getApiProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(environment.apiUrl + '/projects/' + projectId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'project')
    });
  }

  addUserToProject(project: Project, userId: string): Observable<any> {
    this.projectUserPost = new ProjectUserPost();
    this.projectUserPost.mapToPost(project, userId);

    return this.http.post(environment.apiUrl + '/project_users', this.projectUserPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addApiPersonToProject(project: Project, person: Person): Observable<any> {
    this.projectPersonPost = new ProjectPersonPost();
    this.projectPersonPost.mapToPost(project, person);

    return this.http.post(environment.apiUrl + '/project_persons', this.projectPersonPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addApiEssayToProject(project: Project, essay: Essay): Observable<any> {
    this.projectEssayPost = new ProjectEssayPost();
    this.projectEssayPost.mapToPost(project, essay);

    return this.http.post(environment.apiUrl + '/project_essays', this.projectEssayPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addApiTimelineToProject(project: Project, timeline: Timeline): Observable<any> {
    this.projectTimelinePost = new ProjectTimelinePost();
    this.projectTimelinePost.mapToPost(project, timeline);

    return this.http.post(environment.apiUrl + '/project_timelines', this.projectTimelinePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addApiEventToProject(project: Project, event: Event): Observable<any> {
    this.projectEventPost = new ProjectEventPost();
    this.projectEventPost.mapToPost(project, event);

    return this.http.post(environment.apiUrl + '/project_events', this.projectEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addApiChartToProject(project: Project, chart: Chart): Observable<any> {
    this.projectChartPost = new ProjectChartPost();
    this.projectChartPost.mapToPost(project, chart);

    return this.http.post(environment.apiUrl + '/project_charts', this.projectChartPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addApiBrainstormToProject(project: Project, brainstorm: Brainstorm): Observable<any> {
    this.projectBrainstormPost = new ProjectBrainstormPost();
    this.projectBrainstormPost.mapToPost(project, brainstorm);

    return this.http.post(environment.apiUrl + '/project_brainstorms', this.projectBrainstormPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiEssayFromProject(projectEssay: ProjectEssay): Observable<any> {
    return this.http.delete(environment.apiUrl + '/project_essays/' + projectEssay.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiTimelineFromProject(projectTimeline: ProjectTimeline): Observable<any> {
    return this.http.delete(environment.apiUrl + '/project_timelines/' + projectTimeline.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiPersonFromProject(projectPerson: ProjectPerson): Observable<any> {
    return this.http.delete(environment.apiUrl + '/project_persons/' + projectPerson.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiEventFromProject(projectEvent: ProjectEvent): Observable<any> {
    return this.http.delete(environment.apiUrl + '/project_events/' + projectEvent.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiChartFromProject(projectChart: ProjectChart): Observable<any> {
    return this.http.delete(environment.apiUrl + '/project_charts/' + projectChart.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiBrainstormFromProject(projectBrainstorm: ProjectBrainstorm): Observable<any> {
    return this.http.delete(environment.apiUrl + '/project_brainstorms/' + projectBrainstorm.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}

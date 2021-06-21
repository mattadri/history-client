import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {Essay} from '../models/essays/essay';
import {EssayPost} from '../models/essays/posts/essay-post';
import {EssayNote} from '../models/essays/essay-note';
import {EssayNotePost} from '../models/essays/posts/essay-note-post';
import {EssayReference} from '../models/essays/essay-reference';
import {EssayReferencePost} from '../models/essays/posts/essay-reference-post';
import {EssayEvent} from '../models/essays/essay-event';
import {EssayEventPost} from '../models/essays/posts/essay-event-post';
import {EssayPerson} from '../models/essays/essay-person';
import {EssayPersonPost} from '../models/essays/posts/essay-person-post';
import {EssayTimelinePost} from '../models/essays/posts/essay-timeline-post';
import {EssayTimeline} from '../models/essays/essay-timeline';
import {EssayResponse} from '../models/essays/responses/essay-response';
import {EssayType} from '../models/essays/essay-type';
import {EssayUser} from '../models/essays/essay-user';
import {EssayUserPost} from '../models/essays/posts/essay-user-post';
import {UserResponse} from '../models/users/responses/user-response';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class EssayService {
  public essays: Essay[];
  public essayTypes: EssayType[];

  public users: User[];

  public essayPost: EssayPost;
  public essayNotePost: EssayNotePost;
  public essayReferencePost: EssayReferencePost;
  public essayEventPost: EssayEventPost;
  public essayPersonPost: EssayPersonPost;
  public essayTimelinePost: EssayTimelinePost;
  public essayUserPost: EssayUserPost;

  constructor(private http: HttpClient) {
    this.essays = [];
    this.users = [];
  }

  static removeNote(essay: Essay, essayNote: EssayNote) {
    for (let i = 0; i < essay.essayNotes.length; i++) {
      if (essay.essayNotes[i].id === essayNote.id) {
        essay.essayNotes.splice(i, 1);
      }
    }
  }

  static getBiographyFilter() {
    return {
      name: 'type_rel',
      op: 'has',
      val: {
        name: 'label',
        op: 'eq',
        val: 'Biography'
      }
    }
  }

  static getBiographyByUserFilter() {
    return {
      name: 'essay_rel',
      op: 'has',
      val: {
        name: 'type_rel',
        op: 'has',
        val: {
          name: 'label',
          op: 'eq',
          val: 'Biography'
        }
      }
    }
  }

  getApiEssayTypes(): Observable<any> {
    this.essayTypes = [];

    return this.http.get<any>(environment.apiUrl + '/essay_types?page[size]=0', {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
    });
  }

  getApiEssays(path: string,
               userId: string,
               pageSize: string,
               fields: Array<string>,
               sort: Array<string>,
               sortDescending: boolean,
               additionalFilters: Array<Object>,
               isAnotherPage: boolean): Observable<EssayResponse> {
    let type = 'essays';

    // only add params if it's not a link to another page
    if (!isAnotherPage) {
      // default page size is 20 records per page
      if (!pageSize) {
        pageSize = '20';
      }

      this.essays = [];

      if (!path) {
        path = '/essays';
      }

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

        path = '/essay_users';

        type = 'user_essays';
      }

      path = path + '?page[size]=' + pageSize;

      // add any fields filter to the path
      if (fields && fields.length) {
        path = path + '&fields[essay]=';

        for (let i = 0; i < fields.length; i++) {
          path = path + fields[i];

          if (i < fields.length -1) {
            path = path + ',';
          }
        }
      }

      // add any sorting if requested
      if (sort && sort.length) {
        path = path + '&sort=';

        if (sortDescending) {
          path = path + '-';
        }

        for (let i = 0; i < sort.length; i++) {
          path = path + sort[i];

          if (i < sort.length - 1) {
            path = path + ',';
          }
        }
      }

      // lastly tack on any additional filters passed
      if (additionalFilters && additionalFilters.length) {
        for (const additionalFilter of additionalFilters) {
          filter.push(additionalFilter);
        }
      }

      if (filter.length) {
        path = path + '&filter=' + JSON.stringify(filter);
      }

    } else {
      if (path.includes('/essay_users')) {
        type = 'user_essays';
      }
    }

    return this.http.get<EssayResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
    });
  }

  getApiEssay(essayId) {
    return this.http.get<Essay>(environment.apiUrl + '/essays/' + essayId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'essay')
    });
  }

  getApiEssayUsers(path: string, essay: Essay): Observable<UserResponse> {
    this.users = [];

    if (!path) {
      path = '/essay_users';
    }

    let filter = [];

    let essayFilter = {
      name: 'essay_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: essay.id
      }
    };

    filter.push(essayFilter);

    path = path + '?filter=' + JSON.stringify(filter);

    return this.http.get<UserResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'item_user')
    });
  }

  createApiEssay(essay: Essay): Observable<any> {
    this.essayPost = new EssayPost();
    this.essayPost.mapToPost(essay, true);

    return this.http.post(environment.apiUrl + '/essays', this.essayPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayBanner(imageForm: FormData): Observable<any> {
    return this.http.post(environment.apiUrl + '/upload_essay_banner', imageForm, {responseType: 'text'});
  }

  addApiUserToEssay(essayUser: EssayUser): Observable<any> {
    this.essayUserPost = new EssayUserPost();
    this.essayUserPost.mapToPost(essayUser, false);

    return this.http.post(environment.apiUrl + '/essay_users', this.essayUserPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayNote(essay: Essay, essayNote: EssayNote): Observable<any> {
    this.essayNotePost = new EssayNotePost();
    this.essayNotePost.mapToPost(essay, essayNote, false);

    return this.http.post(environment.apiUrl + '/essay_notes', this.essayNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayReference(essay: Essay, essayReference: EssayReference): Observable<any> {
    this.essayReferencePost = new EssayReferencePost();
    this.essayReferencePost.mapToPost(essay, essayReference, false);

    return this.http.post(environment.apiUrl + '/essay_references', this.essayReferencePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayEvent(essay: Essay, essayEvent: EssayEvent): Observable<any> {
    this.essayEventPost = new EssayEventPost();
    this.essayEventPost.mapToPost(essay, essayEvent);

    return this.http.post(environment.apiUrl + '/essay_events', this.essayEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayPerson(essay: Essay, essayPerson: EssayPerson): Observable<any> {
    this.essayPersonPost = new EssayPersonPost();
    this.essayPersonPost.mapToPost(essay, essayPerson);

    return this.http.post(environment.apiUrl + '/essay_persons', this.essayPersonPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayTimeline(essay: Essay, essayTimeline: EssayTimeline): Observable<any> {
    this.essayTimelinePost = new EssayTimelinePost();
    this.essayTimelinePost.mapToPost(essay, essayTimeline);

    return this.http.post(environment.apiUrl + '/essay_timelines', this.essayTimelinePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiEssay(essay: Essay): Observable<any> {
    this.essayPost = new EssayPost();
    this.essayPost.mapToPost(essay, true);

    return this.http.patch(environment.apiUrl + '/essays/' + essay.id, this.essayPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiEssayNote(essay: Essay, essayNote: EssayNote): Observable<any> {
    this.essayNotePost = new EssayNotePost();
    this.essayNotePost.mapToPost(essay, essayNote, true);

    return this.http.patch(environment.apiUrl + '/essay_notes/' + essayNote.id, this.essayNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiEssay(essay: Essay): Observable<any> {
    return this.http.delete(environment.apiUrl + '/essays/' + essay.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiNote(essayNote: EssayNote): Observable<any> {
    return this.http.delete(environment.apiUrl + '/essay_notes/' + essayNote.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  setEssay(essay: Essay) {
    this.essays.push(essay);
  }

  getEssay(essayId: number) {
    for (const essay of this.essays) {
      if (essay.id === essayId) {
        return essay;
      }
    }
  }

  removeEssay(essay: Essay) {
    for (let i = 0; i < this.essays.length; i++) {
      if (this.essays[i].id === essay.id) {
        this.essays.splice(i, 1);
      }
    }
  }

  getEssays() {
    return this.essays;
  }

  setEssayType(essayType: EssayType) {
    this.essayTypes.push(essayType);
  }

  getEssayTypes() {
    return this.essayTypes;
  }
}

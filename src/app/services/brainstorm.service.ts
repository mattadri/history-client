import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {BrainstormResponse} from '../models/responses/brainstorm-response';

import { environment } from '../../environments/environment';

import {BrainstormTopicPost} from '../models/posts/brainstorm-topic-post';
import {BrainstormTopicThoughtPost} from '../models/posts/brainstorm-topic-thought-post';
import {BrainstormThought} from '../models/brainstorm-thought';
import {BrainstormThoughtPost} from '../models/posts/brainstorm-thought-post';
import {BrainstormPost} from '../models/posts/brainstorm-post';
import {BrainstormTopic} from '../models/brainstorm-topic';
import {Brainstorm} from '../models/brainstorm';
import {BrainstormUserPost} from '../models/brainstorms/posts/brainstorm-user-post';
import {UserResponse} from '../models/users/responses/user-response';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BrainstormService {
  public brainstorms: Brainstorm[];
  public users: User[];

  private brainstormPost: BrainstormPost;
  private topicPost: BrainstormTopicPost;
  private topicThoughtPost: BrainstormTopicThoughtPost;
  private brainstormThoughtPost: BrainstormThoughtPost;
  private brainstormUserPost: BrainstormUserPost;

  constructor(private http: HttpClient) {
    this.brainstorms = [];
  }

  getApiBrainstorms(path: string, userId, pageSize: string, pageNumber: string, fields: Array<string>, sort: Array<string>,
                    sortDescending: boolean, additionalFilters: Array<Object>, isAnotherPage: boolean): Observable<BrainstormResponse> {
    this.brainstorms = [];

    let type = 'brainstorms';

    // if a next of previous page is being retrieved just all the path as is
    if (!isAnotherPage) {
      if (!path) {
        path = '/brainstorms';
      }

      // default page size is 20 records per page
      if (!pageSize) {
        pageSize = '20';
      }

      // default page number to 1
      if (!pageNumber) {
        pageNumber = '1';
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

        path = '/brainstorm_users';

        type = 'user_brainstorms';
      }

      path = path + '?page[size]=' + pageSize;

      path = path + '&page[number]=' + pageNumber;

      // add any fields filter to the path
      if (fields && fields.length) {
        path = path + '&fields[brainstorm]=';

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
      // set the type to user if the next page are user timelines
      if (path.includes('/brainstorm_users')) {
        type = 'user_brainstorms';
      }
    }

    return this.http.get<BrainstormResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
    });
  }

  getApiBrainstorm(brainstormId: number) {
    return this.http.get<Brainstorm>(environment.apiUrl + '/brainstorms/' + brainstormId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'brainstorm')
    });
  }

  getApiBrainstormUsers(path: string, brainstorm: Brainstorm): Observable<UserResponse> {
    this.users = [];

    if (!path) {
      path = '/brainstorm_users';
    }

    let filter = [];

    let brainstormFilter = {
      name: 'brainstorm_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: brainstorm.id
      }
    };

    filter.push(brainstormFilter);

    path = path + '?filter=' + JSON.stringify(filter);

    return this.http.get<UserResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'item_user')
    });
  }

  createApiBrainstorm(brainstorm: Brainstorm): Observable<any> {
    this.brainstormPost = new BrainstormPost();
    this.brainstormPost.mapToPost(brainstorm, false);

    return this.http.post(environment.apiUrl + '/brainstorms', this.brainstormPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiBrainstormTopic(brainstorm: Brainstorm, topic: BrainstormTopic): Observable<any> {
    this.topicPost = new BrainstormTopicPost();
    this.topicPost.mapToPost(brainstorm, topic, false);

    return this.http.post(environment.apiUrl + '/brainstorm_topics', this.topicPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiBrainstormTopicThought(thought: BrainstormThought): Observable<any> {
    this.topicThoughtPost = new BrainstormTopicThoughtPost();
    this.topicThoughtPost.mapToPost(thought, false);

    return this.http.post(environment.apiUrl + '/brainstorm_topic_thoughts', this.topicThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiBrainstormThought(thought: BrainstormThought): Observable<any> {
    this.brainstormThoughtPost = new BrainstormThoughtPost();
    this.brainstormThoughtPost.mapToPost(thought, false);

    return this.http.post(environment.apiUrl + '/brainstorm_thoughts', this.brainstormThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  addUserToBrainstorm(brainstorm: Brainstorm, userId: string): Observable<any> {
    this.brainstormUserPost = new BrainstormUserPost();
    this.brainstormUserPost.mapToPost(brainstorm, userId);

    return this.http.post(environment.apiUrl + '/brainstorm_users', this.brainstormUserPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiTopic(topic: BrainstormTopic): Observable<any> {
    this.topicPost = new BrainstormTopicPost();
    this.topicPost.mapToPost(null, topic, true);

    return this.http.patch(environment.apiUrl + '/brainstorm_topics/' + topic.id, this.topicPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiBrainstormThought(thought: BrainstormThought): Observable<any> {
    this.brainstormThoughtPost = new BrainstormThoughtPost();
    this.brainstormThoughtPost.mapToPost(thought, true);

    return this.http.patch(environment.apiUrl + '/brainstorm_thoughts/' + thought.id, this.brainstormThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiTopicThought(thought: BrainstormThought): Observable<any> {
    this.topicThoughtPost = new BrainstormTopicThoughtPost();
    this.topicThoughtPost.mapToPost(thought, true);

    return this.http.patch(environment.apiUrl + '/brainstorm_topic_thoughts/' + thought.id, this.topicThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  deleteApiBrainstormThought(thought: BrainstormThought): Observable<any> {
    return this.http.delete(environment.apiUrl + '/brainstorm_thoughts/' + thought.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  deleteApiBrainstormTopicThought(thought: BrainstormThought): Observable<any> {
    return this.http.delete(environment.apiUrl + '/brainstorm_topic_thoughts/' + thought.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  setBrainstorm(brainstorm: Brainstorm) {
    this.brainstorms.push(brainstorm);
  }

  getBrainstorms() {
    return this.brainstorms;
  }

  removeBrainstormThought(brainstorm: Brainstorm, thought: BrainstormThought) {
    for (let i = 0; i < brainstorm.thoughts.length; i++) {
      if (brainstorm.thoughts[i].id === thought.id) {
        brainstorm.thoughts.splice(i, 1);

        break;
      }
    }
  }

  removeTopicThought(topic: BrainstormTopic, thought: BrainstormThought) {
    for (let i = 0; i < topic.thoughts.length; i++) {
      if (topic.thoughts[i].id === thought.id) {
        topic.thoughts.splice(i, 1);
      }
    }
  }
}

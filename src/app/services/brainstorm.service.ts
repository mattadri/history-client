import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Brainstorm} from '../models/brainstorm';
import {BrainstormResponse} from '../models/responses/brainstorm-response';

import { environment } from '../../environments/environment';
import {BrainstormTopicPost} from '../models/posts/brainstorm-topic-post';
import {BrainstormTopicThoughtPost} from '../models/posts/brainstorm-topic-thought-post';
import {BrainstormThought} from '../models/brainstorm-thought';
import {BrainstormThoughtPost} from '../models/posts/brainstorm-thought-post';

@Injectable({
  providedIn: 'root'
})
export class BrainstormService {
  public brainstorms: Brainstorm[];

  private topicPost: BrainstormTopicPost;
  private topicThoughtPost: BrainstormTopicThoughtPost;
  private brainstormThoughtPost: BrainstormThoughtPost;

  constructor(private http: HttpClient) {
    this.brainstorms = [];
  }

  getApiBrainstorms(path): Observable<BrainstormResponse> {
    this.brainstorms = [];

    return this.http.get<BrainstormResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'brainstorms')
    });
  }

  getApiBrainstorm(brainstormId) {
    return this.http.get<Brainstorm>(environment.apiUrl + '/brainstorms/' + brainstormId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'brainstorm')
    });
  }

  createApiBrainstormTopicThought(thought): Observable<any> {
    this.topicThoughtPost = new BrainstormTopicThoughtPost();
    this.topicThoughtPost.mapToPost(thought, false);

    return this.http.post(environment.apiUrl + '/brainstorm_topic_thoughts', this.topicThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiBrainstormThought(thought): Observable<any> {
    this.brainstormThoughtPost = new BrainstormThoughtPost();
    this.brainstormThoughtPost.mapToPost(thought, false);

    return this.http.post(environment.apiUrl + '/brainstorm_thoughts', this.brainstormThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiTopic(topic): Observable<any> {
    this.topicPost = new BrainstormTopicPost();
    this.topicPost.mapToPost(topic, true);

    return this.http.patch(environment.apiUrl + '/brainstorm_topics/' + topic.id, this.topicPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiBrainstormThought(thought): Observable<any> {
    this.brainstormThoughtPost = new BrainstormThoughtPost();
    this.brainstormThoughtPost.mapToPost(thought, true);

    return this.http.patch(environment.apiUrl + '/brainstorm_thoughts/' + thought.id, this.brainstormThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiTopicThought(thought): Observable<any> {
    this.topicThoughtPost = new BrainstormTopicThoughtPost();
    this.topicThoughtPost.mapToPost(thought, true);

    return this.http.patch(environment.apiUrl + '/brainstorm_topic_thoughts/' + thought.id, this.topicThoughtPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  deleteApiBrainstormThought(thought): Observable<any> {
    return this.http.delete(environment.apiUrl + '/brainstorm_thoughts/' + thought.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  deleteApiBrainstormTopicThought(thought): Observable<any> {
    return this.http.delete(environment.apiUrl + '/brainstorm_topic_thoughts/' + thought.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  setBrainstorm(brainstorm) {
    this.brainstorms.push(brainstorm);
  }

  getBrainstorms() {
    return this.brainstorms;
  }

  removeBrainstormThought(brainstorm, thought) {
    for (let i = 0; i < brainstorm.thoughts.length; i++) {
      if (parseInt(brainstorm.thoughts[i].id, 10) === parseInt(thought.id, 10)) {
        console.log('Found thought to splice', brainstorm.thoughts[i]);
        brainstorm.thoughts.splice(i, 1);

        break;
      }
    }
  }

  removeTopicThought(topic, thought) {
    for (let i = 0; i < topic.thoughts.length; i++) {
      if (parseInt(topic.thoughts[i].id, 10) === parseInt(thought.id, 10)) {
        topic.thoughts.splice(i, 1);
      }
    }
  }
}

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

@Injectable({
  providedIn: 'root'
})
export class BrainstormService {
  public brainstorms: Brainstorm[];

  private brainstormPost: BrainstormPost;
  private topicPost: BrainstormTopicPost;
  private topicThoughtPost: BrainstormTopicThoughtPost;
  private brainstormThoughtPost: BrainstormThoughtPost;

  constructor(private http: HttpClient) {
    this.brainstorms = [];
  }

  getApiBrainstorms(path: string): Observable<BrainstormResponse> {
    this.brainstorms = [];

    return this.http.get<BrainstormResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'brainstorms')
    });
  }

  getApiBrainstorm(brainstormId: number) {
    return this.http.get<Brainstorm>(environment.apiUrl + '/brainstorms/' + brainstormId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'brainstorm')
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
      if (parseInt(brainstorm.thoughts[i].id, 10) === parseInt(thought.id, 10)) {
        console.log('Found thought to splice', brainstorm.thoughts[i]);
        brainstorm.thoughts.splice(i, 1);

        break;
      }
    }
  }

  removeTopicThought(topic: BrainstormTopic, thought: BrainstormThought) {
    for (let i = 0; i < topic.thoughts.length; i++) {
      if (parseInt(topic.thoughts[i].id, 10) === parseInt(thought.id, 10)) {
        topic.thoughts.splice(i, 1);
      }
    }
  }
}

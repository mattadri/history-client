import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {BrainstormService} from '../../services/brainstorm.service';

import {Brainstorm} from '../../models/brainstorm';
import {BrainstormThought} from '../../models/brainstorm-thought';
import {BrainstormTopic} from '../../models/brainstorm-topic';

@Component({
  selector: 'app-brainstorm',
  templateUrl: './brainstorm.component.html',
  styleUrls: ['./brainstorm.component.scss']
})
export class BrainstormComponent implements OnInit {
  public brainstorm: Brainstorm;
  public thought: BrainstormThought;

  public isAddThoughtMode: boolean;
  public isAddBrainstormThoughtMode: boolean;

  constructor(private route: ActivatedRoute,
              private brainstormService: BrainstormService) {
    this.isAddThoughtMode = false;
    this.isAddBrainstormThoughtMode = false;

    const brainstormId = this.route.snapshot.paramMap.get('id');

    this.initializeNewBrainstormThought();

    this.brainstormService.getApiBrainstorm(brainstormId).subscribe(brainstorm => {
      this.brainstorm = brainstorm;
    });
  }

  ngOnInit() { }

  initializeNewBrainstormThought() {
    this.thought = new BrainstormThought();
    this.thought.initializeNewThought();
  }

  openTopicReorderPanel(contentPanel) {
    contentPanel.open();
  }

  closeTopicReorderPanel(contentPanel) {
    contentPanel.close();
  }

  createThought() {
    this.thought.source = null;
    this.thought.brainstormId = this.brainstorm.id;
    this.thought.position = this.brainstorm.thoughts.length;

    this.brainstormService.createApiBrainstormThought(this.thought).subscribe(response => {
      this.thought.id = response.data.id;

      this.brainstorm.thoughts.push(this.thought);

      this.setCreateBrainstormThoughtMode(false);
    });
  }

  createTopicThought(topic) {
    this.thought.topicId = topic.id;
    this.thought.source = null;

    this.thought.position = topic.thoughts.length;

    this.brainstormService.createApiBrainstormTopicThought(this.thought).subscribe(response => {
      this.thought.id = response.data.id;

      topic.thoughts.push(this.thought);

      this.setCreateTopicThoughtMode(false);
    });
  }

  openCreateTopicDialog() {
    console.log('Creating new topic for brainstorm: ', this.brainstorm);
  }

  removeTopicThought(response: any) {
    this.brainstormService.deleteApiBrainstormTopicThought(response.thought).subscribe(() => {
      this.brainstormService.removeTopicThought(response.topic, response.thought);

      for (let i = 0; i < response.topic.thoughts.length; i++) {
        const thoughtToUpdate = response.topic.thoughts[i];
        thoughtToUpdate.position = i;

        this.brainstormService.patchApiTopicThought(thoughtToUpdate).subscribe(() => { });
      }
    });
  }

  removeBrainstormThought(response: any) {
    this.brainstormService.deleteApiBrainstormThought(response.thought).subscribe(() => {
      this.brainstormService.removeBrainstormThought(this.brainstorm, response.thought);

      for (let i = 0; i < this.brainstorm.thoughts.length; i++) {
        const thoughtToUpdate = this.brainstorm.thoughts[i];
        thoughtToUpdate.position = i;

        this.brainstormService.patchApiBrainstormThought(thoughtToUpdate).subscribe(() => { });
      }
    });
  }

  reorderTopic(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.brainstorm.topics, event.previousIndex, event.currentIndex);

    for (let i = 0; i < this.brainstorm.topics.length; i++) {
      const topic = this.brainstorm.topics[i];
      topic.position = i;

      this.brainstormService.patchApiTopic(topic).subscribe(() => { });
    }
  }

  reorderThought(event: CdkDragDrop<string[]>) {
    // A thought is being moved within the same container
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      for (let i = 0; i < event.container.data.length; i++) {
        const thought: BrainstormThought = event.container.data[i];
        thought.position = i;

        if (event.container.id === '0') {
          this.brainstormService.patchApiBrainstormThought(thought).subscribe(() => { });
        } else {
          this.brainstormService.patchApiTopicThought(thought).subscribe(() => { });
        }
      }

    // A thought is being moved from one container to another.
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      let newTopic = null;
      let originalTopic = null;

      const thought: BrainstormThought = event.item.data;

      for (const topic of this.brainstorm.topics) {
        if (topic.id === parseInt(event.previousContainer.id, 10)) {
          originalTopic = topic;
        } else if (topic.id === parseInt(event.container.id, 10)) {
          newTopic = topic;

          thought.topicId = parseInt(newTopic.id, 10);
        }
      }

      // if the originalTopic is null then the original container was the root brainstorm container.
      // in this case remove the brainstorm thought and copy it to the destination topic container.
      if (!originalTopic) {
        this.brainstormService.createApiBrainstormTopicThought(thought).subscribe(response => {
          this.brainstormService.deleteApiBrainstormThought(thought).subscribe(() => {
            thought.id = response.data.id;

            for (let i = 0; i < this.brainstorm.thoughts.length; i++) {
              const brainstormThought = this.brainstorm.thoughts[i];
              brainstormThought.position = i;

              this.brainstormService.patchApiBrainstormThought(brainstormThought).subscribe(() => { });
            }

            for (let i = 0; i < newTopic.thoughts.length; i ++) {
              const topicThought = newTopic.thoughts[i];
              topicThought.position = i;

              this.brainstormService.patchApiTopicThought(topicThought).subscribe(() => { });
            }
          });
        });

      // if the newTopic is null then the destination container is the root brainstorm container
      // in this case remove the thought from the topic and copy it to the brainstorm
      } else if (!newTopic) {
        thought.topicId = null;
        thought.brainstormId = this.brainstorm.id;

        this.brainstormService.createApiBrainstormThought(thought).subscribe(response => {
          this.brainstormService.deleteApiBrainstormTopicThought(thought).subscribe(() => {
            thought.id = response.data.id;

            for (let i = 0; i < this.brainstorm.thoughts.length; i++) {
              const brainstormThought = this.brainstorm.thoughts[i];
              brainstormThought.position = i;

              this.brainstormService.patchApiBrainstormThought(brainstormThought).subscribe(() => { });
            }

            for (let i = 0; i < originalTopic.thoughts.length; i ++) {
              const topicThought = originalTopic.thoughts[i];
              topicThought.position = i;

              this.brainstormService.patchApiTopicThought(topicThought);
            }
          });
        });

      // in this case the thought is just moving between topics
      } else {
        this.brainstormService.patchApiTopicThought(thought).subscribe(() => {
          for (let i = 0; i < originalTopic.thoughts.length; i++) {
            const originalTopicThought = originalTopic.thoughts[i];
            originalTopicThought.position = i;

            this.brainstormService.patchApiTopicThought(originalTopicThought).subscribe(() => { });
          }

          for (let i = 0; i < newTopic.thoughts.length; i++) {
            const newTopicThought = newTopic.thoughts[i];
            newTopicThought.position = i;

            this.brainstormService.patchApiTopicThought(newTopicThought).subscribe(() => { });
          }
        });
      }
    }
  }

  setCreateTopicThoughtMode(isActive) {
    if (!isActive) {
      this.initializeNewBrainstormThought();
    }

    this.isAddThoughtMode = isActive;
  }

  setCreateBrainstormThoughtMode(isActive) {
    if (!isActive) {
      this.initializeNewBrainstormThought();
    }

    this.isAddBrainstormThoughtMode = isActive;
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project} from '../../models/projects/project';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() public project: Project;
  @Input() public canDelete: boolean;

  @Output() private removeProject: EventEmitter<Project>;

  constructor() {
    this.removeProject = new EventEmitter<Project>();
  }

  ngOnInit(): void {
  }

  doRemoveProject() {
    this.removeProject.emit(this.project);
  }
}

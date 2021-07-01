import {ProjectEssay} from './project-essay';
import {ProjectTimeline} from './project-timeline';
import {ProjectBrainstorm} from './project-brainstorm';
import {ProjectPerson} from './project-person';
import {ProjectEvent} from './project-event';
import {ProjectChart} from './project-chart';

export class Project {
  id: string;
  label: string;

  essays: ProjectEssay[];
  timelines: ProjectTimeline[];
  brainstorms: ProjectBrainstorm[];
  persons: ProjectPerson[];
  events: ProjectEvent[];
  charts: ProjectChart[];

  mapProject(project, included) {
    this.id = project.id;
    this.label = project.attributes.label;

    // map essays if they exist
    if (project.relationships) {
      if (project.relationships.project_essay && project.relationships.project_essay.data && project.relationships.project_essay.data.length) {
        for (const projectEssay of project.relationships.project_essay.data) {
          let projectEssayId = projectEssay.id;
          let projectEssayType = projectEssay.type;

          let returnedEssay = this.objectLookup(projectEssayId, projectEssayType, included);

          let essay = new ProjectEssay();
          essay.initializeNewProjectEssay();
          essay.mapProjectEssay(returnedEssay);

          this.essays.push(essay);
        }
      }

      // map timelines if they exist
      if (project.relationships.project_timeline && project.relationships.project_timeline.data && project.relationships.project_timeline.data.length) {
        for (const projectTimeline of project.relationships.project_timeline.data) {
          let projectTimelineId = projectTimeline.id;
          let projectTimelineType = projectTimeline.type;

          let returnedTimeline = this.objectLookup(projectTimelineId, projectTimelineType, included);

          let timeline = new ProjectTimeline();
          timeline.initializeNewProjectTimeline();
          timeline.mapProjectTimeline(returnedTimeline);

          this.timelines.push(timeline);
        }
      }

      // map brainstorms if they exist
      if (project.relationships.project_brainstorm && project.relationships.project_brainstorm.data && project.relationships.project_brainstorm.data.length) {
        for (const projectBrainstorm of project.relationships.project_brainstorm.data) {
          let projectBrainstormId = projectBrainstorm.id;
          let projectBrainstormType = projectBrainstorm.type;

          let returnedBrainstorm = this.objectLookup(projectBrainstormId, projectBrainstormType, included);

          let brainstorm = new ProjectBrainstorm();
          brainstorm.initializeNewProjectBrainstorm();
          brainstorm.mapProjectBrainstorm(returnedBrainstorm);

          this.brainstorms.push(brainstorm);
        }
      }

      // map persons if they exist
      if (project.relationships.project_person && project.relationships.project_person.data && project.relationships.project_person.data.length) {
        for (const projectPerson of project.relationships.project_person.data) {
          let projectPersonId = projectPerson.id;
          let projectPersonType = projectPerson.type;

          let returnedPerson = this.objectLookup(projectPersonId, projectPersonType, included);

          let person = new ProjectPerson();
          person.initializeNewProjectPerson();
          person.mapProjectPerson(returnedPerson);

          this.persons.push(person);
        }
      }

      // map events if they exist
      if (project.attributes.project_event && project.attributes.project_event.data && project.attributes.project_event.data.length) {
        for (const projectEvent of project.attributes.project_event.data) {
          let event = new ProjectEvent();
          event.initializeNewProjectEvent();
          event.mapProjectEvent(projectEvent);

          this.events.push(event);
        }
      }

      // map charts if they exist
      if (project.attributes.project_chart && project.attributes.project_chart.data && project.attributes.project_chart.data.length) {
        for (const projectChart of project.attributes.project_chart.data) {
          let chart = new ProjectChart();
          chart.initializeNewProjectChart();
          chart.mapProjectChart(projectChart);

          this.charts.push(chart);
        }
      }
    }
  }

  initializeNewProject() {
    this.label = '';

    this.essays = [];
    this.timelines = [];
    this.brainstorms = [];
    this.persons = [];
    this.events = [];
    this.charts = [];
  }

  objectLookup(id, type, included) {
    let foundItem = null;

    for (const item of included) {
      if (item.id.toString() === id.toString() && item.type.toLowerCase() === type.toLowerCase()) {
        foundItem = item;
        break;
      }
    }

    return foundItem;
  }
}

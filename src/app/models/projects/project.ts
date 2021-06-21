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

  mapProject(project) {
    this.id = project.id;
    this.label = project.attributes.label;

    // map essays if they exist
    if (project.attributes.project_essay && project.attributes.project_essay.data && project.attributes.project_essay.data.length) {
      for (const projectEssay of project.attributes.project_essay.data) {
        let essay = new ProjectEssay();
        essay.initializeNewProjectEssay();
        essay.mapProjectEssay(projectEssay);

        this.essays.push(essay);
      }
    }

    // map timelines if they exist
    if (project.attributes.project_timeline && project.attributes.project_timeline.data && project.attributes.project_timeline.data.length) {
      for (const projectTimeline of project.attributes.project_timeline.data) {
        let timeline = new ProjectTimeline();
        timeline.initializeNewProjectTimeline();
        timeline.mapProjectTimeline(projectTimeline);

        this.timelines.push(timeline);
      }
    }

    // map brainstorms if they exist
    if (project.attributes.project_brainstorm && project.attributes.project_brainstorm.data && project.attributes.project_brainstorm.data.length) {
      for (const projectBrainstorm of project.attributes.project_brainstorm.data) {
        let brainstorm = new ProjectBrainstorm();
        brainstorm.initializeNewProjectBrainstorm();
        brainstorm.mapProjectBrainstorm(projectBrainstorm);

        this.brainstorms.push(brainstorm);
      }
    }

    // map persons if they exist
    if (project.attributes.project_person && project.attributes.project_person.data && project.attributes.project_person.data.length) {
      for (const projectPerson of project.attributes.project_person.data) {
        let person = new ProjectPerson();
        person.initializeNewProjectPerson();
        person.mapProjectPerson(projectPerson);

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

  initializeNewProject() {
    this.label = '';

    this.essays = [];
    this.timelines = [];
    this.brainstorms = [];
    this.persons = [];
    this.events = [];
    this.charts = [];
  }
}

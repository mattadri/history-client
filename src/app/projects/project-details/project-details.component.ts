import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/projects/project';
import {MatDialog} from '@angular/material/dialog';
import {PersonService} from '../../services/person.service';
import {ProjectPerson} from '../../models/projects/project-person';
import {EssayService} from '../../services/essay.service';
import {ProjectEssay} from '../../models/projects/project-essay';
import {EssayUser} from '../../models/essays/essay-user';
import {UserService} from '../../services/user.service';
import {AddTimelineDialogComponent} from '../../utilities/add-timeline-dialog/add-timeline-dialog.component';
import {ProjectTimeline} from '../../models/projects/project-timeline';
import {TimelineService} from '../../services/timeline.service';
import {ProjectEvent} from '../../models/projects/project-event';
import {ProjectChart} from '../../models/projects/project-chart';
import {ProjectBrainstorm} from '../../models/projects/project-brainstorm';
import {EventService} from '../../services/event.service';
import {ChartService} from '../../services/chart.service';
import {BrainstormService} from '../../services/brainstorm.service';
import {AddChartDialogComponent} from '../../utilities/add-chart-dialog/add-chart-dialog.component';
import {AddBrainstormDialogComponent} from '../../utilities/add-brainstorm-dialog/add-brainstorm-dialog.component';
import {User} from '../../models/user';
import {AddUserDialogComponent} from '../../utilities/add-user-dialog/add-user-dialog.component';
import {MessageDialogComponent} from '../../utilities/message-dialog/message-dialog.component';
import {AddExistingEssayDialogComponent} from '../../utilities/add-existing-essay-dialog/add-existing-essay-dialog.component';
import {AddEssayDialogComponent} from '../../utilities/add-essay-dialog/add-essay-dialog.component';
import {AddExistingTimelineDialogComponent} from '../../utilities/add-existing-timeline-dialog/add-existing-timeline-dialog.component';
import {AddEventDialogComponent} from '../../utilities/add-event-dialog/add-event-dialog.component';
import {AddExistingEventDialogComponent} from '../../utilities/add-existing-event-dialog/add-existing-event-dialog.component';
import {AddPersonDialogComponent} from '../../utilities/add-person-dialog/add-person-dialog.component';
import {AddExistingPersonDialogComponent} from '../../utilities/add-existing-person-dialog/add-existing-person-dialog.component';
import {AddExistingChartDialogComponent} from '../../utilities/add-existing-chart-dialog/add-existing-chart-dialog.component';
import {AddExistingBrainstormDialogComponent} from '../../utilities/add-existing-brainstorm-dialog/add-existing-brainstorm-dialog.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  public project: Project;
  public projectUsers: User[];

  private userId: string;

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private projectService: ProjectService,
              private personService: PersonService,
              private eventService: EventService,
              private chartService: ChartService,
              private brainstormService: BrainstormService,
              private essayService: EssayService,
              private userService: UserService,
              private timelineService: TimelineService) {
    const projectId = this.route.snapshot.paramMap.get('id');

    this.userId = localStorage.getItem('user.id');

    this.projectUsers = [];

    this.project = this.projectService.getProject(projectId);

    if (!this.project) {
      this.projectService.getApiProject(projectId).subscribe((project) => {
        this.project = project;

        this.projectService.getApiProjectUsers('/project_users', this.project).subscribe((response) => {
          for (const user of response.users) {
            this.projectUsers.push(user);
          }
        });

        this.projectService.setProject(this.project);
      });
    }
  }

  ngOnInit(): void {
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(user => {
      let userExists = false;

      for (const currentUser of this.projectUsers) {
        if (user.id === currentUser.id) {
          userExists = true;
          break;
        }
      }

      if (userExists) {
        this.dialog.open(MessageDialogComponent, {
          width: '250px',
          data: {
            title: 'Could Not Add User',
            message: 'User is already part of the project.'
          }
        });
      } else {
        this.projectService.addUserToProject(this.project, user.id).subscribe(() => {
          this.projectUsers.push(user);
        });
      }
    });
  }

  addExistingEssay() {
    const dialogRef = this.dialog.open(AddExistingEssayDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(essay => {
      this.projectService.addApiEssayToProject(this.project, essay).subscribe(projectEssayResponse => {
        let projectEssay = new ProjectEssay();
        projectEssay.initializeNewProjectEssay();

        projectEssay.id = projectEssayResponse.id;
        projectEssay.essay = essay;

        this.project.essays.unshift(projectEssay);
      });
    });
  }

  addNewEssay() {
    const dialogRef = this.dialog.open(AddEssayDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(essay => {
      this.essayService.createApiEssay(essay).subscribe(response => {
        essay.id = response.data.id;

        let essayUser = new EssayUser();

        essayUser.essay = essay;
        essayUser.user = this.userService.getLoggedInUser();


        this.essayService.addApiUserToEssay(essayUser).subscribe((response) => {
          essayUser.id = response.id;

          essay.essayUsers.push(essayUser);
        });

        this.projectService.addApiEssayToProject(this.project, essay).subscribe(projectEssayResponse => {
          let projectEssay = new ProjectEssay();
          projectEssay.initializeNewProjectEssay();

          projectEssay.id = projectEssayResponse.id;
          projectEssay.essay = essay;

          this.project.essays.unshift(projectEssay);
        });
      });
    });
  }

  addNewPerson() {
    const dialogRef = this.dialog.open(AddPersonDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(person => {
      if (person.firstName && person.birthYear) {
        this.personService.createApiPerson(person).subscribe(response => {
          person.id = response.data.id;

          person.formatYears();

          this.personService.setPerson(person);

          this.projectService.addApiPersonToProject(this.project, person).subscribe((response) => {
            let projectPerson = new ProjectPerson();
            projectPerson.initializeNewProjectPerson();

            projectPerson.id = response.id;
            projectPerson.person = person;

            this.project.persons.unshift(projectPerson);
          });
        });
      }
    });
  }

  addExistingPerson() {
    const dialogRef = this.dialog.open(AddExistingPersonDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(person => {
      this.projectService.addApiPersonToProject(this.project, person).subscribe((response) => {
        let projectPerson = new ProjectPerson();
        projectPerson.initializeNewProjectPerson();

        projectPerson.id = response.id;
        projectPerson.person = person;

        this.project.persons.unshift(projectPerson);
      });
    });
  }

  addNewEvent() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(event => {
      if (event.label) {
        this.eventService.createApiEvent(event).subscribe(response => {
          event.id = response.data.id;

          event.formatDates();
          event.formatYears();

          this.eventService.setEvent(event);

          this.projectService.addApiEventToProject(this.project, event).subscribe((response) => {
            let projectEvent = new ProjectEvent();
            projectEvent.initializeNewProjectEvent();

            projectEvent.id = response.id;
            projectEvent.event = event;

            this.project.events.unshift(projectEvent);
          });
        });
      }
    });
  }

  addExistingEvent() {
    const dialogRef = this.dialog.open(AddExistingEventDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(event => {
      this.projectService.addApiEventToProject(this.project, event).subscribe((response) => {
        let projectEvent = new ProjectEvent();
        projectEvent.initializeNewProjectEvent();

        projectEvent.id = response.id;
        projectEvent.event = event;

        this.project.events.unshift(projectEvent);
      });
    });
  }

  addNewChart() {
    const dialogRef = this.dialog.open(AddChartDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(chart => {
      if (chart.options.title.text) {
        this.chartService.createApiChart(chart).subscribe(response => {
          chart.id = response.data.id;

          for (const label of chart.labels) {
            this.chartService.createApiChartLabel(chart, label).subscribe(labelResponse => {
              label.id = labelResponse.data.id;
            });
          }

          for (const dataset of chart.datasets) {
            this.chartService.createApiChartDataset(chart, dataset).subscribe(datasetResponse => {
              dataset.id = datasetResponse.data.id;

              for (const data of dataset.data) {
                this.chartService.createApiChartDatasetData(dataset, data).subscribe(dataResponse => {
                  data.id = dataResponse.data.id;
                });
              }
            });
          }

          this.chartService.createApiChartOptions(chart, chart.options).subscribe(optionsResponse => {
            chart.options.id = optionsResponse.data.id;

            // make the title options
            this.chartService.createApiChartTitleOptions(chart.options, chart.options.title).subscribe(titleOptionsResponse => {
              chart.options.title.id = titleOptionsResponse.data.id;
            });

            // make the legend options
            this.chartService.createApiChartLegendOptions(chart.options, chart.options.legend).subscribe(legendOptionsResponse => {
              chart.options.legend.id = legendOptionsResponse.data.id;

              this.chartService.createApiChartLegendLabelOptions(chart.options.legend, chart.options.legend.labels)
                .subscribe(legendLabelOptionsResponse => {
                  chart.options.legend.labels.id = legendLabelOptionsResponse.data.id;
                });
            });

            // make the tooltip options
            this.chartService.createApiChartTooltipOptions(chart.options, chart.options.tooltips).subscribe(tooltipOptionsResponse => {
              chart.options.tooltips.id = tooltipOptionsResponse.data.id;
            });
          });

          this.projectService.addApiChartToProject(this.project, chart).subscribe((response) => {
            let projectChart = new ProjectChart();
            projectChart.initializeNewProjectChart();

            projectChart.id = response.data.id;
            projectChart.chart = chart;

            this.project.charts.unshift(projectChart);
          });
        });
      }
    });
  }

  addExistingChart() {
    const dialogRef = this.dialog.open(AddExistingChartDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(chart => {
      this.projectService.addApiChartToProject(this.project, chart).subscribe((response) => {
        let projectChart = new ProjectChart();
        projectChart.initializeNewProjectChart();

        projectChart.id = response.data.id;
        projectChart.chart = chart;

        this.project.charts.unshift(projectChart);
      });
    });
  }

  addNewBrainstorm() {
    const dialogRef = this.dialog.open(AddBrainstormDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(brainstorm => {
      if (brainstorm.title) {
        this.brainstormService.createApiBrainstorm(brainstorm).subscribe(response => {
          brainstorm.id = response.data.id;

          this.brainstormService.setBrainstorm(brainstorm);

          this.projectService.addApiBrainstormToProject(this.project, brainstorm).subscribe((response) => {
            let projectBrainstorm = new ProjectBrainstorm();
            projectBrainstorm.initializeNewProjectBrainstorm();

            projectBrainstorm.id = response.data.id;
            projectBrainstorm.brainstorm = brainstorm;

            this.project.brainstorms.unshift(projectBrainstorm);
          });

          this.brainstormService.addUserToBrainstorm(brainstorm, this.userId).subscribe(() => {});
        });
      }
    });
  }

  addExistingBrainstorm() {
    const dialogRef = this.dialog.open(AddExistingBrainstormDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(brainstorm => {
      this.projectService.addApiBrainstormToProject(this.project, brainstorm).subscribe((response) => {
        let projectBrainstorm = new ProjectBrainstorm();
        projectBrainstorm.initializeNewProjectBrainstorm();

        projectBrainstorm.id = response.data.id;
        projectBrainstorm.brainstorm = brainstorm;

        this.project.brainstorms.unshift(projectBrainstorm);
      });
    });
  }

  addNewTimeline() {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(timeline => {
      // THE USER CAN CLOSE DIALOG WITHOUT ENTERING INFO. CHECK TO MAKE SURE REQUIRED FIELDS ARE PRESENT.
      if (timeline.label) {
        this.timelineService.createApiTimeline(timeline).subscribe(response => {
          timeline.id = response.data.id;

          this.timelineService.setTimeline(timeline);

          this.timelineService.addUserToTimeline(timeline, this.userId).subscribe(() => {});

          this.projectService.addApiTimelineToProject(this.project, timeline).subscribe((response) => {
            let projectTimeline = new ProjectTimeline();
            projectTimeline.initializeNewProjectTimeline();

            projectTimeline.id = response.data.id;
            projectTimeline.timeline = timeline;

            this.project.timelines.unshift(projectTimeline);
          });
        });
      }
    });
  }

  addExistingTimeline() {
    const dialogRef = this.dialog.open(AddExistingTimelineDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(timeline => {
      let projectTimeline = new ProjectTimeline();
      projectTimeline.initializeNewProjectTimeline();

      this.projectService.addApiTimelineToProject(this.project, timeline).subscribe(response => {
        projectTimeline.id = response.data.id;

        // get the full timeline now that we have it to show on the card. The previous timeline was a
        // truncated version for selection purposes only.
        this.timelineService.getApiTimeline(timeline.id).subscribe(timeline => {
          projectTimeline.timeline = timeline;

          this.project.timelines.unshift(projectTimeline);
        });
      });
    });
  }

  deleteEssay(essay: ProjectEssay) {
    this.projectService.removeApiEssayFromProject(essay).subscribe(() => {
      for (let i = 0; i < this.project.essays.length; i++) {
        if (this.project.essays[i].essay.id === essay.essay.id) {
          this.project.essays.splice(i, 1);
        }
      }
    });
  }

  deletePerson(projectPerson: ProjectPerson) {
    this.projectService.removeApiPersonFromProject(projectPerson).subscribe(() => {
      for (let i = 0; i < this.project.persons.length; i++) {
        if (this.project.persons[i].person.id === projectPerson.person.id) {
          this.project.persons.splice(i, 1);
        }
      }
    });
  }

  deleteTimeline(projectTimeline: ProjectTimeline) {
    this.projectService.removeApiTimelineFromProject(projectTimeline).subscribe(() => {
      for (let i = 0; i < this.project.timelines.length; i++) {
        if (this.project.timelines[i].timeline.id === projectTimeline.timeline.id) {
          this.project.timelines.splice(i, 1);
        }
      }
    });
  }

  deleteEvent(projectEvent: ProjectEvent) {
    this.projectService.removeApiEventFromProject(projectEvent).subscribe(() => {
      for (let i = 0; i < this.project.events.length; i++) {
        if (this.project.events[i].event.id === projectEvent.event.id) {
          this.project.events.splice(i, 1);
        }
      }
    });
  }

  deleteChart(projectChart: ProjectChart) {
    this.projectService.removeApiChartFromProject(projectChart).subscribe(() => {
      for (let i = 0; i < this.project.charts.length; i++) {
        if (this.project.charts[i].chart.id === projectChart.chart.id) {
          this.project.charts.splice(i, 1);
        }
      }
    });
  }

  deleteBrainstorm(projectBrainstorm: ProjectBrainstorm) {
    this.projectService.removeApiBrainstormFromProject(projectBrainstorm).subscribe(() => {
      for (let i = 0; i < this.project.brainstorms.length; i++) {
        if (this.project.brainstorms[i].brainstorm.id === projectBrainstorm.brainstorm.id) {
          this.project.brainstorms.splice(i, 1);
        }
      }
    });
  }
}

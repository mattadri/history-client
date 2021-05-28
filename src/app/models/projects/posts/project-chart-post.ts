import {Project} from '../project';
import {Chart} from '../../chart';

export class ProjectChartPost {
  data: any;

  mapToPost(project: Project, chart: Chart) {
    this.data = {
      type: 'project_chart',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
          }
        },

        chart_rel: {
          data: {
            type: 'chart',
            id: chart.id
          }
        }
      }
    };
  }
}

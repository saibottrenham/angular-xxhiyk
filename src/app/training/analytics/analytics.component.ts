import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { Analytics } from '../models/analytics.model';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: [ './analytics.component.scss' ]
})
export class AnalyticsComponent implements OnInit {
  analytics$: Observable<Analytics[]>;
  isLoading$: Observable<boolean>;
  title = 'Performance Analytics';

  public chart = {
    "datasets": [],
    "labels": [],
    options: {
      responsive: true,
      title: {
        display: true,
        position: 'top',
        text: 'Line Graph',
        fontSize: 18,
        fontColor: '#111',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#333',
          fontSize: 16,
        },
      },
    }
  };

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.analytics$ = this.store.select(fromTraining.getAnalytics);
    this.trainingService.getAnalytics();

    this.analytics$.subscribe(analytics => {
      this.updateChartData(analytics);
    });
  }

  private fillMissingData(data: number[], dates: string[], labels: string[]): number[] {
    const filledData = new Array(labels.length).fill(null);
    let lastIndex = 0;
  
    for (let i = 0; i < labels.length; i++) {
      const index = dates.findIndex((date, idx) => date === labels[i] && idx >= lastIndex);
  
      if (index !== -1) {
        filledData[i] = data[index];
        lastIndex = index;
      } else if (i > 0) {
        filledData[i] = filledData[i - 1];
      }
    }
  
    return filledData;
  }
  
  private updateChartData(analytics: Analytics[]): void {
    const datasets: ChartDataset[] = [];
    const labels: Set<string> = new Set();
    const datasetDates: Map<string, string[]> = new Map();
  
    analytics.forEach((current: Analytics) => {
      const dataset = datasets.find((dataset) => dataset.label === current.name);
  
      const startDate = moment(current.date?.toDate().toDateString() ?? '2023-01-01').startOf('week');
      const endDate = moment(new Date().toDateString()).startOf('week');
      const lastModified = moment(current.lastModified?.toDate().toDateString()).startOf('week');
      console.log(current.name, lastModified.format('DD-MM-YY'), startDate.format('DD-MM-YY'))
      const weightNumber = parseFloat(current.weight);
      
      if (dataset) {
        dataset.data.push(weightNumber);
        datasetDates.get(current.name).push(lastModified.format('DD-MM-YY'));
      } else {
        datasets.push({
          label: current.name,
          data: [weightNumber],
          backgroundColor: 'blue', // Set a default color or generate a color dynamically for each dataset
          borderColor: 'lightblue', // Set a default color or generate a color dynamically for each dataset
          fill: false,
          tension: 0,
          radius: 5,
        });
        datasetDates.set(current.name, [startDate.format('DD-MM-YY')]);
      }
  
      while (startDate.isSameOrBefore(endDate)) {
        const dateStr = startDate.format('DD-MM-YY'); // Update date format here
        labels.add(dateStr);
        startDate.add(1, 'week');
      }
    });
  
    console.log(datasets, labels, datasetDates)
  
    // Sort labels in ascending order
    const sortedLabels = Array.from(labels).sort((a, b) => moment(a, 'DD-MM-YY').valueOf() - moment(b, 'DD-MM-YY').valueOf());
  
    // Fill missing data points
    datasets.forEach((dataset) => {
      const dates = datasetDates.get(dataset.label);
      dataset.data = this.fillMissingData(dataset.data as any, dates, sortedLabels);
    });
  
    this.chart.labels = sortedLabels;
    this.chart.datasets = datasets;
  }
  
}
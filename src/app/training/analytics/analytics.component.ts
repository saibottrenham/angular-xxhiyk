import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, ChartEvent, ChartType } from 'chart.js';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { Analytics } from '../models/analytics.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: [ './analytics.component.scss' ]
})
export class AnalyticsComponent implements OnInit {
  analytics$: Observable<Analytics[]>;
  isLoading$: Observable<boolean>;
  title = 'Performance Analytics';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [ ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

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

  private updateChartData(analytics: Analytics[]): void {
    const data: number[] = [];
    const labels: string[] = [];

    analytics.forEach(analytic => {
      data.push(analytic.weight);
      labels.push(analytic.name);
    });
    console.log(labels, data)
    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = data;
  }
}
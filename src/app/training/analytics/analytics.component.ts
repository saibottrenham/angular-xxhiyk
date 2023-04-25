import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChartDataset, Chart } from 'chart.js';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { Analytics } from '../models/analytics.model';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: [ './analytics.component.scss' ]
})
export class AnalyticsComponent implements AfterViewInit, OnInit {
  @ViewChild('analyticsContainer') analyticsContainer: ElementRef;
  analytics$: Observable<Analytics[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private renderer: Renderer2,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.analytics$ = this.store.select(fromTraining.getAnalytics);
    this.trainingService.getAnalytics();
    
  }

  ngAfterViewInit(): void {
    this.analytics$.subscribe(analytics => {
      this.updateChartData(analytics);
    });
  }
  
  private generateChartColor(): string {
    return '#ff7f0e';
  }

  private createChart(canvas: HTMLCanvasElement, labels: Date[], datasets: ChartDataset[], title: string): void {
    const chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 20,
            },
            color: "#000000",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day', // or any other time unit
            },
            ticks: {
              source: 'auto',
              autoSkip: true,
              maxRotation: 0,
              major: {
                enabled: true,
              },
            },
          },
        },
      }
    });
  }

  private updateChartData(analytics: Analytics[]): void {
    const exc: Map<string, [{ weight: number, date: string }]> = new Map();
    this.renderer.setProperty(this.analyticsContainer, 'innerHTML', ''); 
  
    analytics.forEach((current: Analytics) => {
      const weight = parseFloat(current.weight);
      const lastModified = moment(current.lastModified?.toDate()).format('MM-DD HH:mm:ss');
  
      if (exc.has(current.name)) {
        const name = exc.get(current.name);
        name.push({ weight: weight, date: lastModified });
      } else {
        exc.set(current.name, [{ weight: weight, date: lastModified }]);
      }
    });
  
    exc.forEach((value, key) => {
      const canvas = this.renderer.createElement('canvas');
      this.renderer.setAttribute(canvas, 'id', `chart-${key}`);
      this.renderer.addClass(canvas, 'chart-canvas');
    
      const chartWrapper = this.renderer.createElement('div');
      this.renderer.addClass(chartWrapper, 'chart-wrapper');
      this.renderer.appendChild(chartWrapper, canvas);
    
      this.renderer.appendChild(this.analyticsContainer.nativeElement, chartWrapper);
  
      const sortedData = value.sort((a, b) => moment(a.date, 'MM-DD HH:mm:ss').valueOf() - moment(b.date, 'MM-DD HH:mm:ss').valueOf());
  
      const labels = sortedData.map(entry => moment(entry.date, 'MM-DD HH:mm:ss').toDate());
      const data = sortedData.map(entry => entry.weight);
      const chartColor = this.generateChartColor();
  
      const datasets: ChartDataset[] = [{
        label: key,
        data: data,
        backgroundColor: chartColor,
        borderColor: chartColor,
        pointBackgroundColor: chartColor,
        pointBorderColor: chartColor,
        fill: false,
        tension: 0,
        radius: 5,
      }];
  
      this.createChart(canvas, labels, datasets, key);
    });
  }
  
}
import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, Color, LabelItem } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public chartData: ChartDataset[] = [];
  public chartLabels: LabelItem[] = [];
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public chartColors = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public chartLegend = true;
  public chartType = 'line';

  constructor() { }

  ngOnInit(): void {
    console.log('AnalyticsComponent')
  }
  

}

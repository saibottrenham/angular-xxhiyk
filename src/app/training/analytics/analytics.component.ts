import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import { UiService } from '../../shared/ui.service';
import { WeekPlan } from '../exercise.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public today: string;
  public weekPlan$: Observable<WeekPlan>;
  public pageIndex = 0;
  public currentDay = null;
  public totalTrainEx = 0;
  private indexKey = 'pageIndex';
  public week = null;

  constructor() { }

  ngOnInit(): void {
    console.log('AnalyticsComponent')
  }
  

}

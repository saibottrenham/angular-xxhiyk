import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Observable } from '../../../../node_modules/rxjs';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import { UiService } from '../../shared/ui.service';
import { WeekPlan } from '../models/exercise.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

  public today: string;
  public weekPlan$: Observable<WeekPlan>;
  public pageIndex = 0;
  public currentDay = null;
  public totalTrainEx = 0;
  private indexKey = 'pageIndex';
  public week = null;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
    private uiService: UiService) { }

  ngOnInit(): void {
    this.weekPlan$ = this.store.select(fromTraining.getWeekPlan);
    this.today = this.uiService.getTodayWeekDay();
    this.fetchWeekPlan();
    this.pageIndex = JSON.parse(localStorage.getItem(this.indexKey)) > 0 ? JSON.parse(localStorage.getItem(this.indexKey)) : 0;
    this.weekPlan$.subscribe((e) => {
      if (e[0] != null) {
        this.week = e[0];
        this.currentDay = this.week.week.filter((d) => d.day === this.today)[0];
        this.totalTrainEx = this.currentDay.data.length;
        this.pageIndex = this.pageIndex < this.totalTrainEx ? this.pageIndex : 0;
      }
    });
  }

  fetchWeekPlan() {
    this.trainingService.fetchWeekPlan();
  }

  getCurrentPageIndex(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    localStorage.setItem(this.indexKey, JSON.stringify(this.pageIndex));
  }

}

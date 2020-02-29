import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Observable } from '../../../../node_modules/rxjs';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import { UiService } from '../../shared/ui.service';
import { WeekPlan } from '../exercise.model';
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

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
    private uiService: UiService) { }

  ngOnInit(): void {
    this.weekPlan$ = this.store.select(fromTraining.getWeekPlan);
    this.today = this.uiService.getTodayWeekDay();
    this.fetchWeekPlan();
  }

  fetchWeekPlan() {
    this.trainingService.fetchWeekPlan();
  }

  getCurrentPageIndex(event: PageEvent) {
    this.pageIndex = event.pageIndex;
  }


}

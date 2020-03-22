import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';
import { Observable } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise, WeekPlan } from '../exercise.model';
import { EditExerciseComponent } from '../list-exercises/edit-exercise.component';
import { MatDialog } from '@angular/material';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { ListExerciseComponent } from '../list-exercises/list-exercise.component';

@Component({
  selector: 'app-week-plan',
  templateUrl: './week-plan.component.html',
  styleUrls: ['./week-plan.component.scss']
})
export class WeekPlanComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  weekPlan$: Observable<WeekPlan>;
  isLoading$: Observable<boolean>;
  removable = true;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
    private dialog: MatDialog) {
  }

  public add(event: any, arr: Exercise[], weekPlan: any) {
    if (event ) {
      arr.push(event.value);
      const matSelect: any = event.source;
      matSelect.writeValue(null);
      this.trainingService.submitTrainingPlan(weekPlan);
    }
  }

  public remove(ex: Exercise, arr: Exercise[], weekPlan: any): void {
    const index: number = arr.indexOf(ex);
    if (index >= 0) {
      arr.splice(index, 1);
      this.trainingService.submitTrainingPlan(weekPlan);
    }
  }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.weekPlan$ = this.store.select(fromTraining.getWeekPlan);
    this.fetchExercises();
    this.fetchWeekPlan();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  fetchWeekPlan() {
    this.trainingService.fetchWeekPlan();
  }

  openEdit(e) {
    console.log(e);
    const dialogRef = this.dialog.open(EditExerciseComponent, {
      data: {
        id: e.id,
        name: e.name,
        weight: e.weight,
        link: e.link,
        sets: e.sets,
        reps: e.reps
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddExerciseComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe();
  }

  list() {
    const dialogRef = this.dialog.open(ListExerciseComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe();
  }

}

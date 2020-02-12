import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';
import { Observable } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;
  removable = true;
  week = [
    {day: 'monday', data: []},
    {day: 'tuesday', data: []},
    {day: 'wednesday', data: []},
    {day: 'thursday', data: []},
    {day: 'friday', data: []},
    {day: 'saturday', data: []},
    {day: 'sunday', data: []}
    ];

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) {
  }

  public add(event: any, arr: Exercise[]) {
    if (event ) {
      arr.push(event.value);
      const matSelect: any = event.source;
      matSelect.writeValue(null);
    }
  }

  public remove(ex: Exercise, arr: Exercise[]): void {
    const index: number = arr.indexOf(ex);
    if (index >= 0) {
      arr.splice(index, 1);
    }
  }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}

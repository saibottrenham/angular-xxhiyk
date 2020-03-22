import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import { Exercise, WeekPlan } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { EditExerciseComponent } from './edit-exercise.component';

@Component({
  selector: 'app-list-exercise',
  templateUrl: './list-exercise.component.html',
  styleUrls: ['./list-exercise.component.scss']
})
export class ListExerciseComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private store: Store<fromTraining.State>,
    private trainingService: TrainingService,
    @Inject(MAT_DIALOG_DATA) public week: any) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
  }

  openEdit(e) {
    const dialogRef = this.dialog.open(EditExerciseComponent, {
      data: {
        id: e.id,
        name: e.name,
        weight: e.weight,
        link: e.link,
        sets: e.sets,
        reps: e.reps,
        week: this.week.week[0]
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe();
  }

  deleteEx(e: string) {
    this.trainingService.deleteExercise(e);
  }

}

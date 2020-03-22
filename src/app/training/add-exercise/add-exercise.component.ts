import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from '../../../../node_modules/rxjs';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import { TrainingService } from '../training.service';
import * as fromRoot from '../../app.reducer';
import { WeekPlan } from '../exercise.model';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss']
})
export class AddExerciseComponent implements OnInit {
  @Input() isDialog = false;
  @Input() ex = null;
  @Input() week: WeekPlan;
  addEx: FormGroup;
  isLoadingSubmit$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private store: Store<fromTraining.State>,
    private trainingService: TrainingService) { }

  ngOnInit() {
    this.addEx = new FormGroup({
      name: new FormControl('', {validators: [Validators.required]}),
      link: new FormControl('', { validators: [Validators.pattern('https://www.youtube.com/.*')] }),
      weight: new FormControl('', { validators: [Validators.pattern('^[0-9]*$')] }),
      sets: new FormControl('', { validators: [Validators.pattern('^[0-9]*$')] }),
      reps: new FormControl('', { validators: [Validators.pattern('^[0-9]*$')] })
    });

    if (this.isDialog) {
      this.addEx.patchValue({
        name: this.ex.name,
        link: this.ex.link,
        weight: this.ex.weight,
        sets: this.ex.sets,
        reps: this.ex.reps
      });
    }
  }

  onSubmit() {
    this.isLoadingSubmit$ = this.store.select(fromRoot.getIsLoading);
    this.trainingService.addExercise(this.addEx.value);
    this.addEx.reset();
  }

  onUpdate() {
    const ex = this.addEx.value;
    ex.id = this.ex.id;
    this.trainingService.updateExercise(ex, this.week);
  }
}

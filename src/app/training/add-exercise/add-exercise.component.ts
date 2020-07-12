import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
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
export class AddExerciseComponent implements OnInit, OnChanges {
  @Input() isDialog = false;
  @Input() ex = null;
  @Input() week: WeekPlan;
  @Input() trainEx = false;
  @Input() addNewEx = true;
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
    this.updateInputFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ex.currentValue && this.addEx != null) {
      this.updateInputFields();
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

  updateInputFields() {
    if (this.isDialog || this.trainEx) {
      this.addEx.patchValue({
        name: this.ex.name,
        link: this.ex.link,
        weight: this.ex.weight,
        sets: this.ex.sets,
        reps: this.ex.reps
      });
    }
  }
}

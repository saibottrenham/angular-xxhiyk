import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from '../../../../node_modules/rxjs';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import { TrainingService } from '../training.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  @Input() isDialog = false;
  @Input() ex = null;
  addEx: FormGroup;
  isLoadingSubmit$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private store: Store<fromTraining.State>,
    private trainingService: TrainingService) { }

  ngOnInit() {
    this.addEx = new FormGroup({
      exName: new FormControl('', {validators: [Validators.required]}),
      exLink: new FormControl('', { validators: [Validators.pattern('https://www.youtube.com/.*')] }),
      exWeight: new FormControl('', { validators: [Validators.pattern('^[0-9]*$')] })
    });

    if (this.isDialog) {
      this.addEx.patchValue({
        exName: this.ex.name,
        exLink: this.ex.link,
        exWeight: this.ex.weight
      });
    }
  }

  onSubmit() {
    this.isLoadingSubmit$ = this.store.select(fromRoot.getIsLoading);
    this.trainingService.addExercise(this.addEx.value);
    this.addEx.reset();
  }

  onUpdate() {
    this.trainingService.updateExercise(this.addEx.value, this.ex.id);
  }
}

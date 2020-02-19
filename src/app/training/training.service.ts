import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/subscription';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UiService } from '../shared/ui.service';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  private userID: string;
  private fbSubs: Subscription[] = [];
  private week_plan = [{
    id: null,
    week: [
      {day: 'monday', data: []},
      {day: 'tuesday', data: []},
      {day: 'wednesday', data: []},
      {day: 'thursday', data: []},
      {day: 'friday', data: []},
      {day: 'saturday', data: []},
      {day: 'sunday', data: []}
    ]
  }];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private afAuth: AngularFireAuth,
    private store: Store<fromTraining.State>) {
    this.afAuth.authState.subscribe(user => {
      if (user) { this.userID = user.uid; }});
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['exName'],
            link: doc.payload.doc.data()['exLink'],
            weight: doc.payload.doc.data()['exWeight'],
            sets: doc.payload.doc.data()['exSets'],
            reps: doc.payload.doc.data()['exReps']
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
      }));
  }

  fetchWeekPlan() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('week_plan', ref => ref.where('userID', '==', this.userID))
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            week: JSON.parse(doc.payload.doc.data()['week']),
          };
        });
      })
      .subscribe((week_plan: any) => {
        if (week_plan.length === 0) {
          this.store.dispatch(new Training.SetWeekPlan(this.week_plan));
        } else {
          this.store.dispatch(new Training.SetWeekPlan(week_plan));
        }
        this.store.dispatch(new UI.StopLoading());
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Something Went wrong, can\'t fetch table', null, 3000);
      }));
  }

  addToDB(data: any, path: string) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path)
      .add(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Something Went wrong, can\'t save table', null, 3000);
    });
  }

  updateToDB(data: any, path: string, id: string) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path, ref => ref.where('userID', '==', this.userID))
      .doc(id).update(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Something Went wrong, can\'t update table', null, 3000);
    });
  }

  addExercise(e: Exercise) {
    e.userID = this.userID;
    this.addToDB(e, 'availableExercises');
  }

  updateExercise(e: Exercise, id: string) {
    e.userID = this.userID;
    this.updateToDB(e, 'availableExercises', id);
  }

  deleteExercise(id: string) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .doc(id).delete().then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Something Went wrong, can\'t delete exercise', null, 3000);
    });
  }

  submitTrainingPlan(week: any) {
    const data = { week: JSON.stringify(week.week), 'userID': this.userID };
    if (!week.id) {
      this.addToDB( data, 'week_plan');
    } else {
      this.updateToDB( data, 'week_plan', week.id);
    }
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

}


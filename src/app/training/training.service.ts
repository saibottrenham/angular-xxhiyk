import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiService } from '../shared/ui.service';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import { Exercise, WeekPlan } from './models/exercise.model';
import { Analytics } from './models/analytics.model';
import { Timestamp } from '@firebase/firestore';

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
    private store: Store<fromTraining.State>
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) { this.userID = user.uid; }
    });
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const data = doc.payload.doc.data() as Exercise;
            return {
              id: doc.payload.doc.id,
              name: data.name,
              link: data.link,
              weight: data.weight,
              sets: data.sets,
              reps: data.reps
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
      })
    );
  }

  getAnalytics() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('analytics', ref => ref.where('userID', '==', this.userID))
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const data = doc.payload.doc.data() as Analytics;
            return {
              id: doc.payload.doc.id,
              name: data.name,
              link: data.link,
              weight: data.weight,
              sets: data.sets,
              reps: data.reps,
              date: data.date,
              lastModified: data.lastModified
            };
          });
        })
      )
      .subscribe((analytics: any) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAnalytics(analytics));
      }, error => {
        console.log(error, 'error');
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Analytics failed, please try again later', null, 3000);
      })
    );
  }
  fetchWeekPlan() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('week_plan', ref => ref.where('userID', '==', this.userID))
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const data = doc.payload.doc.data() as WeekPlan;
            return {
              id: doc.payload.doc.id,
              week: JSON.parse(data.week),
            };
          });
        })
      )
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
      })
    );
  }

  addToDB(data: any, path: string, send_notification: boolean = false) {
    this.store.dispatch(new UI.StartLoading());
    // adding a last modified timestamp
    this.db.collection(path)
      .add(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
      if (send_notification) {this.uiService.showSnackbar('Data Stored successfully', null, 3000)};
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Something Went wrong, can\'t save data', null, 3000);
    });
  }

  updateToDB(data: any, path: string, id: string = null, send_notification: boolean = false) {
    // adding a last modified timestamp
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path, ref => ref.where('userID', '==', this.userID))
      .doc(id !== null ? id : data.id).update(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
      if (send_notification) {this.uiService.showSnackbar('Data updated successfully', null, 3000)};
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Something Went wrong, can\'t update table', null, 3000);
    });
  }

  addExercise(e: Exercise) {
    e.userID = this.userID;
    e.date = Timestamp.fromDate(new Date());
    e.lastModified = Timestamp.fromDate(new Date());
    return new Promise((resolve, reject) => {
      // Add the exercise with the custom record ID to Firebase
      this.db.collection('availableExercises').add(e)
        .then(() => {
          this.uiService.showSnackbar('Data Stored successfully', null, 3000);
          resolve(e);
        })
        .catch(error => {
          this.uiService.showSnackbar('Something Went wrong, can\'t save data', null, 3000);
          reject(error);
        });
    });
  }

  updateExercise(e: Exercise, week: any) {
    for (let i = 0; i < week?.week.length ? week.week.length : 0; i++) {
      for (let ii = 0; ii < week.week[i].data.length; ii++) {
        if (e.id === week.week[i].data[ii].id) {
          week.week[i].data[ii] = e;
        }
      }
    }
    e.userID = this.userID;
    e.lastModified = Timestamp.fromDate(new Date());
    this.updateToDB(e, 'availableExercises', null, true);
    this.submitTrainingPlan(week);
    this.submitAnalytics(e);
  }

  deleteExercise(id: string) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .doc(id).delete().then(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Excercise Deleted', null, 3000);
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Something Went wrong, can\'t delete exercise', null, 3000);
    });
  }

  submitTrainingPlan(week: any) {
    const data = { week: JSON.stringify(week.week), 'userID': this.userID};
    if (!week.id) {
      this.addToDB(data, 'week_plan');
    } else {
      this.updateToDB(data, 'week_plan', week.id);
    }
  }

  submitAnalytics(e: Exercise) {
    this.addToDB(e, 'analytics');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

}


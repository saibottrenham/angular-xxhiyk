import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UiService {
  private days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(message, action, duration) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getTodayWeekDay(index: number = 0) {
    const todayIndex: number = new Date().getDay();
    return index > 0 ? this.days[index] : this.days[todayIndex - 1];
  }
}

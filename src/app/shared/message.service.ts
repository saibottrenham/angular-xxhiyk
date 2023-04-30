import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL = "https://8g7wu5dix7.execute-api.us-east-1.amazonaws.com/Prod/";
  private headers = new HttpHeaders({
    'x-api-key':'lRvSwf1Mxw3uDYxy2ORql7FHYgMjl6hI85mIOA1g',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  submitToAPI(name: string, phone: string, email: string, msg: string): Observable<any> {
    const data = { name, phone, email, msg };

    return this.http.post<any>(this.API_URL, JSON.stringify(data), { headers: this.headers })
      .pipe(
        map(res => {
            console.log(res);
          return { success: true, message: 'Message sent successfully', response: res };
        }),
        catchError(error => {
            console.log(error)
          return throwError({ success: false, message: 'Something went wrong', error });
        })
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //need this import to be able to make http calls, client allows us to make http calls to the backend
import { Observable } from 'rxjs'; //importing observable to be able to use it in the service, this is used to handle asynchronous data streams
import { Advice } from './advice'; //importing the advice model, this is used to define the structure of the data we are working with


@Injectable({
  providedIn: 'root'
})
export class AdviceService {

  private apiUrl = 'https://localhost:7054/api/Advice/ExportAdvice';
  private fetchAdvice = '/api/Advice/ExportAdvice';

  //constructor, the injection of httpclient is possible because of app.config.ts, 
  // where we provided the httpclient in the providers array. This allows us to use httpclient in this service.
  constructor(private httpClient : HttpClient) {

   }
   
   getAdvice(): Observable<Advice[]>{
      return this.httpClient.get<Advice[]>(this.apiUrl);
   }

}

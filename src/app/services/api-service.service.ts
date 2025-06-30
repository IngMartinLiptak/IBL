import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public url:string = "https://ogcie.iblsoft.com/ria/opmetquery";

  constructor(private http: HttpClient) { }

  public PostData(data: any): Observable<any> {
      return this.http.post<any>(this.url, data);
  }
}

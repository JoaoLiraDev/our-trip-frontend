import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _http = inject(HttpClient);

  login(data: any): Observable<any> {
    return this._http.post<any>(`${ ENVIRONMENT.BaseUrl }/auth/login`, data);
  }
}

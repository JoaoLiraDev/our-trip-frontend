import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastrarService {
  private readonly _http = inject(HttpClient);

  newUser(data: any): Observable<any> {
    return this._http.post<any>(`${ ENVIRONMENT.BaseUrl }/users`, data);
  }
}

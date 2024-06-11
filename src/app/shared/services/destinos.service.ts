import { Observable, of } from "rxjs";
import { Injectable, inject } from "@angular/core";
import { DESTINOS_FIXTURE } from "@pages/destinos/fixture/detinos.fixture";
import { HttpClient } from "@angular/common/http";
import { ENVIRONMENT } from "@environments/environment";
import { BodyUpload } from "@shared/interfaces/body-upload.interface";
import { Destino } from "@pages/destinos/interfaces/destino.interface";

@Injectable({
  providedIn: 'root'
})
export class DestinosService {
  private readonly _http = inject(HttpClient);

  getAllDestinos(): Observable<Destino[]>{
    return this._http.get<Destino[]>(`${ENVIRONMENT.BaseUrl}/product`)
  }

  criarDestino(body: {
    imageUrl: string;
    name: string;
    stars: string;
    price: string;
    description: string;
  }) {
    return this._http.post(`${ENVIRONMENT.BaseUrl}/product`, body)
  }

  uploadThumb(body: BodyUpload): Observable<{fileUrl: string}>{
    return this._http.post<{fileUrl: string}>(`${ENVIRONMENT.BaseUrl}/upload`, body)
  }
}

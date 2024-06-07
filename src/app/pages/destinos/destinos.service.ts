import { Observable, of } from "rxjs";
import { DESTINOS_FIXTURE } from "./fixture/detinos.fixture";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DestinosService {
  getAllDestinos(){
    return of(DESTINOS_FIXTURE)
  }
}

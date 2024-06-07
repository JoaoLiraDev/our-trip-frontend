import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, Observable, ReplaySubject, catchError, finalize, switchMap, tap } from 'rxjs';
import { DEFAULT_FEEDBACK_MESSAGE } from '@shared/constant/default-feedback-message'
import { DestinosService } from './destinos.service'
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ExpandableCardComponent } from './components/expandable-card/expandable-card.component';

@Component({
  standalone: true,
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrl: './destinos.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ExpandableCardComponent
  ]
})
export class DestinosComponent implements OnDestroy {
  private readonly _destroy = new ReplaySubject<void>(1);
  private _service = inject(DestinosService);

  data$ = this._service.getAllDestinos();

  constructor(private _snackBar: MatSnackBar) {}

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _handleError(message = DEFAULT_FEEDBACK_MESSAGE): Observable<never> {
    this.openSnackBar(message);
    return EMPTY;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Fechar');
  }

}

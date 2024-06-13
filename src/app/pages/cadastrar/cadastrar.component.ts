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
import { CadastrarService } from './cadastrar.service'
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CadastrarComponent implements OnDestroy {
  private readonly _destroy = new ReplaySubject<void>(1);
  private readonly _service = inject(CadastrarService);
  private readonly _router = inject(Router);
  loading = false;
  hidden = true;

  constructor(private _snackBar: MatSnackBar) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  handleSubmit(): void {
    this.loading = true;
    this.form.markAllAsTouched();
    if (this.form.valid && this._checkPassword()) {
      const body = this.form.value;
      this._service.newUser(body)
        .pipe(
          switchMap(() => this._router.navigateByUrl(`/login`)),
          catchError(({ error }) => this._handleError(error?.detail)),
          finalize(() => this.loading = false)
        ).subscribe();
    }
  }

  private _handleError(message = DEFAULT_FEEDBACK_MESSAGE): Observable<never> {
    this.openSnackBar(message);
    return EMPTY;
  }

  private _checkPassword(){
    if (this.form.controls['password'].value === this.form.controls['confirmPassword'].value) return true
    this.openSnackBar('As senhas não coincidem.')
    return false
  }
  redirectToSignIn(){
    this._router.navigateByUrl('/login');
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Fechar');
  }

}

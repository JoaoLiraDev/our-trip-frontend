import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, Observable, ReplaySubject, catchError, finalize, of, switchMap, takeUntil, tap } from 'rxjs';
import { DEFAULT_FEEDBACK_MESSAGE } from '@shared/constant/default-feedback-message'
import { DestinosService } from '@shared/services/destinos.service'
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DocumentFile } from '@shared/interfaces/document-file.interface';
import { acceptDocumentsFiles } from '@shared/constant/extensions-types.const';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { validateTypeFile } from '@shared/helper/validate-type-file.helper';
import { FileService } from '@shared/services/file.service';
import { v4 as uuidV4 } from 'uuid';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  standalone: true,
  selector: 'app-novo-destino',
  templateUrl: './novo-destino.component.html',
  styleUrl: './novo-destino.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CurrencyMaskModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class NovoDestinoComponent implements OnDestroy {
  private readonly _destroy = new ReplaySubject<void>(1);
  private _service = inject(DestinosService);
  private _fileService = inject(FileService);
  private _cdf = inject(ChangeDetectorRef);
  private _router = inject(Router);

  filesUploaded: Map<string, File> = new Map<string, File>();
  filesError: Map<string, DocumentFile> = new Map<string, DocumentFile>();
  submitted!: boolean;
  term!: boolean;
  Thumb: string = 'thumb';
  loadingSubmit!: boolean;
  fileUploadLoading!: boolean;
  acceptDocumentsFiles = acceptDocumentsFiles;
  progressStatus: ProgressBarMode = 'indeterminate';
  fileUrl?: string;
  data$ = this._service.getAllDestinos();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    stars: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })
  constructor(private _snackBar: MatSnackBar) {}

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  handleSubmit(){
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const body = this.form.value;

      this._service.criarDestino({
        name: body.name!,
        stars: body.stars?.toString()!,
        price: body.price!,
        description: body.description!,
        imageUrl: this.fileUrl!
      })
        .pipe(
          tap(() => this._router.navigateByUrl(`/destinos`)),
          catchError(({ error }) => this._handleError(error))
        ).subscribe();
    }
  }

  private _handleError(message = DEFAULT_FEEDBACK_MESSAGE): Observable<never> {
    this.openSnackBar(message);
    return EMPTY;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Fechar');
  }

  onFileChange(input: HTMLInputElement, documentType: string): void {
    const files = input.files;
    const file = files && files[0];
    const extension = file?.type.split('/').pop()
    if (file && this.validateErrors(file, documentType)) {
      this.fileUploadLoading = true;
      this.setFileUpload(documentType, file);
      this.uploadFile(file, documentType, extension || '')
    }

    input.value = '';
  }

  validateErrors(file: File, documentType: string): boolean {
    let fileDocument: DocumentFile = { file };
    const validateSizeUpload = this.validateSizeUpload(file.size);
    const validateType = validateTypeFile(file.name);

    fileDocument = { ...fileDocument, errorSize: validateSizeUpload };
    fileDocument = { ...fileDocument, error: validateType };

    this.filesError.set(documentType, fileDocument);

    return !(validateSizeUpload || validateType);
  }

  validateSizeUpload(size: number = 0): boolean {
    const tenMBInBytes = 10485760;

    if (size > tenMBInBytes) {
      return true;
    }

    return false;
  }

  setFileUpload(documentType: string, file: File): void {
    this.filesUploaded.set(documentType, file);
    this.filesError.delete(documentType);
    this.fileUploadLoading = true;
  }

  async uploadFile(file: any, documentType: string, extension: string) {
    const base64 = await this.transformInBase64(file);
    this._service
    .uploadThumb({file: base64, filename: `${uuidV4()}.${extension}`})
      .pipe(
        takeUntil(this._destroy),
        switchMap((data) => this.fileUrl = data.fileUrl),
        tap(() => this.uploadFinish(documentType)),
        catchError(() => this.uploadError(documentType)),
      )
      .subscribe();
  }

  uploadError(documentType: string): Observable<null> {
    this.filesUploaded.delete(documentType);
    this.fileUploadLoading = false;
    this.openSnackBar('Ops, aconteceu algum problema, tente novamente mais tarde!');
    return of(null);
  }

  uploadFinish(documentType: string | null): void {
    this.fileUploadLoading = false;
    if (documentType) {
      this.filesError.delete(documentType);
      this.submitted = false;
      this.progressStatus = 'determinate';
      this._cdf.detectChanges();
    }
  }

  removeFile(documentType: string): void {
    this.filesUploaded.delete(documentType);
  }

  showUploadContent(): boolean {
    return (
      !this.filesUploaded.has(this.Thumb)
    );
  }
  async transformInBase64(file: File): Promise<string> {
    const base64 = (await this._fileService.fileToBase64(file)) as string;
    return base64.split('base64,')[1];
  }
}

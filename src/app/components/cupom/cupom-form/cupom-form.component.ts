import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CupomService } from '../../../services/cupom.service';
import { MatDialog } from '@angular/material/dialog';
import { Cupom } from '../../../models/cupom.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cupom-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    NgIf,
    MatInputModule,
    RouterModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  templateUrl: './cupom-form.component.html',
  styleUrl: './cupom-form.component.css',
})
export class CupomFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cupomService: CupomService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nomeCupom: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
        ]),
      ],
      desconto: ['', Validators.compose([])],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const cupom: Cupom = this.activatedRoute.snapshot.data['cupom'];

    this.formGroup = this.formBuilder.group({
      id: [cupom && cupom.id ? cupom.id : null],
      nomeCupom: [
        cupom && cupom.nomeCupom ? cupom.nomeCupom : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
        ]),
      ],
      desconto: [
        cupom && cupom.desconto ? cupom.desconto : '',
        Validators.required,
      ],
    });
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      }
    } else if (errorResponse.status < 400) {
      alert(
        errorResponse.error?.message || 'Erro genérico do envio do formulário.'
      );
    } else if (errorResponse.status >= 500) {
      alert('Erro do servidor.');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const cupom = this.formGroup.value;
      const operacao =
        cupom.id == null
          ? this.cupomService.insert(cupom)
          : this.cupomService.update(cupom);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/cupons');
          this.snackBar.open('O Gênero foi salvo com Sucesso!!', 'Fechar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Gênero', 'Fechar', {
            duration: 3000,
          });
        },
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const cupom = this.formGroup.value;
      if (cupom.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message:
              'Deseja realmente excluir este Gênero? Não será possível reverter.',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cupomService.delete(cupom).subscribe({
              next: () => {
                this.router.navigateByUrl('/admin/cupons');
                this.snackBar.open(
                  'O Gênero foi excluído com Sucesso!!',
                  'Fechar',
                  { duration: 3000 }
                );
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open(
                  'Erro ao tentar excluir o Gênero',
                  'Fechar',
                  { duration: 3000 }
                );
              },
            });
          }
        });
      }
    }
  }

  getErrorMessage(
    controlName: string,
    errors: ValidationErrors | null | undefined
  ): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (
        errors.hasOwnProperty(errorName) &&
        this.errorMessage[controlName][errorName]
      ) {
        return this.errorMessage[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nomeCupom: {
      required: 'O nome deve ser informado',
      minlength: 'O nome deve ter no mínimo 2 caracteres',
      maxlength: 'O nome de ter no maxímo 60 caracteres',
      apiError: '',
    },
    desconto: {
      required: 'O desconto deve ser informado',
    },
  };

  editora() {
    this.router.navigateByUrl('/admin/editoras/new');
  }
  autor() {
    this.router.navigateByUrl('/admin/autores/new');
  }
  caixaLivros() {
    this.router.navigateByUrl('/admin/caixaLivros/new');
  }
  livro() {
    this.router.navigateByUrl('/admin/livros/new');
  }
  genero() {
    this.router.navigateByUrl('/admin/generos/new');
  }
  cupom() {
    this.router.navigateByUrl('/admin/cupons/new');
  }
  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores/new');
  }
  voltar() {
    this.router.navigateByUrl('/admin/cupons');
  }
}

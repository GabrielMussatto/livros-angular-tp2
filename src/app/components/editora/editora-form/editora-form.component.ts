import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EditoraService } from '../../../services/editora.service';
import { Editora } from '../../../models/editora.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './editora-form.component.html',
  styleUrl: './editora-form.component.css'
})
export class EditoraFormComponent implements OnInit{
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      endereco: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      })
    });
    
  }

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void {
    const editora: Editora = this.activatedRoute.snapshot.data['editora'];

    this.formGroup = this.formBuilder.group({
      id: [(editora && editora.id) ? editora.id : null],
      nome: [(editora && editora.nome) ? editora.nome : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      email: [(editora && editora.email) ? editora.email : '', Validators.compose([Validators.required, Validators.email])],
      endereco: [(editora && editora.endereco) ? editora.endereco : '', Validators.required],
      estado: [(editora && editora.estado) ? editora.estado : '', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(editora && editora.telefone && editora.telefone.codigoArea) ? editora.telefone.codigoArea : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(editora && editora.telefone && editora.telefone.numero) ? editora.telefone.numero : '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      })
    });
  }

  tratarErros(errorResponse: HttpErrorResponse){
    if(errorResponse.status === 400){
      if(errorResponse.error?.errors){
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if(formControl){
            formControl.setErrors({apiError: validationError.message})
          }
        });
      }
    } else if (errorResponse.status < 400){
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro do servidor.');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      const operacao = editora.id == null
      ? this.editoraService.insert(editora)
      : this.editoraService.update(editora);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/editoras');
          this.snackBar.open('A Editora foi salva com Sucesso!!', 'Fechar', {duration: 3000});
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar a Editora', 'Fechar', {duration: 3000});
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir esta editora? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.editoraService.delete(editora).subscribe({
              next: () => {
                this.router.navigateByUrl('/admin/editoras');
                this.snackBar.open('A Editora foi excluída com Sucesso!!', 'Fechar', {duration: 3000});
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir a Editora', 'Fechar', {duration: 3000});
              }
            });
          }
        });
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }

    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessage[controlName] && this.errorMessage[controlName][errorName]) {
        return this.errorMessage[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      minlength: 'O nome deve ter no mínimo 2 caracteres',
      maxlength: 'O nome deve ter no máximo 60 caracteres',
      apiError: ''
    },
    email: {
      required: 'O e-mail deve ser informado',
      email: 'O e-mail deve ser válido',
      apiError: ''
    },
    endereco: {
      required: 'O endereço deve ser informado',
      apiError: ''
    },
    estado: {
      required: 'O estado deve ser informado',
      apiError: ''
    },
    'telefone.codigoArea': {
      required: 'O código de área deve ser informado',
      minlength: 'O código de área deve ter no mínimo 2 caracteres',
      maxlength: 'O código de área deve ter no máximo 3 caracteres',
      apiError: ''
    },
    'telefone.numero': {
      required: 'O número de telefone deve ser informado',
      minlength: 'O número de telefone deve ter no mínimo 9 caracteres',
      maxlength: 'O número de telefone deve ter no máximo 9 caracteres',
      apiError: ''
    }
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
  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores/new');
  }
  voltar() {
    this.router.navigateByUrl('/admin/editoras');
  }
}

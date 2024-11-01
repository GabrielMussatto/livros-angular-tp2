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
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})
export class FornecedorFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      cnpj: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
      inscricaoEstadual: ['', Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      endereco: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      cep: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      quantLivrosFornecido: ['', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])]
      })
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : '', Validators.compose([Validators.required, Validators.minLength(18), Validators.maxLength(18)])],
      inscricaoEstadual: [(fornecedor && fornecedor.inscricaoEstadual) ? fornecedor.inscricaoEstadual : '', Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12)])],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : '', Validators.compose([Validators.required, Validators.email])],
      endereco: [(fornecedor && fornecedor.endereco) ? fornecedor.endereco : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      cep: [(fornecedor && fornecedor.cep) ? fornecedor.cep : '', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      estado: [(fornecedor && fornecedor.estado) ? fornecedor.estado : '', Validators.required],
      cidade: [(fornecedor && fornecedor.cidade) ? fornecedor.cidade : '', Validators.required],
      quantLivrosFornecido: [(fornecedor && fornecedor.quantLivrosFornecido) ? fornecedor.quantLivrosFornecido : 0, Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(fornecedor && fornecedor.telefone && fornecedor.telefone.codigoArea) ? fornecedor.telefone.codigoArea : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(fornecedor && fornecedor.telefone && fornecedor.telefone.numero) ? fornecedor.telefone.numero : '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
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
      const fornecedor = this.formGroup.value;
      const operacao = fornecedor.id == null
      ? this.fornecedorService.insert(fornecedor)
      : this.fornecedorService.update(fornecedor);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/fornecedores');
          this.snackBar.open('O Fornecedor foi salvo com Sucesso!!', 'Fechar', {duration: 3000});
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Fornecedor', 'Fechar', {duration: 3000});
        } 
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este fornecedor? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.fornecedorService.delete(fornecedor).subscribe({
              next: () => {
                this.router.navigateByUrl('/fornecedores');
                this.snackBar.open('O Fornecedor foi excluído com Sucesso!!', 'Fechar', {duration: 3000});
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o Fornecedor', 'Fechar', {duration: 3000});
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
    cnpj: {
      required: 'O CNPJ deve ser informado',
      minlength: 'O CNPJ deve ter 18 caracteres',
      maxlength: 'O CNPJ deve ter 18 caracteres',
      apiError: ''
    },
    inscricaoEstadual: {
      required: 'A inscrição estadual deve ser informada',
      minlength: 'A inscrição estadual deve ter no mínimo 12 caracteres',
      maxlength: 'A inscrição estadual deve ter no máximo 12 caracteres',
      apiError: ''
    },
    email: {
      required: 'O e-mail deve ser informado',
      email: 'O e-mail deve ser válido',
      apiError: ''
    },
    endereco: {
      required: 'O endereço deve ser informado',
      minlength: 'O endereço deve ter no mínimo 2 caracteres',
      maxlength: 'O endereço deve ter no máximo 60 caracteres',
      apiError: ''
    },
    cep: {
      required: 'O CEP deve ser informado',
      minlength: 'O CEP deve ter 8 caracteres',
      maxlength: 'O CEP deve ter 8 caracteres',
      apiError: ''
    },
    estado: {
      required: 'O estado deve ser informado',
      apiError: ''
    },
    cidade: {
      required: 'A cidade deve ser informada',
      apiError: ''
    },
    quantLivrosFornecido: {
      required: 'A quantidade de livros fornecidos deve ser informada',
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
    this.router.navigateByUrl('/editoras/new');
  }
  autor() {
    this.router.navigateByUrl('/autores/new');
  }
  caixaLivros() {
    this.router.navigateByUrl('/caixaLivros/new');
  }
  livro() {
    this.router.navigateByUrl('/livros/new');
  }
  genero() {
    this.router.navigateByUrl('/generos/new');
  }
  fornecedor() {
    this.router.navigateByUrl('/fornecedores/new');
  }
  voltar() {
    this.router.navigateByUrl('/fornecedores');
  }
}

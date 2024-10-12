import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})
export class FornecedorFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {

    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : '', Validators.compose([Validators.required, Validators.minLength(3)])],
      cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : '', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
      inscricaoEstadual: [(fornecedor && fornecedor.inscricaoEstadual) ? fornecedor.inscricaoEstadual : '', Validators.required],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : '', Validators.compose([Validators.required, Validators.email])],
      endereco: [(fornecedor && fornecedor.endereco) ? fornecedor.endereco : '', Validators.required],
      cep: [(fornecedor && fornecedor.cep) ? fornecedor.cep : '', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      estado: [(fornecedor && fornecedor.estado) ? fornecedor.estado : '', Validators.required],
      cidade: [(fornecedor && fornecedor.cidade) ? fornecedor.cidade : '', Validators.required],
      quantLivrosFornecido: [(fornecedor && fornecedor.quantLivrosFornecido) ? fornecedor.quantLivrosFornecido : 0, Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(fornecedor && fornecedor.telefone && fornecedor.telefone.codigoArea) ? fornecedor.telefone.codigoArea : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(fornecedor && fornecedor.telefone && fornecedor.telefone.numero) ? fornecedor.telefone.numero : '', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])]
      })
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id == null) {
        this.fornecedorService.insert(fornecedor).subscribe({
          next: (fornecedorCadastrado) => {
            this.router.navigateByUrl('/fornecedores');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar' + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.fornecedorService.update(fornecedor).subscribe({
          next: (fornecedorAlterado) => {
            this.router.navigateByUrl('/fornecedores');
          },
          error: (err) => {
            console.log('Erro ao alterar' + JSON.stringify(err));
          }
        });
      }
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
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
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
      minlength: 'O nome deve ter no mínimo 3 caracteres',
    },
    cnpj: {
      required: 'O CNPJ deve ser informado',
      minlength: 'O CNPJ deve ter 14 caracteres',
      maxlength: 'O CNPJ deve ter 14 caracteres'
    },
    inscricaoEstadual: {
      required: 'A inscrição estadual deve ser informada',
    },
    email: {
      required: 'O e-mail deve ser informado',
      email: 'O e-mail deve ser válido'
    },
    endereco: {
      required: 'O endereço deve ser informado',
    },
    cep: {
      required: 'O CEP deve ser informado',
      minlength: 'O CEP deve ter 8 caracteres',
      maxlength: 'O CEP deve ter 8 caracteres',
    },
    estado: {
      required: 'O estado deve ser informado',
    },
    cidade: {
      required: 'A cidade deve ser informada',
    },
    quantLivrosFornecido: {
      required: 'A quantidade de livros fornecidos deve ser informada',
    },
    'telefone.codigoArea': {
      required: 'O código de área deve ser informado',
      minlength: 'O código de área deve ter no mínimo 2 caracteres',
      maxlength: 'O código de área deve ter no máximo 3 caracteres'
    },
    'telefone.numero': {
      required: 'O número de telefone deve ser informado',
      minlength: 'O número de telefone deve ter no mínimo 8 caracteres',
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

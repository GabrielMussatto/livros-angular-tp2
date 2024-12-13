import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
import { FuncionarioService } from '../../../services/funcionario.service';
import { MatDialog } from '@angular/material/dialog';
import { Funcionario } from '../../../models/funcionario.model';
import { Sexo } from '../../../models/sexo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent implements OnInit {
  formGroup: FormGroup;
  sexos: Sexo[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private funcionarioService: FuncionarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      username: ['', Validators.required],
      senha: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      email: ['', Validators.required],
      sexo: [null, Validators.required],
      cpf: ['', Validators.required],
      salario: ['', Validators.required],
      cargo: ['', Validators.required],
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
    const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];

    const sexo = this.sexos.find(s => s.id === (funcionario?.usuario?.idSexo?.id || null));

    this.formGroup = this.formBuilder.group({
      id: [(funcionario && funcionario.id) ? funcionario.id : null],
      nome: [(funcionario && funcionario.usuario.nome) ? funcionario.usuario.nome : '', Validators.required],
      username: [(funcionario && funcionario.usuario.username) ? funcionario.usuario.username : '', Validators.required],
      senha: [(funcionario && funcionario.usuario.senha) ? funcionario.usuario.senha : '', Validators.required],
      dataNascimento: [(funcionario && funcionario.usuario.dataNascimento) ? funcionario.usuario.dataNascimento : '', Validators.required],
      email: [(funcionario && funcionario.usuario.email) ? funcionario.usuario.email : '', Validators.required],
      sexo: [sexo, Validators.required],
      cpf: [(funcionario && funcionario.usuario.cpf) ? funcionario.usuario.cpf : '', Validators.required],
      salario: [(funcionario && funcionario.salario) ? funcionario.salario : '', Validators.required],
      cargo: [(funcionario && funcionario.cargo) ? funcionario.cargo : '', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(funcionario && funcionario.usuario.telefone && funcionario.usuario.telefone) ? funcionario.usuario.telefone : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(funcionario && funcionario.usuario.telefone && funcionario.usuario.telefone) ? funcionario.usuario.telefone : '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      })
    });
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message })
          }
        });
      }
    } else if (errorResponse.status < 400) {
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro do servidor.');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;
      const operacao = funcionario.id == null
        ? this.funcionarioService.insert(funcionario)
        : this.funcionarioService.update(funcionario);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/funcionarios');
          this.snackBar.open('O Funcionário foi salvo com Sucesso!!', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Funcionário', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;
      if (funcionario.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este funcionario? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.funcionarioService.delete(funcionario).subscribe({
              next: () => {
                this.router.navigateByUrl('/admin/funcionarios');
                this.snackBar.open('O Funcionario foi excluído com Sucesso!!', 'Fechar', { duration: 3000 });
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o Funcionario', 'Fechar', { duration: 3000 });
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
      apiError: ''
    },
    username: {
      required: 'O Username deve ser informado',
      apiError: ''
    },
    senha: {
      required: 'A Senha deve ser informada',
      apiError: ''
    },
    
    inscricaoEstadual: {
      required: 'A inscrição estadual deve ser informada',
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
    cep: {
      required: 'O CEP deve ser informado',
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
}

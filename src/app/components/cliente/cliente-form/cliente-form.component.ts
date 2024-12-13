import { NgFor, NgIf } from '@angular/common';
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
import { ClienteService } from '../../../services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { Sexo } from '../../../models/sexo.model';
import { Cliente } from '../../../models/cliente.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, MatOption, NgFor, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  formGroup: FormGroup;
  sexos: Sexo[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      idUsuario: [null],
      nome: ['', Validators.required],
      username: ['', Validators.required],
      senha: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      email: ['', Validators.required],
      cpf: ['', Validators.required],
      sexo: [null, Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      }),
      idCliente: [null],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      estado: ['', Validators.required],
      sigla: ['', Validators.required],
      cidade: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteService.findSexos().subscribe(data => {
      this.sexos = data;
      this.initializeForm();
    });
    this.initializeForm();
  }

  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];

    const sexo = this.sexos.find(s => s.id === (cliente?.usuario?.idSexo?.id || null));


    this.formGroup = this.formBuilder.group({
      idUsuario: [(cliente && cliente.usuario.id) ? cliente.id : null],
      nome: [(cliente && cliente.usuario.nome) ? cliente.usuario.nome : '', Validators.required],
      username: [(cliente && cliente.usuario.username) ? cliente.usuario.username : '', Validators.required],
      senha: [(cliente && cliente.usuario.senha) ? cliente.usuario.senha : '', Validators.required],
      dataNascimento: [(cliente && cliente.usuario.dataNascimento) ? cliente.usuario.dataNascimento : '', Validators.required],
      email: [(cliente && cliente.usuario.email) ? cliente.usuario.email : '', Validators.required],
      cpf: [(cliente && cliente.usuario.cpf) ? cliente.usuario.cpf : '', Validators.required],
      sexo: [sexo, Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(cliente && cliente.usuario.telefone && cliente.usuario.telefone.codigoArea) ? cliente.usuario.telefone.codigoArea : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(cliente && cliente.usuario.telefone && cliente.usuario.telefone.numero) ? cliente.usuario.telefone.numero : '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      }),
      idCliente: [(cliente && cliente.id) ? cliente.id : null],
      cep: [(cliente && cliente.cep) ? cliente.cep : '', Validators.required],
      endereco: [(cliente && cliente.endereco) ? cliente.endereco : '', Validators.required],
      estado: [(cliente && cliente.estado) ? cliente.estado : '', Validators.required],
      sigla: [(cliente && cliente.sigla) ? cliente.sigla : '', Validators.required],
      cidade: [(cliente && cliente.cidade) ? cliente.cidade : '', Validators.required]
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
      const cliente = this.formGroup.value;
      const operacao = cliente.idCliente == null
        ? this.clienteService.insert(cliente)
        : this.clienteService.update(cliente);

      operacao.subscribe({
        next: () => {
          console.log(cliente);
          this.router.navigateByUrl('/inicio');
          this.snackBar.open('O Cliente foi salvo com Sucesso!!', 'Fechar', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Erro ao Salvar', JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Cliente', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;
      if (cliente.idCliente != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este cliente? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.clienteService.delete(cliente).subscribe({
              next: () => {
                this.router.navigateByUrl('/admin/clientes');
                this.snackBar.open('O Cliente foi excluída com Sucesso!!', 'Fechar', { duration: 3000 });
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o cliente', 'Fechar', { duration: 3000 });
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
    username: {
      required: 'O username deve ser informado',
      minlength: 'O username deve ter no mínimo 2 caracteres',
      maxlength: 'O username deve ter no máximo 60 caracteres',
      apiError: ''
    },
    senha: {
      required: 'A senha deve ser informado',
      apiError: ''
    },
    dataNascimento: {
      required: 'A data é obrigatória',
      apiError: ''
    },
    email: {
      required: 'O e-mail deve ser informado',
      email: 'O e-mail deve ser válido',
      apiError: ''
    },
    cpf: {
      required: 'O CPF deve ser informado',
      apiError: ''
    },
    sexo: {
      required: 'O sexo deve ser informado',
      apiError: ''
    },
    cep: {
      required: 'O CEP deve ser informado',
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
    sigla: {
      required: 'A sigla deve ser informada',
      apiError: ''
    },
    cidade: {
      required: 'A cidade deve ser informada',
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
  cupom() {
    this.router.navigateByUrl('/admin/cupons/new');
  }
  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores/new');
  }
  voltar() {
    this.router.navigateByUrl('/admin/editoras');
  }
}

import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Sexo } from '../../../models/sexo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { ClienteBasicoService } from '../../../services/cliente-basico.service';
import { ClienteBasico } from '../../../models/cliente-basico.model';

@Component({
  selector: 'app-cliente-basico-form',
  standalone: true,
  imports: [MatFormFieldModule ,MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, MatOption, NgFor, NgIf, MatInputModule, MatInput, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './cliente-basico-form.component.html',
  styleUrl: './cliente-basico-form.component.css'
})
export class ClienteBasicoFormComponent implements OnInit {
  formGroup: FormGroup;
  sexos: Sexo[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteBasicoService: ClienteBasicoService,
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
      cpf: ['', Validators.required],
      idSexo: [null, Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      }),
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      estado: ['', Validators.required],
      sigla: ['', Validators.required],
      cidade: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteBasicoService.findSexos().subscribe(data => {
      this.sexos = data;
      this.initializeForm();
    });
    this.initializeForm();
  }

  initializeForm(): void {
    const clienteBasico: ClienteBasico = this.activatedRoute.snapshot.data['clienteBasico'];

    const sexo = this.sexos.find(s => s.id === (clienteBasico?.idSexo?.id || null));


    this.formGroup = this.formBuilder.group({
      id: [(clienteBasico && clienteBasico.id) ? clienteBasico.id : null],
      nome: [(clienteBasico && clienteBasico.nome) ? clienteBasico.nome : '', Validators.required],
      username: [(clienteBasico && clienteBasico.username) ? clienteBasico.username : '', Validators.required],
      senha: [(clienteBasico && clienteBasico.senha) ? clienteBasico.senha : '', Validators.required],
      dataNascimento: [(clienteBasico && clienteBasico.dataNascimento) ? clienteBasico.dataNascimento : '', Validators.required],
      email: [(clienteBasico && clienteBasico.email) ? clienteBasico.email : '', Validators.required],
      cpf: [(clienteBasico && clienteBasico.cpf) ? clienteBasico.cpf : '', Validators.required],
      idSexo: [sexo, Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(clienteBasico && clienteBasico.telefone && clienteBasico.telefone.codigoArea) ? clienteBasico.telefone.codigoArea : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(clienteBasico && clienteBasico.telefone && clienteBasico.telefone.numero) ? clienteBasico.telefone.numero : '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])]
      }),
      cep: [(clienteBasico && clienteBasico.cep) ? clienteBasico.cep : '', Validators.required],
      endereco: [(clienteBasico && clienteBasico.endereco) ? clienteBasico.endereco : '', Validators.required],
      estado: [(clienteBasico && clienteBasico.estado) ? clienteBasico.estado : '', Validators.required],
      sigla: [(clienteBasico && clienteBasico.sigla) ? clienteBasico.sigla : '', Validators.required],
      cidade: [(clienteBasico && clienteBasico.cidade) ? clienteBasico.cidade : '', Validators.required]
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
      const clienteBasico: ClienteBasico = this.formGroup.value;

      this.clienteBasicoService.insert(clienteBasico).subscribe({
        next: () => {
          console.log(clienteBasico);
          this.router.navigateByUrl('/login');
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
    idSexo: {
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

  voltar() {
    this.router.navigateByUrl('/inicio');
  }
}

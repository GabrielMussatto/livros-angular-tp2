import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuncionarioService } from '../../../services/funcionario.service';
import { Funcionario } from '../../../models/funcionario.model';
import { Sexo } from '../../../models/sexo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    NgIf,
    MatInputModule,
    RouterModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatSelect,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './funcionario-form.component.html',
  styleUrls: ['./funcionario-form.component.css'],
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
      email: ['', [Validators.required, Validators.email]],
      sexo: [null, Validators.required],
      cpf: ['', Validators.required],
      salario: ['', Validators.required],
      cargo: ['', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(3),
          ],
        ],
        numero: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
      }),
    });
  }

  ngOnInit(): void {
    this.funcionarioService.findSexos().subscribe((data) => {
      this.sexos = data;
      this.initializeForm();
    });
  }

  initializeForm(): void {
    const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];
  
    // Verifica se o objeto "funcionario" existe antes de acessar seus campos
    const sexo = funcionario?.usuario?.idSexo
      ? this.sexos.find((s) => s.id === funcionario.usuario.idSexo.id)
      : null;
  
    const telefone = funcionario?.usuario?.telefone || {};
  
    // Garantir que "usuario" não seja undefined
    if (!funcionario.usuario) {
      funcionario.usuario = {} as Usuario;  // Inicializa "usuario" caso esteja undefined
    }
  
    // Inicializando o formGroup com os valores recuperados
    this.formGroup = this.formBuilder.group({
      id: [funcionario?.id || null],
      nome: [
        funcionario.usuario?.nome || '',
        Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
      ],
      username: [
        funcionario.usuario?.username || '',
        Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      ],
      senha: [
        funcionario.usuario?.senha || '',
        Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      ],
      dataNascimento: [
        funcionario.usuario?.dataNascimento || '',
        Validators.required,
      ],
      email: [
        funcionario.usuario?.email || '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      sexo: [sexo, Validators.required],  // Atribui o valor de sexo
      cpf: [
        funcionario.usuario?.cpf || '',
        Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      ],
      salario: [
        funcionario.salario || '',
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      cargo: [funcionario.cargo || '', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [
          telefone?.codigoArea || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(3),
          ],
        ],
        numero: [
          telefone?.numero || '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
      }),
    });
  }
  
  

  salvar(): void {
    this.formGroup.markAllAsTouched();  // Marca todos os campos como tocados
  
    if (this.formGroup.valid) {  // Verifica se o formulário é válido
      const funcionario = this.formGroup.value;  // Recupera os dados do formulário
  
      // Verifica se o "usuario" existe dentro de "funcionario"
      if (!funcionario.usuario) {
        funcionario.usuario = {};  // Cria o objeto usuario caso não exista
      }
  
      // Verifica se o objeto "sexo" está sendo enviado corretamente e atribui apenas o id
      if (funcionario.sexo && funcionario.sexo.id) {
        funcionario.usuario.idSexo = funcionario.sexo.id;  // Atribui o id do sexo ao usuário
        delete funcionario.sexo;  // Remove o campo "sexo" do objeto, pois a API espera apenas o id
      }
  
      // Verifica se o telefone está sendo enviado corretamente
      if (funcionario.telefone) {
        funcionario.usuario.telefone = funcionario.telefone;
      }
  
      // Verifica se o campo "usuario" está completo e com todos os dados
      if (!funcionario.usuario.id) {
        funcionario.usuario.id = null;  // Certifica-se de que o id do usuário seja nulo se for uma criação
      }
  
      // Determina se a operação será de inserção ou atualização
      const operacao = funcionario.id == null
        ? this.funcionarioService.insert(funcionario)
        : this.funcionarioService.update(funcionario);
  
      // Subscrição para lidar com a resposta da operação
      operacao.subscribe({
        next: (response) => {  // Manipula a resposta da operação
          if (response) {
            this.router.navigateByUrl('/admin/funcionarios');
            this.snackBar.open('O Funcionário foi salvo com Sucesso!', 'Fechar', { duration: 3000 });
          }
        },
        error: (error: HttpErrorResponse) => {  // Especificando explicitamente o tipo de erro
          console.error('Erro ao salvar o Funcionário: ' + JSON.stringify(error));
          this.tratarErros(error);  // Método para tratar o erro
          this.snackBar.open('Erro ao tentar salvar o Funcionário', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  tratarErros(errorResponse: HttpErrorResponse): void {
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

  excluir(): void {
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;
      if (funcionario.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message:
              'Deseja realmente excluir este funcionário? Não será possível reverter.',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.funcionarioService.delete(funcionario).subscribe({
              next: () => {
                this.router.navigateByUrl('/admin/funcionarios');
                this.snackBar.open(
                  'O Funcionário foi excluído com Sucesso!!',
                  'Fechar',
                  { duration: 3000 }
                );
              },
              error: (err: HttpErrorResponse) => {
                console.error('Erro ao excluir:', err);
                this.snackBar.open(
                  'Erro ao tentar excluir o Funcionário',
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

  getErrorMessage(controlName: string, errors: any): string {
    if (!errors) {
      return '';
    }

    for (const errorName in errors) {
      if (
        errors.hasOwnProperty(errorName) &&
        this.errorMessage[controlName] &&
        this.errorMessage[controlName][errorName]
      ) {
        return this.errorMessage[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      apiError: '',
    },
    username: {
      required: 'O Username deve ser informado',
      apiError: '',
    },
    senha: {
      required: 'A Senha deve ser informada',
      apiError: '',
    },
    email: {
      required: 'O e-mail deve ser informado',
      email: 'O e-mail deve ser válido',
      apiError: '',
    },
    'telefone.codigoArea': {
      required: 'O código de área deve ser informado',
      minlength: 'O código de área deve ter no mínimo 2 caracteres',
      maxlength: 'O código de área deve ter no máximo 3 caracteres',
      apiError: '',
    },
    'telefone.numero': {
      required: 'O número de telefone deve ser informado',
      minlength: 'O número de telefone deve ter no mínimo 9 caracteres',
      maxlength: 'O número de telefone deve ter no máximo 9 caracteres',
      apiError: '',
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
    this.router.navigateByUrl('/admin/funcionarios');
  }
}

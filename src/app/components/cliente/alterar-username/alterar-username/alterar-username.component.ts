import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Cliente } from '../../../../models/cliente.model';
import { AuthService } from '../../../../services/auth.service';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-alterar-username',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, NgIf, ReactiveFormsModule, MatSnackBarModule, MatButtonModule, RouterModule],
  templateUrl: './alterar-username.component.html',
  styleUrl: './alterar-username.component.css'
})
export class AlterarUsernameComponent implements OnInit{
  usuarioLogado: any;
  alterar: any;
  cliente: Cliente | null = null;
  private subscription = new Subscription();
  formGroup: FormGroup;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private router: Router
  ){
    this.formGroup = this.formBuilder.group({
      id: [null],
      username: [{ value: '', disabled: true }], // Campo apenas para exibição
      usernameNovo: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((cliente) => {
        this.usuarioLogado = cliente;
        this.cliente = cliente; // Atualiza o cliente quando os dados forem carregados
        this.initializeForm(); // Recria o formulário com os dados carregados
      })
    );

    const usuarioLogado1 = localStorage.getItem('usuario_logado');
    if (usuarioLogado1) {
      const cliente = JSON.parse(usuarioLogado1);
      this.clienteService.meuPerfil(cliente.id).subscribe({
        next: (dadosCliente) => {
          this.alterar = {
            username: dadosCliente.usuario.username,
          };
        },
        error: (err) => console.error('Erro ao carregar o endereço:', err),
      });
    }
  }

  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'] || ({ usuario: {}, telefone: {} } as unknown as Cliente);
    console.log(cliente);
    this.formGroup.patchValue({
      id: cliente?.usuario?.id || null,
      currentUsername: cliente?.usuario?.username || '',
    });
  }

  alterarUsername() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const { usernameNovo: usernameNovo, senha: senha } = this.formGroup.value;

      this.clienteService.alterarUsername({ usernameNovo, senha }).subscribe({
        next: () => {
          this.snackBar.open('Username alterado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigateByUrl('/inicio');
        },
        error: (error) => {
          console.error('Erro ao alterar username:', error);
          this.tratarErros(error);
          this.snackBar.open('Erro ao alterar username.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
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
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }
  }
}
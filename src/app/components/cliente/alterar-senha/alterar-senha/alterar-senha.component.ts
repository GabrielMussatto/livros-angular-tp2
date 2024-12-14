import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { Cliente } from '../../../../models/cliente.model';
import { AuthService } from '../../../../services/auth.service';
import { ClienteService } from '../../../../services/cliente.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgIf],
  templateUrl: './alterar-senha.component.html',
  styleUrl: './alterar-senha.component.css'
})
export class AlterarSenhaComponent {
    usuarioLogado: any;
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
        senhaAntiga: ['', Validators.required],
        novaSenha: ['', [Validators.required, Validators.minLength(3)]],
      });
    }
  
    ngOnInit(): void {}

    alterarSenha() {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.valid) {
        const { senhaAntiga, novaSenha } = this.formGroup.value;
        const data = {
          senhaAntiga: senhaAntiga,
          novaSenha: novaSenha,
        };
    
        // Log para debugar
        console.log('Dados enviados:', data);
    
        // Chama o serviço para alterar a senha
        this.clienteService.alterarSenha(data).subscribe({
          next: () => {
            this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigateByUrl('/inicio');
          },
          error: (error) => {
            console.error('Erro ao alterar senha:', error);
            this.snackBar.open('Erro ao alterar senha. Tente novamente.', 'Fechar', { duration: 3000 });
          }
        });
      } else {
        this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
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
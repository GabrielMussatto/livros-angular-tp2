import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  // Variáveis para controlar os perfis disponíveis no login
  perfilOptions = [
    { label: 'Cliente', value: 2 },  // Assumindo que 2 é o perfil de Cliente
    { label: 'Funcionario', value: 1 } // Assumindo que 1 é o perfil de Funcionário
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      senha: ['', Validators.required],
      perfil: ['', Validators.required] // Valor padrão como Cliente (2)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const senha = this.loginForm.get('senha')?.value;
      const perfil = this.loginForm.get('perfil')?.value;
  
      this.authService.login(username, senha, perfil).subscribe({
        next: (resp) => {
          // Redireciona baseado no perfil do usuário
          if (perfil === 1) {
            this.router.navigate(['/admin']); // Funcionário
          } else if (perfil === 2) {
            this.router.navigate(['/inicio']); // Cliente
          }
        },
        error: (err) => {
          console.error(err);
          this.showSnackbarTopPosition("Username ou senha inválido");
        }
      });
    }
  }

  showSnackbarTopPosition(content: any): void {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}

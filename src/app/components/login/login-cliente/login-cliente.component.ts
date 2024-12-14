import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login-cliente',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule],
  templateUrl: './login-cliente.component.html',
  styleUrl: './login-cliente.component.css'
})
export class LoginClienteComponent implements OnInit{
  loginForm!: FormGroup;
  cadastroForm!: FormGroup;
  perfilStyle = 2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });

    this.cadastroForm = this.fb.group({
      emailCadastro: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, senha } = this.loginForm.value;
      const perfil = this.perfilStyle;
      this.authService.login(username, senha, perfil).subscribe(
        () => {
          this.router.navigateByUrl('/inicio');
        },
        (error) => {
          this.snackBar.open('Erro ao logar', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  cadastrar(){
    this.router.navigateByUrl('/cadastreSe');
  }
}

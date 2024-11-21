import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gerenciar',
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatIcon],
  templateUrl: './gerenciar.component.html',
  styleUrl: './gerenciar.component.css'
})
export class GerenciarComponent implements OnInit{
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
      this.subscription.add(this.authService.getUsuarioLogado().subscribe(
        usuario => this.usuarioLogado = usuario
        )
    );
  }

  editora() {
    this.router.navigateByUrl('/admin/editoras');
  }
  autor() {
    this.router.navigateByUrl('/admin/autores');
  }
  caixaLivros() {
    this.router.navigateByUrl('/admin/caixaLivros');
  }
  livro() {
    this.router.navigateByUrl('/admin/livros');
  }
  genero() {
    this.router.navigateByUrl('/admin/generos');
  }
  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores');
  }
}

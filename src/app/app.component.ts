import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'livros-angular-tp2';

  constructor(
    private router: Router
  ) { }

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

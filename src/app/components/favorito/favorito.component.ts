import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LivroService } from '../../services/livro.service';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { CaixaLivroService } from '../../services/caixa-livro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type Favorito = {
  id: number;
  titulo: string;
  preco: number;
  autores: string;
  imageUrl: string;
}

type CaixaLivroFavorito = {
  id: number;
  nome: string;
  preco: number;
  autores: string;
  imageUrl: string;
}

@Component({
  selector: 'app-favorito',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './favorito.component.html',
  styleUrl: './favorito.component.css',
})
export class FavoritoComponent implements OnInit {
  favoritos: Favorito[] = [];
  caixaLivroFavorito: CaixaLivroFavorito[] = [];
  loading: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private livroService: LivroService,
    private caixaLivroService: CaixaLivroService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.verificarAutenticacao()) return;
    this.carregarFavoritos();
  }

  verificarAutenticacao(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  carregarFavoritos(): void {
    this.loading = true;

    this.clienteService.getListaFavoritos().subscribe({
      next: (itens) => {
        this.favoritos = itens.filter(item => item.tipo === 'Livro').map(livro => ({
          id: livro.id,
          titulo: livro.nome,
          preco: livro.preco,
          autores: livro.autores?.map((autor) => autor.nome).join(', ') || 'Autor desconhecido',
          imageUrl: this.livroService.getUrlImage(livro.imagemUrl || 'default-livro-jpg'),
        }));
        this.caixaLivroFavorito = itens.filter(item => item.tipo === 'CaixaLivro').map(caixaLivro => ({
          id: caixaLivro.id,
          nome: caixaLivro.nome,
          preco: caixaLivro.preco,
          autores: caixaLivro.autores?.map((autor) => autor.nome).join(', ') || 'Autor desconhecido',
          imageUrl: this.caixaLivroService.getUrlImage(caixaLivro.imagemUrl || 'default-caixalivro-jpg'),
        }));
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
      },
    });
  }

  removerFavorito(id: number, tipo: 'Livro' | 'CaixaLivro'): void {
    if(!this.verificarAutenticacao()) return;
    const remover$ = tipo === 'Livro'
      ? this.clienteService.removerLivroFavorito(id)
      : this.clienteService.removerCaixaLivroFavorito(id);

    remover$.subscribe({
      next: () => {
        if(tipo === 'Livro'){
          this.favoritos = this.favoritos.filter((favorito) => favorito.id !== id);
        } else {
          this.caixaLivroFavorito = this.caixaLivroFavorito.filter((caixaLivroFavorito) => caixaLivroFavorito.id !== id);
        }
        this.snackBar.open('Removendo da lista de favoritos.', 'Fechar', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao remover da lista de favoritos.', 'Fechar', {
          duration: 3000,
        });
        console.error(error);
      },
    });
  }

  verMais(titulo: string): void {
    this.router.navigate(['/livros', titulo]);
  }

  verMaisCaixaLivro(nome: string): void {
    this.router.navigate(['/caixaLivros', nome]);
  }
}
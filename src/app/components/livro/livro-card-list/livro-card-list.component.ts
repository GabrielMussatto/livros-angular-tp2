import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardModule, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../services/livro.service';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

type Card = {
  titulo: string;
  autores: string;
  generos: string;
  descricao: string;
  preco: number;
  imageUrl: string;
  verDescricao: boolean;
  favorito?: boolean;
}

@Component({
  selector: 'app-livro-card-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, NgFor, MatCardActions, MatCardContent,
    MatCardTitle, MatCardSubtitle, MatIcon, FormsModule, CommonModule,
    MatFormField, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule, NgIf
  ],
  templateUrl: './livro-card-list.component.html',
  styleUrl: './livro-card-list.component.css'
})
export class LivroCardListComponent implements OnInit {
  livros: Livro[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "titulo";
  ordenacao: string = 'maisRelevantes';

  constructor(
    private livroService: LivroService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarLivros();
    this.buscarTodos();
  }

  carregarLivros(): void {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.livroService.findByAutor(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.livros = data;
            this.carregarCards();
            this.ordenar();
          }
        );
      } else {
        this.livroService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.livros = data;
            this.carregarCards();
            this.ordenar();
          }
        );
      }
    } else {
      this.livroService.findAll(this.page, this.pageSize).subscribe(
        data => {
          this.livros = data;
          this.carregarCards();
          this.ordenar();
        }
      );
    }
  }

  carregarCards(): void {
    const favoritos: Record<string, boolean> = JSON.parse(localStorage.getItem('favoritos') || '{}');

    const cards: Card[] = [];
    this.livros.forEach(livro => {
      cards.push({
        titulo: livro.titulo,
        descricao: livro.descricao,
        autores: livro.autores.map(autor => autor.nome).join(', '),
        generos: livro.generos.map(genero => genero.nome).join(', '),
        preco: livro.preco,
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
        verDescricao: false,
        favorito: favoritos[livro.titulo] || false
      });
    });
    this.cards.set(cards);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarLivros();
    this.ordenar();
  }

  buscarTodos(): void {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.livroService.countByAutor(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else {
        this.livroService.countByTitulo(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      }
    } else {
      this.livroService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(): void {
    this.carregarLivros();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar', { duration: 3000 });
  }

  formatarTitulo(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-'); // Substitui espaços por hífens
  }

  verMais(titulo: string): void {
    this.router.navigate(['/livros', titulo]);
  }

  verDescricao(card: Card): void {
    card.verDescricao = !card.verDescricao;
  }

  favoritar(card: Card, event: Event): void {
    event.stopPropagation();
    card.favorito = !card.favorito;

    // Encontra o elemento do botão e adiciona a classe de rotação lateral
    const button = (event.target as HTMLElement).closest('.favorite-button');
    if (button) {
      button.classList.add('spin');

      // Remove a classe após a animação completar
      setTimeout(() => button.classList.remove('spin'), 600);
    }

    // Atualiza os favoritos no localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}');
    if (card.favorito) {
      favoritos[card.titulo] = true;
    } else {
      delete favoritos[card.titulo];
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  ordenar(): void {
    const ordenarCards = this.cards().slice();
    if (this.ordenacao === 'asc') {
      ordenarCards.sort((a, b) => a.preco - b.preco);
    } else if (this.ordenacao === 'desc') {
      ordenarCards.sort((a, b) => b.preco - a.preco);
    } else if (this.ordenacao === 'maisRelevantes') {
      this.carregarCards();
      return;
    }
    this.cards.set(ordenarCards);
  }
}

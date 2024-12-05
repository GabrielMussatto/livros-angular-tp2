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
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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
  livrosFiltrados: Livro[] = [];
  cards = signal<Card[]>([]);  // Inicializando o signal corretamente
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";
  ordenacao: string = 'maisRelevantes';

  constructor(
    private livroService: LivroService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.filtro = params['termo'] || '';  // Recupera o filtro do parâmetro de URL
      this.carregarLivros();  // Carrega os livros ao inicializar
    });
  }

  carregarLivros(): void {
    if (this.filtro) {
      // Realiza as contagens
      forkJoin({
        countTitulo: this.livroService.countByTitulo(this.filtro),
        countAutor: this.livroService.countByAutor(this.filtro),
        countGenero: this.livroService.countByGenero(this.filtro),
      }).subscribe(
        (contagens) => {
          this.totalRecords = contagens.countTitulo + contagens.countAutor + contagens.countGenero;
  
          // Carrega todos os livros não paginados (remova paginação aqui)
          forkJoin({
            porTitulo: this.livroService.findByTitulo(this.filtro, 0, this.totalRecords),
            porAutor: this.livroService.findByAutor(this.filtro, 0, this.totalRecords),
            porGenero: this.livroService.findByGenero(this.filtro, 0, this.totalRecords),
          }).subscribe(
            (resultados) => {
              const todosLivros = [
                ...resultados.porTitulo,
                ...resultados.porAutor,
                ...resultados.porGenero,
              ];
  
              // Remove duplicatas e atualiza livrosFiltrados
              this.livrosFiltrados = this.removerDuplicatas(todosLivros);
  
              // Paginação correta agora funcionará
              this.paginacao();
            },
            (erro) => {
              console.error('Erro ao carregar livros:', erro);
              this.snackBar.open('Erro ao carregar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
            }
          );
        },
        (erro) => {
          console.error('Erro ao contar registros:', erro);
          this.snackBar.open('Erro ao contar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      // Carrega todos os livros sem filtro
      this.livroService.findAll(this.page, this.pageSize).subscribe(
        (data) => {
          this.totalRecords = data.length;
          this.livrosFiltrados = data;
          this.paginacao();
        },
        (erro) => {
          console.error('Erro ao carregar todos os livros:', erro);
          this.snackBar.open('Erro ao carregar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        }
      );
    }
  }
  

  removerDuplicatas(livros: Livro[]): Livro[] {
    const vistos = new Set();
    return livros.filter((livro) => {
      const id = livro.id || livro.titulo;
      if (vistos.has(id)) {
        return false;
      }
      vistos.add(id);
      return true;
    });
  }

  paginacao(): void {
    console.log('Livros antes da paginação:', this.livrosFiltrados);
    const inicio = this.page * this.pageSize;
    const fim = inicio + this.pageSize;
  
    this.livros = this.livrosFiltrados.slice(inicio, fim);
  
    console.log(`Livros na página ${this.page + 1}:`, this.livros);
    this.carregarCards();
  }
  

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;    // Atualiza a página com o índice
    this.pageSize = event.pageSize; // Atualiza o tamanho da página
    this.paginacao();  // Aplica a paginação com os novos parâmetros
  }

  carregarCards(): void {
    const favoritos: Record<string, boolean> = JSON.parse(localStorage.getItem('favoritos') || '{}');

    const cards: Card[] = [];
    this.livros.forEach((livro) => {
      cards.push({
        titulo: livro.titulo,
        descricao: livro.descricao,
        autores: livro.autores.map((autor) => autor.nome).join(', '),
        generos: livro.generos.map((genero) => genero.nome).join(', '),
        preco: livro.preco,
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
        verDescricao: false,
        favorito: favoritos[livro.titulo] || false,
      });
    });

    this.cards.set(cards);
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

    const button = (event.target as HTMLElement).closest('.favorite-button');
    if (button) {
      button.classList.add('spin');
      setTimeout(() => button.classList.remove('spin'), 600);
    }

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



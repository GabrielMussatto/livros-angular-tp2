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
import { AutorService } from '../../../services/autor.service';
import { GeneroService } from '../../../services/genero.service';
import { EditoraService } from '../../../services/editora.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';
import { Autor } from '../../../models/autor.model';
import { Editora } from '../../../models/editora.model';
import { Genero } from '../../../models/genero.model';

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
    MatFormField, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule, NgIf, MatCheckbox
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
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.filtro = params['termo'] || '';
      this.carregarLivros();
    });
  }

  carregarLivros(): void {
    if (this.filtro) {
      // Executa todas as buscas em paralelo
      forkJoin({
        porTitulo: this.livroService.findByTitulo(this.filtro, this.page, this.pageSize),
        porAutor: this.livroService.findByAutor(this.filtro, this.page, this.pageSize),
        porGenero: this.livroService.findByGenero(this.filtro, this.page, this.pageSize),
      }).subscribe(
        (resultados) => {
          // Combina os resultados removendo duplicatas
          const todosLivros = [
            ...resultados.porTitulo,
            ...resultados.porAutor,
            ...resultados.porGenero,
          ];
          this.livros = this.removerDuplicatas(todosLivros);
          this.carregarCards();
          this.ordenar();
        },
        (erro) => {
          console.error('Erro ao carregar livros:', erro);
          this.snackBar.open('Erro ao carregar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      // Se não há filtro, carrega todos os livros
      this.livroService.findAll(this.page, this.pageSize).subscribe((data) => {
        this.livros = data;
        this.carregarCards();
        this.ordenar();
      });
    }
  }

  removerDuplicatas(livros: Livro[]): Livro[] {
    const vistos = new Set();
    return livros.filter((livro) => {
      const id = livro.id || livro.titulo; // Use o identificador único ou título
      if (vistos.has(id)) {
        return false;
      }
      vistos.add(id);
      return true;
    });
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

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarLivros();
    this.ordenar();
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

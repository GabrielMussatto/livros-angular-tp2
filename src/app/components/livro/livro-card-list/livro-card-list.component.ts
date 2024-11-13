import { NgFor } from '@angular/common';
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
  id: number;
  titulo: string;
  autores: string;
  generos: string;
  descricao: string;
  preco: number;
  imageUrl: string;
}

@Component({
  selector: 'app-livro-card-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, NgFor, MatCardActions, MatCardContent,
    MatCardTitle, MatCardSubtitle, MatIcon, FormsModule,
    MatFormField, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule
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
          }
        );
      } else {
        this.livroService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.livros = data;
            this.carregarCards();
          }
        );
      }
    } else {
      this.livroService.findAll(this.page, this.pageSize).subscribe(
        data => {
          this.livros = data;
          this.carregarCards();
        }
      );
    }
  }

  carregarCards(): void {
    const cards: Card[] = [];
    this.livros.forEach(livro => {
      cards.push({
        id: livro.id,
        titulo: livro.titulo,
        descricao: livro.descricao,
        autores: livro.autores.map(autor => autor.nome).join(', '),
        generos: livro.generos.map(genero => genero.nome).join(', '),
        preco: livro.preco,
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem)
      });
    });
    this.cards.set(cards);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarLivros();
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

  verMais(id: number): void{
    this.router.navigate(['/livros', id]);
  }
}

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardModule, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { Router } from '@angular/router';

type Card = {
  id: number;
  nome: string;
  autores: string;
  generos: string;
  descricao: string;
  preco: number;
  imageUrl: string;
  verDescricao: boolean;
}

@Component({
  selector: 'app-caixa-livro-card-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, NgFor, MatCardActions, MatCardContent,
    MatCardTitle, MatCardSubtitle, MatIcon, FormsModule, CommonModule, 
    MatFormField, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule, NgIf
  ],
  templateUrl: './caixa-livro-card-list.component.html',
  styleUrl: './caixa-livro-card-list.component.css'
})
export class CaixaLivroCardListComponent implements OnInit{
  caixaLivros: CaixaLivro[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "titulo";
  ordenacao: string = 'maisRelevantes';


  constructor(
    private caixaLivroService: CaixaLivroService,
    private snackBar: MatSnackBar,
    private router: Router
  ){}

  ngOnInit(): void {
      this.carregarCaixaLivros();
      this.buscarTodos();
  }

  carregarCaixaLivros(): void {
    if (this.filtro) {
      if (this.tipoFiltro === 'genero') {
        this.caixaLivroService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.caixaLivros = data;
            this.carregarCards();
            this.ordenar();
          }
        );
      } else {
        this.caixaLivroService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.caixaLivros = data;
            this.carregarCards();
            this.ordenar();
          }
        );
      }
    } else {
      this.caixaLivroService.findAll(this.page, this.pageSize).subscribe(
        data => {
          this.caixaLivros = data;
          this.carregarCards();
          this.ordenar();
        }
      );
    }
  }

  carregarCards(): void {
    const cards: Card[] = [];
    this.caixaLivros.forEach(caixaLivro => {
      cards.push({
        id: caixaLivro.id,
        nome: caixaLivro.nome,
        descricao: caixaLivro.descricao,
        autores: caixaLivro.autores.map(autor => autor.nome).join(', '),
        generos: caixaLivro.generos.map(genero => genero.nome).join(', '),
        preco: caixaLivro.preco,
        imageUrl: this.caixaLivroService.getUrlImage(caixaLivro.nomeImagem),
        verDescricao: false
      });
    });
    this.cards.set(cards);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarCaixaLivros();
    this.ordenar();
  }

  buscarTodos(): void {
    if (this.filtro) {
      if (this.tipoFiltro === 'nome') {
        this.caixaLivroService.countByNome(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else {
        this.caixaLivroService.countByGenero(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      }
    } else {
      this.caixaLivroService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(): void {
    this.carregarCaixaLivros();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar', { duration: 3000 });
  }

  verMais(id: number): void{
    this.router.navigate(['/caixaLivros', id]);
  }

  toogleDescricao(card: Card): void{
    card.verDescricao = !card.verDescricao;
  }

  ordenar(): void{
    const ordenarCards = this.cards().slice();
    if(this.ordenacao === 'asc'){
      ordenarCards.sort((a, b) => a.preco - b.preco);
    }else if(this.ordenacao === 'desc'){
      ordenarCards.sort((a, b) => b.preco - a.preco);
    } else if(this.ordenacao === 'maisRelevantes'){
      this.carregarCards();
      return;
    }
    this.cards.set(ordenarCards);
  }

}


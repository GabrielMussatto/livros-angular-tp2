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
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';


type Card = {
  id: number;
  nome: string;
  autores: string;
  generos: string;
  descricao: string;
  preco: number;
  imageUrl: string;
  verDescricao: boolean;
  listaFavorito: boolean;
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
  caixaLivrosFiltrados: CaixaLivro[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";
  ordenacao: string = 'maisRelevantes';

  constructor(
    private caixaLivroService: CaixaLivroService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.filtro = params['termo'] || '';
      this.carregarCaixaLivros();
    });
  }

  carregarCaixaLivros(): void {
    if (this.filtro) {
      // Executa todas as buscas em paralelo
      forkJoin({
        countNome: this.caixaLivroService.countByNome(this.filtro),
        countAutor: this.caixaLivroService.countByAutor(this.filtro),
        countGenero: this.caixaLivroService.countByGenero(this.filtro),
      }).subscribe(
        (contagens) => {
          this.totalRecords = contagens.countNome + contagens.countAutor + contagens.countGenero;
  
          // Busca todos os livros relacionados ao filtro
          forkJoin({
            porNome: this.caixaLivroService.findByNome(this.filtro, 0, this.totalRecords),
            porAutor: this.caixaLivroService.findByAutor(this.filtro, 0, this.totalRecords),
            porGenero: this.caixaLivroService.findByGenero(this.filtro, 0, this.totalRecords),
          }).subscribe(
            (resultados) => {
              const todosCaixaLivros = [
                ...resultados.porNome,
                ...resultados.porAutor,
                ...resultados.porGenero,
              ];
  
              this.caixaLivrosFiltrados = this.removerDuplicatas(todosCaixaLivros);
              this.paginacao();
            },
            (erro) => {
              console.error('Erro ao carregar livros filtrados:', erro);
              this.snackBar.open('Erro ao carregar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
            }
          );
        },
        (erro) => {
          console.error('Erro ao contar registros filtrados:', erro);
          this.snackBar.open('Erro ao contar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      // Caso não exista filtro, conta e busca todos os livros
      this.caixaLivroService.count().subscribe(
        (total) => {
          this.totalRecords = total;
  
          // Carrega todos os livros de uma vez
          this.caixaLivroService.findAll(0, this.totalRecords).subscribe(
            (data) => {
              this.caixaLivrosFiltrados = data;
              this.paginacao();
            },
            (erro) => {
              console.error('Erro ao carregar todos os livros:', erro);
              this.snackBar.open('Erro ao carregar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
            }
          );
        },
        (erro) => {
          console.error('Erro ao contar todos os livros:', erro);
          this.snackBar.open('Erro ao contar os livros. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        }
      );
    }
  }

  removerDuplicatas(caixaLivros: CaixaLivro[]): CaixaLivro[] {
    const vistos = new Set();
    return caixaLivros.filter((caixaLivro) => {
      const id = caixaLivro.id || caixaLivro.nome; // Use o identificador único ou título
      if (vistos.has(id)) {
        return false;
      }
      vistos.add(id);
      return true;
    });
  }

  paginacao(): void {
    // A cada mudança de página, divide os livros filtrados de acordo com a página e o tamanho
    const inicio = this.page * this.pageSize;
    const fim = inicio + this.pageSize;

    // Atualiza a lista de livros com base na página atual
    this.caixaLivros = this.caixaLivrosFiltrados.slice(inicio, fim);

    // Atualiza os cards a serem exibidos
    this.carregarCards();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;    // Atualiza a página com o índice
    this.pageSize = event.pageSize; // Atualiza o tamanho da página
    this.paginacao();  // Aplica a paginação com os novos parâmetros
  }

  carregarCards(): void {
    const cards: Card[] = this.caixaLivros.map((caixaLivro) => ({
      id: caixaLivro.id,
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      autores: caixaLivro.autores.map((autor) => autor.nome).join(', '),
      generos: caixaLivro.generos.map((genero) => genero.nome).join(', '),
      preco: caixaLivro.preco,
      imageUrl: this.caixaLivroService.getUrlImage(caixaLivro.nomeImagem),
      verDescricao: false,
      listaFavorito: false, // Inicializa como não favorito
    }));
  
    if (this.authService.isLoggedIn()) {
      // Se logado, carrega os favoritos e atualiza os estados
      this.clienteService.getListaFavoritos().subscribe({
        next: (favoritos) => {
          favoritos.forEach((favorito) => {
            const card = cards.find((card) => card.id === favorito.id);
            if (card) {
              card.listaFavorito = true; // Marca como favorito
            }
          });
  
          this.cards.set(cards); // Atualiza os cards com favoritos
        },
        error: () => {
          this.snackBar.open('Erro ao carregar favoritos. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
          this.cards.set(cards); // Mesmo com erro, inicializa os cards
        },
      });
    } else {
      // Caso não logado, inicializa os cards sem favoritos
      this.cards.set(cards);
    }
  }
  
  favoritar(card: Card): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Você precisa estar logado para adicionar favoritos.', 'Fechar', { duration: 3000 });
      return;
    }

    if (!card.listaFavorito) {
      // Adiciona o livro à lista de Favorito
      this.clienteService.adicionarCaixaLivroFavorito(card.id).subscribe({
        next: () => {
          this.snackBar.open('Caixa de Livro adicionado à lista de Favorito.', 'Fechar', { duration: 3000 });
          card.listaFavorito = true; // Atualiza o estado visual do card
        },
        error: () => {
          this.snackBar.open('Erro ao adicionar caixa de livro à lista de Favorito.', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      // Se já está na lista de Favorito, exibe mensagem informativa
      this.snackBar.open('Esta caixa de livro já está na sua lista de Favorito.', 'Fechar', { duration: 3000 });
    }
  }

  verMais(nome: string): void{
    this.router.navigate(['/caixaLivros', nome]);
  }

  verDescricao(card: Card): void{
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


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
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { ItemPedido } from '../../../models/item-pedido';
import { CarrinhoService } from '../../../services/carrinho.service';

type Card = {
  id: number;
  titulo: string;
  autores: string;
  generos: string;
  descricao: string;
  preco: number;
  imageUrl: string;
  verDescricao: boolean;
  listaFavorito: boolean;
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
    private clienteService: ClienteService,
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
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
      // Caso exista um filtro, realiza as contagens e busca
      forkJoin({
        countTitulo: this.livroService.countByTitulo(this.filtro),
        countAutor: this.livroService.countByAutor(this.filtro),
        countGenero: this.livroService.countByGenero(this.filtro),
      }).subscribe(
        (contagens) => {
          this.totalRecords = contagens.countTitulo + contagens.countAutor + contagens.countGenero;

          // Busca todos os livros relacionados ao filtro
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

              this.livrosFiltrados = this.removerDuplicatas(todosLivros);
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
      this.livroService.count().subscribe(
        (total) => {
          this.totalRecords = total;
  
          // Carrega todos os livros de uma vez
          this.livroService.findAll(0, this.totalRecords).subscribe(
            (data) => {
              this.livrosFiltrados = data;
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
    const cards: Card[] = this.livros.map((livro) => ({
      id: livro.id,
      titulo: livro.titulo,
      descricao: livro.descricao,
      autores: livro.autores.map((autor) => autor.nome).join(', '),
      generos: livro.generos.map((genero) => genero.nome).join(', '),
      preco: livro.preco,
      imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
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
      this.clienteService.adicionarLivroFavorito(card.id).subscribe({
        next: () => {
          this.snackBar.open('Livro adicionado à lista de Favorito.', 'Fechar', { duration: 3000 });
          card.listaFavorito = true; // Atualiza o estado visual do card
        },
        error: () => {
          this.snackBar.open('Erro ao adicionar livro à lista de Favorito.', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      // Se já está na lista de Favorito, exibe mensagem informativa
      this.snackBar.open('Este livro já está na sua lista de Favorito.', 'Fechar', { duration: 3000 });
    }
  }

  verMais(titulo: string): void {
    this.router.navigate(['/livros', titulo]);
  }

  verDescricao(card: Card): void {
    card.verDescricao = !card.verDescricao;
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

  adicionarAoCarrinho(card: Card): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Você precisa estar logado para adicionar ao carrinho.', 'Fechar', { duration: 3000 });
      return;
    }
  
    const item: ItemPedido = {
      idLivro: card.id,
      titulo: card.titulo,
      preco: card.preco,
      quantidade: 1 // Quantidade padrão
       // Inicialmente o subtotal é o preço * quantidade
    };
  
    this.carrinhoService.adicionarAoCarrinho(item);
    this.snackBar.open('Livro adicionado ao carrinho com sucesso.', 'Fechar', { duration: 3000 });
  }
  
  
}



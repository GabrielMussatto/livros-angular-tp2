import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LivroService } from '../../../services/livro.service';
import { Livro } from '../../../models/livro.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { ItemPedido } from '../../../models/item-pedido';
import { CarrinhoService } from '../../../services/carrinho.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-livro-detalhado-list',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle, MatCardSubtitle, NgFor, NgIf, MatProgressSpinner, RouterModule, MatButtonModule],
  templateUrl: './livro-detalhado-list.component.html',
  styleUrls: ['./livro-detalhado-list.component.css']
})
export class LivroDetalhadoListComponent implements OnInit {
  livro: Livro | undefined;
  carregando = true;
  quantidade = 1;

  constructor(
    private route: ActivatedRoute,
    public livroService: LivroService,
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    const tituloLivro = this.route.snapshot.paramMap.get('titulo');
    if (tituloLivro) {
      this.livroService.findByTitulo(tituloLivro).subscribe(
        (livro) => {
          setTimeout(() => {
            this.livro = livro[0];
            this.carregando = false;
          }, 200);
        },
        (error) => {
          console.error('Erro ao carregar o livro', error);
          this.carregando = false;
        }
      );
    }
  }

  get generosString(): string {
    return this.livro ? this.livro.generos.map(genero => genero.nome).join(', ') : '';
  }

  voltar(): void {
    window.history.back();
  }

  adicionarAoCarrinho(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Você precisa estar logado para adicionar ao carrinho.', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.livro) {
      const item: ItemPedido = {
        idLivro: this.livro.id,
        titulo: this.livro.titulo,
        preco: this.livro.preco,
        quantidade: this.quantidade,
        subTotal: this.livro.preco * this.quantidade,
        imageUrl: this.livroService.getUrlImage(this.livro.nomeImagem)// Adiciona a URL da imagem

      };
      this.carrinhoService.adicionarAoCarrinho(item);
      this.snackBar.open(`O livro ${this.livro.titulo} foi adicionado ${this.quantidade} ao carrinho.`, 'Fechar' , {duration: 3000});
    }
  }

  incrementar(): void {
    this.quantidade++;
  }

  decrementar(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }
}

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

@Component({
  selector: 'app-livro-detalhado-list',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle, MatCardSubtitle, NgFor, NgIf, MatProgressSpinner, RouterModule],
  templateUrl: './livro-detalhado-list.component.html',
  styleUrls: ['./livro-detalhado-list.component.css']
})
export class LivroDetalhadoListComponent implements OnInit {
  livro: Livro | undefined;
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    public livroService: LivroService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

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
    if (this.livro) {
      const item: ItemPedido = {
        idLivro: this.livro.id,
        titulo: this.livro.titulo,
        preco: this.livro.preco,
        quantidade: 1,
        subTotal: this.livro.preco * 1,
      };
      this.carrinhoService.adicionarAoCarrinho(item);
      alert(`${this.livro.titulo} foi adicionado ao carrinho!`);
    }
  }
}

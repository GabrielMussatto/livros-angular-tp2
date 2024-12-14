import { Component, OnInit } from '@angular/core';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { MatIcon } from '@angular/material/icon';
import { ItemPedido } from '../../../models/item-pedido';
import { CarrinhoService } from '../../../services/carrinho.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-caixa-livro-detalhado-list',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle, MatCardSubtitle, NgFor, NgIf, MatProgressSpinner, RouterModule, MatIcon, MatButtonModule],
  templateUrl: './caixa-livro-detalhado-list.component.html',
  styleUrl: './caixa-livro-detalhado-list.component.css'
})
export class CaixaLivroDetalhadoListComponent implements OnInit {
  caixaLivro: CaixaLivro | undefined;
  carregando = true;
  quantidade = 1;

  constructor(
    private route: ActivatedRoute,
    public caixaLivroService: CaixaLivroService,
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const nomeCaixaLivro = this.route.snapshot.paramMap.get('nome');
    if (nomeCaixaLivro) {
      this.caixaLivroService.findByNome(nomeCaixaLivro).subscribe(
        (caixaLivro) => {
          setTimeout(() => {
            this.caixaLivro = caixaLivro[0];
            this.carregando = false;
          }, 200)
        },
        (error) => {
          console.error('Erro ao carregar o Caixa de Livro', error);
          this.carregando = false;
        }
      );
    }
  }

  get nomesString(): string {
    return this.caixaLivro ? this.caixaLivro.nome : '';
  }

  get generosString(): string {
    return this.caixaLivro ? this.caixaLivro.generos.map(genero => genero.nome).join(', ') : '';
  }

  voltar(): void {
    window.history.back();
  }

  adicionarAoCarrinho(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Você precisa estar logado para adicionar ao carrinho.', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.caixaLivro) {
      const item: ItemPedido = {
        idCaixaLivro: this.caixaLivro.id,
        titulo: this.caixaLivro.nome,
        preco: this.caixaLivro.preco,
        quantidade: this.quantidade,
        subTotal: this.caixaLivro.preco * this.quantidade,
        imageUrl: this.caixaLivroService.getUrlImage(this.caixaLivro.nomeImagem)// Adiciona a URL da imagem

      };
      this.carrinhoService.adicionarAoCarrinho(item);
      alert(`${this.caixaLivro.nome} foi adicionado ao carrinho com quantidade ${this.quantidade}!`);
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



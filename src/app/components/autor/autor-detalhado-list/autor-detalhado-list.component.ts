import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

import { Livro } from '../../../models/livro.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { LivroService } from '../../../services/livro.service';
import { Autor } from '../../../models/autor.model';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { CaixaLivroService } from '../../../services/caixa-livro.service';

@Component({
  selector: 'app-autor-detalhado-list',
  standalone: true,
  imports: [CommonModule, MatCard, NgFor, NgIf, MatProgressSpinner, MatIcon, MatCardTitle, MatCardSubtitle, MatCardHeader],
  templateUrl: './autor-detalhado-list.component.html',
  styleUrls: ['./autor-detalhado-list.component.css']
})
export class AutorDetalhadoListComponent implements OnInit {
  autor: Autor | undefined;
  livros: Livro[] = [];
  caixaLivros: CaixaLivro[] = [];
  carregando = true;

  // Variáveis para controlar o carrossel
  livrosCarouselIndex = 0;
  caixaLivrosCarouselIndex = 0;
  livrosPerPage = 3;  // Defina quantos livros aparecem por vez

  constructor(
    private autorService: AutorService,
    private livroService: LivroService,
    private caixaLivroService: CaixaLivroService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const nomeAutor = this.route.snapshot.paramMap.get('nome');
    if (nomeAutor) {
      this.autorService.findByNome(nomeAutor).subscribe(
        (autor) => {
          this.autor = autor[0];
          this.carregarLivros();
          this.carregarCaixaLivros();
        },
        (error) => {
          console.error('Erro ao carregar o autor', error);
          this.carregando = false;
        }
      );
    }
  }

  carregarLivros(): void {
    if (this.autor) {
      this.livroService.findByAutor(this.autor.nome).subscribe(
        (livros) => {
          this.livros = livros;
          this.carregando = false;
        },
        (error) => {
          console.error('Erro ao carregar os livros do autor', error);
          this.carregando = false;
        }
      );
    }
  }

  carregarCaixaLivros(): void {
    if (this.autor) {
      this.caixaLivroService.findByAutor(this.autor.nome).subscribe(
        (caixaLivros) => {
          this.caixaLivros = caixaLivros;
          this.carregando = false;
        },
        (error) => {
          console.error('Erro ao carregar a Caixa de Livros do autor', error);
          this.carregando = false;
        }
      );
    }
  }

  get autorNome(): string {
    return this.autor ? this.autor.nome : 'Autor não encontrado';
  }

  get autorBiografia(): string {
    return this.autor ? this.autor.biografia : 'Biografia não disponível';
  }

  getAutorImageUrl(nomeImagem: string): string {
    return this.autorService.getUrlImage(nomeImagem);
  }

  getLivroImageUrl(nomeImagem: string): string {
    return this.livroService.getUrlImage(nomeImagem);
  }

  getCaixaLivroImageUrl(nomeImagem: string): string {
    return this.caixaLivroService.getUrlImage(nomeImagem);
  }

  moveCarouselLeft(carouselType: 'livros' | 'caixaLivros'): void {
    if (carouselType === 'livros') {
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.livrosCarouselIndex = (this.livrosCarouselIndex - 1 + this.livros.length) % this.livros.length;
    } else {
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.caixaLivrosCarouselIndex = (this.caixaLivrosCarouselIndex - 1 + this.caixaLivros.length) % this.caixaLivros.length;
    }
  }

  moveCarouselRight(carouselType: 'livros' | 'caixaLivros'): void {
    if (carouselType === 'livros') {
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.livrosCarouselIndex = (this.livrosCarouselIndex + 1) % this.livros.length;
    } else {
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.caixaLivrosCarouselIndex = (this.caixaLivrosCarouselIndex + 1) % this.caixaLivros.length;
    }
  }

  // Método para redirecionar para a página de detalhes
  verMaisLivro(titulo: string): void {
    this.router.navigate(['/livros', titulo]);  // Redireciona para a página de livro detalhado
  }

  verMaisCaixaLivro(nome: string): void {
    this.router.navigate(['/caixaLivros', nome]);  // Redireciona para a página de caixa de livro detalhado
  }

  formatarTitulo(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-'); // Substitui espaços por hífens
  }

  voltar(): void {
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { Livro } from '../../../models/livro.model';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { Autor } from '../../../models/autor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { LivroService } from '../../../services/livro.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { Cupom } from '../../../models/cupom.model';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [CommonModule, MatCard, NgFor, NgIf, MatProgressSpinner, MatIcon, MatCardTitle, MatCardSubtitle, MatCardHeader],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css'
})
export class PaginaInicialComponent implements OnInit{
  livros: Livro [] = [];
  caixaLivros: CaixaLivro [] = [];
  cupons: Cupom[] = [];
  autores: Autor [] = [];
  carregando = true;

  livrosCarouselIndex = 0;
  caixaLivrosCarouselIndex = 0;
  autoresCarouselIndex = 0;
  livrosPorPagina = 5;
  autoresPorPagina = 5;

  constructor(
    private livroService: LivroService,
    private caixaLivroService: CaixaLivroService,
    private autorService: AutorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
      this.carregarLivros();
      this.carregarCaixaLivros();
      this.carregarAutores();
  }

  carregarLivros(): void{
    this.livroService.findAll().subscribe(
      (livros: Livro[]) => {
        this.livros = livros;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao carregar os livros', error);
        this.carregando = false;
      }
    )
  }

  carregarCaixaLivros(): void{
    this.caixaLivroService.findAll().subscribe(
      (caixaLivros: CaixaLivro[]) => {
        this.caixaLivros = caixaLivros;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao carregar as caixas de livros', error);
        this.carregando = false;
      }
    )
  }

  carregarAutores(): void{
    this.autorService.findAll().subscribe(
      (autores: Autor[]) => {
        this.autores = autores;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao carregar os autores', error);
        this.carregando = false;
      }
    )
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

  moveCarouselLeft(carouselType: 'livros' | 'caixaLivros' | 'autores'): void {
    if (carouselType === 'livros') {
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.livrosCarouselIndex = (this.livrosCarouselIndex - 1 + this.livros.length) % this.livros.length;
    } else if(carouselType === 'caixaLivros'){
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.caixaLivrosCarouselIndex = (this.caixaLivrosCarouselIndex - 1 + this.caixaLivros.length) % this.caixaLivros.length;
    } else if (carouselType === 'autores'){
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.autoresCarouselIndex = (this.autoresCarouselIndex - 1 + this.autores.length) % this.autores.length;
    }
  }

  moveCarouselRight(carouselType: 'livros' | 'caixaLivros' | 'autores'): void {
    if (carouselType === 'livros') {
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.livrosCarouselIndex = (this.livrosCarouselIndex + 1) % this.livros.length;
    } else if(carouselType === 'caixaLivros'){
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.caixaLivrosCarouselIndex = (this.caixaLivrosCarouselIndex + 1) % this.caixaLivros.length;
    } else if(carouselType === 'autores'){
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.autoresCarouselIndex = (this.autoresCarouselIndex + 1) % this.autores.length;
    }
  }

  verMaisLivro(titulo: string): void {
    this.router.navigate(['/livros', titulo]);
  }

  verMaisLivrosAll(): void{
    this.router.navigate(['/livros']);
  }

  verMaisCaixaLivro(nome: string): void {
    this.router.navigate(['/caixaLivros', nome]);
  }

  verMaisCaixaLivrosAll(): void{
    this.router.navigate(['/caixaLivros']);
  }

  verMaisAutor(nome: string): void{
    this.router.navigate(['/autores', nome]);
  }

  formatarTitulo(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }
}

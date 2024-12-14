import { Component, OnInit } from '@angular/core';
import { Livro } from '../../../models/livro.model';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { Autor } from '../../../models/autor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { CupomService } from '../../../services/cupom.service';
import { LivroService } from '../../../services/livro.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  MatCard,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { Cupom } from '../../../models/cupom.model';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    NgFor,
    NgIf,
    MatProgressSpinner,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
  ],
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.css'],
})
export class PaginaInicialComponent implements OnInit {
  livros: Livro[] = [];
  caixaLivros: CaixaLivro[] = [];
  cupons: Cupom[] = [];
  autores: Autor[] = [];
  carregando = true;

  livrosCarouselIndex = 0;
  caixaLivrosCarouselIndex = 0;
  autoresCarouselIndex = 0;
  cuponsCarouselIndex = 0;
  cuponsPorPagina = 1;
  livrosPorPagina = 5;
  autoresPorPagina = 5;

  cuponsIntervalo: any;

  constructor(
    private livroService: LivroService,
    private caixaLivroService: CaixaLivroService,
    private autorService: AutorService,
    private cupomService: CupomService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
    this.carregarCaixaLivros();
    this.carregarAutores();
    this.carregarCupons();
  }

  carregarLivros(): void {
    this.livroService.findAll().subscribe(
      (livros: Livro[]) => {
        this.livros = livros;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao carregar os livros', error);
        this.carregando = false;
      }
    );
  }

  carregarCaixaLivros(): void {
    this.caixaLivroService.findAll().subscribe(
      (caixaLivros: CaixaLivro[]) => {
        this.caixaLivros = caixaLivros;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao carregar as caixas de livros', error);
        this.carregando = false;
      }
    );
  }

  carregarAutores(): void {
    this.autorService.findAll().subscribe(
      (autores: Autor[]) => {
        this.autores = autores;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao carregar os autores', error);
        this.carregando = false;
      }
    );
  }

  carregarCupons(): void {
  
    this.cupomService.findAll().subscribe(
      (cupons: Cupom[]) => {
        this.cupons = cupons;
  
        console.log('Cupons carregados:', this.cupons);
  
  
        // Só inicia o carrossel se houver cupons
          this.iniciarCarrosselCupons();
        
      },
      (error) => {
        console.error('Erro ao carregar os cupons:', error);
        this.carregando = false;
      }
    );
  }
  
  iniciarCarrosselCupons(): void {
    // Evita criar múltiplos intervalos
    if (this.cuponsIntervalo) {
      clearInterval(this.cuponsIntervalo);
    }
  
    this.cuponsIntervalo = setInterval(() => {
      this.moveCarrosselCupons();
    }, 3000);
  }
  
  moveCarrosselCupons(): void {
    if (this.cupons.length > 0) {
      this.cuponsCarouselIndex = (this.cuponsCarouselIndex + 1) % this.cupons.length;
    }
  }
  
  pararCarrosselCupons(): void {
    if (this.cuponsIntervalo) {
      clearInterval(this.cuponsIntervalo);
    }
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

  getCupomNome(nomeCupom: string): void {
    this.cupomService.findByNomeCupom(nomeCupom).subscribe(
      (cupons: Cupom[]) => {
        if (cupons.length > 0) {
          console.log(cupons[0].nomeCupom);
        } else {
          console.log('Cupom não encontrado.');
        }
      },
      (error) => {
        console.error('Erro ao buscar o nome do cupom:', error);
      }
    );
  }

  moveCarouselLeft(
    carouselType: 'livros' | 'caixaLivros' | 'autores' | 'cupons'
  ): void {
    if (carouselType === 'livros') {
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.livrosCarouselIndex =
        (this.livrosCarouselIndex - 1 + this.livros.length) %
        this.livros.length;
    } else if (carouselType === 'caixaLivros') {
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.caixaLivrosCarouselIndex =
        (this.caixaLivrosCarouselIndex - 1 + this.caixaLivros.length) %
        this.caixaLivros.length;
    } else if (carouselType === 'autores') {
      // Descer para o item anterior, e se for o primeiro, volta ao último
      this.autoresCarouselIndex =
        (this.autoresCarouselIndex - 1 + this.autores.length) %
        this.autores.length;
    } else if (this.cupons.length > 0) {
      this.cuponsCarouselIndex =
        (this.cuponsCarouselIndex - 1) % this.cupons.length;
    }
  }

  moveCarouselRight(
    carouselType: 'livros' | 'caixaLivros' | 'autores' | 'cupons'
  ): void {
    if (carouselType === 'livros') {
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.livrosCarouselIndex =
        (this.livrosCarouselIndex + 1) % this.livros.length;
    } else if (carouselType === 'caixaLivros') {
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.caixaLivrosCarouselIndex =
        (this.caixaLivrosCarouselIndex + 1) % this.caixaLivros.length;
    } else if (carouselType === 'autores') {
      // Subir para o próximo item, e se for o último, vai para o primeiro
      this.autoresCarouselIndex =
        (this.autoresCarouselIndex + 1) % this.autores.length;
    } else if (this.cupons.length > 0) {
      this.cuponsCarouselIndex =
        (this.cuponsCarouselIndex + 1) % this.cupons.length;
    }
  }

  verMaisLivro(titulo: string): void {
    this.router.navigate(['/livros', titulo]);
  }

  verMaisLivrosAll(): void {
    this.router.navigate(['/livros']);
  }

  verMaisCaixaLivro(nome: string): void {
    this.router.navigate(['/caixaLivros', nome]);
  }

  verMaisCaixaLivrosAll(): void {
    this.router.navigate(['/caixaLivros']);
  }

  verMaisAutor(nome: string): void {
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

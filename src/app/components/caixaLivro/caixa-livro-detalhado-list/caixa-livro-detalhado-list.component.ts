import { Component, OnInit } from '@angular/core';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CaixaLivroService } from '../../../services/caixa-livro.service';

@Component({
  selector: 'app-caixa-livro-detalhado-list',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle, MatCardSubtitle, NgFor, NgIf, MatProgressSpinner],
  templateUrl: './caixa-livro-detalhado-list.component.html',
  styleUrl: './caixa-livro-detalhado-list.component.css'
})
export class CaixaLivroDetalhadoListComponent implements OnInit {
  caixaLivro: CaixaLivro | undefined;
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    public caixaLivroService: CaixaLivroService,
  ){}

  ngOnInit(): void {
    const idCaixaLivro = this.route.snapshot.paramMap.get('id');
    if (idCaixaLivro) {
      this.caixaLivroService.findById(idCaixaLivro).subscribe(
        (caixaLivro) => {
          setTimeout(() => {
            this.caixaLivro = caixaLivro;
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

}



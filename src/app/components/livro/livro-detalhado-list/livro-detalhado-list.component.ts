import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivroService } from '../../../services/livro.service';
import { Livro } from '../../../models/livro.model';
import { NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-livro-detalhado-list',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle, MatCardSubtitle, NgFor, NgIf],
  templateUrl: './livro-detalhado-list.component.html',
  styleUrls: ['./livro-detalhado-list.component.css']
})
export class LivroDetalhadoListComponent implements OnInit {
  livro: Livro | undefined;

  constructor(
    private route: ActivatedRoute,
    public livroService: LivroService
  ) {}

  ngOnInit(): void {
    const idLivro = this.route.snapshot.paramMap.get('id');
    if (idLivro) {
      this.livroService.findById(idLivro).subscribe(
        (livro) => {
          console.log(livro);
          this.livro = livro;
        },
        (error) => {
          console.error('Erro ao carregar o livro', error);
        }
      );
    }
  }

  get autoresString(): string {
    return this.livro ? this.livro.autores.map(autor => autor.nome).join(', ') : '';
  }

  get generosString(): string {
    return this.livro ? this.livro.generos.map(genero => genero.nome).join(', ') : '';
  }

}

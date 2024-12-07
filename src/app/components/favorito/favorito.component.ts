import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LivroService } from '../../services/livro.service';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

type Card = {
  id: number;
  titulo: string;
  descricao: string;
  autores: string;
  generos: string;
  preco: number;
  imageUrl: string;
}

@Component({
  selector: 'app-favorito',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './favorito.component.html',
  styleUrl: './favorito.component.css',
})
export class FavoritoComponent implements OnInit {
  favoritos: Card[] = [];

  constructor(private clienteService: ClienteService, private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    this.carregarFavoritos();
  }

  carregarFavoritos(): void {
    this.clienteService.getLivrosListaFavoritos().subscribe(
      (favoritos) => {
        this.favoritos = favoritos.map((livro) => ({
          id: livro.id,
          titulo: livro.titulo,
          descricao: livro.descricao,
          autores: livro.autores.map((autor) => autor.nome).join(', '),
          generos: livro.generos.map((genero) => genero.nome).join(', '),
          preco: livro.preco,
          imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
        }));
      },
      (error) => {
        console.error('Erro ao carregar favoritos:', error);
      }
    );
  }

  removerFavorito(id: number): void {
    this.clienteService.removendoLivroFavorito(id).subscribe(
      () => {
        this.carregarFavoritos();
      },
      (error) => {
        console.error('Erro ao remover favorito:', error);
      }
    );
  }

  verMais(titulo: string): void {
    this.router.navigate(['/livro', titulo]);
  }
}
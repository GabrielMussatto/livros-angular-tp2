import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './genero-list.component.html',
  styleUrl: './genero-list.component.css'
})
export class GeneroListComponent implements OnInit {
  generos: Genero[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acao'];

  constructor(private generoService: GeneroService) {

  }

  ngOnInit(): void {
    this.generoService.findAll().subscribe(
      data => { this.generos = data }
    );
  }

  excluir(genero: Genero): void {
    this.generoService.delete(genero).subscribe({
      next: () => {
        this.generos = this.generos.filter(e => e.id !== genero.id);
      },
      error: (err) => {
        console.error("Erro ao tentar excluir o genero", err);
      }

    });
  }
}
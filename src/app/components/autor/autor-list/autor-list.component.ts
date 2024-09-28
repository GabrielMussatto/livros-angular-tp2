import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './autor-list.component.html',
  styleUrl: './autor-list.component.css'
})
export class AutorListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'nome', 'biografia', 'acao'];
  autores: Autor[] = [];

  constructor(private autorService: AutorService) { 

  }

  ngOnInit(): void {
      this.autorService.findAll().subscribe(
        data => {this.autores = data}
      );
  }

  excluir(autor: Autor): void{
    if(confirm("Deseja realmente excluir este Autor? Não será possivel reverter.")){
      this.autorService.delete(autor).subscribe({
        next: () => {
          this.autores = this.autores.filter(e => e.id != autor.id);
        },
        error: (err) => {
          console.error('Erro ao tentar excluir o Autor', err);
        }
      });
    }
  }

}

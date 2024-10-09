import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importar o componente de diálogo

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './genero-list.component.html',
  styleUrls: ['./genero-list.component.css']
})
export class GeneroListComponent implements OnInit {
  generos: Genero[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acao'];

  constructor(
    private generoService: GeneroService,
    private dialog: MatDialog // Injeção do MatDialog
  ) { }

  ngOnInit(): void {
    this.generoService.findAll().subscribe(
      data => { this.generos = data; }
    );
  }

  excluir(genero: Genero): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir este Gênero? Não será possível reverter.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.generoService.delete(genero).subscribe({
          next: () => {
            this.generos = this.generos.filter(e => e.id !== genero.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o gênero', err);
          }
        });
      }
    });
  }
}

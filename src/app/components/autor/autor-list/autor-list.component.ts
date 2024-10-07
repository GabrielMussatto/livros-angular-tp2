import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importar o componente de dialogo

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './autor-list.component.html',
  styleUrls: ['./autor-list.component.css']
})
export class AutorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'biografia', 'acao'];
  autores: Autor[] = [];

  constructor(
    private autorService: AutorService, 
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.autorService.findAll().subscribe(
      data => { this.autores = data; }
    );
  }

  excluir(autor: Autor): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir este Autor? Não será possível reverter.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.autorService.delete(autor).subscribe({
          next: () => {
            this.autores = this.autores.filter(e => e.id !== autor.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o Autor', err);
          }
        });
      }
    });
  }
}

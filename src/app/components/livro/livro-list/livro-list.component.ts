import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../services/livro.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatDatepickerModule],
  templateUrl: './livro-list.component.html',
  styleUrl: './livro-list.component.css'
})
export class LivroListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'titulo', 'descricao', 'quantidadeEstoque', 'isbn', 'preco', 'fornecedor', 'editora', 'genero', 'autor', 'classificacao', 'datalancamento', 'acao'];
  livros: Livro[] = [];

  constructor(
    private livroService: LivroService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.livroService.findAll().subscribe(
      data => { this.livros = data; }
    );
  }

  excluir(livro: Livro): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir este Livro? Não será possivel reverter.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.livroService.delete(livro).subscribe({
          next: () => {
            this.livros = this.livros.filter(e => e.id !== livro.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o Livro', err);
          }
        });
      }
    });
  }

}

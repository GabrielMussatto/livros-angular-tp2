import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importar o componente de dialogo
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-caixa-livro-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule],
  templateUrl: './caixa-livro-list.component.html',
  styleUrls: ['./caixa-livro-list.component.css']
})
export class CaixaLivroListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'quantidadeEstoque', 'preco', 'fornecedor', 'editora', 'genero', 'autor', 'classificacao', 'acao'];
  caixaLivros: CaixaLivro[] = [];

  constructor(
    private caixaLivroService: CaixaLivroService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.caixaLivroService.findAll().subscribe(
      data => { this.caixaLivros = data; }
    );
  }

  excluir(caixaLivro: CaixaLivro): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir esta Caixa de Livro? Não será possível reverter.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.caixaLivroService.delete(caixaLivro).subscribe({
          next: () => {
            this.caixaLivros = this.caixaLivros.filter(e => e.id !== caixaLivro.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir a Caixa de Livros', err);
          }
        });
      }
    });
  }
}

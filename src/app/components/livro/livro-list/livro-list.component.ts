import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../services/livro.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatDatepickerModule, MatMenuModule, MatPaginatorModule],
  templateUrl: './livro-list.component.html',
  styleUrl: './livro-list.component.css'
})
export class LivroListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'titulo', 'descricao', 'quantidadeEstoque', 'isbn', 'preco', 'fornecedor', 'editora', 'genero', 'autor', 'classificacao', 'datalancamento', 'acao'];
  livros: Livro[] = [];

  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(
    private livroService: LivroService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.livroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.livros = data }
    );

    this.livroService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
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

  editora() {
    this.router.navigateByUrl('/editoras');
  }
  autor() {
    this.router.navigateByUrl('/autores');
  }
  caixaLivros() {
    this.router.navigateByUrl('/caixaLivros');
  }
  livro() {
    this.router.navigateByUrl('/livros');
  }
  genero() {
    this.router.navigateByUrl('/generos');
  }
  fornecedor() {
    this.router.navigateByUrl('/fornecedores');
  }
  voltar() {
    this.router.navigateByUrl('/livros');
  }
}

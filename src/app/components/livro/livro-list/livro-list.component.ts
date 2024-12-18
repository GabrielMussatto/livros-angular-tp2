import { CommonModule, NgFor, NgIf } from '@angular/common';
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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { IsbnPipe } from '../../pipe/isbn.pipe';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [CommonModule, IsbnPipe, NgIf, NgFor, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatDatepickerModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSelectModule],
  templateUrl: './livro-list.component.html',
  styleUrl: './livro-list.component.css'
})
export class LivroListComponent implements OnInit {
  displayedColumns: string[] = ['linha', 'id', 'titulo', 'descricao', 'quantidadeEstoque', 'isbn', 'preco', 'fornecedor', 'editora', 'genero', 'autor', 'classificacao', 'datalancamento', 'acao'];
  livros: Livro[] = [];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "titulo";

  constructor(
    private livroService: LivroService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.livroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.livros = data }
    );

    this.livroService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.buscarLivros();
    this.buscarTodos();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  buscarLivros() {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.livroService.findByAutor(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.livros = data;
            if (this.livros.length === 0) {
              this.snackBar.open('O Autor pesquisado não foi encontrado. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          }
        );
      } else if (this.tipoFiltro === 'genero') {
        this.livroService.findByGenero(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.livros = data;
            if (this.livros.length === 0) {
              this.snackBar.open('O Gênero pesquisado não foi encontrado. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          }
        );
      } else if (this.tipoFiltro === 'titulo') {
        this.livroService.findByTitulo(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.livros = data;
            if (this.livros.length === 0) {
              this.snackBar.open('O Livro pesquisado não foi encontrado. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          }
        );
      } else {
        this.livroService.findAll(this.page, this.pageSize).subscribe(
          data => { this.livros = data; }
        );
      }
    }
  }

  buscarTodos() {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.livroService.countByAutor(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else if (this.tipoFiltro === 'titulo') {
        this.livroService.countByTitulo(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else if (this.tipoFiltro === 'genero') {
        this.livroService.countByGenero(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      }
    } else {
      this.livroService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar() {
    this.buscarLivros();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar', { duration: 3000 });
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
            this.snackBar.open('O Livro foi excluido com sucesso!!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o Livro', err);
            this.snackBar.open('Erro ao tentar excluir o Livro', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  editora() {
    this.router.navigateByUrl('/admin/editoras');
  }
  autor() {
    this.router.navigateByUrl('/admin/autores');
  }
  caixaLivros() {
    this.router.navigateByUrl('/admin/caixaLivros');
  }
  livro() {
    this.router.navigateByUrl('/admin/livros');
  }
  genero() {
    this.router.navigateByUrl('/admin/generos');
  }
  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores');
  }
  cupom() {
    this.router.navigateByUrl('/admin/cupons');
  }
  voltar() {
    this.router.navigateByUrl('/admin/livros');
  }
}

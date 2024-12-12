import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-caixa-livro-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, MatToolbarModule, MatSelectModule, MatSidenavModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './caixa-livro-list.component.html',
  styleUrls: ['./caixa-livro-list.component.css']
})
export class CaixaLivroListComponent implements OnInit {
  displayedColumns: string[] = ['linha', 'id', 'nome', 'descricao', 'quantidadeEmEstoque', 'preco', 'fornecedor', 'editora', 'genero', 'autor', 'classificacao', 'acao'];
  caixaLivros: CaixaLivro[] = [];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "nome";

  constructor(
    private caixaLivroService: CaixaLivroService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.caixaLivroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.caixaLivros = data }
    );

    this.caixaLivroService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.buscarCaixaLivro();
    this.buscarTodos();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  buscarCaixaLivro() {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.caixaLivroService.findByAutor(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.caixaLivros = data;
            if (this.caixaLivros.length === 0) {
              this.snackBar.open('O Autor pesquisado não foi encontrado. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          }
        );
      } else if (this.tipoFiltro === 'genero') {
        this.caixaLivroService.findByGenero(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.caixaLivros = data;
            if (this.caixaLivros.length === 0) {
              this.snackBar.open('O Gênero pesquisado não foi encontrado. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          }
        );
      } else if (this.tipoFiltro === 'nome') {
        this.caixaLivroService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
          data => {
            this.caixaLivros = data;
            if (this.caixaLivros.length === 0) {
              this.snackBar.open('A Caixa de Livro pesquisada não foi encontrada. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          }
        );
      } else {
        this.caixaLivroService.findAll(this.page, this.pageSize).subscribe(
          data => { this.caixaLivros = data; }
        );
      }
    }
  }

  buscarTodos() {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.caixaLivroService.countByAutor(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else if (this.tipoFiltro === 'nome') {
        this.caixaLivroService.countByNome(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else if (this.tipoFiltro === 'genero') {
        this.caixaLivroService.countByGenero(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      }
    } else {
      this.caixaLivroService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(){
    this.buscarCaixaLivro();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar',  {duration: 3000});
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
            this.snackBar.open('A Caixa de Livro foi excluída com Sucesso!!', 'Fechar', {duration: 3000});
          },
          error: (err) => {
            console.error('Erro ao tentar excluir a Caixa de caixaLivros', err);
            this.snackBar.open('Erro ao tentar excluir a Caixa de Livro', 'Fechar', {duration: 3000});
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
  caixaLivro() {
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
    this.router.navigateByUrl('/admin/caixaLivros');
  }
}
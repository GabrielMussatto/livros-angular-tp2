import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
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

@Component({
  selector: 'app-caixa-livro-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule],
  templateUrl: './caixa-livro-list.component.html',
  styleUrls: ['./caixa-livro-list.component.css']
})
export class CaixaLivroListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'quantidadeEstoque', 'preco', 'fornecedor', 'editora', 'genero', 'autor', 'classificacao', 'acao'];
  caixaLivros: CaixaLivro[] = [];

  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(
    private caixaLivroService: CaixaLivroService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.caixaLivroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.caixaLivros = data }
    );

    this.caixaLivroService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
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

  editora() {
    this.router.navigateByUrl('/editoras');
  }
  autor() {
    this.router.navigateByUrl('/autores');
  }
  caixaLivro() {
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
    this.router.navigateByUrl('/caixaLivros');
  }
}

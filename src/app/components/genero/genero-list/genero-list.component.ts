import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSidenavModule],
  templateUrl: './genero-list.component.html',
  styleUrls: ['./genero-list.component.css']
})
export class GeneroListComponent implements OnInit {
  generos: Genero[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acao'];

  totalRecords = 0;
  pageSize = 5;
  page = 0;
  filtro: string = "";

  constructor(
    private generoService: GeneroService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.generoService.findAll(this.page, this.pageSize).subscribe(
      data => { this.generos = data }
    );

    this.generoService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  buscarGeneros(){
    if(this.filtro){
      this.generoService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
        data => { this.generos = data; }
      );
    } else {
      this.generoService.findAll(this.page, this.pageSize).subscribe(
        data => { this.generos = data;}
      );
    }
  }

  buscarTodos(){
    if(this.filtro){
      this.generoService.countBynome(this.filtro).subscribe(
        data => { this.totalRecords = data; }
      );
    } else {
      this.generoService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(){
    this.buscarGeneros();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar',  {duration: 3000});
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
            this.snackBar.open('O Gênero foi excluído com sucesso!!', 'Fechar', {duration: 3000});
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o gênero', err);
            this.snackBar.open('Erro ao tentar excluir o gênero', 'Fechar', {duration: 3000});
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
    this.router.navigateByUrl('/generos');
  }
}

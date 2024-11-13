import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';
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

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatSidenavModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './autor-list.component.html',
  styleUrls: ['./autor-list.component.css']
})
export class AutorListComponent implements OnInit {
  displayedColumns: string[] = ['linha', 'id', 'nome', 'biografia', 'acao'];
  autores: Autor[] = [];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(
    private autorService: AutorService, 
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.autorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.autores = data }
    );

    this.autorService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }
  
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  buscarAutores(){
    if(this.filtro){
      this.autorService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
        data => { this.autores = data; }
      );
    } else {
      this.autorService.findAll(this.page, this.pageSize).subscribe(
        data => { this.autores = data;}
      );
    }
  }

  buscarTodos(){
    if(this.filtro){
      this.autorService.countBynome(this.filtro).subscribe(
        data => { this.totalRecords = data; }
      );
    } else {
      this.autorService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(){
    this.buscarAutores();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar',  {duration: 3000});
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
            this.snackBar.open('O Autor foi excluído com Sucesso!!', 'Fechar', {duration: 3000});
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o Autor', err);
            this.snackBar.open('Erro ao tentar excluir o Autor', 'Fechar', {duration: 3000});
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
  voltar() {
    this.router.navigateByUrl('/admin/autores');
  }
}

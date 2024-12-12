import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [NgFor,MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule,  MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  displayedColumns: string[] = ['linha', 'id', 'nome', 'cnpj', 'email', 'endereco', 'telefone', 'acao'];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(
    private fornecedorService: FornecedorService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.fornecedores = data }
    );

    this.fornecedorService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  buscarFornecedores(){
    if(this.filtro){
      this.fornecedorService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
        data => { this.fornecedores = data; }
      );
    } else {
      this.fornecedorService.findAll(this.page, this.pageSize).subscribe(
        data => { this.fornecedores = data;}
      );
    }
  }

  buscarTodos(){
    if(this.filtro){
      this.fornecedorService.countBynome(this.filtro).subscribe(
        data => { this.totalRecords = data; }
      );
    } else {
      this.fornecedorService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(){
    this.buscarFornecedores();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar',  {duration: 3000});
  }

  excluir(fornecedor: Fornecedor): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Deseja realmente excluir este Fornecedor? Não será possível reverter.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedor.id);
            this.snackBar.open('O Fornecedor foi excluído com sucesso!', 'Fechar', {duration:3000});
          },
          error: (err) => {
            console.error("Erro ao tentar excluir o fornecedor", err);
            this.snackBar.open('Erro ao tentar excluir o fornecedor', 'Fechar', {duration:3000});
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
    this.router.navigateByUrl('/admin/fornecedores');
  }
}

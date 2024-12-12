import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../services/editora.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-editora-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatSidenavModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './editora-list.component.html',
  styleUrls: ['./editora-list.component.css']
})
export class EditoraListComponent implements OnInit {
  editoras: Editora[] = [];
  displayedColumns: string[] = ['linha', 'id', 'nome', 'email', 'endereco', 'telefone', 'acao'];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(
    private editoraService: EditoraService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) { } 

  ngOnInit(): void {
    this.editoraService.findAll(this.page, this.pageSize).subscribe(
      data => { this.editoras = data }
    );

    this.editoraService.count().subscribe(
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

  buscarEditoras(){
    if(this.filtro){
      this.editoraService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
        data => { this.editoras = data; }
      );
    } else {
      this.editoraService.findAll(this.page, this.pageSize).subscribe(
        data => { this.editoras = data;}
      );
    }
  }

  buscarTodos(){
    if(this.filtro){
      this.editoraService.countBynome(this.filtro).subscribe(
        data => { this.totalRecords = data; }
      );
    } else {
      this.editoraService.count().subscribe(
        data => { this.totalRecords = data; }
      );
    }
  }

  filtrar(){
    this.buscarEditoras();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar',  {duration: 3000});
  }

  excluir(editora: Editora): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Deseja realmente excluir esta editora?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editoraService.delete(editora).subscribe({
          next: () => {
            this.editoras = this.editoras.filter(e => e.id !== editora.id);
            this.snackBar.open('A Editora foi excluída com sucesso!!', 'Fechar', {duration: 3000});
          },
          error: (err) => {
            console.error("Erro ao tentar excluir a editora", err);
            this.snackBar.open('Erro ao tentar excluir a Editora', 'Fechar', {duration: 3000});
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
    this.router.navigateByUrl('/admin/editoras');
  }
}

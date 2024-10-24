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

@Component({
  selector: 'app-editora-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule],
  templateUrl: './editora-list.component.html',
  styleUrls: ['./editora-list.component.css']
})
export class EditoraListComponent implements OnInit {
  editoras: Editora[] = [];
  displayedColumns: string[] = ['id', 'nome', 'email', 'endereco', 'telefone', 'acao'];

  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(
    private editoraService: EditoraService, 
    private dialog: MatDialog,
    private router: Router) { } 

  ngOnInit(): void {
    this.editoraService.findAll(this.page, this.pageSize).subscribe(
      data => { this.editoras = data }
    );

    this.editoraService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
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
          },
          error: (err) => {
            console.error("Erro ao tentar excluir a editora", err);
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
    this.router.navigateByUrl('/editoras');
  }
}

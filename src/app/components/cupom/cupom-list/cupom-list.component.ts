import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CupomService } from '../../../services/cupom.service';
import { Cupom } from '../../../models/cupom.model';

@Component({
  selector: 'app-cupom-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSidenavModule],
  templateUrl: './cupom-list.component.html',
  styleUrl: './cupom-list.component.css'
})
export class CupomListComponent implements OnInit{

  cupons: Cupom[] = [];
    displayedColumns: string[] = ['linha', 'id', 'nomeCupom', 'desconto', 'acao'];
  
    totalRecords = 0;
    pageSize = 10;
    page = 0;
    filtro: string = "";
  
    constructor(
      private cupomService: CupomService,
      private dialog: MatDialog,
      private router: Router,
      private snackBar: MatSnackBar
    ) { }
  
    ngOnInit(): void {
      this.cupomService.findAll(this.page, this.pageSize).subscribe(
        data => { this.cupons = data }
      );
  
      this.cupomService.count().subscribe(
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
  
    buscarCupons(){
      if(this.filtro){
        this.cupomService.findByNomeCupom(this.filtro, this.page, this.pageSize).subscribe(
          data => { this.cupons = data; }
        );
      } else {
        this.cupomService.findAll(this.page, this.pageSize).subscribe(
          data => { this.cupons = data;}
        );
      }
    }
  
    buscarTodos(){
      if(this.filtro){
        this.cupomService.countBynome(this.filtro).subscribe(
          data => { this.totalRecords = data; }
        );
      } else {
        this.cupomService.count().subscribe(
          data => { this.totalRecords = data; }
        );
      }
    }
  
    filtrar(){
      this.buscarCupons();
      this.buscarTodos();
      this.snackBar.open('O filtro foi aplicado com Sucesso!!', 'Fechar',  {duration: 3000});
    }
  
    excluir(cupom: Cupom): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: {
          message: 'Deseja realmente excluir este Gênero? Não será possível reverter.'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.cupomService.delete(cupom).subscribe({
            next: () => {
              this.cupons = this.cupons.filter(e => e.id !== cupom.id);
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
      this.router.navigateByUrl('/admin/cupons');
    }

}

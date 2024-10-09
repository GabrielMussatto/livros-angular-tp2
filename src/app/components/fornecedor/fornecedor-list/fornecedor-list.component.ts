import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../../models/fornecedor.model';  // Atualizado para usar o modelo de Fornecedor
import { FornecedorService } from '../../../services/fornecedor.service';  // Atualizado para usar o serviço de Fornecedor
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importa o componente de diálogo de confirmação

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit {
  fornecedores: Fornecedor[] = [];  // Atualizado para usar Fornecedor
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'email', 'endereco', 'telefone', 'acao'];  // Atualizado para incluir CNPJ

  constructor(
    private fornecedorService: FornecedorService,
    private dialog: MatDialog // Injeta o MatDialog
  ) {}

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(
      data => { this.fornecedores = data; }  // Atualizado para atribuir os dados ao array de fornecedores
    );
  }

  excluir(fornecedor: Fornecedor): void {  // Atualizado para usar Fornecedor
    // Abre o diálogo de confirmação
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Deseja realmente excluir este Fornecedor? Não será possível reverter.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedor.id);  // Atualizado para remover o fornecedor da lista
          },
          error: (err) => {
            console.error("Erro ao tentar excluir o fornecedor", err);  // Atualizado para mensagem de erro de fornecedor
          }
        });
      }
    });
  }
}

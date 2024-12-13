import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [NgFor,MatSidenavModule, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule,  MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  displayedColumns: string[] = [
    'linha', 'id', 'nome', 'username', 'dataNascimento', 'email', 'cpf', 'telefone', 
    'sexo', 'cep', 'endereco', 'estado', 'cidade', 'acao'
  ];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  // Carregar os clientes com paginação e total
  carregarClientes(): void {
    this.buscarClientes();
    this.buscarTotalClientes();
  }

  // Buscar clientes com base na paginação e filtro
  buscarClientes(): void {
    if (this.filtro) {
      this.clienteService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
        (data) => {
          this.clientes = data.map(cliente => ({
            ...cliente,
            usuario: cliente.usuario || { nome: '', username: '', dataNascimento: null, email: '', cpf: '', telefone: [], idSexo: { id: 0, nome: '' } }
          }));
        },
        (error) => {
          console.error('Erro ao buscar clientes:', error);
          this.snackBar.open('Erro ao buscar clientes', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.clienteService.findAll(this.page, this.pageSize).subscribe(
        (data) => {
          this.clientes = data;
        },
        (error) => {
          console.error('Erro ao buscar clientes:', error);
          this.snackBar.open('Erro ao buscar clientes', 'Fechar', { duration: 3000 });
        }
      );
    }
  }

  // Buscar o total de clientes (para a paginação)
  buscarTotalClientes(): void {
    if (this.filtro) {
      this.clienteService.countByNome(this.filtro).subscribe(
        (data) => {
          this.totalRecords = data; // Total de clientes com filtro
        },
        (error) => {
          console.error('Erro ao buscar o total de clientes:', error);
          this.snackBar.open('Erro ao buscar o total de clientes', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.clienteService.count().subscribe(
        (data) => {
          this.totalRecords = data; // Total de clientes sem filtro
        },
        (error) => {
          console.error('Erro ao buscar o total de clientes:', error);
          this.snackBar.open('Erro ao buscar o total de clientes', 'Fechar', { duration: 3000 });
        }
      );
    }
  }

  // Método para paginar
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarClientes();
  }

  // Aplicar filtro
  filtrar(): void {
    this.page = 0; // Reinicia a página ao aplicar filtro
    this.carregarClientes();
    this.snackBar.open('O filtro foi aplicado com sucesso!', 'Fechar', { duration: 3000 });
  }

  // Excluir cliente
  excluir(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Deseja realmente excluir este cliente? Não será possível reverter.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.delete(cliente).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(c => c.id !== cliente.id);
            this.totalRecords--;
            this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o cliente:', err);
            this.snackBar.open('Erro ao tentar excluir o cliente', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}

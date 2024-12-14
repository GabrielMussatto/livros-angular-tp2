import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../../../services/funcionario.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { CpfPipe } from '../../pipe/cpf.pipe';
import { TelefonePipe } from '../../pipe/telefone.pipe';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [NgFor, CpfPipe, TelefonePipe, MatSidenavModule, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css'
})
export class FuncionarioListComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  displayedColumns: string[] = [
    'linha', 'id', 'nome', 'username', 'dataNascimento', 'email', 'cpf', 'telefone',
    'sexo', 'cargo', 'salario'
  ];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(
    private funcionarioService: FuncionarioService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  carregarFuncionarios(): void {
    this.buscarFuncionarios();
    this.buscarTotalFuncionarios();
  }

  buscarFuncionarios(): void {
    if (this.filtro) {
      this.funcionarioService.findByNome(this.filtro, this.page, this.pageSize).subscribe(
        (data) => {
          this.funcionarios = data.map(funcionario => ({
            ...funcionario,
            usuario: funcionario.usuario || { nome: '', username: '', dataNascimento: null, email: '', cpf: '', telefone: [], idSexo: { id: 0, nome: '' } }
          }));
        },
        (error) => {
          console.error('Erro ao buscar Funcionarios:', error);
          this.snackBar.open('Erro ao buscar Funcionarios', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.funcionarioService.findAll(this.page, this.pageSize).subscribe(
        (data) => {
          this.funcionarios = data;
        },
        (error) => {
          console.error('Erro ao buscar Funcionarios:', error);
          this.snackBar.open('Erro ao buscar Funcionarios', 'Fechar', { duration: 3000 });
        }
      );
    }
  }

  buscarTotalFuncionarios(): void {
    if (this.filtro) {
      this.funcionarioService.countByNome(this.filtro).subscribe(
        (data) => {
          this.totalRecords = data;
        },
        (error) => {
          console.error('Erro ao buscar o total de funcionarios:', error);
          this.snackBar.open('Erro ao buscar o total de funcionarios', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.funcionarioService.count().subscribe(
        (data) => {
          this.totalRecords = data;
        },
        (error) => {
          console.error('Erro ao buscar o total de funcionarios:', error);
          this.snackBar.open('Erro ao buscar o total de funcionarios', 'Fechar', { duration: 3000 });
        }
      );
    }
  }

  // Método para paginar
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarFuncionarios();
  }

  // Aplicar filtro
  filtrar(): void {
    this.page = 0; // Reinicia a página ao aplicar filtro
    this.carregarFuncionarios();
    this.snackBar.open('O filtro foi aplicado com sucesso!', 'Fechar', { duration: 3000 });
  }
}

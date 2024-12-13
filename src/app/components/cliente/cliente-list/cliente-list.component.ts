import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [NgFor, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule,  MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit{
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['linha', 'id', 'nome', 'username', 'dataNascimento', 'email', 'cpf', 'telefone', 'sexo', 'cep', 'endereco', 'estado', 'cidade', 'acao'];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      
  }
}

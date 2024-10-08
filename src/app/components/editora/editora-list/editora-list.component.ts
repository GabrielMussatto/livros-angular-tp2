import { Component, OnInit } from '@angular/core';
import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../services/editora.service';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importa o componente de confirmação

@Component({
  selector: 'app-editora-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './editora-list.component.html',
  styleUrls: ['./editora-list.component.css']
})
export class EditoraListComponent implements OnInit {
  editoras: Editora[] = [];
  displayedColumns: string[] = ['id', 'nome', 'email', 'endereco', 'telefone', 'acao'];

  constructor(private editoraService: EditoraService, private dialog: MatDialog) {} // Injeta MatDialog

  ngOnInit(): void {
    this.editoraService.findAll().subscribe(
      data => { this.editoras = data; }
    );
  }

  excluir(editora: Editora): void {
    // Abre o diálogo de confirmação
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Deseja realmente excluir esta editora?' }
    });

    // Processa a resposta do diálogo
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
}

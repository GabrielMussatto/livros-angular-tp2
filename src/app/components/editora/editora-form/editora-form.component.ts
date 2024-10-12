import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EditoraService } from '../../../services/editora.service';
import { Editora } from '../../../models/editora.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './editora-form.component.html',
  styleUrl: './editora-form.component.css'
})
export class EditoraFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {

    const editora: Editora = this.activatedRoute.snapshot.data['editora'];

    this.formGroup = this.formBuilder.group({
      id: [(editora && editora.id) ? editora.id : null],
      nome: [(editora && editora.nome) ? editora.nome : '', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: [(editora && editora.email) ? editora.email : '', Validators.compose([Validators.required, Validators.email])],
      endereco: [(editora && editora.endereco) ? editora.endereco : '', Validators.required],
      estado: [(editora && editora.estado) ? editora.estado : '', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(editora && editora.telefone && editora.telefone.codigoArea) ? editora.telefone.codigoArea : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(editora && editora.telefone && editora.telefone.numero) ? editora.telefone.numero : '', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])]
      })
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id == null) {
        this.editoraService.insert(editora).subscribe({
          next: (editoraCadastrada) => {
            this.router.navigateByUrl('/editoras');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar' + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.editoraService.update(editora).subscribe({
          next: (editoraAlterada) => {
            this.router.navigateByUrl('/editoras');
          },
          error: (err) => {
            console.log('Erro ao alterar' + JSON.stringify(err));
          }
        });
      }
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir esta editora? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.editoraService.delete(editora).subscribe({
              next: () => {
                this.router.navigateByUrl('/editoras');
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
              }
            });
          }
        });
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }

    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessage[controlName] && this.errorMessage[controlName][errorName]) {
        return this.errorMessage[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      minlength: 'O nome deve ter no mínimo 3 caracteres',
    },
    email: {
      required: 'O e-mail deve ser informado',
      email: 'O e-mail deve ser válido'
    },
    endereco: {
      required: 'O endereço deve ser informado',
    },
    estado: {
      required: 'O estado deve ser informado',
    },
    'telefone.codigoArea': {
      required: 'O código de área deve ser informado',
      minlength: 'O código de área deve ter no mínimo 2 caracteres',
      maxlength: 'O código de área deve ter no máximo 3 caracteres'
    },
    'telefone.numero': {
      required: 'O número de telefone deve ser informado',
      minlength: 'O número de telefone deve ter no mínimo 8 caracteres',
    }
  };

  editora() {
    this.router.navigateByUrl('/editoras/new');
  }
  autor() {
    this.router.navigateByUrl('/autores/new');
  }
  caixaLivros() {
    this.router.navigateByUrl('/caixaLivros/new');
  }
  livro() {
    this.router.navigateByUrl('/livros/new');
  }
  genero() {
    this.router.navigateByUrl('/generos/new');
  }
  fornecedor() {
    this.router.navigateByUrl('/fornecedores/new');
  }
  voltar() {
    this.router.navigateByUrl('/editoras');
  }
}

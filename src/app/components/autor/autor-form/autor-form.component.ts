import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './autor-form.component.html',
  styleUrls: ['./autor-form.component.css']
})
export class AutorFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    const autor: Autor = this.activatedRoute.snapshot.data['autor'];
    console.log(autor);
    
    this.formGroup = formBuilder.group({
      id: [(autor && autor.id) ? autor.id : null],
      nome: [(autor && autor.nome) ? autor.nome : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      biografia: [(autor && autor.biografia) ? autor.biografia : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10000)])]
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;
      if (autor.id == null) {
        this.autorService.insert(autor).subscribe({
          next: (autorCadastrado) => {
            this.router.navigateByUrl('/autores');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar', + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.autorService.update(autor).subscribe({
          next: (autorAlterado) => {
            this.router.navigateByUrl('/autores');
          },
          error: (err) => {
            console.log('Erro ao salvar', + JSON.stringify(err));
          }
        });
      }
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;
      if (autor.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este Autor? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.autorService.delete(autor).subscribe({
              next: () => {
                this.router.navigateByUrl('/autores');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
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
    biografia: {
      required: 'A biografia deve ser informado',
      minlength: 'A biografia deve ter no mínimo 2 caracteres',
      maxlength: 'A biografia deve ter no máximo 10000 caracteres'
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
    this.router.navigateByUrl('/autores');
  }
}

import { Component, OnInit } from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './autor-form.component.html',
  styleUrls: ['./autor-form.component.css']
})
export class AutorFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      biografia: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10000)])]
    });
  }

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void {
    const autor: Autor = this.activatedRoute.snapshot.data['autor'];
    
    this.formGroup = this.formBuilder.group({
      id: [(autor && autor.id) ? autor.id : null],
      nome: [(autor && autor.nome) ? autor.nome : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      biografia: [(autor && autor.biografia) ? autor.biografia : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10000)])]
    });
  }

  tratarErros(errorResponse: HttpErrorResponse){
    if(errorResponse.status === 400){
      if(errorResponse.error?.errors){
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if(formControl){
            formControl.setErrors({apiError: validationError.message})
          }
        });
      }
    } else if (errorResponse.status < 400){
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro do servidor.');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;
      const operacao = autor.id == null 
      ? this.autorService.insert(autor) 
      : this.autorService.update(autor);

      operacao.subscribe({
        next: () => {
          this.snackBar.open('O Autor foi salvo com Sucesso!!', 'Fechar', {duration: 3000});
          this.router.navigateByUrl('/autores');
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Autor', 'Fechar', {duration: 3000});
        }
      });
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
                this.snackBar.open('O Autor foi excluído com Sucesso!!', 'Fechar', {duration: 3000});
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o Autor', 'Fechar', {duration: 3000});
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
      minlength: 'O nome deve ter no mínimo 2 caracteres',
      maxlength: 'O nome deve ter no máximo 60 caracteres',
      apiError: ''
    },
    biografia: {
      required: 'A biografia deve ser informada',
      minlength: 'A biografia deve ter no mínimo 2 caracteres',
      maxlength: 'A biografia deve ter no máximo 10000 caracteres',
      apiError: ''
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

import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GeneroService } from '../../../services/genero.service';
import { Genero } from '../../../models/genero.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genero-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    NgIf, 
    MatInputModule, 
    RouterModule, 
    MatTableModule, 
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './genero-form.component.html',
  styleUrls: ['./genero-form.component.css']
})
export class GeneroFormComponent implements OnInit{
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      descricao: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(500)])]
    });
  }

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void {
    const genero: Genero = this.activatedRoute.snapshot.data['genero'];

    this.formGroup = this.formBuilder.group({
      id: [(genero && genero.id) ? genero.id : null],
      nome: [(genero && genero.nome) ? genero.nome : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      descricao: [(genero && genero.descricao) ? genero.descricao : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(500)])]
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
      const genero = this.formGroup.value;
      const operacao = genero.id == null
      ? this.generoService.insert(genero)
      : this.generoService.update(genero);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/generos');
          this.snackBar.open('O Gênero foi salvo com Sucesso!!', 'Fechar', {duration: 3000});
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Gênero', 'Fechar', {duration: 3000});
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const genero = this.formGroup.value;
      if (genero.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este Gênero? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.generoService.delete(genero).subscribe({
              next: () => {
                this.router.navigateByUrl('/generos');
                this.snackBar.open('O Gênero foi excluído com Sucesso!!', 'Fechar', {duration: 3000});
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o Gênero', 'Fechar', {duration: 3000});
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
      if (errors.hasOwnProperty(errorName) && this.errorMessage[controlName][errorName]) {
        return this.errorMessage[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      minlength: 'O nome deve ter no mínimo 2 caracteres',
      maxlength: 'O nome de ter no maxímo 60 caracteres',
      apiError: ''
    },
    descricao: {
      required: 'A descrição deve ser informada',
      minlength: 'A descrição deve ter no mínimo 2 caracteres',
      maxlength: 'A descrição deve ter no maximo 500 caracteres',
      apiError: ''
    }
  }

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
    this.router.navigateByUrl('/generos');
  }
}

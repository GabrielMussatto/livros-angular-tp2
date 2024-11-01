import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Editora } from '../../../models/editora.model';
import { LivroService } from '../../../services/livro.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { EditoraService } from '../../../services/editora.service';
import { Livro } from '../../../models/livro.model';
import { Genero } from '../../../models/genero.model';
import { Autor } from '../../../models/autor.model';
import { GeneroService } from '../../../services/genero.service';
import { AutorService } from '../../../services/autor.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './livro-form.component.html',
  styleUrls: ['./livro-form.component.css']
})
export class LivroFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  editoras: Editora[] = [];
  generos: Genero[] = [];
  autores: Autor[] = [];


  constructor(private formBuilder: FormBuilder,
    private livroService: LivroService,
    private fornecedorService: FornecedorService,
    private editoraService: EditoraService,
    private generoService: GeneroService,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      quantidadeEstoque: [null, Validators.required],
      isbn: ['', Validators.required],
      preco: [null, Validators.required],
      fornecedor: [null, Validators.required],
      editora: [null, Validators.required],
      generos: [[], Validators.required],
      autores: [[], Validators.required],
      classificacao: ['', Validators.required],
      datalancamento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.generoService.findAll().subscribe(data => {
      this.generos = data;
      this.initializeForm();
    }),
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
      this.initializeForm();
    }),
    this.editoraService.findAll().subscribe(data => {
      this.editoras = data;
      this.initializeForm();
    }),
    this.autorService.findAll().subscribe(data => {
      this.autores = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const livro: Livro = this.activatedRoute.snapshot.data['livro'];
    // console.log("Inicialize form");
    // console.log(livro);

    const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (livro?.fornecedor?.id || null));
    const editora = this.editoras.find(editora => editora.id === (livro?.editora?.id || null));

    // console.log("Inicialize form - genero");
    // console.log(livro.generos);

    this.formGroup = this.formBuilder.group({
      id: [(livro && livro.id) ? livro.id : null],
      titulo: [(livro && livro.titulo) ? livro.titulo : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      descricao: [(livro && livro.descricao) ? livro.descricao : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20000)])],
      quantidadeEstoque: [(livro && livro.quantidadeEstoque) ? livro.quantidadeEstoque : null, Validators.compose([Validators.required, Validators.minLength(1)])],
      isbn: [(livro && livro.isbn) ? livro.isbn : null, Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13)])],
      preco: [(livro && livro.preco) ? livro.preco : null, Validators.required],
      fornecedor: [fornecedor, Validators.required],
      editora: [editora, Validators.required],
      generos: [(livro && livro.generos) ? livro.generos.map((genero) => genero.id) : [], Validators.required],
      autores: [(livro && livro.autores) ? livro.autores.map((autor) => autor.id) : [], Validators.required],
      classificacao: [(livro && livro.classificacao) ? livro.classificacao : null, Validators.required],
      datalancamento: [(livro && livro.datalancamento) ? livro.datalancamento : null, Validators.required]
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
      const livro = this.formGroup.value;
      const operacao = livro.id == null
      ? this.livroService.insert(livro)
      : this.livroService.update(livro);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/livros');
          this.snackBar.open('O Livro foi salvo com Sucesso!!', 'Fechar', {duration: 3000});
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Livro', 'Fechar', {duration: 3000});
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const livro = this.formGroup.value;
      if (livro.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este Livro? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.livroService.delete(livro).subscribe({
              next: () => {
                this.router.navigateByUrl('/livros');
                this.snackBar.open('O Livro foi excluído com Sucesso!!', 'Fechar', {duration: 3000});
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o Livro', 'Fechar', {duration: 3000});
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
    titulo: {
      required: 'Titulo é obrigatório',
      minlength: 'Titulo deve ter no mínimo 2 caracteres',
      maxlength: 'Titulo deve ter no máximo 60 caracteres',
      apiError: ''
    },
    descricao: {
      required: 'Descrição é obrigatório',
      minlength: 'Descrição deve ter no mínimo 2 caracteres',
      maxlength: 'Descrição deve ter no máximo 20000 caracteres',
      apiError: ''
    },
    quantidadeEstoque: {
      required: 'Quantidade Estoque é obrigatório',
      minlength: 'Quantidade Estoque deve ser maior que zero',
      apiError: ''
    },
    isbn: {
      required: 'ISBN é obrigatório',
      minlength: 'ISBN deve ter no mínimo 13 caracteres',
      maxlength: 'ISBN deve ter no máximo 13 caracteres',
      apiError: ''
    },
    preco: {
      required: 'Preço é obrigatório',
      apiError: ''
    },
    fornecedor: {
      required: 'Fornecedor é obrigatório',
      apiError: ''
    },
    editora: {
      required: 'Editora é obrigatório',
      apiError: ''
    },
    generos: {
      required: 'Gênero é obrigatório',
      apiError: ''
    },
    autores: {
      required: 'Autor é obrigatório',
      apiError: ''
    },
    classificacao: {
      required: 'Classificação é obrigatório',
      apiError: ''
    },
    datalancamento: {
      required: 'A data é obrigatória',
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
    this.router.navigateByUrl('/livros');
  }
}
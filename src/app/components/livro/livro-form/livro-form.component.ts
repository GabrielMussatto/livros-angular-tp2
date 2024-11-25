import { CommonModule, Location, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
import { Classificacao } from '../../../models/classificacao.model';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatSelectModule, MatSelect, MatDatepickerModule,
    MatNativeDateModule, MatIconModule, MatMenuModule, MatSnackBarModule, CommonModule],
  templateUrl: './livro-form.component.html',
  styleUrls: ['./livro-form.component.css']
})
export class LivroFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  editoras: Editora[] = [];
  generos: Genero[] = [];
  autores: Autor[] = [];
  classificacoes: Classificacao[] = [];

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder,
    private livroService: LivroService,
    private fornecedorService: FornecedorService,
    private editoraService: EditoraService,
    private generoService: GeneroService,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private location: Location
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      quantidadeEstoque: ['', Validators.required],
      isbn: ['', Validators.required],
      preco: ['', Validators.required],
      fornecedor: [null, Validators.required],
      editora: [null, Validators.required],
      generos: [[], Validators.required],
      autores: [[], Validators.required],
      classificacao: [null, Validators.required],
      datalancamento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.livroService.findClassificacoes().subscribe(data => {
      this.classificacoes = data;
      this.initializeForm();
    });
    this.generoService.findAll().subscribe(data => {
      this.generos = data;
      this.initializeForm();
    });
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
      this.initializeForm();
    });
    this.editoraService.findAll().subscribe(data => {
      this.editoras = data;
      this.initializeForm();
    });
    this.autorService.findAll().subscribe(data => {
      this.autores = data;
      this.initializeForm();
    });
    this.initializeForm();

  }

  initializeForm(): void {
    const livro: Livro = this.activatedRoute.snapshot.data['livro'];

    const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (livro?.fornecedor?.id || null));
    const editora = this.editoras.find(editora => editora.id === (livro?.editora?.id || null));
    const classificacao = this.classificacoes.find(c => c.id === (livro?.classificacao?.id || null));
    
    // carregando a imagem do preview
    if (livro && livro.nomeImagem) {
      this.imagePreview = this.livroService.getUrlImage(livro.nomeImagem);
      this.fileName = livro.nomeImagem;
    }

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
      classificacao: [classificacao, Validators.required],
      datalancamento: [(livro && livro.datalancamento) ? livro.datalancamento : null, Validators.required]
    });
  }

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private uploadImage(livroId: number) {
    if (this.selectedFile) {
      this.livroService.uploadImage(livroId, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => {
            this.voltarPagina();
          },
          error: err => {
            console.log('Erro ao fazer o upload da imagem');
            // tratar o erro
          }
        })
    } else {
      this.voltarPagina();
    }
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message })
          }
        });
      }
    } else if (errorResponse.status < 400) {
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
        next: (livroCadastrado) => {
          this.uploadImage(livroCadastrado.id);
          this.router.navigateByUrl('/admin/livros');
          this.snackBar.open('O Livro foi salvo com Sucesso!!', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Livro', 'Fechar', { duration: 3000 });
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
                this.router.navigateByUrl('/admin/livros');
                this.snackBar.open('O Livro foi excluído com Sucesso!!', 'Fechar', { duration: 3000 });
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir o Livro', 'Fechar', { duration: 3000 });
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
    this.router.navigateByUrl('/admin/editoras/new');
  }
  autor() {
    this.router.navigateByUrl('/admin/autores/new');
  }
  caixaLivros() {
    this.router.navigateByUrl('/admin/caixaLivros/new');
  }
  livro() {
    this.router.navigateByUrl('/admin/livros/new');
  }
  genero() {
    this.router.navigateByUrl('/admin/generos/new');
  }
  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores/new');
  }
  voltar() {
    this.router.navigateByUrl('/admin/livros');
  }
  voltarPagina() {
    this.location.back();
  }
}
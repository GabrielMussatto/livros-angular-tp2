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
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importa o componente de diálogo de confirmação
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatSelectModule,MatDatepickerModule, 
    MatNativeDateModule, MatIconModule, MatMenuModule],
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
    private dialog: MatDialog) {

    const livro: Livro = this.activatedRoute.snapshot.data['livro'];

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
    })
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
      })
    this.autorService.findAll().subscribe(data => {
      this.autores = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const livro: Livro = this.activatedRoute.snapshot.data['livro'];

    const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (livro?.fornecedor?.id || null));
    const editora = this.editoras.find(editora => editora.id === (livro?.editora?.id || null));

    this.formGroup = this.formBuilder.group({
      id: [(livro && livro.id) ? livro.id : null],
      titulo: [(livro && livro.titulo) ? livro.titulo : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      descricao: [(livro && livro.descricao) ? livro.descricao : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20000)])],
      quantidadeEstoque: [(livro && livro.quantidadeEstoque) ? livro.quantidadeEstoque : null, Validators.compose([Validators.required, Validators.minLength(1)])],
      isbn: [(livro && livro.isbn) ? livro.isbn : null, Validators.compose([Validators.minLength(13), Validators.maxLength(13)])],
      preco: [(livro && livro.preco) ? livro.preco : null, Validators.required],
      fornecedor: [fornecedor, Validators.required],
      editora: [editora, Validators.required],
      generos: [(livro && livro.generos) ? livro.generos.map((genero) => genero.id) : [], Validators.required],
      autores: [(livro && livro.autores) ? livro.autores.map((autor) => autor.id) : [], Validators.required],
      classificacao: [(livro && livro.classificacao) ? livro.classificacao : null, Validators.required],
      datalancamento: [(livro && livro.datalancamento) ? livro.datalancamento : null, Validators.required]
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const livros = this.formGroup.value;
      if (livros.id == null) {
        this.livroService.insert(livros).subscribe({
          next: (livroCadastrado) => {
            this.router.navigateByUrl('/livros');
          },
          error: (err) => {
            console.log('Erro ao Cadastrar' + JSON.stringify(err));
          }
        });
      } else {
        this.livroService.update(livros).subscribe({
          next: (livroAtualizado) => {
            this.router.navigateByUrl('/livros');
          },
          error: (err) => {
            console.log('Erro ao Atualizar' + JSON.stringify(err));
          }
        });
      }
    } else {
      console.log('Formulário Inválido');
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const livro = this.formGroup.value;
      if (livro.id != null) {
        // Abre o diálogo de confirmação
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir este Livro? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.livroService.delete(livro).subscribe({
              next: () => {
                this.router.navigateByUrl('/livros');
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

  cancelar() {
    this.router.navigateByUrl('/livros');
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    titulo: {
      required: 'Titulo é obrigatório',
      minlength: 'Titulo deve ter no mínimo 2 caracteres',
      maxlength: 'Titulo deve ter no máximo 60 caracteres'
    },
    descricao: {
      required: 'Descrição é obrigatório',
      minlength: 'Descrição deve ter no mínimo 2 caracteres',
      maxlength: 'Descrição deve ter no máximo 20000 caracteres'
    },
    quantidadeEstoque: {
      required: 'Quantidade Estoque é obrigatório',
      minlength: 'Quantidade Estoque deve ser maior que zero'
    },
    isbn: {
      required: 'ISBN é obrigatório',
      minlength: 'ISBN deve ter no mínimo 13 caracteres',
      maxlength: 'ISBN deve ter no máximo 13 caracteres'
    },
    preco: {
      required: 'Preço é obrigatório',
    },
    fornecedor: {
      required: 'Fornecedor é obrigatório'
    },
    editora: {
      required: 'Editora é obrigatório'
    },
    generos: {
      required: 'Gênero é obrigatório'
    },
    autores: {
      required: 'Autor é obrigatório'
    },
    classificacao: {
      required: 'Classificação é obrigatório'
    },
    datalancamento: {
      required: 'A data é obrigatória'
    }
  }
}
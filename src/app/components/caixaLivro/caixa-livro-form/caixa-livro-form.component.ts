import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { CaixaLivro } from '../../../models/caixa-livro.model';
import { Genero } from '../../../models/genero.model';
import { Autor } from '../../../models/autor.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Editora } from '../../../models/editora.model';
import { GeneroService } from '../../../services/genero.service';
import { AutorService } from '../../../services/autor.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { EditoraService } from '../../../services/editora.service';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'; // Importa o componente de diálogo de confirmação
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-caixa-livro-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatSelectModule, MatIconModule, MatMenuModule],
  templateUrl: './caixa-livro-form.component.html',
  styleUrls: ['./caixa-livro-form.component.css']
})
export class CaixaLivroFormComponent implements OnInit {
  formGroup: FormGroup;
  generos: Genero[] = [];
  autores: Autor[] = [];
  fornecedores: Fornecedor[] = [];
  editoras: Editora[] = [];

  constructor(private formBuilder: FormBuilder,
    private caixaLivroService: CaixaLivroService,
    private generoService: GeneroService,
    private autorService: AutorService,
    private fornecedorService: FornecedorService,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { 

    const caixaLivro: CaixaLivro = this.activatedRoute.snapshot.data['caixaLivro'];

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      quantidadeEstoque: [null, Validators.required],
      preco: [null, Validators.required],
      fornecedor: [null, Validators.required],
      editora: [null, Validators.required],
      generos: [[], Validators.required],
      autores: [[], Validators.required],
      classificacao: ['', Validators.required]
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
    })
    this.autorService.findAll().subscribe(data => {
      this.autores = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const caixaLivro: CaixaLivro = this.activatedRoute.snapshot.data['caixaLivro'];

    const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (caixaLivro?.fornecedor?.id || null));
    const editora = this.editoras.find(editora => editora.id === (caixaLivro?.editora?.id || null));

    this.formGroup = this.formBuilder.group({
      id: [(caixaLivro && caixaLivro.id) ? caixaLivro.id : null],
      nome: [(caixaLivro && caixaLivro.nome) ? caixaLivro.nome : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      descricao: [(caixaLivro && caixaLivro.descricao) ? caixaLivro.descricao : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20000)])],
      quantidadeEstoque: [(caixaLivro && caixaLivro.quantidadeEstoque) ? caixaLivro.quantidadeEstoque : null, Validators.compose([Validators.required, Validators.minLength(1)])],
      preco: [(caixaLivro && caixaLivro.preco) ? caixaLivro.preco : null, Validators.required],
      fornecedor: [fornecedor, Validators.required],
      editora: [editora, Validators.required],
      generos: [(caixaLivro && caixaLivro.generos) ? caixaLivro.generos.map((genero) => genero.id) : [], Validators.required],
      autores: [(caixaLivro && caixaLivro.autores) ? caixaLivro.autores.map((autor) => autor.id) : [], Validators.required],
      classificacao: [(caixaLivro && caixaLivro.classificacao) ? caixaLivro.classificacao : null, Validators.required]
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const caixaLivros = this.formGroup.value;
      if (caixaLivros.id == null) {
        this.caixaLivroService.insert(caixaLivros).subscribe({
          next: (caixaLivroCadastrado) => {
            this.router.navigateByUrl('/caixaLivros');
          },
          error: (err) => {
            console.log('Erro ao Cadastrar' + JSON.stringify(err));
          }
        });
      } else {
        this.caixaLivroService.update(caixaLivros).subscribe({
          next: (caixaLivroAtualizado) => {
            this.router.navigateByUrl('/caixaLivros');
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
      const caixaLivro = this.formGroup.value;
      if (caixaLivro.id != null) {
        // Abre o diálogo de confirmação
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Deseja realmente excluir esta Caixa de Livros? Não será possível reverter.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.caixaLivroService.delete(caixaLivro).subscribe({
              next: () => {
                this.router.navigateByUrl('/caixaLivros');
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
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'Nome é obrigatório',
      minlength: 'Nome deve ter no mínimo 2 caracteres',
      maxlength: 'Nome deve ter no máximo 60 caracteres'
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
    this.router.navigateByUrl('/caixaLivros');
  }
}

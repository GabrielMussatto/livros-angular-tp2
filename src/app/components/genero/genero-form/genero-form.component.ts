import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    MatMenuModule
  ],
  templateUrl: './genero-form.component.html',
  styleUrls: ['./genero-form.component.css']
})
export class GeneroFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    const genero: Genero = this.activatedRoute.snapshot.data['genero'];

    this.formGroup = this.formBuilder.group({
      id: [(genero && genero.id) ? genero.id : null],
      nome: [(genero && genero.nome) ? genero.nome : '', Validators.required],
      descricao: [(genero && genero.descricao) ? genero.descricao : '', Validators.required]
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const genero = this.formGroup.value;
      if (genero.id == null) {
        this.generoService.insert(genero).subscribe({
          next: (generoCadastrado) => {
            this.router.navigateByUrl('/generos');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar' + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.generoService.update(genero).subscribe({
          next: (generoAlterado) => {
            this.router.navigateByUrl('/generos');
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

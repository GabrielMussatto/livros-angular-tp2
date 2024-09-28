import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule],
  templateUrl: './autor-form.component.html',
  styleUrl: './autor-form.component.css'
})
export class AutorFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    const autor: Autor = this.activatedRoute.snapshot.data['autor'];

    this.formGroup = formBuilder.group({
      id: [(autor && autor.id) ? autor.id : null],
      nome: [(autor && autor.nome) ? autor.nome : '', Validators.required],
      biografia: [(autor && autor.biografia) ? autor.biografia : '', Validators.required]
    })
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
        if (confirm("Deseja realmente excluir este Autor? Não será possivel reverter.")) {
          this.autorService.delete(autor).subscribe({
            next: () => {
              this.router.navigateByUrl('/autores');
            },
            error: (err) => {
              console.log('Erro ao Excluir' + JSON.stringify(err));
            }
          });
        }
      }
    }
  }

  cancelar(){
    this.router.navigateByUrl('/autores');
  }
}

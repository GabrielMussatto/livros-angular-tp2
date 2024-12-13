import { Component, OnInit } from '@angular/core';
import { Sugestao } from '../../models/sugestao.model';
import { ClienteService } from '../../services/cliente.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sugestao',
  standalone: true,
  imports: [
    FormsModule,
     CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sugestao.component.html',
  styleUrl: './sugestao.component.css',
})
export class SugestaoComponent implements OnInit {
  sugestoes: Sugestao[] = [];
  novaSugestao: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.buscarMinhasSugestoes();
  }

  buscarMinhasSugestoes(): void {
    this.loading = true;
    this.errorMessage = null;
    this.clienteService.findMinhasSugestoes().subscribe({
      next: (sugestoes) => {
        this.sugestoes = sugestoes;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao buscar sugestões';
        console.error(error);
        this.loading = false;
      },
    });
  }

  adicionarSugestao(): void {
    if (!this.novaSugestao.trim()) {
      this.errorMessage = 'O campo de sugestão não pode estar vazio.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.clienteService.adicionarSugestao(this.novaSugestao).subscribe({
      next: (sugestao) => {
        this.sugestoes.push(sugestao); // Adiciona a nova sugestão à lista
        this.novaSugestao = ''; // Limpa o campo de texto
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao adicionar sugestão.';
        console.error(error);
        this.loading = false;
      },
    });
  }
}

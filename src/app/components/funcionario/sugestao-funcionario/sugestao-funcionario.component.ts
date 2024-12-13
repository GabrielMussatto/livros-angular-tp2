import { Component, OnInit } from '@angular/core';
import { Sugestao } from '../../../models/sugestao.model';
import { FuncionarioService } from '../../../services/funcionario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTable, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sugestao-funcionario',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, MatToolbarModule, MatTable, MatTableModule],
  templateUrl: './sugestao-funcionario.component.html',
  styleUrl: './sugestao-funcionario.component.css'
})
export class SugestaoFuncionarioComponent implements OnInit{
  sugestoes: Sugestao[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  displayedColumns: string[] = ['id', 'nome', 'username', 'dataSugestao', 'sugestao'];

  constructor(
    private funcionarioService: FuncionarioService
  ){ }

  ngOnInit(): void {
    this.listarSugestoes();
  }

  listarSugestoes(): void {
    this.loading = true;
    this.errorMessage = null;
  
    this.funcionarioService.listarSugestoes().subscribe({
      next: (sugestoes) => {
        console.log('Dados recebidos:', sugestoes);
        this.sugestoes = sugestoes;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao buscar sugestões.';
        console.error(error);
        this.loading = false;
      },
    });
  }
  
}

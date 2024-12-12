import { Component, OnInit } from '@angular/core';
import { Sugestao } from '../../../models/sugestao.model';
import { FuncionarioService } from '../../../services/funcionario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sugestao-funcionario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sugestao-funcionario.component.html',
  styleUrl: './sugestao-funcionario.component.css'
})
export class SugestaoFuncionarioComponent implements OnInit{
  sugestoes: Sugestao[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

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

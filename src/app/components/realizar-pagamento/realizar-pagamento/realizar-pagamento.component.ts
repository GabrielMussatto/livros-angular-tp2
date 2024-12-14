import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../../../services/carrinho.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ItemPedido } from '../../../models/item-pedido';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartaoCredito } from '../../../models/cartao-credito.model';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { ClienteService } from '../../../services/cliente.service';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-realizar-pagamento',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatButtonModule, MatRadioModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatOptionModule, MatInputModule, MatLabel, NgIf, NgFor, MatOptionModule],
  templateUrl: './realizar-pagamento.component.html',
  styleUrls: ['./realizar-pagamento.component.css'],
})
export class RealizarPagamentoComponent implements OnInit {

  currentStep: number = 1; // Controle do passo atual
  totalPedido: number = 0;
  metodoPagamento: string = '';
  itensCarrinho: ItemPedido[] = [];
  cartaoCredito: CartaoCredito = { 
    bandeiraCartao: 0, 
    cpfTitular: '', 
    cvc: 0, 
    nomeImpressaoTitular: '', 
    numeroCartao: '', 
    validade: '' 
  };
  cliente: any = {};

  constructor(
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrinhoService.obterCarrinho().subscribe((itens) => {
      this.itensCarrinho = itens;
      this.calcularTotalPedido();
    });

    // Carregar dados do cliente
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (usuarioLogado) {
      this.cliente = JSON.parse(usuarioLogado);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  calcularTotalPedido(): void {
    this.totalPedido = this.itensCarrinho.reduce((total, item) => total + (item.subTotal ?? 0), 0);
  }

  avancar(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  voltar(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  realizarPagamento(): void {
    if (!this.metodoPagamento) {
      alert('Selecione um método de pagamento!');
      return;
    }

    switch (this.metodoPagamento) {
      case 'pix':
        this.carrinhoService.finalizarPedidoPix().subscribe({
          next: () => {
            this.snackBar.open('Pagamento por pix realizado com sucesso!!', 'Fechar' , {duration: 3000});
            this.router.navigateByUrl('/acompanharpedido'); // Redireciona
          },
          error: (err) => {
            console.error('Erro ao processar pagamento via Pix:', err);
            this.snackBar.open('Opss... Pagamento por pix falhou. Tente Novamente', 'Fechar' , {duration: 3000});
          },
        });
        break;
      case 'credito':
        this.carrinhoService.finalizarPedidoCartaoCredito(this.cartaoCredito).subscribe({
          next: () => {
            this.snackBar.open('Pagamento por Cartão de Crédito realizado com sucesso!!', 'Fechar' , {duration: 3000});
            this.router.navigateByUrl('/acompanharpedido'); // Redireciona
          },
          error: (err) => {
            console.error('Erro ao processar pagamento com Cartão de Crédito:', err);
            this.snackBar.open('Opss... Pagamento por Cartão de Crédito falhou. Tente Novamente', 'Fechar' , {duration: 3000});
          },
        });
        break;
      case 'boleto':
        this.carrinhoService.finalizarPedidoBoleto().subscribe({
          next: () => {
            this.snackBar.open('Pagamento por Boleto realizado com sucesso!!', 'Fechar' , {duration: 3000});
            this.router.navigateByUrl('/acompanharpedido'); // Redireciona
          },
          error: (err) => {
            console.error('Erro ao processar pagamento com Boleto:', err);
            this.snackBar.open('Opss... Pagamento por boleto falhou. Tente Novamente', 'Fechar' , {duration: 3000});
          },
        });
        break;
      default:
        this.snackBar.open('Opss... Método de pagamento inválido. Tente Novamente', 'Fechar' , {duration: 3000});
    }
  }
}

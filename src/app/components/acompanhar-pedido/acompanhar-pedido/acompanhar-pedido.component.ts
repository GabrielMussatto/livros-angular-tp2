import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-acompanhar-pedido',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './acompanhar-pedido.component.html',
  styleUrls: ['./acompanhar-pedido.component.css'],
})
export class AcompanharPedidoComponent implements OnInit {
  progressValue: number = 0; // Valor inicial da barra de progresso
  interval: any;

  constructor(private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Simulação de progresso
    this.interval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 10; // Incrementa o progresso
      } else {
        clearInterval(this.interval);
        this.snackBar.open('Seu pedido chegou!! Rápido né. Aproveite!!', 'Fechar' , {duration: 3000});
        this.router.navigateByUrl('/inicio'); // Redireciona para a página inicial
      }
    }, 1000); // Atualiza a cada 1 segundo
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval); // Limpa o intervalo ao destruir o componente
    }
  }
}

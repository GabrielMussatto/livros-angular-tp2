import { Component } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { LivroService } from '../../../services/livro.service'; // Serviço fictício para busca
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-header-cliente',
  standalone: true,
  imports: [
    NgIf,
    MatToolbar,
    MatIcon,
    MatBadge,
    MatButton,
    MatIconButton,
    RouterModule,
    MatMenuModule,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: './header-cliente.component.html',
  styleUrls: ['./header-cliente.component.css'],
})
export class HeaderClienteComponent {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  // Controladores de pesquisa
  exibirPesquisa = false; // Controla a exibição do campo de pesquisa
  termoPesquisa: string = ''; // Guarda o termo pesquisado
  filtroSelecionado: string = '';

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private livroService: LivroService, // Serviço fictício para buscar livros
    private caixaLivroService: CaixaLivroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Assina mudanças no estado do usuário logado
    this.subscription.add(
      this.authService
        .getUsuarioLogado()
        .subscribe((usuario) => (this.usuarioLogado = usuario))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clickMenu() {
    this.sidebarService.toggle();
  }

  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

  // Alterna a exibição do campo de pesquisa
  togglePesquisa() {
    this.exibirPesquisa = !this.exibirPesquisa;
    if (!this.exibirPesquisa) {
      this.termoPesquisa = ''; // Limpa o termo de pesquisa
    }
  }

  // Função de pesquisa que chama os métodos do serviço
  pesquisar(): void {

    if (this.filtroSelecionado === 'livro') {
      // Redireciona para a página de livros com o termo de pesquisa
      this.router.navigate(['/livros'], { queryParams: { termo: this.termoPesquisa } });
    } else if (this.filtroSelecionado === 'caixaLivro') {
      // Redireciona para a página de caixas de livros com o termo de pesquisa
      this.router.navigate(['/caixaLivros'], { queryParams: { termo: this.termoPesquisa } });
    } else {
      alert('Por favor, selecione um tipo de pesquisa.');
    }
  }
}

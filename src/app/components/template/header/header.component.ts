import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Usuario } from '../../../models/usuario.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, MatToolbar, MatIcon, MatBadge, MatButton, MatIconButton, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      usuario => this.usuarioLogado = usuario
    ));
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
  }

}
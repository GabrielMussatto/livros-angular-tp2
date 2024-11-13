import { Component, OnInit, ViewChild } from '@angular/core';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenav, MatDrawer, MatDrawerContainer, RouterModule, MatDrawerContent, MatToolbar, MatList, MatNavList, MatListItem, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sideBarService: SidebarService) { }

  ngOnInit(): void {
    this.sideBarService.sideNavToggleSubject.subscribe(
      () => {
        this.drawer.toggle();
      }
    )
  }

  fecharBarraLateral(){
    this.drawer.close();
  }
}

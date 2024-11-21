import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderClienteComponent } from '../header-cliente/header-cliente.component';

@Component({
  selector: 'app-user-template',
  standalone: true,
  imports: [HeaderClienteComponent, FooterComponent, RouterModule, RouterOutlet],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}

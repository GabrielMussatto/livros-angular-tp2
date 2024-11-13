import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-template',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, RouterOutlet],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}

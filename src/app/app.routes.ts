import { Routes } from '@angular/router';
import { AutorFormComponent } from './components/autor/autor-form/autor-form.component';
import { AutorListComponent } from './components/autor/autor-list/autor-list.component';
import { autorResolver } from './components/autor/resolver/autor.resolver';

export const routes: Routes = [
    {path: 'autores',component: AutorListComponent, title: 'Lista de Autores'},
    {path: 'autores/new',component: AutorFormComponent, title: 'Novo Autor'},
    {path: 'autores/edit/:id', component: AutorFormComponent, resolve: {autor: autorResolver}}
];

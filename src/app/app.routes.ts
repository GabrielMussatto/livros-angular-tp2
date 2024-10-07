import { Routes } from '@angular/router';
import { AutorFormComponent } from './components/autor/autor-form/autor-form.component';
import { AutorListComponent } from './components/autor/autor-list/autor-list.component';
import { autorResolver } from './components/autor/resolver/autor.resolver';
import { GeneroListComponent } from './components/genero/genero-list/genero-list.component';
import { GeneroFormComponent } from './components/genero/genero-form/genero-form.component';
import { generoResolver } from './components/genero/resolver/genero.resolver';
import { editoraResolver } from './components/editora/resolver/editora.resolver';
import { fornecedorResolver } from './components/fornecedor/resolver/fornecedor.resolver';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { EditoraFormComponent } from './components/editora/editora-form/editora-form.component';
import { EditoraListComponent } from './components/editora/editora-list/editora-list.component';

export const routes: Routes = [
    // Rotas para Autores
    { path: 'autores', component: AutorListComponent, title: 'Lista de Autores' },
    { path: 'autores/new', component: AutorFormComponent, title: 'Novo Autor' },
    { path: 'autores/edit/:id', component: AutorFormComponent, resolve: { autor: autorResolver } },

    // Rotas para Generos
    { path: 'generos', component: GeneroListComponent, title: 'Lista de Generos' },
    { path: 'generos/new', component: GeneroFormComponent, title: 'Novo Genero' },
    { path: 'generos/edit/:id', component: GeneroFormComponent, resolve: { genero: generoResolver } },

    // Rotas para Editoras
    { path: 'editoras', component: EditoraListComponent, title: 'Lista de Editoras' },
    { path: 'editoras/new', component: EditoraFormComponent, title: 'Nova Editora' },
    { path: 'editoras/edit/:id', component: EditoraFormComponent, resolve: { editora: editoraResolver } },

    // Rotas para Fornecedores
    { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores' },
    { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor' },
    { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: { fornecedor: fornecedorResolver } }
];

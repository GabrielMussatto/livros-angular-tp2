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
import { CaixaLivroListComponent } from './components/caixaLivro/caixa-livro-list/caixa-livro-list.component';
import { CaixaLivroFormComponent } from './components/caixaLivro/caixa-livro-form/caixa-livro-form.component';
import { caixaLivroResolver } from './components/caixaLivro/resolver/caixa-livro.resolver';
import { livroResolver } from './components/livro/resolver/livro.resolver';
import { LivroFormComponent } from './components/livro/livro-form/livro-form.component';
import { LivroListComponent } from './components/livro/livro-list/livro-list.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { LivroCardListComponent } from './components/livro/livro-card-list/livro-card-list.component';
import { LivroDetalhadoListComponent } from './components/livro/livro-detalhado-list/livro-detalhado-list.component';
import { CaixaLivroCardListComponent } from './components/caixaLivro/caixa-livro-card-list/caixa-livro-card-list.component';
import { CaixaLivroDetalhadoListComponent } from './components/caixaLivro/caixa-livro-detalhado-list/caixa-livro-detalhado-list.component';
import { livroDetalhadoResolver } from './components/livro/resolver/livro-detalhado.resolver';
import { caixaLivroDetalhadoResolver } from './components/caixaLivro/resolver/caixa-livro-detalhado.resolver';
import { AutorDetalhadoListComponent } from './components/autor/autor-detalhado-list/autor-detalhado-list.component';
import { autorDetalhadoResolver } from './components/autor/resolver/autor-detalhado.resolver';
import { PaginaInicialComponent } from './components/inicio/pagina-inicial/pagina-inicial.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [

    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'administração',
        canActivate: [AdminGuard], // Apenas admin pode acessar
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'autores' },


            // Rotas para Autores
            { path: 'autores', component: AutorListComponent, title: 'Lista de Autores' },
            { path: 'autores/new', component: AutorFormComponent, title: 'Novo Autor' },
            { path: 'autores/edit/:id', component: AutorFormComponent, resolve: { autor: autorResolver } },

            // Rotas para Caixa de Livros
            { path: 'caixaLivros', component: CaixaLivroListComponent, title: 'Lista de Caixas de Livros' },
            { path: 'caixaLivros/new', component: CaixaLivroFormComponent, title: 'Nova Caixa de Livro' },
            { path: 'caixaLivros/edit/:id', component: CaixaLivroFormComponent, resolve: { caixaLivro: caixaLivroResolver } },

            // Rotas para Livros
            { path: 'livros', component: LivroListComponent, title: 'Lista de Livros' },
            { path: 'livros/new', component: LivroFormComponent, title: 'Novo Livro' },
            { path: 'livros/edit/:id', component: LivroFormComponent, resolve: { livro: livroResolver } },

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
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: { fornecedor: fornecedorResolver } },
        ]
    },
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'inicio', component: PaginaInicialComponent, title: 'Página Inicial'},

            { path: 'livros', component: LivroCardListComponent, title: 'Lista de Livros' },
            { path: 'livros/:titulo', component: LivroDetalhadoListComponent, title: 'Detalhes do Livro', resolve: {livro : livroDetalhadoResolver} },

            { path: 'caixaLivros', component: CaixaLivroCardListComponent, title: 'Lista de Caixa de Livros' },
            { path: 'caixaLivros/:nome', component: CaixaLivroDetalhadoListComponent, title: 'Detalhes das Caixas de Livro', resolve: { caixaLivro: caixaLivroDetalhadoResolver} },

            { path: 'autores/:nome', component: AutorDetalhadoListComponent, title: 'Detalhes dos Autores', resolve: { autor: autorDetalhadoResolver }},

            { path: 'login', component: LoginComponent, title: 'Login' },
        ]
    }
   
];

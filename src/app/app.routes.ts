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
import { LoginFuncionarioComponent } from './components/login/login-funcionario/login-funcionario.component';
import { LoginClienteComponent } from './components/login/login-cliente/login-cliente.component';
import { GerenciarComponent } from './components/gerenciar/gerenciar/gerenciar.component';
import { FavoritoComponent } from './components/favorito/favorito.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { authGuard } from './guard/auth.guard';
import { authClienteGuard } from './guard/auth-cliente.guard';
import { CupomListComponent } from './components/cupom/cupom-list/cupom-list.component';
import { CupomFormComponent } from './components/cupom/cupom-form/cupom-form.component';
import { cupomResolver } from './components/cupom/resolver/cupom.resolver';
import { SugestaoFuncionarioComponent } from './components/funcionario/sugestao-funcionario/sugestao-funcionario.component';
import { SugestaoComponent } from './components/sugestao/sugestao.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { RealizarPagamentoComponent } from './components/realizar-pagamento/realizar-pagamento/realizar-pagamento.component';
import { AcompanharPedidoComponent } from './components/acompanhar-pedido/acompanhar-pedido/acompanhar-pedido.component';
import { AlterarUsernameComponent } from './components/cliente/alterar-username/alterar-username/alterar-username.component';
import { AlterarSenhaComponent } from './components/cliente/alterar-senha/alterar-senha/alterar-senha.component';
import { ClientePerfilComponent } from './components/cliente/cliente-perfil/cliente-perfil.component';
import { CadastroClienteComponent } from './components/cliente/cadastro-cliente/cadastro-cliente/cadastro-cliente.component';

export const routes: Routes = [

    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'Administração',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },

            { path: 'login', component: LoginFuncionarioComponent, title: 'Login Admin' },
            
            { path: 'gerenciar', component: GerenciarComponent, title: 'Gerenciar', canActivate: [authGuard] },



            // Rotas para Autores
            { path: 'autores', component: AutorListComponent, title: 'Lista de Autores', canActivate: [authGuard] },
            { path: 'autores/new', component: AutorFormComponent, title: 'Novo Autor', canActivate: [authGuard] },
            { path: 'autores/edit/:id', component: AutorFormComponent, resolve: { autor: autorResolver }, canActivate: [authGuard] },

            // Rotas para Cliente
            { path: 'clientes', component: ClienteListComponent, title: 'Lista de Clientes', canActivate: [authGuard] },

            // Rotas para Funcionario
            { path: 'funcionarios', component: FuncionarioListComponent, title: 'Lista de Funcionários', canActivate: [authGuard] },

            // Rotas para Caixa de Livros
            { path: 'caixaLivros', component: CaixaLivroListComponent, title: 'Lista de Caixas de Livros', canActivate: [authGuard] },
            { path: 'caixaLivros/new', component: CaixaLivroFormComponent, title: 'Nova Caixa de Livro', canActivate: [authGuard] },
            { path: 'caixaLivros/edit/:id', component: CaixaLivroFormComponent, resolve: { caixaLivro: caixaLivroResolver }, canActivate: [authGuard] },

            // Rotas para Livros
            { path: 'livros', component: LivroListComponent, title: 'Lista de Livros', canActivate: [authGuard] },
            { path: 'livros/new', component: LivroFormComponent, title: 'Novo Livro', canActivate: [authGuard] },
            { path: 'livros/edit/:id', component: LivroFormComponent, resolve: { livro: livroResolver }, canActivate: [authGuard] },

            // Rotas para Generos
            { path: 'generos', component: GeneroListComponent, title: 'Lista de Generos', canActivate: [authGuard] },
            { path: 'generos/new', component: GeneroFormComponent, title: 'Novo Genero', canActivate: [authGuard] },
            { path: 'generos/edit/:id', component: GeneroFormComponent, resolve: { genero: generoResolver }, canActivate: [authGuard] },

            // Rotas para Cupons
            { path: 'cupons', component: CupomListComponent, title: 'Lista de Cupons', canActivate: [authGuard] },
            { path: 'cupons/new', component: CupomFormComponent, title: 'Novo Cupom', canActivate: [authGuard] },
            { path: 'cupons/edit/:id', component: CupomFormComponent, resolve: { cupom: cupomResolver }, canActivate: [authGuard] },
            
            // Rotas para Editoras
            { path: 'editoras', component: EditoraListComponent, title: 'Lista de Editoras', canActivate: [authGuard] },
            { path: 'editoras/new', component: EditoraFormComponent, title: 'Nova Editora', canActivate: [authGuard] },
            { path: 'editoras/edit/:id', component: EditoraFormComponent, resolve: { editora: editoraResolver }, canActivate: [authGuard] },
            
            // Rotas para Fornecedores
            { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores', canActivate: [authGuard] },
            { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor', canActivate: [authGuard] },
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: { fornecedor: fornecedorResolver }, canActivate: [authGuard] },

            { path: 'sugestao', component: SugestaoFuncionarioComponent, title: 'Sugestão', canActivate: [authGuard] },
        ]
    },
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'inicio' },
            { path: 'inicio', component: PaginaInicialComponent, title: 'Página Inicial'},

            { path: 'livros', component: LivroCardListComponent, title: 'Lista de Livros' },
            { path: 'livros/:titulo', component: LivroDetalhadoListComponent, title: 'Detalhes do Livro', resolve: {livro : livroDetalhadoResolver} },

            { path: 'caixaLivros', component: CaixaLivroCardListComponent, title: 'Lista de Caixa de Livros' },
            { path: 'caixaLivros/:nome', component: CaixaLivroDetalhadoListComponent, title: 'Detalhes das Caixas de Livro', resolve: { caixaLivro: caixaLivroDetalhadoResolver} },

            { path: 'autores/:nome', component: AutorDetalhadoListComponent, title: 'Detalhes dos Autores', resolve: { autor: autorDetalhadoResolver }},

            { path: 'favoritos', component: FavoritoComponent, title: 'Favoritos', canActivate: [authClienteGuard]},

            { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho', canActivate: [authClienteGuard]},
            
            { path: 'realizarPagamento', component: RealizarPagamentoComponent, title: 'Realizar Pagamento', canActivate: [authClienteGuard]},

            { path: 'acompanharpedido', component: AcompanharPedidoComponent, title: 'Acompanhar Pedido', canActivate: [authClienteGuard]},

            { path: 'alterarUsername', component: AlterarUsernameComponent, title: 'Alterando Username', canActivate: [authClienteGuard]},
            
            { path: 'alterarSenha', component: AlterarSenhaComponent, title: 'Alterando Senha', canActivate: [authClienteGuard]},

            { path: 'sugestao', component: SugestaoComponent, title: 'Sugestão'},

            { path: 'login', component: LoginClienteComponent, title: 'Login' },

            { path: 'meuPerfil', component: ClientePerfilComponent, title: 'Meu Perfil', canActivate: [authClienteGuard]},

            { path: 'cadastreSe', component: CadastroClienteComponent, title: 'Cadastre-se' },
        ]
    }
   
];

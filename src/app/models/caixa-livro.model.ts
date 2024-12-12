import { Autor } from "./autor.model";
import { Classificacao } from "./classificacao.model";
import { Editora } from "./editora.model";
import { Fornecedor } from "./fornecedor.model";
import { Genero } from "./genero.model";

export class CaixaLivro {
    id!: number;
    nome!: string;
    descricao!: string;
    quantidadeEmEstoque!: number;
    fornecedor!: Fornecedor;
    editora!: Editora;
    generos!: Genero[];
    autores!: Autor[];
    classificacao!: Classificacao;
    preco!: number;
    nomeImagem!: string;
}
